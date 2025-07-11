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

interface Breakdown {
    transportation?: number;
    energy?: number;
    food?: number;
    shopping?: number;
}

interface AIAnalysis {
    breakdown?: Breakdown;
}

const CarbonFootprintChart = ({ aiAnalysis }: { aiAnalysis?: AIAnalysis }) => {
    if (!aiAnalysis || !aiAnalysis.breakdown) {
        return (
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Carbon Footprint by Category</h3>
                <div className="h-64 w-full bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">No analysis data available</span>
                </div>
            </div>
        );
    }

    const breakdown = aiAnalysis.breakdown;

const chartData = {
    labels: ['Today'],
    datasets: [
        {
            label: 'Transportation',
            data: [(breakdown.transportation || 0)], // Convert kg to g
            backgroundColor: '#f59e0b' // amber-500
        },
        {
            label: 'Energy', 
            data: [(breakdown.energy || 0)],
            backgroundColor: '#fbbf24' // amber-400
        },
        {
            label: 'Food',
            data: [(breakdown.food || 0)],
            backgroundColor: '#fcd34d' // amber-300
        },
        {
            label: 'Shopping',
            data: [(breakdown.shopping || 0)],
            backgroundColor: '#fde68a' // amber-200
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
                    callback: (value: unknown) => `${value}g`
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: import('chart.js').TooltipItem<'bar'>) {
                        const label = tooltipItem.dataset.label || '';
                        const value = tooltipItem.parsed.y ?? tooltipItem.parsed;
                        return `${label}: ${value}g CO₂`;
                    }
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

export default CarbonFootprintChart;