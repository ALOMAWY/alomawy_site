import { render, screen, fireEvent, waitFor } from './test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Portfolio from '../components/Portfolio'

// Mock the fetch API
const mockProjects = [
  { _id: '1', title: 'Project 1', type: 'website', developer: 'ALOMAWY', disc: 'test disc', techs: [], langs: [], rate: '80', visit: '#' },
  { _id: '2', title: 'Project 2', type: 'game', developer: 'ALOMAWY', disc: 'test disc 2', techs: [], langs: [], rate: '90', visit: '#' }
]

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve(mockProjects)
})

describe('Portfolio Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state then projects', async () => {
    render(<Portfolio />)
    
    // Check loading text from translations
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument()
      expect(screen.getByText('Project 2')).toBeInTheDocument()
    })
  })

  it('filters projects by category', async () => {
    render(<Portfolio />)
    
    await waitFor(() => expect(screen.getByText('Project 1')).toBeInTheDocument())
    
    // Click on Websites filter
    const websitesBtn = screen.getByText(/Websites/i)
    fireEvent.click(websitesBtn)
    
    expect(screen.getByText('Project 1')).toBeInTheDocument()
    // Project 2 (game) should be filtered out
    expect(screen.queryByText('Project 2')).not.toBeInTheDocument()
  })
})
