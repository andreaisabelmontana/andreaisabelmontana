<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/andreaisabelmontana/andreaisabelmontana/main/assets/banner-dark.svg?v=1">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/andreaisabelmontana/andreaisabelmontana/main/assets/banner-light.svg?v=1">
  <img alt="Andrea Montaña. Computer Science and Artificial Intelligence at IE University, Madrid. Computer vision, augmented reality, spatial computing." src="https://raw.githubusercontent.com/andreaisabelmontana/andreaisabelmontana/main/assets/banner-light.svg?v=1">
</picture>

<p align="center">
  <a href="https://andreamontana.com"><img alt="Portfolio" src="https://img.shields.io/badge/Portfolio-andreamontana.com-0d9488?style=for-the-badge&labelColor=0b0f16"></a>
  <a href="https://www.linkedin.com/in/andrea-isabel-montana"><img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-andrea%20isabel%20montana-0a66c2?style=for-the-badge&labelColor=0b0f16"></a>
  <a href="mailto:amontana.ieu2023@student.ie.edu"><img alt="Email" src="https://img.shields.io/badge/Email-amontana.ieu2023-a78bfa?style=for-the-badge&labelColor=0b0f16"></a>
</p>

I work on systems that have to figure out **what they are looking at** and **where it is**. That
pulls me toward three things: getting geometry out of pixels, putting rendered objects and the
real world in the same frame, and placing data on a map so that it means something.

BSc in Computer Science and Artificial Intelligence at **IE University**, Madrid, expected 2028,
on a High Potential Scholarship. Research assistant at **IEX Labs, CyPhy Life**. Technical Lead
of **Google Developer Group IE**.

## Selected work

Each of these runs in a browser. No install, no setup, just open it.

### [Hand Gesture Snake](https://github.com/andreaisabelmontana/hand-gesture-snake) &nbsp;·&nbsp; [play it ↗](https://andreaisabelmontana.github.io/hand-gesture-snake/)

Snake, played by holding fingers up to a webcam. The tracking is the project, and it is written
against the raw pixels: RGB to YCbCr so skin sits in a narrow chroma band across every skin tone,
erode and dilate to clear the speckle a colour threshold always leaves and to close the pinholes
over knuckles, flood fill for the largest region, Moore neighbour contour tracing with Jacob's
stopping criterion, Andrew's monotone chain for the convex hull, then peak finding on the
convexity defects. Count the valleys between the fingers, add one, and you have counted the
fingers. No model, no OpenCV, no dependency of any kind.

The part I am most pleased with is how it is tested. Every stage is a pure function over a pixel
buffer, so the suite draws synthetic hands and asserts on the output, and CI runs the whole thing
without a camera attached.

`JavaScript` `computer vision` `zero dependencies` `unit tested` `CI`

### [ENCORE](https://github.com/andreaisabelmontana/encore-live-music-map) &nbsp;·&nbsp; [open the map ↗](https://andreaisabelmontana.github.io/encore-live-music-map/)

A world map where every pin is a live performance. Google Maps shows you places; this shows you
the moments that happened in them. Nearby pins cluster as you zoom out. The rail beside the map
holds whatever the viewport is currently showing and reorders itself by hearts, by recency, or by
distance from the centre of the map as you pan. Search ignores accents, so `rosalia` finds
Rosalía.

Tested ES modules, no runtime dependencies, CI and deploy workflows, and an accessibility pass.

`JavaScript` `Leaflet` `geospatial` `clustering` `viewport queries` `a11y`

### [THEEDGE](https://github.com/andreaisabelmontana/THEEDGE) &nbsp;·&nbsp; [andreamontana.com ↗](https://andreamontana.com)

My portfolio, and where I work out real time rendering in the browser. WebGL scenes, a 3D helmet
with a texture atlas mapped across its separate shells, and GSAP with Lenis driving the scroll
orchestration.

`Three.js` `WebGL` `GSAP` `Lenis` `Rive`

### [Ladybug Girl](https://github.com/andreaisabelmontana/ladybug-girl) &nbsp;·&nbsp; [play it ↗](https://andreaisabelmontana.github.io/ladybug-girl/)

A Three.js storybook meadow you walk a rigged character through. Real skeletal animation driving
the walk cycle, with foot grounding so the feet plant on the terrain instead of sliding through
it. Three.js is vendored, so there is no build step and it runs offline.

