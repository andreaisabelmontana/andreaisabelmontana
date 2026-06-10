#!/usr/bin/env node
/**
 * Regenerates README.md from README.template.md by pulling repos from the
 * GitHub API and grouping them under courses by topic.
 *
 * Convention: tag a course repo with a topic from the CATEGORIES table below
 * (e.g. `bcsai-calc`, `bcsai-nlp`). The script reads `has_pages` to decide
 * between 🌐 (live site) and 📂 (source-only).
 *
 * Independent projects / study rebuilds aren't topic-tagged, so they're
 * curated per-course in EXTRA below and merged into the same row.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const USER = 'andreaisabelmontana';
const TOKEN = process.env.GITHUB_TOKEN || '';
const ROOT = path.resolve(__dirname, '..');

// Ordered by Year > Semester (derived from BCSAI syllabus metadata).
// [section label, [course slug, display name]...]
const CATEGORIES = [
  ['📘 Year 1 — Semester 1', [
    ['discrete', 'Discrete Mathematics'],
    ['fps',      'Fundamentals of Probability & Statistics'],
    ['business', 'Introduction to Business Management'],
    ['research', 'Learning to Observe, Experiment & Survey'],
    ['history',  'The Big History of Ideas and Innovation'],
  ]],
  ['📘 Year 1 — Semester 2', [
    ['data',     'Fundamentals of Data Analysis'],
    ['humanities', 'Humanities'],
    ['physics',  'Physics for Computer Science'],
    ['pop',      'Principles of Programming'],
    ['modeling', 'Simulating and Modeling to Understand Change'],
  ]],
  ['📗 Year 2 — Semester 1', [
    ['algos',    'Algorithms & Data Structures'],
    ['calc',     'Calculus for Computer Science'],
    ['cloud',    'Cloud Computing'],
    ['arch',     'Computer Architecture, Networks & OS'],
    ['cp1',      'Computer Programming I'],
    ['tech',     'Technology with Impact'],
  ]],
  ['📗 Year 2 — Semester 2', [
    ['mlf',      'AI: Machine Learning Foundations'],
    ['affect',   'AI: Personality & Emotion for AI Design'],
    ['db',       'Designing and Using Databases'],
    ['entrep',   'IE Impact Entrepreneurship'],
    ['linalg',   'Matrices & Linear Transformations'],
    ['prob',     'Probability for Computing Science'],
  ]],
  ['📙 Year 3 — Semester 1', [
    ['cp2',      'Computer Programming II'],
    ['iec',      'IE Challenge'],
    ['sddo',     'Software Development & DevOps'],
    ['reason',   'AI: Reasoning & Problem Solving'],
    ['robolab',  'Introduction to Robotics Lab'],
    ['hpc',      'High Performance Computing'],
  ]],
  ['📙 Year 3 — Semester 2', [
    ['chat',     'AI: Chatbots & Recommendation Engines'],
    ['vision',   'AI: Computer Vision'],
    ['nlp',      'AI: NLP & Semantic Analysis'],
    ['rl',       'AI: Reinforcement Learning'],
    ['stat',     'AI: Statistical Learning & Prediction'],
  ]],
  ['📕 Year 4 — Semester 2', [
    ['blockchain', 'Blockchain, Cryptocurrencies & FinTech'],
    ['ethics',   'Ethics, Policy & Legislation in CS'],
    ['robo',     'Robotics & Automation'],
    ['uxui',     'UX/UI & Human-Computer Interaction'],
    ['capstone', 'Capstone Project'],
  ]],
];

const TOPIC_PREFIX = 'bcsai-';

const PAGES = (slug) => `🌐 [${slug}](https://${USER}.github.io/${slug}/)`;
const SRC = (slug) => `📂 [${slug}](https://github.com/${USER}/${slug})`;

// Independent projects & study rebuilds, curated into the course they fit.
// Merged with topic-tagged course repos in the same row.
const EXTRA = {
  data:    [PAGES('vigiview'), PAGES('shopsmart')],
  physics: [PAGES('pyfreebody'), PAGES('radioform-web')],
  arch:    [PAGES('hostpad-802.11r'), SRC('terminalchat-rebuild')],
  cloud:   [PAGES('petcare')],
  mlf:     [PAGES('efficient-classifier-rebuild'), PAGES('heuristic-compiler-rebuild')],
  db:      [PAGES('fantasy-forum'), PAGES('matchup'), SRC('tablepro-rebuild')],
  entrep:  [PAGES('foodloop-rebuild')],
  cp2:     [PAGES('futclub-manager')],
  iec:     ['🎤 [pitch deck](https://canva.link/hah28m2jrnhfj42)'],
  sddo:    [PAGES('qrate'), PAGES('rerun'), PAGES('bug-tracker'), PAGES('daybook'), PAGES('dotfiles'), PAGES('sublime-config'), PAGES('dev-vm-setup')],
  reason:  [PAGES('symphony'), PAGES('victoria-rebuild'), PAGES('neural-noir-rebuild')],
  hpc:     [PAGES('gpu-montecarlo-risk-rebuild'), PAGES('uncorrelated-returns'), PAGES('time-series-momentum-rebuild'), PAGES('aimes-emanager'), PAGES('hpc-course'), PAGES('hpc_foundations_book'), PAGES('hpc_applications_book')],
  chat:    [PAGES('mistral-kit'), PAGES('radical-bot'), PAGES('bookdb-discovery'), PAGES('moviewatchlist'), PAGES('memora-rebuild')],
  vision:  [PAGES('fatigued-driver-detector'), PAGES('ie-tower-vpr'), PAGES('crittercut'), PAGES('SPICE'), PAGES('holovinyl-rebuild')],
  nlp:     [PAGES('truthlens'), PAGES('stash')],
  rl:      [PAGES('mountain-car-control'), PAGES('mesh-parking-rl'), PAGES('swipe-rl'), PAGES('rl-control-lab')],
  stat:    [PAGES('beyondstats')],
  blockchain: [PAGES('rodeo'), PAGES('harthat-web3-tutorial')],
  ethics:  [PAGES('openpolicystack'), PAGES('garlic')],
  robo:    [PAGES('botzo'), PAGES('niryo-one-digital-twin'), PAGES('niryo-one-datasets'), PAGES('turtlebot2-service'), PAGES('digital-twin-scalability')],
};

function ghRequest(url) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': `${USER}-readme-bot`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;

    https.get(url, { headers }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ data: JSON.parse(body), link: res.headers.link });
        } else {
          reject(new Error(`${res.statusCode} ${res.statusMessage}: ${body.slice(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

async function fetchAllRepos() {
  const repos = [];
  let url = `https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=updated`;
  while (url) {
    const { data, link } = await ghRequest(url);
    repos.push(...data);
    const next = link && link.match(/<([^>]+)>;\s*rel="next"/);
    url = next ? next[1] : null;
  }
  return repos;
}

function pickEmoji(repo) {
  if (repo.has_pages) return '🌐';
  if (repo.fork) return '🍴';
  return '📂';
}

function pickUrl(repo) {
  if (repo.has_pages) {
    // Prefer the configured homepage if it looks like a real URL.
    if (repo.homepage && /^https?:\/\//.test(repo.homepage)) return repo.homepage;
    return `https://${USER}.github.io/${repo.name}/`;
  }
  return repo.html_url;
}

function renderRepoLink(repo) {
  return `${pickEmoji(repo)} [${repo.name}](${pickUrl(repo)})`;
}

function buildTable(repos) {
  // Map: topic-suffix -> list of repos
  const byTopic = new Map();
  for (const repo of repos) {
    const topics = repo.topics || [];
    for (const t of topics) {
      if (!t.startsWith(TOPIC_PREFIX)) continue;
      const slug = t.slice(TOPIC_PREFIX.length);
      if (!byTopic.has(slug)) byTopic.set(slug, []);
      byTopic.get(slug).push(repo);
    }
  }

  // Build rows in chronological order, numbered `<year>.<course-in-year>`.
  const rows = [];
  const perYear = {};
  for (const [header, courses] of CATEGORIES) {
    const year = (header.match(/Year (\d)/) || [])[1] || '?';
    for (const [slug, name] of courses) {
      perYear[year] = (perYear[year] || 0) + 1;
      const matched = (byTopic.get(slug) || [])
        .sort((a, b) => Number(b.has_pages) - Number(a.has_pages) || a.name.localeCompare(b.name))
        .map(renderRepoLink);
      const links = [...matched, ...(EXTRA[slug] || [])];
      const cell = links.length ? links.join(' · ') : '_— coming soon —_';
      rows.push(`| ${year}.${perYear[year]} | ${name} | ${cell} |`);
    }
  }
  rows.reverse(); // most recent / last-year courses first

  const lines = ['| # | Course | Coursework & Projects |', '|---|---|---|', ...rows, ''];

  // Orphans: repos tagged `bcsai-<slug>` where <slug> isn't in CATEGORIES.
  const known = new Set();
  for (const [, courses] of CATEGORIES) for (const [s] of courses) known.add(s);
  const orphans = [...byTopic.entries()].filter(([s]) => !known.has(s));
  if (orphans.length) {
    lines.push('### ⚠️ Unmapped course topics');
    lines.push('| Topic | Repos |');
    lines.push('|---|---|');
    for (const [slug, list] of orphans) {
      lines.push(`| \`bcsai-${slug}\` | ${list.map(renderRepoLink).join(' · ')} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const repos = await fetchAllRepos();
  console.error(`Fetched ${repos.length} repos`);
  const table = buildTable(repos);

  const template = fs.readFileSync(path.join(ROOT, 'README.template.md'), 'utf8');
  const stamp = new Date().toISOString().slice(0, 10);

  const output = template
    .replace(
      /<!-- COURSE_TABLE_START -->[\s\S]*?<!-- COURSE_TABLE_END -->/,
      `<!-- COURSE_TABLE_START -->\n${table}\n<!-- COURSE_TABLE_END -->`,
    )
    .replace(
      /<!-- LAST_UPDATED -->/,
      `<sub>Last refreshed ${stamp} · auto-generated from GitHub topics</sub>`,
    );

  fs.writeFileSync(path.join(ROOT, 'README.md'), output);
  console.error('Wrote README.md');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
