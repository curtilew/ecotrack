import { render, screen } from '@testing-library/react'
import CarbonFootprintChart from '@/components/Chart'

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data, options }: { data: Record<string, unknown>; options: Record<string, unknown> }) => (
    <div data-testid="mock-bar-chart">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-options">{JSON.stringify(options)}</div>
    </div>
  )
}))

// Mock Chart.js registration
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn()
  },
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  Title: {},
  Tooltip: {},
  Legend: {}
}))

describe('CarbonFootprintChart', () => {
  const mockAIAnalysis = {
    breakdown: {
      transportation: 15.5,
      energy: 8.2,
      food: 12.1,
      shopping: 5.3
    }
  }

  test('renders chart title', () => {
    render(<CarbonFootprintChart aiAnalysis={mockAIAnalysis} />)
    
    expect(screen.getByText('Carbon Footprint by Category')).toBeInTheDocument()
  })

  test('renders chart when data is provided', () => {
    render(<CarbonFootprintChart aiAnalysis={mockAIAnalysis} />)
    
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument()
  })

  test('displays no data message when aiAnalysis is undefined', () => {
    render(<CarbonFootprintChart />)
    
    expect(screen.getByText('No analysis data available')).toBeInTheDocument()
    expect(screen.queryByTestId('mock-bar-chart')).not.toBeInTheDocument()
  })

  test('displays no data message when breakdown is undefined', () => {
    render(<CarbonFootprintChart aiAnalysis={{}} />)
    
    expect(screen.getByText('No analysis data available')).toBeInTheDocument()
    expect(screen.queryByTestId('mock-bar-chart')).not.toBeInTheDocument()
  })

  test('displays no data message when breakdown is null', () => {
    render(<CarbonFootprintChart aiAnalysis={{ breakdown: undefined }} />)
    
    expect(screen.getByText('No analysis data available')).toBeInTheDocument()
    expect(screen.queryByTestId('mock-bar-chart')).not.toBeInTheDocument()
  })

  test('passes correct data structure to chart', () => {
    render(<CarbonFootprintChart aiAnalysis={mockAIAnalysis} />)
    
    const chartData = screen.getByTestId('chart-data')
    const dataObject = JSON.parse(chartData.textContent || '{}')
    
    // Check basic structure
    expect(dataObject.labels).toEqual(['Today'])
    expect(dataObject.datasets).toHaveLength(4)
    
    // Check dataset labels
    type Dataset = { label: string; data: number[]; backgroundColor: string };
    const datasetLabels = dataObject.datasets.map((ds: Dataset) => ds.label)
    expect(datasetLabels).toEqual(['Transportation', 'Energy', 'Food', 'Shopping'])
    
    // Check data values
    expect(dataObject.datasets[0].data).toEqual([15.5])
    expect(dataObject.datasets[1].data).toEqual([8.2])
    expect(dataObject.datasets[2].data).toEqual([12.1])
    expect(dataObject.datasets[3].data).toEqual([5.3])
  })

  test('handles missing breakdown properties gracefully', () => {
    const incompleteAnalysis = {
      breakdown: {
        transportation: 10,
        // missing energy, food, shopping
      }
    }
    
    render(<CarbonFootprintChart aiAnalysis={incompleteAnalysis} />)
    
    const chartData = screen.getByTestId('chart-data')
    const dataObject = JSON.parse(chartData.textContent || '{}')
    
    // Should default missing values to 0
    expect(dataObject.datasets[0].data).toEqual([10]) // transportation
    expect(dataObject.datasets[1].data).toEqual([0])  // energy (missing)
    expect(dataObject.datasets[2].data).toEqual([0])  // food (missing)
    expect(dataObject.datasets[3].data).toEqual([0])  // shopping (missing)
  })

  test('chart has correct colors', () => {
    render(<CarbonFootprintChart aiAnalysis={mockAIAnalysis} />)
    
    const chartData = screen.getByTestId('chart-data')
    const dataObject = JSON.parse(chartData.textContent || '{}')
    
    // Check background colors (amber shades)
    expect(dataObject.datasets[0].backgroundColor).toBe('#f59e0b') // amber-500
    expect(dataObject.datasets[1].backgroundColor).toBe('#fbbf24') // amber-400
    expect(dataObject.datasets[2].backgroundColor).toBe('#fcd34d') // amber-300
    expect(dataObject.datasets[3].backgroundColor).toBe('#fde68a') // amber-200
  })

  test('chart options are configured correctly', () => {
    render(<CarbonFootprintChart aiAnalysis={mockAIAnalysis} />)
    
    const chartOptions = screen.getByTestId('chart-options')
    const optionsObject = JSON.parse(chartOptions.textContent || '{}')
    
    // Check basic options
    expect(optionsObject.responsive).toBe(true)
    expect(optionsObject.maintainAspectRatio).toBe(false)
    
    // Check stacked configuration
    expect(optionsObject.scales.x.stacked).toBe(true)
    expect(optionsObject.scales.y.stacked).toBe(true)
    expect(optionsObject.scales.y.beginAtZero).toBe(true)
  })

  test('handles zero values correctly', () => {
    const zeroAnalysis = {
      breakdown: {
        transportation: 0,
        energy: 0,
        food: 0,
        shopping: 0
      }
    }
    
    render(<CarbonFootprintChart aiAnalysis={zeroAnalysis} />)
    
    const chartData = screen.getByTestId('chart-data')
    const dataObject = JSON.parse(chartData.textContent || '{}')
    
    // All values should be 0
    type Dataset = { label: string; data: number[]; backgroundColor: string };
    dataObject.datasets.forEach((dataset: Dataset) => {
      expect(dataset.data).toEqual([0])
    })
  })

  test('handles large values correctly', () => {
    const largeAnalysis = {
      breakdown: {
        transportation: 999.9,
        energy: 1000.5,
        food: 2000.1,
        shopping: 500.7
      }
    }
    
    render(<CarbonFootprintChart aiAnalysis={largeAnalysis} />)
    
    const chartData = screen.getByTestId('chart-data')
    const dataObject = JSON.parse(chartData.textContent || '{}')
    
    expect(dataObject.datasets[0].data).toEqual([999.9])
    expect(dataObject.datasets[1].data).toEqual([1000.5])
    expect(dataObject.datasets[2].data).toEqual([2000.1])
    expect(dataObject.datasets[3].data).toEqual([500.7])
  })
})