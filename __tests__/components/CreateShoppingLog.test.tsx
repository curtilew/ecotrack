import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateShoppingLog from '@/components/CreateShoppingLog'
import { createNewEntry } from '@/utils/api'

// Mock the API function
jest.mock('../../utils/api', () => ({
  createNewEntry: jest.fn()
}))

const mockCreateNewEntry = createNewEntry as jest.MockedFunction<typeof createNewEntry>

describe('CreateShoppingLog', () => {
  beforeEach(() => {
    mockCreateNewEntry.mockClear()
    mockCreateNewEntry.mockResolvedValue({ id: 'test-id' })
  })

  test('renders all form fields', () => {
    render(<CreateShoppingLog />)
    
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Second-hand/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Note/i)).toBeInTheDocument()
  })

  test('has all category options', () => {
    render(<CreateShoppingLog />)
    
    const select = screen.getByLabelText(/Category/i)
    expect(select).toBeInTheDocument()
    
    // Check key options are present
    expect(screen.getByText('Select category')).toBeInTheDocument()
    expect(screen.getByText('Clothing')).toBeInTheDocument()
    expect(screen.getByText('Electronics')).toBeInTheDocument()
    expect(screen.getByText('Home & Garden')).toBeInTheDocument()
    expect(screen.getByText('Other')).toBeInTheDocument()
  })

  test('updates form fields when user types', async () => {
    const user = userEvent.setup()
    render(<CreateShoppingLog />)

    const categorySelect = screen.getByLabelText(/Category/i)
    const itemNameInput = screen.getByLabelText(/Item Name/i)
    const priceInput = screen.getByLabelText(/Price/i)
    const noteInput = screen.getByLabelText(/Note/i)

    await user.selectOptions(categorySelect, 'Electronics')
    await user.type(itemNameInput, 'iPhone')
    await user.type(priceInput, '999')
    await user.type(noteInput, 'New phone')

    expect(categorySelect).toHaveValue('Electronics')
    expect(itemNameInput).toHaveValue('iPhone')
    expect(priceInput).toHaveValue(999)
    expect(noteInput).toHaveValue('New phone')
  })

  test('handles checkbox toggle', async () => {
    const user = userEvent.setup()
    render(<CreateShoppingLog />)

    const checkbox = screen.getByLabelText(/Second-hand/i)
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  test('submits form with correct data', async () => {
    const user = userEvent.setup()
    render(<CreateShoppingLog />)

    // Fill out the form
    await user.selectOptions(screen.getByLabelText(/Category/i), 'Clothing')
    await user.type(screen.getByLabelText(/Item Name/i), 'T-shirt')
    await user.type(screen.getByLabelText(/Price/i), '25.99')

    const quantityInput = screen.getByLabelText(/Quantity/i)
    await user.clear(quantityInput)  
    await user.type(quantityInput, '2')  

    await user.click(screen.getByLabelText(/Second-hand/i))
    
    const dateInput = screen.getByLabelText(/Date/i)
    fireEvent.change(dateInput, { target: { value: '2024-01-15' } })
    
    await user.type(screen.getByLabelText(/Note/i), 'Cotton shirts')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Save Shopping Log/i })
    await user.click(submitButton)

    // Verify API was called with correct data
    await waitFor(() => {
      expect(mockCreateNewEntry).toHaveBeenCalledWith(
        {
          category: 'Clothing',
          itemName: 'T-shirt',
          price: '25.99',
          quantity: '2',
          isSecondHand: true,
          date: '2024-01-15',
          note: 'Cotton shirts',
        },
        'shopping'
      )
    })
  })

  test('shows loading state during submission', async () => {
    const user = userEvent.setup()
    
    // Mock a slow API call
    mockCreateNewEntry.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ id: 'test-id' }), 100))
    )

    render(<CreateShoppingLog />)

    const submitButton = screen.getByRole('button', { name: /Save Shopping Log/i })
    await user.click(submitButton)

    // Check loading state appears
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.getByText('Save Shopping Log')).toBeInTheDocument()
    })
  })

  test('defaults to today\'s date', () => {
    render(<CreateShoppingLog />)
    
    const dateInput = screen.getByLabelText(/Date/i)
    const today = new Date().toISOString().slice(0, 10)
    expect(dateInput).toHaveValue(today)
  })

  test('defaults quantity to 1', () => {
    render(<CreateShoppingLog />)
    
    const quantityInput = screen.getByLabelText(/Quantity/i)
    expect(quantityInput).toHaveValue(1)
  })

  test('checkbox defaults to unchecked', () => {
    render(<CreateShoppingLog />)
    
    const checkbox = screen.getByLabelText(/Second-hand/i)
    expect(checkbox).not.toBeChecked()
  })

  test('handles decimal prices correctly', async () => {
    const user = userEvent.setup()
    render(<CreateShoppingLog />)

    const priceInput = screen.getByLabelText(/Price/i)
    await user.type(priceInput, '12.50')

    expect(priceInput).toHaveValue(12.5)
  })
})