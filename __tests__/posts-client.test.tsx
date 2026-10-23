import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { Post } from '../src/types';

const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockRefresh = jest.fn();

jest.mock('../src/app/cms/actions', () => ({
  createPost: (...a: unknown[]) => mockCreate(...a),
  updatePost: (...a: unknown[]) => mockUpdate(...a),
  deletePost: jest.fn(),
}));
jest.mock('next/navigation', () => ({ useRouter: () => ({ refresh: mockRefresh }) }));
// The real TipTap editor needs a full DOM; a plain hidden input is enough to test form wiring
jest.mock('../src/app/cms/RichTextEditor', () => ({
  __esModule: true,
  default: ({ name, defaultValue = '' }: { name: string; defaultValue?: string }) => (
    <input type="hidden" name={name} defaultValue={defaultValue} />
  ),
}));

import PostsClient from '../src/app/cms/posts/PostsClient';

const post: Post = {
  id: 7,
  slug: 'hello-world',
  title: 'Hello World',
  excerpt: 'Intro',
  content: '<p>Body</p>',
  cover_url: '',
  tags: 'react',
  status: 'published',
  published_at: '2026-10-01T00:00:00Z',
  created_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-02T00:00:00Z',
};

describe('PostsClient', () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockRefresh.mockReset();
  });

  it('lists posts with status and a View link for published ones', () => {
    render(<PostsClient initialData={[post, { ...post, id: 8, slug: 'draft-one', title: 'Draft One', status: 'draft', published_at: null }]} />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('Published', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Draft', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getAllByText('View')).toHaveLength(1);
    expect(screen.getByText('View').closest('a')).toHaveAttribute('href', '/blog/hello-world');
    // Every post, drafts included, can be previewed in the CMS
    const previews = screen.getAllByText('Preview').map((el) => el.closest('a')?.getAttribute('href'));
    expect(previews).toEqual(['/cms/posts/7/preview', '/cms/posts/8/preview']);
  });

  it('submits a new post through createPost and refreshes', async () => {
    mockCreate.mockResolvedValue({ ok: true });
    render(<PostsClient initialData={[]} />);

    fireEvent.click(screen.getByText('+ New Post'));
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'My Post' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => expect(mockCreate).toHaveBeenCalledTimes(1));
    const fd = mockCreate.mock.calls[0][0] as FormData;
    expect(fd.get('title')).toBe('My Post');
    expect(fd.get('status')).toBe('draft');
    await waitFor(() => expect(mockRefresh).toHaveBeenCalled());
  });

  it('edits through updatePost and shows backend errors such as slug conflicts', async () => {
    mockUpdate.mockResolvedValue({ ok: false, error: 'Slug already in use' });
    render(<PostsClient initialData={[post]} />);

    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByLabelText('Slug')).toHaveValue('hello-world');
    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText('Slug already in use')).toBeInTheDocument();
    expect(mockUpdate.mock.calls[0][0]).toBe(7);
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
