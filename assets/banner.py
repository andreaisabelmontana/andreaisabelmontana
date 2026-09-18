# -*- coding: utf-8 -*-
"""Generates the animated profile banner in a dark and a light variant.

The right-hand panel is the finger-counting stage of the hand-gesture-snake
pipeline drawn literally: the traced contour of the hand, the convex hull
closed around it, and the four convexity defects between them. Count the
defects, add one, and you have counted the fingers.

The resting state is the finished detection, so a rasterized still or a
reduced-motion viewer sees a complete frame rather than an empty panel.
"""
import io
import os

SANS = "'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
MONO = "ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace"

# ---- geometry -------------------------------------------------------------
# Convex hull, clockwise from the middle fingertip.
HULL = [
    (912, 80),    # middle tip
    (952, 88),    # ring tip
    (988, 110),   # pinky tip
    (1000, 160),  # pinky base
    (996, 197),   # palm, right edge
    (968, 227),   # wrist, right
    (890, 230),   # wrist, left
    (846, 204),   # palm, left edge
    (838, 142),   # thumb tip
    (872, 90),    # index tip
]

# Traced outline of the same hand, clockwise from the left wrist. Every hull
# vertex appears here too; the extra points are the sides of the fingers.
CONTOUR = [
    (890, 230), (846, 204), (826, 168), (838, 142),          # wrist, palm, thumb
    (858, 166),                                              # thumb / index web
    (864, 112), (872, 90), (881, 112),                        # index
    (893, 126),                                              # index / middle
    (904, 104), (912, 80), (921, 104),                        # middle
    (933, 124),                                              # middle / ring
    (944, 106), (952, 88), (960, 110),                        # ring
    (968, 136),                                              # ring / pinky
    (980, 126), (988, 110), (994, 144),                       # pinky
    (1000, 160), (996, 197), (968, 227),                      # palm, wrist
]

# The four convexity defects, each with the midpoint of the hull edge it sits
# under. The dashed line between them is the defect depth.
VALLEYS = [
    ((858, 166), (855, 116)),
    ((893, 126), (892, 85)),
    ((933, 124), (932, 84)),
    ((968, 136), (970, 99)),
]

VIEW = (700, 52, 440, 200)  # x, y, w, h of the camera panel
HULL_LEN = 520              # dash length, comfortably over the true perimeter
CONTOUR_LEN = 720

DARK = dict(
    bg="#0b0f16", panel="#0d131d", edge="#1d283a", dot="#223047",
    text="#e8eef6", muted="#93a3b8", dim="#5c6a7e",
    accent="#5eead4", accent2="#a78bfa", glow="#5eead4", glowop="0.10",
    silhouette="#5eead4", silop="0.09",
)
LIGHT = dict(
    bg="#fbfcfd", panel="#f3f6fa", edge="#d8e0ea", dot="#c8d3e1",
    text="#0d1117", muted="#4a5568", dim="#8494a8",
    accent="#0d9488", accent2="#6d28d9", glow="#0d9488", glowop="0.06",
    silhouette="#0d9488", silop="0.08",
)


def path_of(points):
    return "M " + " L ".join("%d %d" % (x, y) for x, y in points) + " Z"


