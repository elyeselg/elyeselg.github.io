/* ═══════════════════════════════════════════════════
   canvas3d.js — Formes 3D wireframe en POINTS (dots)
   Style Matrix : vert sur noir, pas de traits pleins
   ═══════════════════════════════════════════════════

   Pour modifier :
   - COLORS   → palette des formes
   - DOT_SIZE → taille des points
   - SHAPE_COUNT → nombre de formes (auto selon résolution)
   - vitesse → paramètre sp dans Shape3D.reset()
*/

const cv = document.getElementById('c3d');
const gx = cv.getContext('2d');
let W, H;

function resize() {
  W = cv.width  = window.innerWidth;
  H = cv.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); spawnAll(); });

/* ── PALETTE ──────────────────────────────────────── */
const COLORS = [
  [0,   255, 65],   // vert Matrix pur
  [0,   200, 50],   // vert moyen
  [57,  255, 20],   // vert fluo
  [0,   180, 80],   // vert émeraude
];

/* ── CONSTANTES ───────────────────────────────────── */
const DOT_SIZE       = 1.4;   // rayon des points vertices
const EDGE_DOT_COUNT = 6;     // points intermédiaires sur chaque arête
const EDGE_DOT_SIZE  = 0.55;  // rayon des points d'arête

/* ── CLASSE SHAPE 3D ──────────────────────────────── */
class Shape3D {
  constructor() { this.reset(true); }

  reset(init) {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    if (!init) {
      // Réapparaît depuis un bord
      this.x = Math.random() < .5 ? -130 : W + 130;
      this.y = Math.random() * H;
    }

    this.sz   = 28 + Math.random() * 60;
    this.type = ['cube','octa','tetra','icosa','prism'][Math.floor(Math.random() * 5)];

    // Rotation initiale aléatoire
    this.rx = Math.random() * Math.PI * 2;
    this.ry = Math.random() * Math.PI * 2;
    this.rz = Math.random() * Math.PI * 2;

    // Vitesse de rotation (lente et organique)
    const sp = .0012 + Math.random() * .0025;
    this.drx = (Math.random() - .5) * sp * 2;
    this.dry = (Math.random() - .5) * sp * 2;
    this.drz = (Math.random() - .5) * sp;

    // Déplacement
    this.vx = (Math.random() - .5) * .16;
    this.vy = (Math.random() - .5) * .16;

    // Couleur depuis la palette
    this.col   = COLORS[Math.floor(Math.random() * COLORS.length)];
    // Alpha faible = discret mais présent
    this.alpha = .055 + Math.random() * .075;

    this.verts = [];
    this.edges = [];
    this.build();
  }

