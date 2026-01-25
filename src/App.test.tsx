import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

const GOOGLE_CLIENT_ID = 'test-client-id';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </GoogleOAuthProvider>
);

describe('App', () => {
  test('renders without crashing', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    expect(screen.getByText(/cargando/i)).toBeInTheDocument(); // Assuming loading state
  });
});