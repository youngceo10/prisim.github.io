import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputFile = resolve(scriptDirectory, '../data/news-candidates.json');
const apiKey = process.env.NEWSAPI_KEY;

if (!apiKey) {
  throw new Error('NEWSAPI_KEY is required. Add it as a GitHub Actions repository secret.');
}

const query = '"Ray-Ban Meta" OR "Meta AI glasses" OR "Oakley Meta"';
const endpoint = new URL('https://newsapi.org/v2/everything');
endpoint.search = new URLSearchParams({
  q: query,
  searchIn: 'title,description',
  language: 'en',
  sortBy: 'publishedAt',
  pageSize: '30',
  from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10)
}).toString();

const response = await fetch(endpoint, { headers: { 'X-Api-Key': apiKey } });
if (!response.ok) {
  throw new Error(`News API returned ${response.status}: ${await response.text()}`);
}

const payload = await response.json();
if (payload.status !== 'ok' || !Array.isArray(payload.articles)) {
  throw new Error('News API returned an unexpected response.');
}

const relevance = /privacy|data|camera|microphone|voice|record|security|policy|consent|indicator|surveillance|ai/i;
const seen = new Set();
const articles = payload.articles
  .filter(article => article?.url && article?.title && relevance.test(`${article.title} ${article.description ?? ''}`))
  .filter(article => {
    if (seen.has(article.url)) return false;
    seen.add(article.url);
    return true;
  })
  .slice(0, 12)
  .map(article => ({
    title: article.title.replace(/\s+/g, ' ').trim(),
    source: article.source?.name?.replace(/\s+/g, ' ').trim() || 'Unknown source',
    url: article.url,
    publishedAt: article.publishedAt
  }));

let previous = { schemaVersion: 1, generatedAt: null, articles: [] };
try {
  previous = JSON.parse(await readFile(outputFile, 'utf8'));
} catch {
  // First run creates the file.
}

const unchanged = JSON.stringify(previous.articles) === JSON.stringify(articles);
if (unchanged) {
  console.log('No new candidate reports; data file is unchanged.');
  process.exit(0);
}

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), articles }, null, 2)}\n`);
console.log(`Updated news watch with ${articles.length} candidate report(s).`);
