// LabSim - Consulta Enciclopédica Científica (Wikipedia PT / EN)
// Integrado ao Open Anatomy Atlas com suporte a português e cache offline/local
/* global wikiSummary */

const WIKI_API_PT = 'https://pt.wikipedia.org/w/api.php';
const WIKI_API_EN = 'https://en.wikipedia.org/w/api.php';
const wikiCache = new Map();

function cleanAnatomyName(name) {
  return name
    .replace(/\b(esquerdo|direita|esquerda|direito|left|right)\b/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/sistema\s+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchWikiPage(api, params) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 6000);
  try {
    const qs = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      redirects: '1',
      prop: 'extracts|pageimages|pageprops|info',
      inprop: 'url',
      exintro: '1',
      explaintext: '1',
      exsentences: '4',
      pithumbsize: '360',
      ...params,
    });
    const res = await fetch(`${api}?${qs}`, { signal: ctl.signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const pages = Object.values((data.query && data.query.pages) || {});
    return pages.find(p => !p.missing && !(p.pageprops && 'disambiguation' in p.pageprops) && p.extract) || null;
  } finally {
    clearTimeout(timer);
  }
}

async function getScientificSummary(namePt, nameEn) {
  const qPt = cleanAnatomyName(namePt);
  const qEn = cleanAnatomyName(nameEn || namePt);
  const cacheKey = qPt.toLowerCase();

  if (wikiCache.has(cacheKey)) {
    return wikiCache.get(cacheKey);
  }

  const job = (async () => {
    try {
      // 1. Tenta Wikipédia em Português
      let page = await fetchWikiPage(WIKI_API_PT, { titles: qPt });
      if (!page) {
        page = await fetchWikiPage(WIKI_API_PT, { generator: 'search', gsrlimit: '1', gsrsearch: `${qPt} anatomia` });
      }

      // 2. Se não encontrar, tenta em Inglês
      if (!page && qEn) {
        page = await fetchWikiPage(WIKI_API_EN, { titles: qEn });
        if (!page) {
          page = await fetchWikiPage(WIKI_API_EN, { generator: 'search', gsrlimit: '1', gsrsearch: `${qEn} anatomy` });
        }
      }

      if (!page) return null;

      return {
        title: page.title,
        extract: page.extract,
        url: page.fullurl,
        thumb: page.thumbnail ? page.thumbnail.source : null
      };
    } catch (err) {
      console.warn('Consulta Wikipedia indisponível:', err);
      return null;
    }
  })();

  wikiCache.set(cacheKey, job);
  job.catch(() => wikiCache.delete(cacheKey));
  return job;
}

if (typeof window !== 'undefined') {
  window.getScientificSummary = getScientificSummary;
}
