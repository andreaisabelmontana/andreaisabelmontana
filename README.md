https://github.com/user-attachments/assets/2e790415-f167-48b1-9b38-4019f42498f2

<div align="center">

# Andrea Isabel Montana

### Computer Science &amp; Artificial Intelligence · Student-Athlete @ IE University

**CS + AI student-athlete at IE University (BCSAI).**
**I build interactive demos from scratch in plain JavaScript — 205 repos, ~200 live, 0 forks.**

<a href="mailto:amontana.ieu2023@student.ie.edu"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
<a href="https://cyphy.life/"><img src="https://img.shields.io/badge/Research_at_CyPhy_Life-8b5cf6?style=for-the-badge&logo=googlescholar&logoColor=white" alt="CyPhy Life" /></a>
<a href="https://github.com/andreaisabelmontana"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>

</div>

---

<div align="center">

### 📊 By the numbers

<!-- STATS_START -->
<img src="https://img.shields.io/badge/Repositories-212-8b5cf6?style=for-the-badge&logo=github&logoColor=white" alt="212 repositories" />
<img src="https://img.shields.io/badge/Live_Sites-201-22c55e?style=for-the-badge&logo=githubpages&logoColor=white" alt="201 live sites" />
<img src="https://img.shields.io/badge/Forks-0-ec4899?style=for-the-badge&logo=git&logoColor=white" alt="0 forks" />
<img src="https://img.shields.io/badge/Courses_Documented-38-3b82f6?style=for-the-badge&logo=googlescholar&logoColor=white" alt="38 courses" />
<img src="https://img.shields.io/badge/BCSAI-Year_4-f59e0b?style=for-the-badge&logo=academia&logoColor=white" alt="Year 4" />
<!-- STATS_END -->

<sub>Every repository is original work — <b>0 forks</b> across the whole account. Each course I take gets its own interactive companion site.</sub>

</div>

## 🧑‍💻 About

