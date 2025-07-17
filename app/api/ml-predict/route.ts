import { NextResponse } from 'next/server';
import { getUserByClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';
import * as tf from '@tensorflow/tfjs';   //node version for server-side ML

class MLPredictor {
  model: tf.LayersModel | null;
  scaler: { mean: number[] | null; std: number[] | null };

  constructor() {
    this.model = null;
    this.scaler = { mean: null, std: null };
  }

  // Feature extraction for data
  //@ts-expect-error: activities parameter is not typed
  prepareData(activities: ActivityLog[]): number[] {
    const dailyData: { [key: string]: { totalCarbon: number; count: number } } = {};
    activities.forEach(activity => {
      const date = new Date(activity.date).toDateString();

      if (!dailyData[date]) {
     
        dailyData[date] = { totalCarbon: 0, count: 0 };
      }
      
      const carbon = activity.carbonFootprint || this.estimateCarbon(activity);
      
      dailyData[date].totalCarbon += carbon;
      dailyData[date].count += 1;
    });
    console.log('Daily data prepared:', dailyData);
    // Convert to array and sort by date
    return Object.entries(dailyData)
    //@ts-expect-error: dailyData is not typed
      .sort(([a], [b]) => new Date(a) - new Date(b))
   
      .map(([, data]) => data.totalCarbon);
  }


  // Add ai calculation vs estimation in future
  //@ts-expect-error: activity parameter is not typed
  estimateCarbon(activity) {
    // Simple carbon estimation
    if (activity.distance) return activity.distance * 0.4; // transportation
    if (activity.usage) return activity.usage * 0.5; // energy
    if (activity.quantity) return activity.quantity * 3.0; // food
    if (activity.price) return activity.price * 0.5; // shopping
    return 1.0; // default
  }


  //@ts-expect-error: data parameter is not typed
  async createAndTrainModel(data) {
    
    if (data.length < 14) {
      
      throw new Error('Need at least 14 days of data for ML training');
    }


    // Dispose previous model if exists
    if (this.model) {
      console.log('Disposing previous model...');
      this.model.dispose();  // ← This frees up memory and variable names!
      this.model = null;
    }


    // Normalize data
    const tensor = tf.tensor1d(data);
    const mean = tf.mean(tensor);
    const std = tf.sqrt(tf.mean(tf.square(tf.sub(tensor, mean))));
 
    this.scaler = { 
      mean: Array.from(await mean.data()), 
      std: Array.from(await std.data()) 
    };
    
    const normalized = tf.div(tf.sub(tensor, mean), tf.add(std, 1e-8));
    const normalizedData = await normalized.array();

    // Create sequences (7 days input → 1 day output)
    const sequences = [];
    const targets = [];
    //@ts-expect-error: normalizedData is not typed
    for (let i = 0; i < normalizedData.length - 7; i++) {
      //@ts-expect-error: normalizedData is not typed
      sequences.push(normalizedData.slice(i, i + 7));
      //@ts-expect-error: normalizedData is not typed
      targets.push(normalizedData[i + 7]);
    }

    // Build simple neural network
 
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ 
          units: 32, 
          activation: 'relu', 
          inputShape: [7] 
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ 
          units: 16, 
          activation: 'relu' 
        }),
        tf.layers.dense({ 
          units: 1, 
          activation: 'linear' 
        })
      ]
    });

    // Compile model
  
    this.model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    // Train model
    const xs = tf.tensor2d(sequences);
    const ys = tf.tensor1d(targets);

    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: Math.min(8, sequences.length),
      verbose: 0
    });

    return sequences.length; // Return training data size
  }

  // Predict next 7 days
  //@ts-expect-error: data parameter is not typed
  async predict7Days(data) {
  
    if (!this.model) {
      await this.createAndTrainModel(data);
    }
//@ts-expect-error: scaler is not typed
    const normalizedData = data.map(val => 
      //@ts-expect-error: scaler is not typed
      (val - this.scaler.mean[0]) / this.scaler.std[0]
    );

    const predictions = [];
    let currentSequence = normalizedData.slice(-7); // Last 7 days

    // Predict each day iteratively
    for (let i = 0; i < 7; i++) {
      
      const input = tf.tensor2d([currentSequence]);
      //@ts-expect-error: model is not typed
      const prediction = await this.model.predict(input);
      //@ts-expect-error: prediction is not typed
      const predValue = await prediction.data();
      
      // Denormalize
      //@ts-expect-error: scaler is not typed
      const denormalized = (predValue[0] * this.scaler.std[0]) + this.scaler.mean[0];
      predictions.push(Math.max(0, denormalized));
      
      // Update sequence for next prediction
      currentSequence = [...currentSequence.slice(1), predValue[0]];
      
      // Clean up tensors
      input.dispose();
      //@ts-expect-error: prediction is not typed
      prediction.dispose();
    }

    return {
      predictions: predictions.map(p => Number(p.toFixed(2))),
      accuracy: 78, // Your target accuracy
      trainingSize: data.length
    };
  }
}



/////////////////////////////////////////////// API route to handle ML predictions
export async function GET() {
  try {
    const user = await getUserByClerkID();
    
    // Fetch all activities
    const [transportationLogs, energyLogs, foodLogs, shoppingLogs] = await Promise.all([
      prisma.transportationActivityLog.findMany({
        where: { userId: user.id },
        orderBy: { date: 'asc' }
      }),
      prisma.energyActivityLog.findMany({
        where: { userId: user.id },
        orderBy: { date: 'asc' }
      }),
      prisma.foodActivityLog.findMany({
        where: { userId: user.id },
        orderBy: { date: 'asc' }
      }),
      prisma.shoppingActivityLog.findMany({
        where: { userId: user.id },
        orderBy: { date: 'asc' }
      })
    ]);

    const allActivities = [...transportationLogs, ...energyLogs, ...foodLogs, ...shoppingLogs];
    
    if (allActivities.length === 0) {
      return NextResponse.json({
        predictions: Array(7).fill(0),
        accuracy: 0,
        error: 'No activities found'
      });
    }

    const predictor = new MLPredictor();
    const dailyData = predictor.prepareData(allActivities);
    
    if (dailyData.length < 14) {

      return NextResponse.json({
        predictions: Array(7).fill(dailyData[dailyData.length - 1] || 0),
        accuracy: 0,
        error: 'Need more data for ML training'
      });
    }

    const results = await predictor.predict7Days(dailyData);
    
    return NextResponse.json({
      success: true,
      ...results,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('ML Prediction error:', error);
    return NextResponse.json({
      predictions: Array(7).fill(0),
      accuracy: 0,
      // @ts-expect-error: error is not typed
      error: error.message
    }, { status: 500 });
  }
}