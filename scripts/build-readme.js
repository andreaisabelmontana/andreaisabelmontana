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

// Short purpose tagline per repo, keyed by repo name. Appended after each link.
const DESC = {
  // Year 4
  'apex-athlete': 'Unified multisport training-data platform',
  'Blockchain-Cryptocurrencies-Fintech': 'Cornell notes + ChainForge mini-blockchain capstone',
  'UX-UI-Human-Computer-Interaction': 'Cornell notes + UX Audit Kit capstone',
  'Final-Project': 'Cornell notes + Capstone Cockpit toolkit',
  'uxui-hci-interactive': 'Interactive UX/UI design tutorials',
  'polar-club': 'Membership club concept site',
  'Robotics-Automation': 'Interactive robotics course demos',
  'botzo': 'Budget DIY quadruped robot build',
  'niryo-one-digital-twin': 'Real-time robot-arm digital twin',
  'niryo-one-datasets': 'Robot-arm telemetry ML datasets',
  'turtlebot2-service': 'Robot navigation as network services',
  'digital-twin-scalability': 'ML autoscaling for SLA breaches',
  'cs-ethics': 'Interactive CS ethics & policy atlas',
  'openpolicystack': 'Microservices for evidence-based policy',
  'garlic': 'Encode web text against scrapers',
  'blockchain-playground': 'In-browser blockchain concept demos',
  'rodeo': 'Blockchain multi-robot coordination framework',
  'harthat-web3-tutorial': 'Local Solidity smart-contract tutorial',
  // Year 3 S2
  'fraud-detector': 'Tune fraud classification thresholds',
  'sound-classifier': 'Classify animal sounds from audio',
  'stat-learning': 'Interactive ML algorithm demos',
  'beyondstats': 'Gender-inequality scoring explorer',
  'reinforce-interactive': 'Interactive reinforcement-learning demos',
  'mountain-car-control': 'RL agent solving Mountain Car',
  'mesh-parking-rl': 'Grid-based RL autonomous parking',
  'swipe-rl': 'Preference-based RL from swipes',
  'rl-control-lab': 'Benchmark RL algorithms head-to-head',
  'nlp-alignment-drift': 'Visualize multi-turn LLM safety drift',
  'nlp-lab': 'Interactive NLP concept demos',
  'truthlens': 'AI fact-checking workspace',
  'stash': 'YouTube transcript saver & summarizer',
  'cs-vision': 'Interactive computer-vision demos',
  'vision-proctor': 'Browser exam proctoring via face detection',
  'fatigued-driver-detector': 'Detect driver drowsiness with CV',
  'ie-tower-vpr': 'Visual place recognition by image retrieval',
  'crittercut': 'Crop & trim animal-behavior videos',
  'SPICE': 'Projected interactive cooking guide',
  'holovinyl-rebuild': 'Turn objects into playable records',
  'chatbots-recsys-lab': 'Interactive recommender-systems demos',
  'skincares-advisor': 'Decode & categorize skincare ingredients',
  'mistral-kit': 'Chat UI components for Mistral',
  'radical-bot': 'Minimal from-scratch chatbot tutorial',
  'bookdb-discovery': 'AI-chat book recommendations',
  'moviewatchlist': 'Track watched & unwatched movies',
  'memora-rebuild': 'Capture & reflect on memories',
  // Year 3 S1
  'hpc-miniweather': 'In-browser HPC stencil simulation',
  'gpu-montecarlo-risk-rebuild': 'GPU Monte Carlo risk engine',
  'uncorrelated-returns': 'Diversification portfolio optimizer',
  'time-series-momentum-rebuild': 'Cross-asset momentum backtester',
  'aimes-emanager': 'Pilot-job workflow manager for HPC',
  'hpc-course': 'Hands-on HPC course with clusters',
  'hpc_foundations_book': 'Intro book on HPC fundamentals',
  'hpc_applications_book': 'Book on supercomputing applications',
  'robotics-lab-interactive': 'Browser sandbox for robotics concepts',
  'ai-reasoning-games': 'Playable AI strategy demos',
  'symphony': 'C++20 graph-search algorithms framework',
  'victoria-rebuild': 'Play Connect 4 vs AI',
  'neural-noir-rebuild': 'Procedural detective deduction game',
  'sddo-notes': 'Software dev & DevOps study notes',
  'Software-Development-And-Devops': 'Demo e-commerce shop app',
  'topliving-inmobiliaria': 'Colombian real-estate listings platform',
  'qrate': 'In-browser QR code generator',
  'rerun': 'Workflow automation ops dashboard',
  'bug-tracker': 'Auto-tagging issue tracker',
  'daybook': 'Local daily journaling app',
  'dotfiles': 'Version-controlled machine setup',
  'sublime-config': 'Synced editor config',
  'dev-vm-setup': 'Automated dev VM provisioning',
  'java-study': 'Interactive Java learning site',
  'library-system': 'Multi-role library management app',
  'futclub-manager': 'Football club management app',
  // Year 2
  'stats-lab': 'Interactive statistics visualizer',
  'linalg-lab': 'Interactive linear-algebra visualizer',
  'entrep-lab': 'Venture-building & validation tools',
  'foodloop-rebuild': 'Surplus-food discount marketplace',
  'sql-lab': 'Browser SQL learning playground',
  'fantasy-forum': 'Fantasy football discussion forum',
  'matchup': 'Football tournament standings tracker',
  'tablepro-rebuild': 'Spreadsheet-style data table tool',
  'affect-lab': 'Emotion-modeling neural-net demos',
  'ml-lab': 'Interactive ML concept visualizer',
  'efficient-classifier-rebuild': 'YAML-configured classification pipeline',
  'heuristic-compiler-rebuild': 'Compiles JSON rules into a classifier',
  'tech-lab': 'Low-code & generative-AI demos',
  'cp1-lab': 'Interactive C programming visualizer',
  'arch-lab': 'Architecture & networking sims',
  'hostpad-802.11r': 'Fast-roaming Wi-Fi configuration',
  'terminalchat-rebuild': 'Terminal LAN chat client',
  'cloud-lab': 'Interactive cloud-computing simulator',
  'petcare': 'Pet management DevOps app',
  'calc-lab': 'Interactive calculus visualizer',
  'calculus-toolkit-site': 'Browser calculus plotting toolkit',
  'algos-lab': 'Animated algorithm visualizer',
  // Year 1
  'modeling-lab': 'Modeling & simulation playground',
  'programming-principles-lab': 'Code-execution concept visualizer',
  'physics-cs-lab': 'Interactive physics simulation lab',
  'pyfreebody': 'Python free-body diagram generator',
  'radioform-web': 'Browser parametric EQ tool',
  'humanities-lab': 'Technology-and-society study companion',
  'data-analysis-lab': 'Statistical inference visualizer',
  'vigiview': 'Adverse drug event explorer',
  'shopsmart': 'Grocery price-comparison app',
  'big-history-lab': 'Cosmic-to-human history visualizer',
  'research-methods-lab': 'Research methods visualizer',
  'business-lab': 'Business & market concept visualizer',
  'prob-stats-lab': 'Probability & statistics visualizer',
  'discrete-math-lab': 'Discrete-math concept visualizer',
  // Kinetic Lab — curiosity-driven study rebuilds (ideas I didn't originate,
  // rebuilt from scratch to understand how they work). See the Kinetic Lab section.
  'solar-system-simulation': 'N-body what-if solar system · study rebuild',
  'black-hole-simulation': '3D black-hole accretion sim · study rebuild',
  'tilt-maze-game': 'Tilt-a-cube 3D ball-maze puzzle · study rebuild',
  'fluid-simulation': '2D SPH fluid you can stir · study rebuild',
  'ant-colony-simulation': 'Emergent ant-colony foraging · study rebuild',
  'boids-flocking': 'Boids flocking simulation · study rebuild',
  'strange-attractors': '3D chaotic-attractor explorer · study rebuild',
  'fractal-explorer': 'GPU Mandelbrot & Julia explorer · study rebuild',
  'bank-marketing-ml': 'Term-deposit subscription classifier · study rebuild',
  'rental-finder': 'Plain-language rental search · study rebuild',
  'pong': 'Modern Pong with spin physics · study rebuild',
  'snake': 'Refined Snake · study rebuild',
  'echolocation-maze': 'Echolocation maze game · study rebuild',
  'chess-dodge-game': 'Dodge escalating chess-piece hazards · study rebuild',
  'chess-dodge-server': 'WebSocket leaderboard & matchmaking · study rebuild',
};

