/** @jest-environment node */
import { createSessionToken, verifySessionToken } from '../src/lib/session';

describe('CMS session tokens', () => {
  beforeEach(() => {
    process.env.CMS_SESSION_SECRET = 'test-secret';
  });

  it('accepts a freshly signed token', async () => {
    expect(await verifySessionToken(await createSessionToken())).toBe(true);
  });

  it('rejects the old static cookie value and empty tokens', async () => {
    expect(await verifySessionToken('authenticated')).toBe(false);
    expect(await verifySessionToken(undefined)).toBe(false);
  });

  it('rejects a tampered signature', async () => {
    const [expires] = (await createSessionToken()).split('.');
    expect(await verifySessionToken(`${expires}.deadbeef`)).toBe(false);
  });

  it('rejects an expired token', async () => {
    const spy = jest.spyOn(Date, 'now').mockReturnValue(0);
    const token = await createSessionToken();
    spy.mockRestore();
    expect(await verifySessionToken(token)).toBe(false);
  });

  it('fails closed when the secret is missing', async () => {
    const token = await createSessionToken();
    delete process.env.CMS_SESSION_SECRET;
    expect(await verifySessionToken(token)).toBe(false);
  });
});
