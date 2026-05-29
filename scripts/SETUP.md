# Dynamic README — setup notes

## How it works

`README.md` is **auto-generated**. Do not edit it by hand — your changes will be overwritten.

Edit one of these instead:

| File | What it controls |
|---|---|
| `README.template.md` | Everything outside the course table (intro, experience, skills, growth mindset). The `<!-- COURSE_TABLE_START --> ... <!-- COURSE_TABLE_END -->` block is the slot that gets filled. |
| `scripts/build-readme.js` → `CATEGORIES` | The list of courses, their topic slugs, display names, and blurbs. |
| `.github/workflows/update-readme.yml` | The cron schedule and trigger rules. |

## How to make a repo show up in the table

Add a GitHub **topic** to it of the form `bcsai-<slug>`. The slug must match one in the `CATEGORIES` table in `build-readme.js`.

Example:
```bash
# Add bcsai-nlp to your nlp-lab repo
gh api -X PUT repos/andreaisabelmontana/nlp-lab/topics \
  -f names[]=bcsai-nlp -f names[]=nlp -f names[]=transformers
```

Or from the GitHub UI: open the repo → click the ⚙️ next to "About" → add the topic.

The workflow runs:
- **Daily** at 06:17 UTC
- **On push** to `README.template.md`, the script, or the workflow
- **Manually** from the Actions tab → "Update README" → "Run workflow"

## Topic slug reference (BCSAI study plan order)

### Year 1 — Semester 1
| Slug | Course |
|---|---|
| `bcsai-discrete` | Discrete Mathematics |
| `bcsai-fps` | Fundamentals of Probability & Statistics |
| `bcsai-business` | Introduction to Business Management |
| `bcsai-research` | Learning to Observe, Experiment & Survey |
| `bcsai-history` | The Big History of Ideas and Innovation |

### Year 1 — Semester 2
| Slug | Course |
|---|---|
| `bcsai-data` | Fundamentals of Data Analysis |
| `bcsai-humanities` | Humanities |
| `bcsai-physics` | Physics for Computer Science |
| `bcsai-pop` | Principles of Programming |
| `bcsai-modeling` | Simulating and Modeling to Understand Change |

### Year 2 — Semester 1
| Slug | Course |
|---|---|
| `bcsai-algos` | Algorithms & Data Structures |
| `bcsai-calc` | Calculus for Computer Science |
| `bcsai-cloud` | Cloud Computing |
| `bcsai-arch` | Computer Architecture, Networks & OS |
| `bcsai-cp1` | Computer Programming I |
| `bcsai-tech` | Technology with Impact |

### Year 2 — Semester 2
| Slug | Course |
|---|---|
| `bcsai-mlf` | AI: Machine Learning Foundations |
| `bcsai-affect` | AI: Personality & Emotion for AI Design |
| `bcsai-db` | Designing and Using Databases |
| `bcsai-entrep` | IE Impact Entrepreneurship |
| `bcsai-linalg` | Matrices & Linear Transformations |
| `bcsai-prob` | Probability for Computing Science |

### Year 3 — Semester 1
| Slug | Course |
|---|---|
| `bcsai-cp2` | Computer Programming II |
| `bcsai-iec` | IE Challenge |
| `bcsai-sddo` | Software Development & DevOps |
| `bcsai-reason` | AI: Reasoning & Problem Solving |
| `bcsai-robolab` | Introduction to Robotics Lab |
| `bcsai-hpc` | High Performance Computing |

### Year 3 — Semester 2
| Slug | Course |
|---|---|
| `bcsai-chat` | AI: Chatbots & Recommendation Engines |
| `bcsai-vision` | AI: Computer Vision |
| `bcsai-nlp` | AI: NLP & Semantic Analysis |
| `bcsai-rl` | AI: Reinforcement Learning |
| `bcsai-stat` | AI: Statistical Learning & Prediction |

### Year 4 — Semester 2
| Slug | Course |
|---|---|
| `bcsai-blockchain` | Blockchain, Cryptocurrencies & FinTech |
| `bcsai-ethics` | Ethics, Policy & Legislation in CS |
| `bcsai-robo` | Robotics & Automation |
| `bcsai-uxui` | UX/UI & Human-Computer Interaction |
| `bcsai-capstone` | Capstone Project |

## Icons in the table

| Icon | Meaning |
|---|---|
| 🌐 | Repo has GitHub Pages enabled — link goes to the live site |
| 📂 | Source-only repo — link goes to GitHub |
| 🍴 | Fork |

If a repo is tagged with a slug not in `CATEGORIES`, it lands in an "⚠️ Unmapped course topics" section at the bottom of the table so you can fix it.

## Running it locally

```bash
node scripts/build-readme.js
```

No dependencies — pure Node + the GitHub REST API. Set `GITHUB_TOKEN` if you hit rate limits.