const desc = (slug) => (DESC[slug] ? ` — ${DESC[slug]}` : '');

const PAGES = (slug) => `🌐 [${slug}](https://${USER}.github.io/${slug}/)${desc(slug)}`;
const SRC = (slug) => `📂 [${slug}](https://github.com/${USER}/${slug})${desc(slug)}`;

// Independent projects & study rebuilds, curated into the course they fit.
// Merged with topic-tagged course repos in the same row.
const EXTRA = {
  data:    [PAGES('vigiview'), PAGES('shopsmart')],
  physics: [PAGES('pyfreebody'), PAGES('radioform-web'), PAGES('solar-system-simulation'), PAGES('black-hole-simulation'), PAGES('tilt-maze-game')],
  modeling: [PAGES('fluid-simulation'), PAGES('ant-colony-simulation'), PAGES('boids-flocking'), PAGES('strange-attractors')],
  calc:    [PAGES('fractal-explorer')],
  arch:    [PAGES('hostpad-802.11r'), SRC('terminalchat-rebuild')],
  cloud:   [PAGES('petcare')],
  mlf:     [PAGES('efficient-classifier-rebuild'), PAGES('heuristic-compiler-rebuild'), PAGES('bank-marketing-ml')],
  db:      [PAGES('fantasy-forum'), PAGES('matchup'), SRC('tablepro-rebuild')],
  entrep:  [PAGES('foodloop-rebuild')],
  cp2:     [PAGES('futclub-manager'), PAGES('pong'), PAGES('snake'), PAGES('echolocation-maze'), PAGES('chess-dodge-game')],
  iec:     ['🎤 [pitch deck](https://canva.link/hah28m2jrnhfj42) — IE Challenge startup pitch'],
  sddo:    [PAGES('qrate'), PAGES('rerun'), PAGES('bug-tracker'), PAGES('daybook'), PAGES('dotfiles'), PAGES('sublime-config'), PAGES('dev-vm-setup'), SRC('chess-dodge-server')],
  reason:  [PAGES('symphony'), PAGES('victoria-rebuild'), PAGES('neural-noir-rebuild')],
  hpc:     [PAGES('gpu-montecarlo-risk-rebuild'), PAGES('uncorrelated-returns'), PAGES('time-series-momentum-rebuild'), PAGES('aimes-emanager'), PAGES('hpc-course'), PAGES('hpc_foundations_book'), PAGES('hpc_applications_book')],
  chat:    [PAGES('mistral-kit'), PAGES('radical-bot'), PAGES('bookdb-discovery'), PAGES('moviewatchlist'), PAGES('memora-rebuild')],
  vision:  [PAGES('fatigued-driver-detector'), PAGES('ie-tower-vpr'), PAGES('crittercut'), PAGES('SPICE'), PAGES('holovinyl-rebuild')],
  nlp:     [PAGES('truthlens'), PAGES('stash'), PAGES('rental-finder')],
  rl:      [PAGES('mountain-car-control'), PAGES('mesh-parking-rl'), PAGES('swipe-rl'), PAGES('rl-control-lab')],
  stat:    [PAGES('beyondstats')],
  blockchain: [SRC('Blockchain-Cryptocurrencies-Fintech'), PAGES('rodeo'), PAGES('harthat-web3-tutorial')],
  ethics:  [PAGES('openpolicystack'), PAGES('garlic')],
  robo:    [PAGES('botzo'), PAGES('niryo-one-digital-twin'), PAGES('niryo-one-datasets'), PAGES('turtlebot2-service'), PAGES('digital-twin-scalability')],
  uxui:    [SRC('UX-UI-Human-Computer-Interaction'), PAGES('polar-club')],
  capstone: [SRC('Final-Project')],
};

