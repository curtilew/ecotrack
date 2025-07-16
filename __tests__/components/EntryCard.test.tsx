import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import EntryCard from '@/components/EntryCard'

describe('EntryCard', () => {
  const mockTransportationLog = {
    id: '1',
    createdAt: '2024-01-15T10:30:00Z',
    activityType: 'Car',
    distance: 25,
    // carbonFootprint: 5.2,
    note: 'Commute to work',
    logType: 'transportation'
  }

  const mockEnergyLog = {
    id: '2',
    createdAt: '2024-01-15T10:30:00Z',
    energyType: 'Natural Gas',
    usage: 121,
    unit: 'kWh',
    // carbonFootprint: 60.5,
    note: 'Monthly bill',
    logType: 'energy'
  }

  const mockFoodLog = {
    id: '3',
    createdAt: '2024-01-15T10:30:00Z',
    foodType: 'Beef',
    quantity: 2,
    unit: 'servings',
    mealType: 'Dinner',
    // carbonFootprint: 8.4,
    note: 'Steak dinner',
    logType: 'food'
  }

  it('renders transportation log correctly', () => {
    render(<EntryCard log={mockTransportationLog} />)
    
    expect(screen.getByText('Jan 15')).toBeInTheDocument()
    expect(screen.getByText('Car - 25 miles')).toBeInTheDocument()
    // expect(screen.getByText('5.2 kg CO₂')).toBeInTheDocument()
    expect(screen.getByText('`Commute to work`')).toBeInTheDocument()
  })

  it('renders energy log correctly', () => {
    render(<EntryCard log={mockEnergyLog} />)
    
    expect(screen.getByText('Natural Gas - 121 kWh')).toBeInTheDocument()
    // expect(screen.getByText('60.5 kg CO₂')).toBeInTheDocument()
  })

  it('renders food log correctly', () => {
    render(<EntryCard log={mockFoodLog} />)
    
    expect(screen.getByText('Beef - 2 servings')).toBeInTheDocument()
    // expect(screen.getByText('8.4 kg CO₂')).toBeInTheDocument()
  })

  it('handles missing carbon footprint gracefully', () => {
    const logWithoutCarbon = { ...mockTransportationLog, carbonFootprint: undefined }
    render(<EntryCard log={logWithoutCarbon} />)
    
    expect(screen.getByText('Car - 25 miles')).toBeInTheDocument()
    expect(screen.queryByText(/kg CO₂/)).not.toBeInTheDocument()
  })

  it('handles missing note gracefully', () => {
    const logWithoutNote = { ...mockTransportationLog, note: '' }
    render(<EntryCard log={logWithoutNote} />)
    
    expect(screen.getByText('Car - 25 miles')).toBeInTheDocument()
    expect(screen.queryByText('Commute to work')).not.toBeInTheDocument()
  })
})