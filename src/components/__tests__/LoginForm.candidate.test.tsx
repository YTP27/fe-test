import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginForm from '../LoginForm'
import * as auth from '../../api/auth'

vi.mock('../../api/auth', () => ({
  login: vi.fn()
}))

describe('LoginForm', () => {
  const mockLogin = auth.login as unknown as ReturnType<typeof vi.fn>

  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('should render username, password inputs and login button', () => {
    render(<LoginForm />)

    const form = screen.getAllByLabelText(/login form/i)[0]
    expect(within(form).getByLabelText(/username/i)).toBeInTheDocument()
    expect(within(form).getByLabelText(/password/i)).toBeInTheDocument()
    expect(within(form).getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('should show error when submitting empty fields', async () => {
    render(<LoginForm />)
    const form = screen.getAllByLabelText(/login form/i)[0]
    const button = within(form).getByRole('button', { name: /log in/i })
    await userEvent.click(button)

    expect(await screen.findByRole('alert')).toHaveTextContent(/username and password are required/i)
  })

  it('should show invalid credentials when wrong input', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'))

    render(<LoginForm />)
    const form = screen.getAllByLabelText(/login form/i)[0]
    const usernameInput = within(form).getByLabelText(/username/i)
    const passwordInput = within(form).getByLabelText(/password/i)

    await userEvent.clear(usernameInput)
    await userEvent.clear(passwordInput)
    await userEvent.type(usernameInput, 'wrong')
    await userEvent.type(passwordInput, 'user')

    const button = within(form).getByRole('button', { name: /log in/i })
    await userEvent.click(button)

    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid credentials/i)
  })

  it('should show welcome message when correct credentials', async () => {
    mockLogin.mockResolvedValueOnce(undefined)

    render(<LoginForm />)
    const form = screen.getAllByLabelText(/login form/i)[0]

    const usernameInput = within(form).getByLabelText(/username/i)
    const passwordInput = within(form).getByLabelText(/password/i)

    await userEvent.clear(usernameInput)
    await userEvent.clear(passwordInput)
    await userEvent.type(usernameInput, 'admin')
    await userEvent.type(passwordInput, 'secret')

    const button = within(form).getByRole('button', { name: /log in/i })
    await userEvent.click(button)

    expect(await screen.findByText(/welcome, admin/i)).toBeInTheDocument()
  })
})
