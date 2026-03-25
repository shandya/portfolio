'use server';

const API = process.env.NEXT_PUBLIC_API_URL;

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.BACKEND_ADMIN_KEY}`,
  };
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────

export async function createPortfolio(formData) {
  try {
    const body = {
      name: formData.get('name'),
      tags: formData.get('tags'),
      external_url: formData.get('external_url'),
      description: formData.get('description'),
      year: formData.get('year'),
      highlight: formData.get('highlight') === 'on',
      client: formData.get('client'),
      made_at: formData.get('made_at'),
    };
    const res = await fetch(`${API}/portfolio`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function updatePortfolio(id, formData) {
  try {
    const body = {
      name: formData.get('name'),
      tags: formData.get('tags'),
      external_url: formData.get('external_url'),
      description: formData.get('description'),
      year: formData.get('year'),
      highlight: formData.get('highlight') === 'on',
      client: formData.get('client'),
      made_at: formData.get('made_at'),
    };
    const res = await fetch(`${API}/portfolio/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function deletePortfolio(id) {
  try {
    const res = await fetch(`${API}/portfolio/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok && res.status !== 204) throw new Error(await res.text());
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// ─── WORKS ───────────────────────────────────────────────────────────────────

export async function createWork(formData) {
  try {
    const body = {
      title: formData.get('title'),
      company_name: formData.get('company_name'),
      location: formData.get('location'),
      time: formData.get('time'),
      job_desc: formData.get('job_desc'),
    };
    const res = await fetch(`${API}/works`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function updateWork(id, formData) {
  try {
    const body = {
      title: formData.get('title'),
      company_name: formData.get('company_name'),
      location: formData.get('location'),
      time: formData.get('time'),
      job_desc: formData.get('job_desc'),
    };
    const res = await fetch(`${API}/works/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function deleteWork(id) {
  try {
    const res = await fetch(`${API}/works/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok && res.status !== 204) throw new Error(await res.text());
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
