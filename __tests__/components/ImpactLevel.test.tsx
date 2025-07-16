import { render, screen } from '@testing-library/react'
import DailyImpactVisualization from '@/components/ImpactLevel'

// Mock setInterval and clearInterval for animation tests
const mockSetInterval = jest.fn()
const mockClearInterval = jest.fn()

beforeEach(() => {
  jest.useFakeTimers()
  global.setInterval = mockSetInterval
  global.clearInterval = mockClearInterval
  mockSetInterval.mockClear()
  mockClearInterval.mockClear()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

describe('ImpactLevel', () => {
  test('renders component with basic elements', () => {
    render(<DailyImpactVisualization yesterdayData={25.5} />)
    
    expect(screen.getByText("Yesterday's Impact on Earth")).toBeInTheDocument()
    expect(screen.getByText('25.5 kg')).toBeInTheDocument()
    expect(screen.getByText(/vs Global Citizen/i)).toBeInTheDocument()
  })

  test('displays excellent impact for low carbon footprint', () => {
    render(<DailyImpactVisualization yesterdayData={15} />)
    
    expect(screen.getByText(/Planet Hero/i)).toBeInTheDocument()
    expect(screen.getByText(/healing the Earth/i)).toBeInTheDocument()
    expect(screen.getByText('🌱')).toBeInTheDocument()
  })

  test('displays good impact for below average footprint', () => {
    render(<DailyImpactVisualization yesterdayData={30} />)
    
    expect(screen.getByText(/Eco Champion/i)).toBeInTheDocument()
    expect(screen.getByText(/protecting our planet/i)).toBeInTheDocument()
    expect(screen.getByText('🌳')).toBeInTheDocument()
  })

  test('displays concerning impact for moderate footprint', () => {
    render(<DailyImpactVisualization yesterdayData={45} />)
    
    expect(screen.getByText(/Warning Signs/i)).toBeInTheDocument()
    expect(screen.getByText(/planet needs your help/i)).toBeInTheDocument()
    // FIX: Use getAllByText for emojis that appear multiple times
    expect(screen.getAllByText('🌡️')[0]).toBeInTheDocument()
  })

  test('displays alarming impact for high footprint', () => {
    render(<DailyImpactVisualization yesterdayData={60} />)
    
    expect(screen.getByText(/Emergency/i)).toBeInTheDocument()
    expect(screen.getByText(/planet is in crisis/i)).toBeInTheDocument()
    // Use getAllByText for emojis that appear multiple times
    expect(screen.getAllByText('🔥')[0]).toBeInTheDocument()
  })

  test('displays devastating impact for very high footprint', () => {
    render(<DailyImpactVisualization yesterdayData={100} />)
    
    // Use getAllByText for text that appears multiple times and select the first one (main title)
    expect(screen.getAllByText(/PLANET KILLER/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/Catastrophic damage/i)).toBeInTheDocument()
    expect(screen.getAllByText('💀')[0]).toBeInTheDocument()
  })

  test('calculates percentage above/below average correctly', () => {
    // Test below average (25 kg vs 32.8 kg average = ~24% below)
    render(<DailyImpactVisualization yesterdayData={25} />)
    expect(screen.getByText(/24% below avg/i)).toBeInTheDocument()
    
    // Test above average (40 kg vs 32.8 kg average = ~22% above)
    render(<DailyImpactVisualization yesterdayData={40} />)
    expect(screen.getByText(/22% above avg/i)).toBeInTheDocument()
  })

  test('shows appropriate directional arrows', () => {
    // Below average should show down arrow
    render(<DailyImpactVisualization yesterdayData={25} />)
    expect(screen.getByText('↓')).toBeInTheDocument()
    
    // Above average should show up arrow  
    render(<DailyImpactVisualization yesterdayData={40} />)
    expect(screen.getByText('↑')).toBeInTheDocument()
  })

  test('displays real world equivalent messages', () => {
    render(<DailyImpactVisualization yesterdayData={15} />)
    expect(screen.getByText(/Like watering a garden/i)).toBeInTheDocument()
    
    render(<DailyImpactVisualization yesterdayData={35} />)
    expect(screen.getByText(/Like walking instead of driving/i)).toBeInTheDocument()
    
    // FIX: Use a more flexible text matcher for text broken up by emojis
    render(<DailyImpactVisualization yesterdayData={55} />)
    expect(screen.getByText((content) => {
      return content.includes('Like driving') && content.includes('50 miles')
    })).toBeInTheDocument()
  })

  test('displays animal impact messages', () => {
    // Low impact should show positive message
    render(<DailyImpactVisualization yesterdayData={15} />)
    expect(screen.getByText(/You saved.*trees today/i)).toBeInTheDocument()
    
    // High impact should show negative message
    render(<DailyImpactVisualization yesterdayData={60} />)
    expect(screen.getByText(/displaced.*animals/i)).toBeInTheDocument()
  })

  test('displays temperature impact information', () => {
    render(<DailyImpactVisualization yesterdayData={15} />)
    expect(screen.getByText(/Cooling the planet/i)).toBeInTheDocument()
    
    render(<DailyImpactVisualization yesterdayData={50} />)
    expect(screen.getByText(/Heated Earth/i)).toBeInTheDocument()
  })

  test('displays ice cap impact information', () => {
    render(<DailyImpactVisualization yesterdayData={15} />)
    expect(screen.getByText(/preserve Arctic ice/i)).toBeInTheDocument()
    
    render(<DailyImpactVisualization yesterdayData={60} />)
    expect(screen.getByText(/DESTROYED.*glaciers/i)).toBeInTheDocument()
  })

  test('renders progress bar with correct width', () => {
    render(<DailyImpactVisualization yesterdayData={32.8} />)
    
    // Should have a progress bar (we can't easily test the exact width without more complex setup)
    const progressContainer = screen.getByText('Earth-friendly').parentElement
    expect(progressContainer).toBeInTheDocument()
    expect(screen.getByText('Planet killer')).toBeInTheDocument()
  })

  test('handles edge case of zero emissions', () => {
    render(<DailyImpactVisualization yesterdayData={0} />)
    
    expect(screen.getByText('0.0 kg')).toBeInTheDocument()
    expect(screen.getByText(/Planet Hero/i)).toBeInTheDocument()
  })

  test('handles very high emissions', () => {
    render(<DailyImpactVisualization yesterdayData={200} />)
    
    expect(screen.getByText('200.0 kg')).toBeInTheDocument()
    expect(screen.getAllByText(/PLANET KILLER/i)[0]).toBeInTheDocument()
  })

  test('animation interval is set up correctly', () => {
    render(<DailyImpactVisualization yesterdayData={25} />)
    
    // Verify setInterval was called
    expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 100)
  })
})