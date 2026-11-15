// Server-side proxy for the OMDb API so the API key never reaches the browser bundle.
export default async (req) => {
  const url = new URL(req.url)
  const title = (url.searchParams.get('t') || '').trim()

  if (!title) {
    return Response.json({ Response: 'False', Error: 'Missing title' }, { status: 400 })
  }

  const apiKey = process.env.OMDB_API_KEY || process.env.VITE_OMDB_API_KEY
  if (!apiKey) {
    return Response.json({ Response: 'False', Error: 'OMDb API key not configured' }, { status: 500 })
  }

  try {
    const upstream = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(title.slice(0, 200))}&apikey=${encodeURIComponent(apiKey)}`
    )
    const data = await upstream.json()
    return Response.json(data, {
      status: upstream.ok ? 200 : upstream.status,
      headers: { 'Cache-Control': 'public, max-age=86400' },
    })
  } catch {
    return Response.json({ Response: 'False', Error: 'Upstream request failed' }, { status: 502 })
  }
}

export const config = {
  path: '/api/omdb',
}