def build(p):
    o = io.StringIO()
    w = o.write
    vx, vy, vw, vh = VIEW

    w('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" '
      'width="1200" height="300" role="img" '
      'aria-label="Andrea Montana. Computer Science and Artificial Intelligence at '
      'IE University, Madrid. Computer vision, augmented reality, spatial computing. '
      'A tracked hand with its convex hull and four convexity defects.">\n')

    # ---- defs -------------------------------------------------------------
    w('<defs>\n')
    w('<radialGradient id="glow" cx="50%%" cy="45%%" r="55%%">'
      '<stop offset="0%%" stop-color="%(glow)s" stop-opacity="%(glowop)s"/>'
      '<stop offset="100%%" stop-color="%(glow)s" stop-opacity="0"/></radialGradient>\n' % p)
    w('<linearGradient id="scanfade" x1="0" y1="0" x2="1" y2="0">'
      '<stop offset="0%%" stop-color="%(accent)s" stop-opacity="0"/>'
      '<stop offset="50%%" stop-color="%(accent)s" stop-opacity="0.55"/>'
      '<stop offset="100%%" stop-color="%(accent)s" stop-opacity="0"/></linearGradient>\n' % p)
    w('<clipPath id="panel"><rect x="%d" y="%d" width="%d" height="%d" rx="10"/></clipPath>\n'
      % (vx, vy, vw, vh))
    w('</defs>\n')

    # ---- stylesheet -------------------------------------------------------
    # One 12s cycle: hold the finished frame, dissolve it, then rebuild in
    # pipeline order (contour, keypoints, hull, defects) and come back to rest.
    w('<style>\n')
    w('.s{font-family:%s} .m{font-family:%s}\n' % (SANS, MONO))
    w('.ct{stroke-dashoffset:0;opacity:1;animation:ct 12s linear infinite}\n')
    w('@keyframes ct{0%%,41.7%%{stroke-dashoffset:0;opacity:1}45.8%%{stroke-dashoffset:0;opacity:0}'
      '49.9%%{stroke-dashoffset:%(L)dpx;opacity:0}50.5%%{stroke-dashoffset:%(L)dpx;opacity:1}'
      '60%%{stroke-dashoffset:0;opacity:1}100%%{stroke-dashoffset:0;opacity:1}}\n'
      % {"L": CONTOUR_LEN})
    w('.ctf{opacity:1;animation:ctf 12s linear infinite}\n')
    w('@keyframes ctf{0%,41.7%{opacity:1}45.8%{opacity:0}57%{opacity:0}63%{opacity:1}100%{opacity:1}}\n')
    w('.kp{opacity:1;animation:kp 12s linear infinite}\n')
    w('@keyframes kp{0%,41.7%{opacity:1}45.8%{opacity:0}56.7%{opacity:0}61.7%{opacity:1}100%{opacity:1}}\n')
    w('.ring{opacity:0;animation:ring 12s linear infinite}\n')
    w('@keyframes ring{0%,56.7%{opacity:0;r:2}58.5%{opacity:.8;r:4}63%{opacity:0;r:13}100%{opacity:0;r:13}}\n')
    w('.hull{stroke-dashoffset:0;opacity:1;animation:hull 12s linear infinite}\n')
    w('@keyframes hull{0%%,41.7%%{stroke-dashoffset:0;opacity:1}45.8%%{stroke-dashoffset:0;opacity:0}'
      '69.5%%{stroke-dashoffset:%(L)dpx;opacity:0}70%%{stroke-dashoffset:%(L)dpx;opacity:1}'
      '81.7%%{stroke-dashoffset:0;opacity:1}100%%{stroke-dashoffset:0;opacity:1}}\n'
      % {"L": HULL_LEN})
    w('.vl{opacity:1;animation:vl 12s linear infinite}\n')
    w('@keyframes vl{0%,41.7%{opacity:1}45.8%{opacity:0}81.7%{opacity:0}86.7%{opacity:1}100%{opacity:1}}\n')
    w('.scan{animation:scan 3.6s ease-in-out infinite}\n')
    w('@keyframes scan{0%%{transform:translateY(0)}50%%{transform:translateY(%dpx)}'
      '100%%{transform:translateY(0)}}\n' % (vh - 8))
    w('.caret{animation:blink 1.1s steps(1) infinite}\n')
    w('@keyframes blink{0%,50%{opacity:1}50.01%,100%{opacity:0}}\n')
    w('@media (prefers-reduced-motion:reduce){'
      '.ct,.ctf,.kp,.ring,.hull,.vl,.scan,.caret{animation:none}}\n')
    w('</style>\n')

    # ---- background -------------------------------------------------------
    w('<rect width="1200" height="300" fill="%(bg)s"/>\n' % p)

    # ---- left column ------------------------------------------------------
    w('<text class="s" x="64" y="116" font-size="52" font-weight="600" '
      'letter-spacing="2.5" fill="%s">ANDREA MONTAÑA</text>\n' % p["text"])
    w('<rect x="65" y="132" width="54" height="3" rx="1.5" fill="%s"/>\n' % p["accent"])
    w('<text class="s" x="64" y="168" font-size="17" fill="%s">'
      'Computer Science &amp; Artificial Intelligence · IE University, Madrid</text>\n'
      % p["muted"])
    w('<text class="m" x="64" y="203" font-size="15" fill="%s">'
      'computer vision / augmented reality / spatial computing</text>\n' % p["accent"])
    w('<rect class="caret" x="556" y="191" width="9" height="16" fill="%s"/>\n' % p["accent"])
    w('<text class="m" x="64" y="239" font-size="12.5" fill="%s" letter-spacing="0.4">'
      'SIGGRAPH Real-Time Live! 2025 · IEEE ICRA 2026</text>\n' % p["dim"])

    # ---- camera panel -----------------------------------------------------
    w('<rect x="%d" y="%d" width="%d" height="%d" rx="10" fill="%s" stroke="%s" stroke-width="1"/>\n'
      % (vx, vy, vw, vh, p["panel"], p["edge"]))
    w('<g clip-path="url(#panel)">\n')
    w('<rect x="%d" y="%d" width="%d" height="%d" fill="url(#glow)"/>\n' % (vx, vy, vw, vh))

    w('<g fill="%s">' % p["dot"])
    for gx in range(vx + 12, vx + vw - 4, 20):
        for gy in range(vy + 12, vy + vh - 4, 20):
            w('<circle cx="%d" cy="%d" r="1"/>' % (gx, gy))
    w('</g>\n')

    w('<rect class="scan" x="%d" y="%d" width="%d" height="1.5" fill="url(#scanfade)"/>\n'
      % (vx, vy + 4, vw))

    contour_d = path_of(CONTOUR)

    # segmented region, then its traced outline
    w('<path class="ctf" d="%s" fill="%s" fill-opacity="%s"/>\n'
      % (contour_d, p["silhouette"], p["silop"]))
    w('<path class="ct" d="%s" fill="none" stroke="%s" stroke-width="1.4" '
      'stroke-linejoin="round" stroke-dasharray="%d"/>\n'
      % (contour_d, p["muted"], CONTOUR_LEN))

    # convexity defects: depth line from each valley to its hull edge
    w('<g class="vl">\n')
    for (px, py), (mx, my) in VALLEYS:
        w('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="1.2" '
          'stroke-dasharray="3 3"/>\n' % (px, py, mx, my, p["accent2"]))
    for (px, py), _ in VALLEYS:
        w('<circle cx="%d" cy="%d" r="4.5" fill="none" stroke="%s" stroke-width="1.6"/>\n'
          % (px, py, p["accent2"]))
        w('<circle cx="%d" cy="%d" r="1.6" fill="%s"/>\n' % (px, py, p["accent2"]))
    w('</g>\n')

    # convex hull
    w('<path class="hull" d="%s" fill="none" stroke="%s" stroke-width="2" '
      'stroke-linejoin="round" stroke-dasharray="%d"/>\n'
      % (path_of(HULL), p["accent"], HULL_LEN))

    # keypoints: hull vertices first, then the defects
    for i, (px, py) in enumerate(HULL + [v[0] for v in VALLEYS]):
        d = "%.2fs" % (i * 0.07)
        w('<circle class="ring" cx="%d" cy="%d" r="2" fill="none" stroke="%s" '
          'stroke-width="1.2" style="animation-delay:%s"/>\n' % (px, py, p["accent"], d))
        w('<g class="kp" style="animation-delay:%s" stroke="%s" stroke-width="1.3">'
          '<line x1="%d" y1="%d" x2="%d" y2="%d"/>'
          '<line x1="%d" y1="%d" x2="%d" y2="%d"/></g>\n'
          % (d, p["text"], px - 4, py, px + 4, py, px, py - 4, px, py + 4))
    w('</g>\n')

    # ---- camera framing ---------------------------------------------------
    b, arm = 10, 18
    corners = ((vx, vy, 1, 1), (vx + vw, vy, -1, 1),
               (vx, vy + vh, 1, -1), (vx + vw, vy + vh, -1, -1))
    for cx, cy, sx, sy in corners:
        w('<path d="M %d %d L %d %d L %d %d" fill="none" stroke="%s" stroke-width="1.6" '
          'opacity="0.8"/>\n'
          % (cx + sx * b, cy + sy * (b + arm), cx + sx * b, cy + sy * b,
             cx + sx * (b + arm), cy + sy * b, p["accent"]))

    w('<circle cx="%d" cy="%d" r="3" fill="%s"/>\n' % (vx + 22, vy + 26, p["accent"]))
    w('<text class="m" x="%d" y="%d" font-size="11" letter-spacing="1.1" fill="%s">TRACKING</text>\n'
      % (vx + 32, vy + 30, p["muted"]))
    w('<text class="m" x="%d" y="%d" font-size="10" text-anchor="end" fill="%s">'
      'contour → hull → defects</text>\n' % (vx + vw - 22, vy + 30, p["dim"]))
    w('<text class="m vl" x="%d" y="%d" font-size="12" fill="%s">'
      '4 defects → 5 fingers</text>\n' % (vx + 22, vy + vh - 16, p["accent2"]))

    w('</svg>\n')
    return o.getvalue()


out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")
os.makedirs(out, exist_ok=True)
for name, palette in (("banner-dark.svg", DARK), ("banner-light.svg", LIGHT)):
    target = os.path.join(out, name)
    with open(target, "w", encoding="utf-8") as fh:
        fh.write(build(palette))
    print(name, os.path.getsize(target), "bytes")
