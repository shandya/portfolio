/** @jest-environment node */
import { createSessionToken } from '../src/lib/session';

const mockCookie = jest.fn();
const mockRevalidate = jest.fn();

jest.mock('next/headers', () => ({ cookies: () => ({ get: mockCookie }) }));
jest.mock('next/cache', () => ({ revalidateTag: (...a: unknown[]) => mockRevalidate(...a) }));

let deleteWork: typeof import('../src/app/cms/actions').deleteWork;
let createPortfolio: typeof import('../src/app/cms/actions').createPortfolio;

beforeAll(async () => {
  // lib/api reads API_URL at import time, so set it before loading the actions
  process.env.API_URL = 'http://api.test/api';
  ({ deleteWork, createPortfolio } = await import('../src/app/cms/actions'));
});

describe('CMS server actions', () => {
  beforeEach(() => {
    process.env.CMS_SESSION_SECRET = 'test-secret';
    process.env.BACKEND_ADMIN_KEY = 'admin-key';
    process.env.API_URL = 'http://api.test/api';
    global.fetch = jest.fn(async () => ({ ok: true, status: 204, json: async () => ({}) })) as any;
    mockCookie.mockReset();
    mockRevalidate.mockReset();
  });

  it('refuses to call the backend without a valid session', async () => {
    mockCookie.mockReturnValue(undefined);
    expect(await deleteWork(1)).toEqual({ ok: false, error: 'Unauthorized' });

    mockCookie.mockReturnValue({ value: 'authenticated' });
    expect(await deleteWork(1)).toEqual({ ok: false, error: 'Unauthorized' });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('forwards the admin key and revalidates cached pages with a valid session', async () => {
    mockCookie.mockReturnValue({ value: await createSessionToken() });
    const fd = new FormData();
    fd.set('name', 'X');
    fd.set('highlight', 'on');

    expect(await createPortfolio(fd)).toEqual({ ok: true });

    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('http://api.test/api/portfolio');
    expect(init.headers.Authorization).toBe('Bearer admin-key');
    expect(JSON.parse(init.body).highlight).toBe(true);
    expect(mockRevalidate).toHaveBeenCalledWith('api');
  });

  it('surfaces the backend error message', async () => {
    mockCookie.mockReturnValue({ value: await createSessionToken() });
    global.fetch = jest.fn(async () => ({ ok: false, status: 400, json: async () => ({ error: 'Invalid request body' }) })) as any;
    expect(await deleteWork(1)).toEqual({ ok: false, error: 'Invalid request body' });
  });
});
