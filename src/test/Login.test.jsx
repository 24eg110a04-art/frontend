import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Login from '../pages/Login.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import * as authService from '../services/authService.js';

vi.mock('../services/authService.js');

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('shows validation errors for an empty form', async () => {
    renderLogin();
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('shows the server error for invalid credentials', async () => {
    authService.login.mockRejectedValue({ userMessage: 'Invalid email or password' });
    renderLogin();
    await userEvent.type(screen.getByLabelText('Email'), 'kiran@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'WrongPass1');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
  });

  it('links to the register page', () => {
    renderLogin();
    expect(screen.getByRole('link', { name: /create an account/i })).toHaveAttribute('href', '/register');
  });
});
