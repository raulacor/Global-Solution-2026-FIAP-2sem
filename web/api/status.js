// Vercel serverless function: GET /api/status
// The browser can't fetch the Direto do Metrô page directly (CORS), so this runs on Vercel's
// server, fetches the page and hands the raw HTML back to the site. Parsing stays in the
// Python core (metro/line_status.py → ParseStatus), run in the browser through Pyodide.
const SOURCE = 'https://www.metro.sp.gov.br/wp-content/themes/metrosp/direto-metro.php?embed=1'

export default async function handler(request, response) {
  try {
    const upstream = await fetch(SOURCE, { headers: { 'User-Agent': 'Detour (FIAP GS 2026)' } })
    if (!upstream.ok) {
      response.status(502).json({ error: `Metrô answered HTTP ${upstream.status}` })
      return
    }
    const html = await upstream.text()
    // Cache for 60 s on Vercel's edge: everyone gets fresh-enough status without hammering Metrô.
    response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.status(200).send(html)
  } catch (error) {
    response.status(502).json({ error: `Could not reach Metrô: ${error.message}` })
  }
}
