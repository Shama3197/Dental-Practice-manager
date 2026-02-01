import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DailyCalendarSection from './DailyCalendarSection';

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (options && options.method === 'POST') {
      // Simulate adding a new task
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ task: JSON.parse(options.body).task }),
      });
    }
    // Simulate fetching tasks for a date
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });
});
afterEach(() => {
  jest.resetAllMocks();
});

describe('DailyCalendarSection', () => {
  it('renders layout and heading', () => {
    render(<DailyCalendarSection />);
    expect(screen.getByText(/Your Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Tasks for/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter new task/i)).toBeInTheDocument();
  });

  it('fetches and displays tasks for selected date', async () => {
    // Mock fetch to return tasks for a specific date
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ task: 'Test Task' }]),
    }));
    render(<DailyCalendarSection />);
    // Wait for tasks to appear
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
  });

  it('adds a new task and renders it', async () => {
    render(<DailyCalendarSection />);
    const textarea = screen.getByPlaceholderText(/Enter new task/i);
    fireEvent.change(textarea, { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText(/Add Task/i));
    // Wait for new task to appear
    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });

  it('does not require auth/token for API calls', async () => {
    render(<DailyCalendarSection />);
    fireEvent.change(screen.getByPlaceholderText(/Enter new task/i), { target: { value: 'No Auth Task' } });
    fireEvent.click(screen.getByText(/Add Task/i));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.not.objectContaining({ headers: expect.objectContaining({ Authorization: expect.any(String) }) })
      );
    });
  });

  it('calls stubbed API endpoints and handles responses', async () => {
    render(<DailyCalendarSection />);
    // Should call fetch for GET and POST
    fireEvent.change(screen.getByPlaceholderText(/Enter new task/i), { target: { value: 'Stubbed API Task' } });
    fireEvent.click(screen.getByText(/Add Task/i));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
}); 