// One canonical hub link per course for the minimal top-level list. Every other
// link for that course still lives in the folded "Full project index" below, so
// nothing is hidden — the index just keeps the surface area off the main view.
// As each companion site grows into a real hub, its index entries fall away.
const PRIMARY = {
  // Year 1
  discrete: 'discrete-math-lab', fps: 'prob-stats-lab', business: 'business-lab',
  research: 'research-methods-lab', history: 'big-history-lab',
  data: 'data-analysis-lab', humanities: 'humanities-lab', physics: 'physics-cs-lab',
  pop: 'programming-principles-lab', modeling: 'modeling-lab',
  // Year 2
  algos: 'algos-lab', calc: 'calc-lab', cloud: 'cloud-lab', arch: 'arch-lab',
  cp1: 'cp1-lab', tech: 'tech-lab', mlf: 'ml-lab', affect: 'affect-lab',
  db: 'sql-lab', entrep: 'entrep-lab', linalg: 'linalg-lab', prob: 'stats-lab',
  // Year 3
  cp2: 'java-study', iec: null /* pitch deck only */, sddo: 'sddo-notes',
  reason: 'reasoning-project', robolab: 'robotics-lab-interactive', hpc: 'hpc-final-project',
  chat: 'chatbots-recsys-lab', vision: 'cs-vision', nlp: 'nlp-lab',
  rl: 'reinforce-interactive', stat: 'stat-learning',
  // Year 4
  blockchain: 'blockchain-playground', ethics: 'cs-ethics', robo: 'Robotics-Automation',
  uxui: 'uxui-hci-interactive', capstone: 'apex-athlete',
};