Most of what I build is single-page interactive demos in plain JavaScript — no engines, no frameworks. The topics track my degree: computer vision, physics simulation, reinforcement learning, linear algebra, blockchain, robotics. Every course has a companion site, and all 38 are in the table below. My research is on healthcare systems that combine AI projection mapping with robotics, which I work on at [CyPhy Life](https://cyphy.life/). Lately I've also been shipping production-grade tools in systems and typed languages — **Rust, Go, C++, and TypeScript** — the four flagships below.

## ✨ Featured Projects

> Seven production-grade tools, each from scratch in a different systems/typed language — tested and CI'd.

<table>
<tr>
<td width="50%" valign="top">

### 🦀 [repoforge](https://andreaisabelmontana.github.io/repoforge/)
**Async Rust CLI that audits any GitHub account against an 11-check quality rubric — and auto-fixes the gaps.**<br>
<sub>Scores every repo 0–100 and generates the missing README / license / CI / .gitignore / topics, applied by direct commit or pull request. Run across this account it lifted the average **51.8 → 69.6**. tokio + reqwest, 12 tests, live HTML dashboard, weekly self-audit.</sub>

</td>
<td width="50%" valign="top">

### 🔗 [linkrot](https://github.com/andreaisabelmontana/linkrot)
**Fast concurrent broken-link & asset checker, in Go.**<br>
<sub>Bounded-concurrency BFS crawl of same-host pages, then every link verified in parallel (HEAD→GET), reported broken-first with the page that references it. <code>--fail-on-error</code> CI gate. Standard library + x/net only.</sub>

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🧠 [nanograd](https://github.com/andreaisabelmontana/nanograd)
**A reverse-mode autograd engine + neural net, from scratch in header-only C++17.**<br>
<sub>The machinery behind <code>loss.backward()</code> in ~200 lines, zero deps: a dynamic computation graph, topological backprop, and an MLP that learns XOR (loss 5.0 → 0.004). Gradients verified against finite differences.</sub>

</td>
<td width="50%" valign="top">

### 🧩 [parsekit](https://github.com/andreaisabelmontana/parsekit)
**A strongly-typed parser-combinator library for TypeScript.**<br>
<sub><code>seq</code> returns a typed tuple; <code>alt</code> / <code>many</code> / <code>sepBy</code> / <code>lazy</code> handle recursive grammars — with a full JSON parser (agrees with <code>JSON.parse</code>) and an arithmetic evaluator built on top. Strict TS, zero deps, 22 tests.</sub>

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🔤 [thompson](https://github.com/andreaisabelmontana/thompson)
**A regex engine in C, on Thompson NFA construction — linear-time, no backtracking.**<br>
<sub>Tokeniser → shunting-yard → NFA → multi-state simulation. Matches pathological patterns like <code>(a*)*</code> in microseconds where backtracking engines hang. ~350 lines, zero deps, tested under ASan + UBSan.</sub>

</td>
<td width="50%" valign="top">

### 🔢 [recalc](https://github.com/andreaisabelmontana/recalc)
**A spreadsheet formula engine in Java.**<br>
<sub>Recursive-descent parser → a Java 17 sealed-type + record AST → on-read evaluation that recalculates dependents and detects reference cycles (<code>#CYCLE!</code>). Maven + JUnit 5, 19 tests.</sub>

</td>
</tr>
<tr>
<td colspan="2" valign="top">

### 🗃️ [tinysql](https://github.com/andreaisabelmontana/tinysql) — a SQL engine over CSV in Python
**Lexer → recursive-descent parser → executor, run real queries on a CSV.**<br>
<sub><code>SELECT</code> with <code>WHERE</code> (AND/OR/parens), <code>ORDER BY</code>, <code>LIMIT</code>, and COUNT/SUM/AVG/MIN/MAX aggregates over a frozen-dataclass AST. Typed (mypy --strict), 26 tests, standard library only.</sub>

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 👁️ [cs-vision](https://andreaisabelmontana.github.io/cs-vision/)
**17 computer-vision algorithms written from scratch — no libraries.**<br>
<sub>Pinhole camera (K[R|t]), DFT, Sobel edges with corner non-max suppression, a CNN forward pass (conv / ReLU / pooling), segmentation, detection, autoencoder, self-supervised learning. 1,589 lines of vanilla JS.</sub>

</td>
<td width="50%" valign="top">

### 📐 [linalg-lab](https://andreaisabelmontana.github.io/linalg-lab/)
**11 interactive 2D linear-algebra demos with exact matrix math.**<br>
<sub>Span tests via the cross product (|v×w| > 1e-6), determinants as signed area, eigenvectors, and the image of the integer lattice under any 2×2 matrix you drag. 917 lines.</sub>

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🕳️ [black-hole-simulation](https://andreaisabelmontana.github.io/black-hole-simulation/)
**12,000-particle Newtonian accretion disk in Three.js.**<br>
<sub>Inverse-square gravity (a = G·m / d³) integrated every frame, circular-orbit initial velocities (v = √(Gm/r)), optional binary black hole. No textures — the disk is the dynamics.</sub>

</td>
<td width="50%" valign="top">

### 🎥 [vision-proctor](https://andreaisabelmontana.github.io/vision-proctor/)
**Webcam exam proctor on MediaPipe BlazeFace, fully client-side.**<br>
<sub>Runs ~30 fps in the browser with no uploads. Flags three states: no face, multiple faces, and looking away (head off-axis for more than 0.4s).</sub>

</td>
</tr>
<tr>
<td width="50%" valign="top">

### ⛓️ [blockchain-playground](https://andreaisabelmontana.github.io/blockchain-playground/)
**17 blockchain primitives built up from a hash function.**<br>
<sub>Proof-of-work mining (increment the nonce until N leading zeros), Merkle trees, ECDSA and SHA-256 via Web Crypto, plus a toy EVM, UTXO and account models, ERC-20, and an AMM. 995 lines.</sub>

</td>
<td width="50%" valign="top">

### 🏊 [apex-athlete](https://andreaisabelmontana.github.io/apex-athlete/)
**Triathlon training-load model: NP, IF, TSS, CTL/ATL/TSB.**<br>
<sub>Normalized Power as the 4th root of mean power⁴, Intensity Factor = NP/FTP, TSS = hours · IF² · 100, fitness/fatigue/form tracking, and race-time forecasting.</sub>

</td>
</tr>
</table>

## 🛠️ Skills &amp; Tools

<p align="center">
  <img src="https://skillicons.dev/icons?i=python,js,ts,html,css,java,cpp,react,nextjs,nodejs,tailwind,threejs,tensorflow,git,github,vscode,firebase,vercel,docker,figma,arduino,unity,blender,raspberrypi&perline=12" />
</p>

<table align="center">
<tr><td><b>Languages</b></td><td>Python · JavaScript · TypeScript · Java · C · C++ · SQL · HTML/CSS</td></tr>
<tr><td><b>AI / ML</b></td><td>Computer vision · NLP · Reinforcement learning · Statistical learning · TensorFlow</td></tr>
<tr><td><b>Web &amp; Graphics</b></td><td>React · Next.js · Three.js / WebGL · Canvas · Node.js · Tailwind</td></tr>
<tr><td><b>Robotics &amp; Systems</b></td><td>Digital twins · Arduino · Raspberry Pi · HPC · Cloud · DevOps</td></tr>
</table>

## 🔬 Experience &amp; Research

[🔗 CyPhy Life](https://cyphy.life/)
&nbsp;&nbsp;&nbsp;&nbsp;AI, robotics, and HCI research at IE University

[🔗 Top Living Inmobiliaria](https://andreaisabelmontana.github.io/topliving-inmobiliaria/properties.html)
&nbsp;&nbsp;&nbsp;&nbsp;Search homes to buy or rent in Bogotá, Colombia

[🔗 Arte de la Montaña](https://andreaisabelmontana.github.io/Arte-De-La-Montana/index.html)
&nbsp;&nbsp;&nbsp;&nbsp;Original paintings and custom commissions

[🔗 Alma de María](https://andreaisabelmontana.github.io/Alma-De-Maria/)
&nbsp;&nbsp;&nbsp;&nbsp;Handcrafted rosaries and religious jewelry

## 🧪 Interactive Simulations &amp; Games — curiosity rebuilds

A collection of 15 interactive simulations, games, and small apps I rebuilt from scratch in the browser. **None of these began as my own idea.** Each one recreates an existing project or concept that caught my eye — and curiosity about *how it actually works* pushed me to rebuild it my own way, with no engine or framework, and to make it a little different and better as I went. They double as coursework, so you'll also find them under their related courses below.

[🔗 Open the collection](https://andreaisabelmontana.github.io/interactive-simulations-and-games/)
&nbsp;&nbsp;&nbsp;&nbsp;The hub linking all 15

## 📚 Course Portfolio

> One interactive companion site per course, across the full four-year BCSAI degree. Auto-generated from GitHub topics.

<!-- COURSE_TABLE_START -->
| # | Course | Coursework & Projects |
|---|---|---|
| 4.5 | Capstone Project | 🌐 [apex-athlete](https://andreaisabelmontana.github.io/apex-athlete/) — Unified multisport training-data platform<br>📂 [Final-Project](https://github.com/andreaisabelmontana/Final-Project) — Cornell notes + Capstone Cockpit toolkit |
| 4.4 | UX/UI & Human-Computer Interaction | 🌐 [uxui-hci-interactive](https://andreaisabelmontana.github.io/uxui-hci-interactive/) — Interactive UX/UI design tutorials<br>📂 [UX-UI-Human-Computer-Interaction](https://github.com/andreaisabelmontana/UX-UI-Human-Computer-Interaction) — Cornell notes + UX Audit Kit capstone<br>🌐 [polar-club](https://andreaisabelmontana.github.io/polar-club/) — Membership club concept site |
| 4.3 | Robotics & Automation | 🌐 [Robotics-Automation](https://andreaisabelmontana.github.io/Robotics-Automation/) — Interactive robotics course demos<br>🌐 [botzo](https://andreaisabelmontana.github.io/botzo/) — Budget DIY quadruped robot build<br>🌐 [niryo-one-digital-twin](https://andreaisabelmontana.github.io/niryo-one-digital-twin/) — Real-time robot-arm digital twin<br>🌐 [niryo-one-datasets](https://andreaisabelmontana.github.io/niryo-one-datasets/) — Robot-arm telemetry ML datasets<br>🌐 [turtlebot2-service](https://andreaisabelmontana.github.io/turtlebot2-service/) — Robot navigation as network services<br>🌐 [digital-twin-scalability](https://andreaisabelmontana.github.io/digital-twin-scalability/) — ML autoscaling for SLA breaches |
| 4.2 | Ethics, Policy & Legislation in CS | 🌐 [cs-ethics](https://andreaisabelmontana.github.io/cs-ethics/) — Interactive CS ethics & policy atlas<br>🌐 [openpolicystack](https://andreaisabelmontana.github.io/openpolicystack/) — Microservices for evidence-based policy<br>🌐 [garlic](https://andreaisabelmontana.github.io/garlic/) — Encode web text against scrapers |
| 4.1 | Blockchain, Cryptocurrencies & FinTech | 🌐 [blockchain-playground](https://andreaisabelmontana.github.io/blockchain-playground/) — In-browser blockchain concept demos<br>📂 [Blockchain-Cryptocurrencies-Fintech](https://github.com/andreaisabelmontana/Blockchain-Cryptocurrencies-Fintech) — Cornell notes + ChainForge mini-blockchain capstone<br>🌐 [rodeo](https://andreaisabelmontana.github.io/rodeo/) — Blockchain multi-robot coordination framework<br>🌐 [harthat-web3-tutorial](https://andreaisabelmontana.github.io/harthat-web3-tutorial/) — Local Solidity smart-contract tutorial |
| 3.11 | AI: Statistical Learning & Prediction | 🌐 [fraud-detector](https://andreaisabelmontana.github.io/fraud-detector/) — Tune fraud classification thresholds<br>🌐 [sound-classifier](https://andreaisabelmontana.github.io/sound-classifier/) — Classify animal sounds from audio<br>🌐 [stat-learning](https://andreaisabelmontana.github.io/stat-learning/) — Interactive ML algorithm demos<br>🌐 [beyondstats](https://andreaisabelmontana.github.io/beyondstats/) — Gender-inequality scoring explorer |
| 3.10 | AI: Reinforcement Learning | 🌐 [reinforce-interactive](https://andreaisabelmontana.github.io/reinforce-interactive/) — Interactive reinforcement-learning demos<br>🌐 [mountain-car-control](https://andreaisabelmontana.github.io/mountain-car-control/) — RL agent solving Mountain Car<br>🌐 [mesh-parking-rl](https://andreaisabelmontana.github.io/mesh-parking-rl/) — Grid-based RL autonomous parking<br>🌐 [swipe-rl](https://andreaisabelmontana.github.io/swipe-rl/) — Preference-based RL from swipes<br>🌐 [rl-control-lab](https://andreaisabelmontana.github.io/rl-control-lab/) — Benchmark RL algorithms head-to-head |
| 3.9 | AI: NLP & Semantic Analysis | 🌐 [nlp-alignment-drift](https://andreaisabelmontana.github.io/nlp-alignment-drift/) — Visualize multi-turn LLM safety drift<br>🌐 [nlp-lab](https://andreaisabelmontana.github.io/nlp-lab/) — Interactive NLP concept demos<br>🌐 [truthlens](https://andreaisabelmontana.github.io/truthlens/) — AI fact-checking workspace<br>🌐 [stash](https://andreaisabelmontana.github.io/stash/) — YouTube transcript saver & summarizer<br>🌐 [rental-finder](https://andreaisabelmontana.github.io/rental-finder/) — Plain-language rental search · study rebuild |
| 3.8 | AI: Computer Vision | 🌐 [cs-vision](https://andreaisabelmontana.github.io/cs-vision/) — Interactive computer-vision demos<br>🌐 [vision-proctor](https://andreaisabelmontana.github.io/vision-proctor/) — Browser exam proctoring via face detection<br>🌐 [fatigued-driver-detector](https://andreaisabelmontana.github.io/fatigued-driver-detector/) — Detect driver drowsiness with CV<br>🌐 [ie-tower-vpr](https://andreaisabelmontana.github.io/ie-tower-vpr/) — Visual place recognition by image retrieval<br>🌐 [crittercut](https://andreaisabelmontana.github.io/crittercut/) — Crop & trim animal-behavior videos<br>🌐 [SPICE](https://andreaisabelmontana.github.io/SPICE/) — Projected interactive cooking guide<br>🌐 [holovinyl-rebuild](https://andreaisabelmontana.github.io/holovinyl-rebuild/) — Turn objects into playable records |
| 3.7 | AI: Chatbots & Recommendation Engines | 🌐 [chatbots-recsys-lab](https://andreaisabelmontana.github.io/chatbots-recsys-lab/) — Interactive recommender-systems demos<br>🌐 [skincares-advisor](https://andreaisabelmontana.github.io/skincares-advisor/) — Decode & categorize skincare ingredients<br>🌐 [mistral-kit](https://andreaisabelmontana.github.io/mistral-kit/) — Chat UI components for Mistral<br>🌐 [radical-bot](https://andreaisabelmontana.github.io/radical-bot/) — Minimal from-scratch chatbot tutorial<br>🌐 [bookdb-discovery](https://andreaisabelmontana.github.io/bookdb-discovery/) — AI-chat book recommendations<br>🌐 [moviewatchlist](https://andreaisabelmontana.github.io/moviewatchlist/) — Track watched & unwatched movies<br>🌐 [memora-rebuild](https://andreaisabelmontana.github.io/memora-rebuild/) — Capture & reflect on memories |
| 3.6 | High Performance Computing | 🌐 [hpc-miniweather](https://andreaisabelmontana.github.io/hpc-miniweather/) — In-browser HPC stencil simulation<br>🌐 [gpu-montecarlo-risk-rebuild](https://andreaisabelmontana.github.io/gpu-montecarlo-risk-rebuild/) — GPU Monte Carlo risk engine<br>🌐 [uncorrelated-returns](https://andreaisabelmontana.github.io/uncorrelated-returns/) — Diversification portfolio optimizer<br>🌐 [time-series-momentum-rebuild](https://andreaisabelmontana.github.io/time-series-momentum-rebuild/) — Cross-asset momentum backtester<br>🌐 [aimes-emanager](https://andreaisabelmontana.github.io/aimes-emanager/) — Pilot-job workflow manager for HPC<br>🌐 [hpc-course](https://andreaisabelmontana.github.io/hpc-course/) — Hands-on HPC course with clusters<br>🌐 [hpc_foundations_book](https://andreaisabelmontana.github.io/hpc_foundations_book/) — Intro book on HPC fundamentals<br>🌐 [hpc_applications_book](https://andreaisabelmontana.github.io/hpc_applications_book/) — Book on supercomputing applications |
| 3.5 | Introduction to Robotics Lab | 🌐 [robotics-lab-interactive](https://andreaisabelmontana.github.io/robotics-lab-interactive/) — Browser sandbox for robotics concepts |
| 3.4 | AI: Reasoning & Problem Solving | 🌐 [ai-reasoning-games](https://andreaisabelmontana.github.io/ai-reasoning-games/) — Playable AI strategy demos<br>🌐 [symphony](https://andreaisabelmontana.github.io/symphony/) — C++20 graph-search algorithms framework<br>🌐 [victoria-rebuild](https://andreaisabelmontana.github.io/victoria-rebuild/) — Play Connect 4 vs AI<br>🌐 [neural-noir-rebuild](https://andreaisabelmontana.github.io/neural-noir-rebuild/) — Procedural detective deduction game |
| 3.3 | Software Development & DevOps | 🌐 [sddo-notes](https://andreaisabelmontana.github.io/sddo-notes/) — Software dev & DevOps study notes<br>🌐 [Software-Development-And-Devops](https://andreaisabelmontana.github.io/Software-Development-And-Devops/) — Demo e-commerce shop app<br>🌐 [topliving-inmobiliaria](https://andreaisabelmontana.github.io/topliving-inmobiliaria/) — Colombian real-estate listings platform<br>🌐 [qrate](https://andreaisabelmontana.github.io/qrate/) — In-browser QR code generator<br>🌐 [rerun](https://andreaisabelmontana.github.io/rerun/) — Workflow automation ops dashboard<br>🌐 [bug-tracker](https://andreaisabelmontana.github.io/bug-tracker/) — Auto-tagging issue tracker<br>🌐 [daybook](https://andreaisabelmontana.github.io/daybook/) — Local daily journaling app<br>🌐 [dotfiles](https://andreaisabelmontana.github.io/dotfiles/) — Version-controlled machine setup<br>🌐 [sublime-config](https://andreaisabelmontana.github.io/sublime-config/) — Synced editor config<br>🌐 [dev-vm-setup](https://andreaisabelmontana.github.io/dev-vm-setup/) — Automated dev VM provisioning<br>📂 [chess-dodge-server](https://github.com/andreaisabelmontana/chess-dodge-server) — WebSocket leaderboard & matchmaking · study rebuild |
| 3.2 | IE Challenge | 🎤 [pitch deck](https://canva.link/hah28m2jrnhfj42) — IE Challenge startup pitch |
| 3.1 | Computer Programming II | 🌐 [java-study](https://andreaisabelmontana.github.io/java-study/) — Interactive Java learning site<br>🌐 [library-system](https://andreaisabelmontana.github.io/library-system/) — Multi-role library management app<br>🌐 [futclub-manager](https://andreaisabelmontana.github.io/futclub-manager/) — Football club management app<br>🌐 [pong](https://andreaisabelmontana.github.io/pong/) — Modern Pong with spin physics · study rebuild<br>🌐 [snake](https://andreaisabelmontana.github.io/snake/) — Refined Snake · study rebuild<br>🌐 [echolocation-maze](https://andreaisabelmontana.github.io/echolocation-maze/) — Echolocation maze game · study rebuild<br>🌐 [chess-dodge-game](https://andreaisabelmontana.github.io/chess-dodge-game/) — Dodge escalating chess-piece hazards · study rebuild |
| 2.12 | Probability for Computing Science | 🌐 [stats-lab](https://andreaisabelmontana.github.io/stats-lab/) — Interactive statistics visualizer |
| 2.11 | Matrices & Linear Transformations | 🌐 [linalg-lab](https://andreaisabelmontana.github.io/linalg-lab/) — Interactive linear-algebra visualizer |
| 2.10 | IE Impact Entrepreneurship | 🌐 [entrep-lab](https://andreaisabelmontana.github.io/entrep-lab/) — Venture-building & validation tools<br>🌐 [foodloop-rebuild](https://andreaisabelmontana.github.io/foodloop-rebuild/) — Surplus-food discount marketplace |
| 2.9 | Designing and Using Databases | 🌐 [sql-lab](https://andreaisabelmontana.github.io/sql-lab/) — Browser SQL learning playground<br>🌐 [fantasy-forum](https://andreaisabelmontana.github.io/fantasy-forum/) — Fantasy football discussion forum<br>🌐 [matchup](https://andreaisabelmontana.github.io/matchup/) — Football tournament standings tracker<br>📂 [tablepro-rebuild](https://github.com/andreaisabelmontana/tablepro-rebuild) — Spreadsheet-style data table tool |
| 2.8 | AI: Personality & Emotion for AI Design | 🌐 [affect-lab](https://andreaisabelmontana.github.io/affect-lab/) — Emotion-modeling neural-net demos |
| 2.7 | AI: Machine Learning Foundations | 🌐 [ml-lab](https://andreaisabelmontana.github.io/ml-lab/) — Interactive ML concept visualizer<br>🌐 [efficient-classifier-rebuild](https://andreaisabelmontana.github.io/efficient-classifier-rebuild/) — YAML-configured classification pipeline<br>🌐 [heuristic-compiler-rebuild](https://andreaisabelmontana.github.io/heuristic-compiler-rebuild/) — Compiles JSON rules into a classifier<br>🌐 [bank-marketing-ml](https://andreaisabelmontana.github.io/bank-marketing-ml/) — Term-deposit subscription classifier · study rebuild |
| 2.6 | Technology with Impact | 🌐 [tech-lab](https://andreaisabelmontana.github.io/tech-lab/) — Low-code & generative-AI demos |
| 2.5 | Computer Programming I | 🌐 [cp1-lab](https://andreaisabelmontana.github.io/cp1-lab/) — Interactive C programming visualizer |
| 2.4 | Computer Architecture, Networks & OS | 🌐 [arch-lab](https://andreaisabelmontana.github.io/arch-lab/) — Architecture & networking sims<br>🌐 [hostpad-802.11r](https://andreaisabelmontana.github.io/hostpad-802.11r/) — Fast-roaming Wi-Fi configuration<br>📂 [terminalchat-rebuild](https://github.com/andreaisabelmontana/terminalchat-rebuild) — Terminal LAN chat client |
| 2.3 | Cloud Computing | 🌐 [cloud-lab](https://andreaisabelmontana.github.io/cloud-lab/) — Interactive cloud-computing simulator<br>🌐 [petcare](https://andreaisabelmontana.github.io/petcare/) — Pet management DevOps app |
| 2.2 | Calculus for Computer Science | 🌐 [calc-lab](https://andreaisabelmontana.github.io/calc-lab/) — Interactive calculus visualizer<br>🌐 [calculus-toolkit-site](https://andreaisabelmontana.github.io/calculus-toolkit-site/) — Browser calculus plotting toolkit<br>🌐 [fractal-explorer](https://andreaisabelmontana.github.io/fractal-explorer/) — GPU Mandelbrot & Julia explorer · study rebuild |
| 2.1 | Algorithms & Data Structures | 🌐 [algos-lab](https://andreaisabelmontana.github.io/algos-lab/) — Animated algorithm visualizer |
| 1.10 | Simulating and Modeling to Understand Change | 🌐 [modeling-lab](https://andreaisabelmontana.github.io/modeling-lab/) — Modeling & simulation playground<br>🌐 [fluid-simulation](https://andreaisabelmontana.github.io/fluid-simulation/) — 2D SPH fluid you can stir · study rebuild<br>🌐 [ant-colony-simulation](https://andreaisabelmontana.github.io/ant-colony-simulation/) — Emergent ant-colony foraging · study rebuild<br>🌐 [boids-flocking](https://andreaisabelmontana.github.io/boids-flocking/) — Boids flocking simulation · study rebuild<br>🌐 [strange-attractors](https://andreaisabelmontana.github.io/strange-attractors/) — 3D chaotic-attractor explorer · study rebuild |
| 1.9 | Principles of Programming | 🌐 [programming-principles-lab](https://andreaisabelmontana.github.io/programming-principles-lab/) — Code-execution concept visualizer |
| 1.8 | Physics for Computer Science | 🌐 [physics-cs-lab](https://andreaisabelmontana.github.io/physics-cs-lab/) — Interactive physics simulation lab<br>🌐 [pyfreebody](https://andreaisabelmontana.github.io/pyfreebody/) — Python free-body diagram generator<br>🌐 [radioform-web](https://andreaisabelmontana.github.io/radioform-web/) — Browser parametric EQ tool<br>🌐 [solar-system-simulation](https://andreaisabelmontana.github.io/solar-system-simulation/) — N-body what-if solar system · study rebuild<br>🌐 [black-hole-simulation](https://andreaisabelmontana.github.io/black-hole-simulation/) — 3D black-hole accretion sim · study rebuild<br>🌐 [tilt-maze-game](https://andreaisabelmontana.github.io/tilt-maze-game/) — Tilt-a-cube 3D ball-maze puzzle · study rebuild |
| 1.7 | Humanities | 🌐 [humanities-lab](https://andreaisabelmontana.github.io/humanities-lab/) — Technology-and-society study companion |
| 1.6 | Fundamentals of Data Analysis | 🌐 [data-analysis-lab](https://andreaisabelmontana.github.io/data-analysis-lab/) — Statistical inference visualizer<br>🌐 [vigiview](https://andreaisabelmontana.github.io/vigiview/) — Adverse drug event explorer<br>🌐 [shopsmart](https://andreaisabelmontana.github.io/shopsmart/) — Grocery price-comparison app |
| 1.5 | The Big History of Ideas and Innovation | 🌐 [big-history-lab](https://andreaisabelmontana.github.io/big-history-lab/) — Cosmic-to-human history visualizer |
| 1.4 | Learning to Observe, Experiment & Survey | 🌐 [research-methods-lab](https://andreaisabelmontana.github.io/research-methods-lab/) — Research methods visualizer |
| 1.3 | Introduction to Business Management | 🌐 [business-lab](https://andreaisabelmontana.github.io/business-lab/) — Business & market concept visualizer |
| 1.2 | Fundamentals of Probability & Statistics | 🌐 [prob-stats-lab](https://andreaisabelmontana.github.io/prob-stats-lab/) — Probability & statistics visualizer |
| 1.1 | Discrete Mathematics | 🌐 [discrete-math-lab](https://andreaisabelmontana.github.io/discrete-math-lab/) — Discrete-math concept visualizer |

<!-- COURSE_TABLE_END -->

<sub>Last refreshed 2026-06-23 · auto-generated from GitHub topics</sub>
