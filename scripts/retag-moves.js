#!/usr/bin/env node
/**
 * One-off: swap topic slugs on specific repos (move repo from one course to another).
 * Idempotent — re-running after a successful move is a no-op.
 */
const https = require('https');
const { execSync } = require('child_process');

const USER = 'andreaisabelmontana';
const TOKEN = execSync('gh auth token', { encoding: 'utf8' }).trim();

// [repo, oldSlug, newSlug]
const MOVES = [
  ['behavioral_design_pattern_exercise_observer', 'pop', 'sddo'],
  ['structural_design_pattern_exercise_proxy', 'pop', 'sddo'],
  ['algos-lab', 'algos', 'reason'],
  ['hpc-miniweather', 'modeling', 'hpc'],
];

function api(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'User-Agent': `${USER}-readme-bot`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${TOKEN}`,
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
  for (const [repo, oldSlug, newSlug] of MOVES) {
    const oldTopic = `bcsai-${oldSlug}`;
    const newTopic = `bcsai-${newSlug}`;
    const { names: current } = await api('GET', `/repos/${USER}/${repo}/topics`);
    let next = current.filter((t) => t !== oldTopic);
    if (!next.includes(newTopic)) next.push(newTopic);
    if (current.join(',') === next.join(',')) {
      console.log(`✓ ${repo}: already ${newTopic}`);
      continue;
    }
    await api('PUT', `/repos/${USER}/${repo}/topics`, { names: next });
    console.log(`↻ ${repo}: ${oldTopic} → ${newTopic}`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