// The single hub link shown for a course in the minimal list. Falls back to the
// best topic-tagged repo (live sites first) if the chosen primary isn't found.
function primaryCell(slug, byName, byTopic) {
  if (slug === 'iec') return '🎤 [Pitch deck](https://canva.link/hah28m2jrnhfj42)';
  let repo = null;
  const want = PRIMARY[slug];
  if (want) {
    if (byName.has(want)) repo = byName.get(want);
    else console.error(`PRIMARY ${slug} -> ${want} not found in API repos`);
  }
  if (!repo) {
    const matched = (byTopic.get(slug) || [])
      .slice()
      .sort((a, b) => Number(b.has_pages) - Number(a.has_pages) || a.name.localeCompare(b.name));
    repo = matched[0] || null;
    if (repo && want) console.error(`PRIMARY ${slug}: fell back to ${repo.name}`);
  }
  if (!repo) return '_— coming soon —_';
  const emoji = repo.has_pages ? '🌐' : '📂';
  return `${emoji} [${repo.name}](${pickUrl(repo)})`;
}

// Minimal, scannable view: semester sections (newest first), one hub link per
// course. The detailed link set lives in the folded index produced by buildTable.
function buildMinimalList(repos) {
  const byName = new Map(repos.map((r) => [r.name, r]));
  const byTopic = new Map();
  for (const repo of repos) {
    for (const t of repo.topics || []) {
      if (!t.startsWith(TOPIC_PREFIX)) continue;
      const slug = t.slice(TOPIC_PREFIX.length);
      if (!byTopic.has(slug)) byTopic.set(slug, []);
      byTopic.get(slug).push(repo);
    }
  }
  const out = [];
  for (const [header, courses] of [...CATEGORIES].reverse()) {
    out.push(`#### ${header}`, '');
    for (const [slug, name] of courses) {
      out.push(`- **${name}** — ${primaryCell(slug, byName, byTopic)}`);
    }
    out.push('');
  }
  return out.join('\n').trim();
}

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
  return `${pickEmoji(repo)} [${repo.name}](${pickUrl(repo)})${desc(repo.name)}`;
}

