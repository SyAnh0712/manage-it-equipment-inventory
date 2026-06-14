import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

// Mock the useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock react-router-dom's Navigate component
vi.mock('react-router-dom', () => ({
  Navigate: vi.fn(({ to }) => <div data-testid="navigate" data-to={to} />),
}));

describe('ProtectedRoute component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when authenticated and adminOnly is false', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      initialLoading: false,
      user: { role: 'staff' },
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      initialLoading: false,
      user: null,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    const navigateEl = screen.getByTestId('navigate');
    expect(navigateEl).toBeInTheDocument();
    expect(navigateEl).toHaveAttribute('data-to', '/login');
  });

  it('redirects to /dashboard when user is not admin and adminOnly is true', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      initialLoading: false,
      user: { role: 'staff' },
    });

    render(
      <ProtectedRoute adminOnly={true}>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    const navigateEl = screen.getByTestId('navigate');
    expect(navigateEl).toBeInTheDocument();
    expect(navigateEl).toHaveAttribute('data-to', '/dashboard');
  });

  it('renders children when user is admin and adminOnly is true', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      initialLoading: false,
      user: { role: 'admin' },
    });

    render(
      <ProtectedRoute adminOnly={true}>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('renders Spinner when initialLoading is true', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      initialLoading: true,
      user: null,
    });

    const { container } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    
    // Check for bootstrap spinner class
    const spinner = container.querySelector('.spinner-border');
    expect(spinner).toBeInTheDocument();
  });
});