`Three.js` `skeletal animation` `rigging` `terrain`

<details>
<summary><b>Also on this account</b></summary>

<br>

| | |
|---|---|
| [**battleship**](https://github.com/andreaisabelmontana/battleship) | Classic Battleship as a C11 terminal game with a probability density AI, plus a browser version verified to play identically. [Play ↗](https://andreaisabelmontana.github.io/battleship/) |
| [**The Shop**](https://github.com/andreaisabelmontana/Software-Development-And-Devops) | React and Vite frontend for a cloud native marketplace. BCSAI Software Development and DevOps capstone. [Live ↗](https://andreaisabelmontana.github.io/Software-Development-And-Devops/) |
| [**Arte de la Montaña**](https://github.com/andreaisabelmontana/Arte-De-La-Montana) | Browser only catalogue for a painting collection, ported from a Java OOP design to ES2022. [Live ↗](https://andreaisabelmontana.github.io/Arte-De-La-Montana/) |
| [**Alma de María**](https://github.com/andreaisabelmontana/Alma-De-Maria) | Responsive storefront for a Colombian artisan jewelry brand. [Live ↗](https://andreaisabelmontana.github.io/Alma-De-Maria/) |
| [**Simulations and games**](https://github.com/andreaisabelmontana/interactive-simulations-and-games) | Hub for a collection of browser simulations and small apps. [Live ↗](https://andreaisabelmontana.github.io/interactive-simulations-and-games/) |
| [**IE University**](https://github.com/andreaisabelmontana/IE-University) | Personal archive of syllabuses, readings and notes across the BCSAI degree. |

</details>

## Research

**DJESTHESIA** &nbsp;·&nbsp; IEX Labs, CyPhy Life &nbsp;·&nbsp; SIGGRAPH Real-Time Live! 2025

A tangible multimedia interface behind a live DJ performance. I set up and tested the
TouchDesigner and OptiTrack motion capture side of it, and calibrated the projection rig, which
meant aligning every motion capture camera with a short throw projector. The system was accepted
to the SIGGRAPH Real-Time Live! 2025 demo track and ran on stage without failure.

**[ROBOPRENEUR](https://github.com/andreaisabelmontana/robopreneur-sim)** &nbsp;·&nbsp; IEX Labs, CyPhy Life &nbsp;·&nbsp; IEEE ICRA 2026

An agent based simulation of human-robot interaction where tasks are rewarded in cryptocurrency.
Mesa drives the simulation and a Solara interface exposes live controls alongside wealth, battery,
inequality and time allocation metrics. I ran the literature review and worked on the final video
prototype submitted to IEEE ICRA 2026.

I am also building a motion capture and Blender animation pipeline for character work in a Unity
project, which is where the vision, rigging and real time rendering threads meet.

## Toolkit

| | |
|---|---|
| **Vision and 3D** | Three.js, WebGL, Unity, Blender, OptiTrack motion capture, TouchDesigner, GSAP, Rive |
| **Geospatial** | Leaflet, marker clustering, viewport driven queries, accent insensitive search |
| **Machine learning** | TensorFlow, Azure AI and ML, generative and agentic AI, prompt engineering |
| **Languages** | Python, C++, C, Java, C#, Swift, JavaScript, TypeScript, R, SQL, HTML and CSS |
| **Web and data** | React, Next.js, Node.js, SwiftUI, Tailwind, PostgreSQL, MySQL, MongoDB |
| **Infrastructure** | Docker, AWS, Azure, Firebase, Vercel, GitHub Actions |
| **Hardware** | Arduino, Raspberry Pi |

<p align="center">
  <img alt="" src="https://skillicons.dev/icons?i=py,cpp,c,java,cs,swift,js,ts,react,nextjs,nodejs,threejs,tensorflow,unity,blender,docker,aws,azure,postgres,git&theme=dark">
</p>

Certificates completed in 2026: Anthropic Academy (17 courses), Google AI (7 courses), Microsoft
AI and ML Engineering (5 courses), DeepLearning.AI. Spanish native, English fluent, German
beginner.

## Where the robotics came from

Before any of the above, this.

https://github.com/user-attachments/assets/2e790415-f167-48b1-9b38-4019f42498f2

---

<p align="center">
  <b>Looking for a summer 2027 internship in computer vision, AR or geospatial.</b><br>
  <sub>Based in Madrid. Eligible to intern in Spain through an IE University agreement.</sub>
</p>
