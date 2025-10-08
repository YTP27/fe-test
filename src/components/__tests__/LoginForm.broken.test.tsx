import { render, screen, fireEvent } from '@testing-library/react'
import { test, expect } from 'vitest'
import LoginForm from '../LoginForm'

test('BROKEN: shows welcome on successful login', async () => {
  render(<LoginForm />)

  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'admin' } })
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret' } })
  fireEvent.click(screen.getByRole('button', { name: /log in/i }))

  expect(await screen.findByText(/welcome, admin/i)).toBeInTheDocument()
})
