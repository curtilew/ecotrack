'use client'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,    
    Title,
    Tooltip,
    Legend
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SimpleCarbonBarChart = ({ data }) => {
    // Helper function to create local date from database date
    const createLocalDateFromDB = (dbDate) => {
        const date = new Date(dbDate);
        // Add timezone offset to get correct local date
        return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    };

    const chartData = {
        labels: data.map(item => {
            const localDate = createLocalDateFromDB(item.date);
            return localDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
datasets: [
            {
                label: 'Transportation',
                data: data.map(item => item.transport),
                backgroundColor: '#fbbf24', // Amber-100
            },
            {
                label: 'Energy',
                data: data.map(item => item.energy),
                backgroundColor: '#fde68a', // Amber-200
            },
            {
                label: 'Food',
                data: data.map(item => item.food),
                backgroundColor: '#fcd34d', // Amber-300
            },
            {
                label: 'Shopping',
                data: data.map(item => item.shopping),
                backgroundColor: '#fef3c7', // Amber-500
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { stacked: true },
            y: { 
                stacked: true,
                beginAtZero: true,
                ticks: {
                    callback: (value) => `${value} kg`
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.parsed.y} kg CO₂`
                }
            }
        }
    };

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Carbon Footprint by Category</h3>
            <div className="h-64 w-full">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default SimpleCarbonBarChart;