'use server';

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';
import { API_URL, API_TAG } from '@/lib/api';
import type { ActionResult } from '@/types';

// Server actions are public POST endpoints, so every action must verify the session itself.
async function assertSession(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) throw new Error('Unauthorized');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.BACKEND_ADMIN_KEY}`,
  };
}

async function request(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: object): Promise<ActionResult> {
  try {
    await assertSession();
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: authHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || `Request failed (${res.status})`);
    }
    revalidateTag(API_TAG);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

const portfolioBody = (formData: FormData) => ({
  name: formData.get('name'),
  tags: formData.get('tags'),
  external_url: formData.get('external_url'),
  description: formData.get('description'),
  year: formData.get('year'),
  highlight: formData.get('highlight') === 'on',
  client: formData.get('client'),
  made_at: formData.get('made_at'),
});

const workBody = (formData: FormData) => ({
  title: formData.get('title'),
  company_name: formData.get('company_name'),
  location: formData.get('location'),
  time: formData.get('time'),
  job_desc: formData.get('job_desc'),
});

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────

export async function createPortfolio(formData: FormData) {
  return request('/portfolio', 'POST', portfolioBody(formData));
}

export async function updatePortfolio(id: number, formData: FormData) {
  return request(`/portfolio/${id}`, 'PUT', portfolioBody(formData));
}

export async function deletePortfolio(id: number) {
  return request(`/portfolio/${id}`, 'DELETE');
}

// ─── WORKS ───────────────────────────────────────────────────────────────────

export async function createWork(formData: FormData) {
  return request('/works', 'POST', workBody(formData));
}

export async function updateWork(id: number, formData: FormData) {
  return request(`/works/${id}`, 'PUT', workBody(formData));
}

export async function deleteWork(id: number) {
  return request(`/works/${id}`, 'DELETE');
}