  build() {
    const s = this.sz;
    this.verts = [];
    this.edges = [];

    switch (this.type) {
      case 'cube': {
        const h = s / 2;
        this.verts = [
          [-h,-h,-h],[h,-h,-h],[h,h,-h],[-h,h,-h],
          [-h,-h, h],[h,-h, h],[h,h, h],[-h,h, h]
        ];
        this.edges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];
        break;
      }
      case 'octa': {
        this.verts = [[0,-s,0],[s,0,0],[0,0,s],[-s,0,0],[0,0,-s],[0,s,0]];
        this.edges = [
          [0,1],[0,2],[0,3],[0,4],
          [5,1],[5,2],[5,3],[5,4],
          [1,2],[2,3],[3,4],[4,1]
        ];
        break;
      }
      case 'tetra': {
        const h2 = s * Math.sqrt(2/3);
        this.verts = [[0,h2,0],[s/2,-h2/2,s/2],[-s/2,-h2/2,s/2],[0,-h2/2,-s]];
        this.edges = [[0,1],[0,2],[0,3],[1,2],[2,3],[3,1]];
        break;
      }
      case 'prism': {
        const hp = s * .6, r = s * .7;
        for (let i = 0; i < 3; i++) {
          const a = i * Math.PI * 2 / 3;
          this.verts.push([r * Math.cos(a),  hp, r * Math.sin(a)]);
          this.verts.push([r * Math.cos(a), -hp, r * Math.sin(a)]);
        }
        this.edges = [[0,2],[2,4],[4,0],[1,3],[3,5],[5,1],[0,1],[2,3],[4,5]];
        break;
      }
      default: { // icosa
        const phi = (1 + Math.sqrt(5)) / 2 * s * .55;
        this.verts = [
          [0,s,phi],[0,-s,phi],[0,s,-phi],[0,-s,-phi],
          [s,phi,0],[-s,phi,0],[s,-phi,0],[-s,-phi,0],
          [phi,0,s],[phi,0,-s],[-phi,0,s],[-phi,0,-s]
        ];
        this.edges = [
          [0,1],[0,4],[0,5],[0,8],[0,10],
          [3,2],[3,6],[3,7],[3,9],[3,11],
          [1,6],[1,7],[1,8],[1,10],
          [2,4],[2,5],[2,9],[2,11],
          [4,8],[5,10]
        ];
      }
    }
  }

  /* Projection 3D → 2D avec rotation X/Y/Z */
  project(v) {
    const fov = 680;
    let [x, y, z] = v;

    // Rotation X
    const cx = Math.cos(this.rx), sx = Math.sin(this.rx);
    let y1 = y * cx - z * sx, z1 = y * sx + z * cx;

    // Rotation Y
    const cy = Math.cos(this.ry), sy = Math.sin(this.ry);
    let x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;

    // Rotation Z
    const cz = Math.cos(this.rz), sz = Math.sin(this.rz);
    let x3 = x2 * cz - y1 * sz, y3 = x2 * sz + y1 * cz;

    const d = fov / (fov + z2 + 500);
    return [x3 * d, y3 * d];
  }

  update() {
    this.rx += this.drx;
    this.ry += this.dry;
    this.rz += this.drz;
    this.x  += this.vx;
    this.y  += this.vy;

    // Recycle si hors écran
    if (this.x < -200 || this.x > W + 200 || this.y < -200 || this.y > H + 200) {
      this.reset(false);
    }
  }

  draw() {
    const pts = this.verts.map(v => this.project(v));
    const [r, g, b] = this.col;

    // ── Vertices = gros points lumineux ────────────
    gx.fillStyle = `rgba(${r},${g},${b},${this.alpha * 2.8})`;
    for (const p of pts) {
      gx.beginPath();
      gx.arc(this.x + p[0], this.y + p[1], DOT_SIZE, 0, Math.PI * 2);
      gx.fill();
    }

    // ── Arêtes = série de petits points ───────────
    gx.fillStyle = `rgba(${r},${g},${b},${this.alpha * 1.1})`;
    for (const [ai, bi] of this.edges) {
      const ax = this.x + pts[ai][0], ay = this.y + pts[ai][1];
      const bx = this.x + pts[bi][0], by = this.y + pts[bi][1];
      for (let t = 1; t < EDGE_DOT_COUNT; t++) {
        const f  = t / EDGE_DOT_COUNT;
        const px = ax + (bx - ax) * f;
        const py = ay + (by - ay) * f;
        gx.beginPath();
        gx.arc(px, py, EDGE_DOT_SIZE, 0, Math.PI * 2);
        gx.fill();
      }
    }
  }
}

/* ── PARTICULES FOND ─────────────────────────────── */
class Particle {
  constructor() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - .5) * .04;
    this.vy = (Math.random() - .5) * .04;
    this.r  = Math.random() < .015 ? 1.6 : Math.random() < .08 ? .8 : .35;
    this.a  = .1 + Math.random() * .45;
    this.ph = Math.random() * Math.PI * 2;
    this.sp = .007 + Math.random() * .011;
  }
  update() {
    this.ph += this.sp;
    this.x  += this.vx;
    this.y  += this.vy;
    if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
  }
  draw() {
    const tw = .35 + .65 * (Math.sin(this.ph) * .5 + .5);
    gx.beginPath();
    gx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    gx.fillStyle = `rgba(0,255,65,${this.a * tw * .55})`;
    gx.fill();
  }
}

/* ── GLOWS AMBIANTS ──────────────────────────────── */
function drawAmbient() {
  const blobs = [
    { x: W * .85, y: H * .12, r: 380, alpha: .035 },
    { x: W * .08, y: H * .75, r: 260, alpha: .028 },
    { x: W * .45, y: H * .5,  r: 180, alpha: .018 },
  ];
  for (const b of blobs) {
    const g = gx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    g.addColorStop(0, `rgba(0,255,65,${b.alpha})`);
    g.addColorStop(1, 'transparent');
    gx.fillStyle = g;
    gx.fillRect(0, 0, W, H);
  }
}

/* ── INIT & BOUCLE ───────────────────────────────── */
let shapes = [], particles = [];

function spawnAll() {
  const ns = Math.min(16, Math.floor(W * H / 50000) + 6);
  const np = Math.floor(W * H / 9000);
  shapes    = Array.from({ length: ns }, () => new Shape3D());
  particles = Array.from({ length: np }, () => new Particle());
}
spawnAll();

function frame() {
  gx.clearRect(0, 0, W, H);
  drawAmbient();

  // Connexions entre particules proches
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 70) {
        gx.strokeStyle = `rgba(0,255,65,${(1 - d / 70) * .025})`;
        gx.lineWidth   = .3;
        gx.beginPath();
        gx.moveTo(particles[i].x, particles[i].y);
        gx.lineTo(particles[j].x, particles[j].y);
        gx.stroke();
      }
    }
  }

  for (const s of shapes) { s.update(); s.draw(); }
  requestAnimationFrame(frame);
}
frame();
