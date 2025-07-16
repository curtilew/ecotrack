import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateTransLog from '@/components/CreateTransLog'
import { createNewEntry } from '@/utils/api'

// Mock the API module to match your actual function signatures
jest.mock('../../utils/api', () => ({
  createNewEntry: jest.fn(),
  updateEntry: jest.fn(),
}))

// Import the mocked functions

const mockCreateNewEntry = createNewEntry as jest.MockedFunction<typeof createNewEntry>

describe('CreateTransLog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(<CreateTransLog />)
    
    expect(screen.getByLabelText(/Activity Type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Distance/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Note/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Save Activity/i })).toBeInTheDocument()
  })

  it('has all activity type options', () => {
    render(<CreateTransLog />)
    
    const options = screen.getAllByRole('option')
    
    expect(options).toHaveLength(6) // Including "Select type" option
    expect(screen.getByRole('option', { name: 'Car' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Bike' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Public Transit' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Walking' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Other' })).toBeInTheDocument()
  })

  it('updates form fields when user types', async () => {
    const user = userEvent.setup()
    render(<CreateTransLog />)

    const activitySelect = screen.getByLabelText(/Activity Type/i)
    const distanceInput = screen.getByLabelText(/Distance/i)
    const noteInput = screen.getByLabelText(/Note/i)

    // User interactions
    await user.selectOptions(activitySelect, 'Car')
    await user.type(distanceInput, '25')
    await user.type(noteInput, 'Test note')

    // Verify the form updates
    expect(screen.getByDisplayValue('Car')).toBeInTheDocument()
    expect(screen.getByDisplayValue('25')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test note')).toBeInTheDocument()
  })

  it('submits form with correct data', async () => {
    const user = userEvent.setup()
    mockCreateNewEntry.mockResolvedValue({ id: 'new-log-id' })

    render(<CreateTransLog />)

    // Fill out the form
    await user.selectOptions(screen.getByLabelText(/Activity Type/i), 'Car')
    await user.type(screen.getByLabelText(/Distance/i), '25')

    const dateInput = screen.getByLabelText(/Date/i)
    fireEvent.change(dateInput, { target: { value: '2024-01-15' } })
    
    await user.type(screen.getByLabelText(/Note/i), 'Test drive to work')

    // Submit the form
    await user.click(screen.getByRole('button', { name: /Save Activity/i }))

    // Verify API was called with correct data (matching your function signature)
    await waitFor(() => {
      expect(mockCreateNewEntry).toHaveBeenCalledWith(
        {
          activityType: 'Car',
          distance: '25',
          date: '2024-01-15',
          note: 'Test drive to work'
        },
        'transportation'
      )
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    // Mock a delayed response
    mockCreateNewEntry.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ id: 'test' }), 100))
    )

    render(<CreateTransLog />)
    
    await user.click(screen.getByRole('button', { name: /Save Activity/i }))
    
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })
})