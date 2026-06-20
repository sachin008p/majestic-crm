import React from 'react';
import { toast } from 'react-hot-toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
    toast.error('Something went wrong. Please try again.');
  }

  render() {
    if (this.state.hasError) {
      // Simple fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] text-[var(--text)]">
          <h1 className="text-2xl font-semibold">Oops! An unexpected error occurred.</h1>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
