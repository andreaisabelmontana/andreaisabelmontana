#!/usr/bin/env node
/**
 * One-off helper: add `bcsai-<slug>` topics to existing course repos.
 *
 * Reads the current topics for each repo, adds the mapped slug if missing,
 * and PUTs the merged list back. Idempotent — safe to re-run.
 *
 * Uses `gh auth token` for authentication so it inherits your local gh login.
 *
 * Usage:
 *   node scripts/tag-repos.js          # apply changes
 *   node scripts/tag-repos.js --dry    # show what would change without writing
 */

const https = require('https');
const { execSync } = require('child_process');

const USER = 'andreaisabelmontana';
const DRY = process.argv.includes('--dry');

const MAPPING = {
  // Calculus
  'Calculus-For-Computer-Science': 'calc',
  'calculus-toolkit-site': 'calc',
  'calc-lab': 'calc',
  // Probability
  'stats-lab': 'prob',
  // CP2
  'Computer-Programming-II': 'cp2',
  'java-study': 'cp2',
  'library-system': 'cp2',
  // Principles of Programming (design patterns)
  'behavioral_design_pattern_exercise_observer': 'pop',
  'structural_design_pattern_exercise_proxy': 'pop',
  // Algorithms & Data Structures
  'algos-lab': 'algos',
  // Databases
  'sql-lab': 'db',
  // Software Dev & DevOps
  'Software-Development-And-Devops': 'sddo',
  'sddo-notes': 'sddo',
  'topliving-inmobiliaria': 'sddo',
  // Modeling
  'hpc-miniweather': 'modeling',
  // Statistical Learning
  'Statistical-Learning-Prediction': 'stat',
  'stat-learning': 'stat',
  'sound-classifier': 'stat',
  'fraud-detector': 'stat',
  // Reasoning
  'Representation-Reasoning-Problem-Solving': 'reason',
  'ai-reasoning-games': 'reason',
  // NLP
  'Natural-Language-Processing-Semantic-Analysis': 'nlp',
  'nlp-lab': 'nlp',
  'nlp-alignment-drift': 'nlp',
  // Computer Vision
  'Computer-Vision': 'vision',
  'cs-vision': 'vision',
  'vision-proctor': 'vision',
  // Reinforcement Learning
  'Reinforcement-Learning': 'rl',
  'reinforce-interactive': 'rl',
  // Chatbots & Recsys
  'Chatbots-Recommendation-Engines': 'chat',
  'chatbots-recsys-lab': 'chat',
  'skincares-advisor': 'chat',
  'LaGuacamaya': 'chat',
  // Intro to Robotics Lab
  'Intro-to-Robotics-LAB': 'robolab',
  'robotics-lab-interactive': 'robolab',
  // Robotics & Automation
  'Robotics-Automation': 'robo',
  // Blockchain
  'Blockchain-Cryptocurrencies-Fintech': 'blockchain',
  'blockchain-playground': 'blockchain',
  // UX/UI
  'UX-UI-Human-Computer-Interaction': 'uxui',
  'uxui-hci-interactive': 'uxui',
  // Ethics
  'cs-ethics': 'ethics',
  // Capstone
  'Final-Project': 'capstone',
  'apex-athlete': 'capstone',
};

const TOKEN = execSync('gh auth token', { encoding: 'utf8' }).trim();

function api(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'User-Agent': `${USER}-readme-bot`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Authorization': `Bearer ${TOKEN}`,
        ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }, (res) => {
      let buf = '';
      res.on('data', (c) => (buf += c));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(buf || '{}'));
        else reject(new Error(`${res.statusCode} ${res.statusMessage} on ${method} ${path}: ${buf.slice(0, 200)}`));
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  let changed = 0, skipped = 0, failed = 0;
  for (const [repo, slug] of Object.entries(MAPPING)) {
    const desiredTopic = `bcsai-${slug}`;
    try {
      const { names: current } = await api('GET', `/repos/${USER}/${repo}/topics`);
      if (current.includes(desiredTopic)) {
        console.log(`✓ ${repo} already has ${desiredTopic}`);
        skipped++;
        continue;
      }
      const next = [...current, desiredTopic];
      if (DRY) {
        console.log(`→ ${repo}: would add ${desiredTopic} (current: ${current.join(', ') || '(none)'})`);
      } else {
        await api('PUT', `/repos/${USER}/${repo}/topics`, { names: next });
        console.log(`+ ${repo}: added ${desiredTopic}`);
      }
      changed++;
    } catch (err) {
      console.error(`✗ ${repo}: ${err.message}`);
      failed++;
    }
  }
  console.log(`\nSummary: ${changed} ${DRY ? 'would change' : 'changed'}, ${skipped} already tagged, ${failed} failed`);
}

main().catch((err) => { console.error(err); process.exit(1); });
