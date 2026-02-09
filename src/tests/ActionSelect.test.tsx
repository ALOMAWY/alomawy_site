import { render, screen, fireEvent } from './test-utils'
import { describe, it, expect } from 'vitest'
import ActionSelect from '../components/ActionSelect'

describe('ActionSelect Component', () => {
  it('renders correctly', () => {
    render(<ActionSelect />)
    expect(screen.getByText(/Tools/i)).toBeInTheDocument()
  })

  it('opens tools menu when clicked', () => {
    render(<ActionSelect />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByText(/Change Theme/i)).toBeInTheDocument()
    expect(screen.getByText(/Change Language/i)).toBeInTheDocument()
  })

  it('triggers action and closes menu', () => {
    render(<ActionSelect />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    const themeBtn = screen.getByText(/Change Theme/i)
    fireEvent.click(themeBtn)
    
    expect(screen.queryByText(/Change Language/i)).not.toBeInTheDocument()
  })
})
