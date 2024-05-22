import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Home } from '../src/app/page'
 
describe('Page', () => {
  it('renders an archive', () => {
    render(<Home />)
 
    const archive = screen.getByRole('archive', { level: 1 })
 
    expect(archive).toBeInTheDocument()
  })
})