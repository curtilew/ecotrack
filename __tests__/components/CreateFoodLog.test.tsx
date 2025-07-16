import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateFoodLog from '@/components/CreateFoodLog'
import { createNewEntry } from '@/utils/api'

// Mock the API function
jest.mock('../../utils/api', () => ({
  createNewEntry: jest.fn()
}))

const mockCreateNewEntry = createNewEntry as jest.MockedFunction<typeof createNewEntry>

describe('CreateFoodLog', () => {
  beforeEach(() => {
    mockCreateNewEntry.mockClear()
    mockCreateNewEntry.mockResolvedValue({ id: 'test-id' })
  })

  test('renders all form fields', () => {
    render(<CreateFoodLog />)
    
    expect(screen.getByLabelText(/Food Type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Unit/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Meal Type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Note/i)).toBeInTheDocument()
  })

  test('has all food type options', () => {
    render(<CreateFoodLog />)
    
    const select = screen.getByLabelText(/Food Type/i)
    expect(select).toBeInTheDocument()
    
    // Check key options are present
    expect(screen.getByText('Select food type')).toBeInTheDocument()
    expect(screen.getByText('Beef')).toBeInTheDocument()
    expect(screen.getByText('Chicken')).toBeInTheDocument()
    expect(screen.getByText('Vegetables')).toBeInTheDocument()
    expect(screen.getByText('Other')).toBeInTheDocument()
  })

  test('has all meal type options', () => {
    render(<CreateFoodLog />)
    
    expect(screen.getByText('Select meal type')).toBeInTheDocument()
    expect(screen.getByText('Breakfast')).toBeInTheDocument()
    expect(screen.getByText('Lunch')).toBeInTheDocument()
    expect(screen.getByText('Dinner')).toBeInTheDocument()
    expect(screen.getByText('Snack')).toBeInTheDocument()
  })

  test('updates form fields when user types', async () => {
    const user = userEvent.setup()
    render(<CreateFoodLog />)

    const foodTypeSelect = screen.getByLabelText(/Food Type/i)
    const quantityInput = screen.getByLabelText(/Quantity/i)
    const noteInput = screen.getByLabelText(/Note/i)

    await user.selectOptions(foodTypeSelect, 'Beef')
    await user.clear(quantityInput)
    await user.type(quantityInput, '2')
    await user.type(noteInput, 'Steak dinner')

    expect(foodTypeSelect).toHaveValue('Beef')
    expect(quantityInput).toHaveValue(2)
    expect(noteInput).toHaveValue('Steak dinner')
  })

  test('submits form with correct data', async () => {
    const user = userEvent.setup()
    render(<CreateFoodLog />)

    // Fill out the form
    await user.selectOptions(screen.getByLabelText(/Food Type/i), 'Chicken')

    const quantityInput = screen.getByLabelText(/Quantity/i)
    await user.clear(quantityInput)
    await user.type(quantityInput, '1')

    await user.selectOptions(screen.getByLabelText(/Unit/i), 'servings')
    await user.selectOptions(screen.getByLabelText(/Meal Type/i), 'Dinner')
    
    const dateInput = screen.getByLabelText(/Date/i)
    fireEvent.change(dateInput, { target: { value: '2024-01-15' } })
    
    await user.type(screen.getByLabelText(/Note/i), 'Grilled chicken')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Save Food Log/i })
    await user.click(submitButton)

    // Verify API was called with correct data
    await waitFor(() => {
      expect(mockCreateNewEntry).toHaveBeenCalledWith(
        {
          foodType: 'Chicken',
          quantity: '1',
          unit: 'servings',
          mealType: 'Dinner',
          date: '2024-01-15',
          note: 'Grilled chicken',
        },
        'food'
      )
    })
  })

  test('shows loading state during submission', async () => {
    const user = userEvent.setup()
    
    // Mock a slow API call
    mockCreateNewEntry.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ id: 'test-id' }), 100))
    )

    render(<CreateFoodLog />)

    const submitButton = screen.getByRole('button', { name: /Save Food Log/i })
    await user.click(submitButton)

    // Check loading state appears
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByText('Save Food Log')).toBeInTheDocument()
    })
  })

  test('defaults to today\'s date', () => {
    render(<CreateFoodLog />)
    
    const dateInput = screen.getByLabelText(/Date/i)
    const today = new Date().toISOString().slice(0, 10)
    expect(dateInput).toHaveValue(today)
  })

  test('defaults unit to servings', () => {
    render(<CreateFoodLog />)
    
    const unitSelect = screen.getByLabelText(/Unit/i)
    expect(unitSelect).toHaveValue('servings')
  })

  test('defaults quantity to 1', () => {
    render(<CreateFoodLog />)
    
    const quantityInput = screen.getByLabelText(/Quantity/i)
    expect(quantityInput).toHaveValue(1)
  })
})