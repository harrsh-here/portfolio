export default async (request) => {
  if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });
  const title = new URL(request.url).searchParams.get('t')?.trim();
  if (!title || title.length > 200) return Response.json({ error: 'Invalid title' }, { status: 400 });
  const key = process.env.OMDB_API_KEY;
  if (!key) return Response.json({ error: 'Movie details are not configured' }, { status: 503 });
  const url = new URL('https://www.omdbapi.com/');
  url.searchParams.set('t', title);
  url.searchParams.set('apikey', key);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Upstream unavailable');
    return Response.json(await response.json(), { headers: { 'Cache-Control': 'public, max-age=3600' } });
  } catch {
    return Response.json({ error: 'Movie details temporarily unavailable' }, { status: 502 });
  }
};
