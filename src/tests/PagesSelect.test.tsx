import { render, screen, fireEvent } from './test-utils'
import { describe, it, expect, vi } from 'vitest'
import PagesSelect from '../components/PagesSelect'

describe('PagesSelect Component', () => {
  it('renders the current page name', () => {
    render(<PagesSelect />)
    expect(screen.getByText(/Page/i)).toBeInTheDocument()
  })

  it('opens dropdown when clicked', () => {
    render(<PagesSelect />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Check if one of the menu items is visible
    expect(screen.getByText(/Home/i)).toBeInTheDocument()
    expect(screen.getByText(/Services/i)).toBeInTheDocument()
  })

  it('closes dropdown when a link is clicked', () => {
    render(<PagesSelect />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    const homeLink = screen.getByText(/Home/i)
    fireEvent.click(homeLink)
    
    // Dropdown items should be removed from DOM
    expect(screen.queryByText(/Services/i)).not.toBeInTheDocument()
  })
})
