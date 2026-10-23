import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Archive from '../src/app/archive/page';

const item = {
  id: 1, name: 'Alpha Site', tags: 'React,Next', external_url: 'https://alpha.test',
  description: '<p>d</p>', year: '2024', highlight: false, client: 'ACME', made_at: 'Studio',
};
const response = (data: unknown[]) => ({
  ok: true,
  json: async () => ({ data, meta: { currentPage: 1, size: 20, totalItems: data.length, totalPages: 1 } }),
});

describe('Archive', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://api.test/api';
    (global as any).IntersectionObserver = class {
      observe() {}
      disconnect() {}
    };
    global.fetch = jest.fn(async () => response([item])) as any;
  });

  it('loads the first page and lists projects', async () => {
    render(<Archive />);
    expect((await screen.findAllByText('Alpha Site')).length).toBeGreaterThan(0);
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe('http://api.test/api/portfolio?page=1&size=20');
  });

  it('searches on the server (debounced) rather than filtering loaded rows', async () => {
    render(<Archive />);
    await screen.findAllByText('Alpha Site');

    fireEvent.change(screen.getByPlaceholderText('Search projects...'), { target: { value: 'react app' } });
    await waitFor(() =>
      expect((global.fetch as jest.Mock).mock.calls.map((c) => c[0])).toContain(
        'http://api.test/api/portfolio?page=1&size=20&q=react%20app',
      ),
    );
  });

  it('shows an error with retry when the API fails', async () => {
    global.fetch = jest.fn(async () => ({ ok: false, status: 500, json: async () => ({}) })) as any;
    render(<Archive />);
    expect(await screen.findByText(/Failed to load projects/)).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });
});
