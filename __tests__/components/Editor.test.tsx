import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Editor from '@/components/Editor'
import * as api from '@/utils/api'

// Mock the API module
jest.mock('../../utils/api')
const mockUpdateEntry = jest.mocked(api.updateEntry)

describe('Editor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Mock log data for different types
  const mockTransportationLog = {
    id: 'trans-1',
    logType: 'transportation',
    activityType: 'Car',
    distance: 25,
    date: new Date('2024-01-15T10:30:00Z'),
    note: 'Commute to work'
  }

  const mockEnergyLog = {
    id: 'energy-1',
    logType: 'energy',
    energyType: 'Electricity',
    usage: 150,
    unit: 'kWh',
    date: new Date('2024-01-15T10:30:00Z'),
    note: 'Monthly bill'
  }

  const mockFoodLog = {
    id: 'food-1',
    logType: 'food',
    foodType: 'Beef',
    quantity: 2,
    mealType: 'Dinner',
    date: new Date('2024-01-15T10:30:00Z'),
    note: 'Steak dinner'
  }

  const mockShoppingLog = {
    id: 'shopping-1',
    logType: 'shopping',
    category: 'Electronics',
    itemName: 'iPhone',
    price: 999,
    isSecondHand: false,
    date: new Date('2024-01-15T10:30:00Z'),
    note: 'New phone'
  }

  describe('Transportation Log Type', () => {
    it('renders transportation fields correctly', () => {
      render(<Editor log={mockTransportationLog} />)
      
      expect(screen.getByLabelText(/Activity Type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Distance/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Note/i)).toBeInTheDocument()
      
      // Should not show fields from other log types
      expect(screen.queryByLabelText(/Energy Type/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/Food Type/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/Category/i)).not.toBeInTheDocument()
    })

    it('populates transportation fields with existing data', () => {
      render(<Editor log={mockTransportationLog} />)
      
      expect(screen.getByDisplayValue('Car')).toBeInTheDocument()
      expect(screen.getByDisplayValue('25')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Commute to work')).toBeInTheDocument()
    })

    it('updates transportation data when user changes fields', async () => {
      const user = userEvent.setup()
      render(<Editor log={mockTransportationLog} />)
      
      const activitySelect = screen.getByLabelText(/Activity Type/i)
      const distanceInput = screen.getByLabelText(/Distance/i)
      
      await user.selectOptions(activitySelect, 'Bike')
      await user.clear(distanceInput)
      await user.type(distanceInput, '10')
      
      expect(screen.getByDisplayValue('Bike')).toBeInTheDocument()
      expect(screen.getByDisplayValue('10')).toBeInTheDocument()
    })

    it('submits transportation data correctly', async () => {
      const user = userEvent.setup()
      mockUpdateEntry.mockResolvedValue({ id: 'updated-id' })
      
      render(<Editor log={mockTransportationLog} />)
      
      // Modify some data
      await user.selectOptions(screen.getByLabelText(/Activity Type/i), 'Bike')
      await user.clear(screen.getByLabelText(/Distance/i))
      await user.type(screen.getByLabelText(/Distance/i), '10')
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /Save/i }))
      
      await waitFor(() => {
        expect(mockUpdateEntry).toHaveBeenCalledWith(
          'trans-1',
          expect.objectContaining({
            activityType: 'Bike',
            distance: '10',
            date: '2024-01-15',
            note: 'Commute to work'
          }),
          'transportation'
        )
      })
    })
  })

  describe('Energy Log Type', () => {
    it('renders energy fields correctly', () => {
      render(<Editor log={mockEnergyLog} />)
      
      expect(screen.getByLabelText(/Energy Type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Usage/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Unit/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Note/i)).toBeInTheDocument()
      
      // Should not show fields from other log types
      expect(screen.queryByLabelText(/Activity Type/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/Food Type/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/Category/i)).not.toBeInTheDocument()
    })

    it('populates energy fields with existing data', () => {
      render(<Editor log={mockEnergyLog} />)
      
      expect(screen.getByDisplayValue('Electricity')).toBeInTheDocument()
      expect(screen.getByDisplayValue('150')).toBeInTheDocument()
      expect(screen.getByDisplayValue('kWh')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Monthly bill')).toBeInTheDocument()
    })

    it('submits energy data correctly', async () => {
      const user = userEvent.setup()
      mockUpdateEntry.mockResolvedValue({ id: 'updated-id' })
      
      render(<Editor log={mockEnergyLog} />)
      
      // Modify some data
      await user.selectOptions(screen.getByLabelText(/Energy Type/i), 'Natural Gas')
      await user.clear(screen.getByLabelText(/Usage/i))
      await user.type(screen.getByLabelText(/Usage/i), '200')
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /Save/i }))
      
      await waitFor(() => {
        expect(mockUpdateEntry).toHaveBeenCalledWith(
          'energy-1',
          expect.objectContaining({
            energyType: 'Natural Gas',
            usage: '200',
            unit: 'kWh',
            date: '2024-01-15',
            note: 'Monthly bill'
          }),
          'energy'
        )
      })
    })
  })

  describe('Food Log Type', () => {
    it('renders food fields correctly', () => {
      render(<Editor log={mockFoodLog} />)
      
      expect(screen.getByLabelText(/Food Type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Meal Type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Note/i)).toBeInTheDocument()
      
      // Should not show fields from other log types
      expect(screen.queryByLabelText(/Activity Type/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/Energy Type/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/Category/i)).not.toBeInTheDocument()
    })

    it('populates food fields with existing data', () => {
      render(<Editor log={mockFoodLog} />)
      
      expect(screen.getByDisplayValue('Beef')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Dinner')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Steak dinner')).toBeInTheDocument()
    })

    it('submits food data correctly', async () => {
      const user = userEvent.setup()
      mockUpdateEntry.mockResolvedValue({ id: 'updated-id' })
      
      render(<Editor log={mockFoodLog} />)
      
      // Modify some data
      await user.selectOptions(screen.getByLabelText(/Food Type/i), 'Chicken')
      await user.selectOptions(screen.getByLabelText(/Meal Type/i), 'Lunch')
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /Save/i }))
      
      await waitFor(() => {
        expect(mockUpdateEntry).toHaveBeenCalledWith(
          'food-1',
          expect.objectContaining({
            foodType: 'Chicken',
            quantity: '2',
            mealType: 'Lunch',
            date: '2024-01-15',
            note: 'Steak dinner'
          }),
          'food'
        )
      })
    })
  })

  describe('Shopping Log Type', () => {
    it('renders shopping fields correctly', () => {
      render(<Editor log={mockShoppingLog} />)
      
      expect(screen.getByLabelText(/Category/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Price/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Second-hand/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Note/i)).toBeInTheDocument()
      
      // Should not show fields from other log types
      expect(screen.queryByLabelText(/Activity Type/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/Energy Type/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/Food Type/i)).not.toBeInTheDocument()
    })

    it('populates shopping fields with existing data', () => {
      render(<Editor log={mockShoppingLog} />)
      
      expect(screen.getByDisplayValue('Electronics')).toBeInTheDocument()
      expect(screen.getByDisplayValue('iPhone')).toBeInTheDocument()
      expect(screen.getByDisplayValue('999')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument()
      expect(screen.getByDisplayValue('New phone')).toBeInTheDocument()
      
      // Check checkbox state
      const checkbox = screen.getByLabelText(/Second-hand/i)
      expect(checkbox).not.toBeChecked()
    })

    it('handles second-hand checkbox correctly', async () => {
      const user = userEvent.setup()
      render(<Editor log={mockShoppingLog} />)
      const checkbox = screen.getByLabelText(/Second-hand/i)
      expect(checkbox).not.toBeChecked()
      
      await user.click(checkbox)
      expect(checkbox).toBeChecked()
      
      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })

    it('submits shopping data correctly', async () => {
      const user = userEvent.setup()
      mockUpdateEntry.mockResolvedValue({ id: 'updated-id' })
      
      render(<Editor log={mockShoppingLog} />)
      
      // Modify some data
      await user.selectOptions(screen.getByLabelText(/Category/i), 'Clothing')
      await user.clear(screen.getByLabelText(/Item Name/i))
      await user.type(screen.getByLabelText(/Item Name/i), 'T-shirt')
      await user.click(screen.getByLabelText(/Second-hand/i))
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /Save/i }))
      
      await waitFor(() => {
        expect(mockUpdateEntry).toHaveBeenCalledWith(
          'shopping-1',
          expect.objectContaining({
            category: 'Clothing',
            itemName: 'T-shirt',
            price: '999',
            isSecondHand: true,
            date: '2024-01-15',
            note: 'New phone'
          }),
          'shopping'
        )
      })
    })
  })

  describe('Form Behavior', () => {
    it('shows loading state during submission', async () => {
      const user = userEvent.setup()
      // Mock a delayed response
      mockUpdateEntry.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ id: 'test' }), 100))
      )

      render(<Editor log={mockTransportationLog} />)
      
      await user.click(screen.getByRole('button', { name: /Save/i }))
      
      expect(screen.getByText('Saving...')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('prevents form submission when already loading', async () => {
      const user = userEvent.setup()
      mockUpdateEntry.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ id: 'test' }), 100))
      )

      render(<Editor log={mockTransportationLog} />)
      
      const submitButton = screen.getByRole('button', { name: /Save/i })
      
      // Click once
      await user.click(submitButton)
      expect(screen.getByText('Saving...')).toBeInTheDocument()
      
      // Try to click again while loading
      await user.click(submitButton)
      
      // Should only be called once
      expect(mockUpdateEntry).toHaveBeenCalledTimes(1)
    })

    it('prevents default form submission', async () => {
      render(<Editor log={mockTransportationLog} />)
      
      const form = screen.getByRole('form')
      const submitEvent = fireEvent.submit(form)
      
      // Form submission should be prevented (defaultPrevented = true)
      expect(submitEvent).toBe(false)
    })

    it('handles date formatting correctly', () => {
      const logWithDate = {
        ...mockTransportationLog,
        date: new Date('2024-12-25T15:30:45Z')
      }
      
      render(<Editor log={logWithDate} />)
      
      expect(screen.getByDisplayValue('2024-12-25')).toBeInTheDocument()
    })

    it('handles missing date gracefully', () => {
      const logWithoutDate = {
        ...mockTransportationLog,
        date: null
      }
      
      render(<Editor log={logWithoutDate} />)
      
      const dateInput = screen.getByLabelText(/Date/i)
      expect(dateInput).toHaveValue('')
    })

    it('handles empty log gracefully', () => {
      const emptyLog = {
        id: 'empty-1',
        logType: 'transportation'
      }
      
      render(<Editor log={emptyLog} />)
      
      expect(screen.getByLabelText(/Activity Type/i)).toHaveValue('')
      expect(screen.getByLabelText(/Distance/i)).toHaveValue(null)
      expect(screen.getByLabelText(/Date/i)).toHaveValue('')
      expect(screen.getByLabelText(/Note/i)).toHaveValue('')
    })
  })

  describe('Form Validation', () => {
    it('allows submission with empty optional fields', async () => {
      const user = userEvent.setup()
      mockUpdateEntry.mockResolvedValue({ id: 'test' })
      
      const emptyLog = {
        id: 'empty-1',
        logType: 'transportation'
      }
      
      render(<Editor log={emptyLog} />)
      
      await user.click(screen.getByRole('button', { name: /Save/i }))
      
      await waitFor(() => {
        expect(mockUpdateEntry).toHaveBeenCalledWith(
          'empty-1',
          expect.objectContaining({
            activityType: '',
            distance: '',
            date: '',
            note: ''
          }),
          'transportation'
        )
      })
    })

    it('handles number inputs correctly', async () => {
      const user = userEvent.setup()
      render(<Editor log={mockTransportationLog} />)
      
      const distanceInput = screen.getByLabelText(/Distance/i)
      
      await user.clear(distanceInput)
      await user.type(distanceInput, '25.5')
      
      expect(distanceInput).toHaveValue(25.5)
    })
  })

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      const user = userEvent.setup()
      mockUpdateEntry.mockResolvedValue(new Error('API Error'))

      render(<Editor log={mockTransportationLog} />)
      
      await user.click(screen.getByRole('button', { name: /Save/i }))
      
      // Just verify the button returns to normal state
      await waitFor(() => {
        expect(screen.getByRole('button')).not.toBeDisabled()
      })
    })

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<Editor log={mockTransportationLog} />)
      
      expect(screen.getByLabelText(/Activity Type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Distance/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Note/i)).toBeInTheDocument()
    })

    it('submit button is keyboard accessible', () => {
      render(<Editor log={mockTransportationLog} />)
      
      const submitButton = screen.getByRole('button', { name: /Save/i })
      expect(submitButton).toBeInTheDocument()
      
      submitButton.focus()
      expect(submitButton).toHaveFocus()
    })

    it('form fields are keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<Editor log={mockTransportationLog} />)
      
      const activitySelect = screen.getByLabelText(/Activity Type/i)
      const distanceInput = screen.getByLabelText(/Distance/i)
      
      await user.tab()
      expect(activitySelect).toHaveFocus()
      
      await user.tab()
      expect(distanceInput).toHaveFocus()
    })
  })
})
});