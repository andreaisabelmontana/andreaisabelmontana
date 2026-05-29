#!/usr/bin/env node
/**
 * Regenerates README.md from README.template.md by pulling repos from the
 * GitHub API and grouping them under courses by topic.
 *
 * Convention: tag a course repo with a topic from the CATEGORIES table below
 * (e.g. `bcsai-calc`, `bcsai-nlp`). The script reads `has_pages` to decide
 * between 🌐 (live site) and 📂 (source-only).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const USER = 'andreaisabelmontana';
const TOKEN = process.env.GITHUB_TOKEN || '';
const ROOT = path.resolve(__dirname, '..');

// Ordered by Year > Semester (derived from BCSAI syllabus metadata).
// [section label, [course slug, display name, blurb]...]
const CATEGORIES = [
  ['📘 Year 1 — Semester 1', [
    ['discrete', 'Discrete Mathematics',                       'Logic, sets, graphs, combinatorics, proofs'],
    ['business', 'Introduction to Business Management',        'Management principles, organizations, strategy'],
    ['research', 'Learning to Observe, Experiment & Survey',   'Research methods, experimental design, surveys'],
    ['history',  'The Big History of Ideas and Innovation',    'History of science, innovation, intellectual thought'],
  ]],
  ['📘 Year 1 — Semester 2', [
    ['data',     'Fundamentals of Data Analysis',              'Data wrangling, EDA, visualization'],
    ['physics',  'Physics for Computer Science',               'Mechanics, waves, computational physics'],
    ['pop',      'Principles of Programming',                  'Paradigms, language design, design patterns'],
    ['modeling', 'Simulating and Modeling to Understand Change', 'Simulation, dynamic systems, agent-based modeling'],
  ]],
  ['📗 Year 2 — Semester 1', [
    ['algos',    'Algorithms & Data Structures',               'Sorting, searching, complexity, ADTs'],
    ['calc',     'Calculus for Computer Science',              'Calculus, optimization, algorithm analysis'],
    ['cloud',    'Cloud Computing',                            'Cloud architectures, IaaS/PaaS/SaaS, deployment'],
    ['arch',     'Computer Architecture, Networks & OS',       'CPU, memory, networking, OS internals'],
    ['cp1',      'Computer Programming I',                     'Programming fundamentals, control flow, functions'],
    ['tech',     'Low Code, No Code & Generative AI',          'No-code tools, automation, GenAI integration'],
  ]],
  ['📗 Year 2 — Semester 2', [
    ['mlf',      'AI: Machine Learning Foundations',           'Supervised/unsupervised learning, model evaluation'],
    ['affect',   'AI: Personality & Emotion for AI Design',    'Affective computing, persona design, emotional AI'],
    ['cp2',      'Computer Programming II',                    'Java, OOP, data structures, multithreading'],
    ['db',       'Designing and Using Databases',              'SQL, relational design, normalization, NoSQL'],
    ['entrep',   'IE Impact Entrepreneurship',                 'Entrepreneurship, social impact, venture building'],
    ['linalg',   'Matrices & Linear Transformations',          'Linear algebra, vector spaces, eigenvalues'],
    ['prob',     'Probability for Computing Science',          'Probability, distributions, stochastic processes'],
  ]],
  ['📙 Year 3 — Semester 1', [
    ['sddo',     'Software Development & DevOps',              'Agile, CI/CD, cloud systems, DevOps, design patterns'],
    ['reason',   'AI: Reasoning & Problem Solving',            'Search algorithms, intelligent agents, game AI'],
    ['robolab',  'Introduction to Robotics Lab',               'Raspberry Pi, Pepper robot, autonomous systems'],
    ['hpc',      'High Performance Computing',                 'Parallel computing, GPU, distributed systems'],
  ]],
  ['📙 Year 3 — Semester 2', [
    ['chat',     'AI: Chatbots & Recommendation Engines',      'Chatbots, recommender systems, conversational AI'],
    ['vision',   'AI: Computer Vision',                        'Image processing, deep learning, OpenCV'],
    ['nlp',      'AI: NLP & Semantic Analysis',                'NLP, transformers, sentiment analysis, LLMs'],
    ['rl',       'AI: Reinforcement Learning',                 'Q-learning, Deep RL, policy optimization'],
    ['stat',     'AI: Statistical Learning & Prediction',      'Regression, classification, statistical inference'],
  ]],
  ['📕 Year 4 — Semester 2', [
    ['blockchain', 'Blockchain, Cryptocurrencies & FinTech',   'Blockchain, smart contracts, fintech systems'],
    ['ethics',   'Ethics, Policy & Legislation in CS',         'AI ethics, privacy, regulation'],
    ['robo',     'Robotics & Automation',                      'ROS, robotic simulation, sensing & planning'],
    ['uxui',     'UX/UI & Human-Computer Interaction',         'User-centered design, usability, accessibility'],
    ['capstone', 'Capstone Project',                           'Final interdisciplinary AI/CS project'],
  ]],
];

const TOPIC_PREFIX = 'bcsai-';

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

  const lines = [];
  for (const [categoryHeader, courses] of CATEGORIES) {
    lines.push(`### ${categoryHeader}`);
    lines.push('| Course | Topics | Repos |');
    lines.push('|---|---|---|');
    for (const [slug, name, blurb] of courses) {
      const matched = (byTopic.get(slug) || [])
        .sort((a, b) => Number(b.has_pages) - Number(a.has_pages) || a.name.localeCompare(b.name));
      const cell = matched.length
        ? matched.map(renderRepoLink).join(' · ')
        : '_— coming soon —_';
      lines.push(`| ${name} | ${blurb} | ${cell} |`);
    }
    lines.push('');
  }

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
