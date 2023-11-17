// pages/api/proxy/[...proxy].ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;
  let { proxy, ...queryParams } = query;

  if (Array.isArray(proxy)) proxy = proxy.join('/');

  const queryString = new URLSearchParams(queryParams as Record<string, string>).toString();
  const backendURL = `http://54.196.68.6:8080/${proxy}?${queryString}`;

  console.log('------- ', backendURL);

  try {
    const response = await fetch(backendURL, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.log('err', error);
  }
}