function buildTable(repos, archived = new Set()) {
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
  let covered = 0; // course rows with at least one project, for the stats badge
  for (const [header, courses] of CATEGORIES) {
    const year = (header.match(/Year (\d)/) || [])[1] || '?';
    for (const [slug, name] of courses) {
      perYear[year] = (perYear[year] || 0) + 1;
      const matchedRepos = (byTopic.get(slug) || [])
        .sort((a, b) => Number(b.has_pages) - Number(a.has_pages) || a.name.localeCompare(b.name));
      const matchedNames = new Set(matchedRepos.map((r) => r.name));
      const matched = matchedRepos.map(renderRepoLink);
      // Drop any curated EXTRA link whose repo is already matched via topic
      // (lets us hand-seed repos the public API temporarily omits, without
      // duplicating them once the API starts returning them again).
      const extra = (EXTRA[slug] || []).filter((s) => {
        const m = s.match(/\[([^\]]+)\]/);
        if (!m) return true; // non-repo links (e.g. a pitch deck) always stay
        return !matchedNames.has(m[1]) && !archived.has(m[1]); // drop already-matched or archived
      });
      const links = [...matched, ...extra];
      if (links.length) covered++;
      const cell = links.length ? links.join('<br>') : '_— coming soon —_';
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

  return { table: lines.join('\n'), covered };
}

// Live figures for the "By the numbers" badges, computed from the same repo
// list that builds the table so they never drift from reality. Counts public
// repos only, so a personal token that can see private repos still matches CI.
function accountStats(repos, covered) {
  const pub = repos.filter((r) => !r.private);
  const maxYear = Math.max(
    ...CATEGORIES.map(([h]) => Number((h.match(/Year (\d)/) || [])[1]) || 0),
  );
  return {
    repos: pub.length,
    live: pub.filter((r) => r.has_pages).length,
    forks: pub.filter((r) => r.fork).length,
    courses: covered,
    year: maxYear,
  };
}

function renderStats(s) {
  const badge = (label, value, color, logo, alt) =>
    `<img src="https://img.shields.io/badge/${label}-${value}-${color}?style=for-the-badge&logo=${logo}&logoColor=white" alt="${alt}" />`;
  return [
    badge('Repositories', s.repos, '8b5cf6', 'github', `${s.repos} repositories`),
    badge('Live_Sites', s.live, '22c55e', 'githubpages', `${s.live} live sites`),
    badge('Forks', s.forks, 'ec4899', 'git', `${s.forks} forks`),
    badge('Courses_Documented', s.courses, '3b82f6', 'googlescholar', `${s.courses} courses`),
    badge('BCSAI', `Year_${s.year}`, 'f59e0b', 'academia', `Year ${s.year}`),
  ].join('\n');
}

async function main() {
  const all = await fetchAllRepos();
  const repos = all.filter((r) => !r.archived); // archived repos are hidden from the profile
  const archived = new Set(all.filter((r) => r.archived).map((r) => r.name));
  console.error(`Fetched ${all.length} repos (${repos.length} active, ${archived.size} archived & hidden)`);
  const { table, covered } = buildTable(repos, archived);
  const minimal = buildMinimalList(repos);
  const stats = accountStats(repos, covered);
  console.error(
    `Stats: ${stats.repos} repos · ${stats.live} live · ${stats.forks} forks · ${stats.courses} courses · Year ${stats.year}`,
  );

  // Minimal list up top; every other link folded into a single details block so
  // the main view stays clean but no project is ever orphaned from the profile.
  const portfolio = [
    minimal,
    '',
    '<details>',
    `<summary>📂 <b>Full project index</b> — every build for every course (${stats.live} live sites)</summary>`,
    '',
    table,
    '</details>',
  ].join('\n');

  const template = fs.readFileSync(path.join(ROOT, 'README.template.md'), 'utf8');
  const stamp = new Date().toISOString().slice(0, 10);

  const output = template
    .replace(
      /<!-- COURSE_TABLE_START -->[\s\S]*?<!-- COURSE_TABLE_END -->/,
      `<!-- COURSE_TABLE_START -->\n${portfolio}\n<!-- COURSE_TABLE_END -->`,
    )
    .replace(
      /<!-- STATS_START -->[\s\S]*?<!-- STATS_END -->/,
      `<!-- STATS_START -->\n${renderStats(stats)}\n<!-- STATS_END -->`,
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
