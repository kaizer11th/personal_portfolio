/* =============================================
   ADMIN CREDENTIALS
   Change these before deploying!
============================================= */
const ADMIN_USER = 'san';
const ADMIN_PASS = 'admin2026';
const STORAGE_KEY = 'san_projects_v2';

/* =============================================
   DEFAULT PROJECTS (shown before admin adds any)
============================================= */
const DEFAULT_PROJECTS = [
    {
        id: 'p1',
        name: "My Department's Website",
        desc: "Italian Language College website. Built with HTML, Tailwind CSS, and JS. Deployed via GitHub & Vercel.",
        stack: ["HTML", "Tailwind", "JavaScript"],
        github: "https://github.com/kaizer11th/italian_website",
        live: "https://cmellcsitalian.blog/",
        status: "live"
    },
    {
        id: 'p2',
        name: "Neuralgrid",
        desc: "Live GPU Sharing Network Simulator with real-time visualisation.",
        stack: ["HTML", "CSS3", "JavaScript"],
        github: "https://github.com/kaizer11th/neuralgrid",
        live: "https://neuralgrid-h4gg.onrender.com/",
        status: "live"
    },
    {
        id: 'p3',
        name: "Basic Foundation Site",
        desc: "Helped me learn the fundamentals of web development. Still up and regularly updated.",
        stack: ["HTML5", "CSS3", "JavaScript"],
        github: "https://github.com/kaizer11th/website",
        live: "https://san-green.vercel.app/",
        status: "live"
    }
];

/* =============================================
   STATE
============================================= */
let isAdmin = false;
let projects = [];

/* =============================================
   LOADER
============================================= */
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
const loaderLabel = document.getElementById('loaderLabel');
const loaderName = document.querySelector('.loader-name');

document.body.classList.add('loading');

const loaderSteps = ['Loading', 'Initialising', 'Almost there'];
let step = 0;
const stepInterval = setInterval(() => {
    step++;
    if (step < loaderSteps.length) loaderLabel.textContent = loaderSteps[step];
}, 600);

window.addEventListener('load', () => {
    clearInterval(stepInterval);
    setTimeout(() => { loaderFill.style.width = '100%'; }, 80);
    setTimeout(() => { if (loaderName) loaderName.classList.add('fill'); }, 400);
    setTimeout(() => {
        loader.classList.add('out');
        document.body.classList.remove('loading');
    }, 2000);
});

/* =============================================
   CURSOR
============================================= */
const cur = document.getElementById('cur');
const curRing = document.getElementById('curRing');
let mx = 0, my = 0, rx = 0, ry = 0;

if (cur && curRing) {
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cur.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function tick() {
        rx += (mx - rx) * .12;
        ry += (my - ry) * .12;
        curRing.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(tick);
    })();
    document.querySelectorAll('a,button').forEach(el => {
        el.addEventListener('mouseenter', () => { cur.classList.add('hov'); curRing.classList.add('hov'); });
        el.addEventListener('mouseleave', () => { cur.classList.remove('hov'); curRing.classList.remove('hov'); });
    });
}

/* =============================================
   NAVBAR
============================================= */
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNav();
}, { passive: true });

navBurger?.addEventListener('click', () => {
    navBurger.classList.toggle('open');
    navLinks.classList.toggle('open');
});
document.querySelectorAll('.nl').forEach(l => {
    l.addEventListener('click', () => {
        navBurger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

function updateActiveNav() {
    const ids = ['hero', 'developer', 'writer', 'contact'];
    const y = window.scrollY + 100;
    ids.forEach(id => {
        const sec = document.getElementById(id);
        const link = document.querySelector(`.nl[href="#${id}"]`);
        if (!sec || !link) return;
        const active = y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight;
        link.classList.toggle('active', active);
    });
}

/* =============================================
   SMOOTH SCROLL
============================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const h = a.getAttribute('href');
        if (h === '#') return;
        e.preventDefault();
        const t = document.querySelector(h);
        if (t) window.scrollTo({ top: t.offsetTop - 68, behavior: 'smooth' });
    });
});

/* =============================================
   HERO CANVAS — PARTICLE NETWORK
============================================= */
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles;

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - .5) * .3;
            this.vy = (Math.random() - .5) * .3;
            this.r = Math.random() * 1.5 + .5;
            this.alpha = Math.random() * .4 + .1;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,240,74,${this.alpha})`;
            ctx.fill();
        }
    }

    particles = Array.from({ length: 80 }, () => new Particle());

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(200,240,74,${.06 * (1 - d / 100)})`;
                    ctx.lineWidth = .5;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(loop);
    }
    loop();
}
initHeroCanvas();

/* =============================================
   COUNTER ANIMATION
============================================= */
function animCount(el, target, dur = 1600) {
    const start = performance.now();
    function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(2, -10 * t);
        el.textContent = Math.floor(ease * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
    }
    requestAnimationFrame(tick);
}

const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('[data-t]').forEach(el => {
                animCount(el, parseInt(el.dataset.t));
            });
            statsObs.unobserve(e.target);
        }
    });
}, { threshold: .5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObs.observe(heroStats);

/* =============================================
   SKILL BARS ANIMATION
============================================= */
const sbObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.sb-item').forEach((item, i) => {
                setTimeout(() => {
                    item.querySelector('.sb-fill').style.width = item.dataset.pct + '%';
                }, i * 150);
            });
            sbObs.unobserve(e.target);
        }
    });
}, { threshold: .3 });
document.querySelectorAll('.skill-bars').forEach(el => sbObs.observe(el));

/* =============================================
   REVEAL ON SCROLL
============================================= */
const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const siblings = [...e.target.parentElement.querySelectorAll('.reveal')];
            const idx = siblings.indexOf(e.target);
            setTimeout(() => e.target.classList.add('in'), idx * 100);
            revObs.unobserve(e.target);
        }
    });
}, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* =============================================
   PROJECT MANAGEMENT (localStorage)
============================================= */
function loadProjects() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            projects = JSON.parse(raw);
        } else {
            projects = [...DEFAULT_PROJECTS];
            saveProjects();
        }
    } catch {
        projects = [...DEFAULT_PROJECTS];
    }
}

function saveProjects() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    const count = document.getElementById('projectCount');
    if (!grid) return;

    grid.innerHTML = '';

    projects.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'proj-card reveal';
        card.innerHTML = `
            <button class="proj-delete-btn" data-id="${p.id}" title="Delete project">
                <i class="fas fa-trash"></i>
            </button>
            <div class="proj-card-num">${String(i + 1).padStart(2, '0')}</div>
            <div class="proj-status ${p.status}">
                ${p.status === 'live' ? 'Live' : p.status === 'wip' ? 'WIP' : 'Coming Soon'}
            </div>
            <h4 class="proj-name">${p.name}</h4>
            <p class="proj-desc">${p.desc}</p>
            ${p.stack && p.stack.length ? `
            <div class="proj-stack">
                ${p.stack.map(s => `<span>${s}</span>`).join('')}
            </div>` : ''}
            <div class="proj-links">
                ${p.github ? `<a href="${p.github}" target="_blank" class="pl-btn"><i class="fab fa-github"></i> GitHub</a>` : ''}
                ${p.live ? `<a href="${p.live}" target="_blank" class="pl-btn live-btn"><i class="fas fa-arrow-up-right-from-square"></i> Live</a>` : ''}
            </div>`;

        card.querySelector('.proj-delete-btn')?.addEventListener('click', e => {
            e.stopPropagation();
            deleteProject(p.id);
        });

        grid.appendChild(card);

        // Observe for reveal
        setTimeout(() => revObs.observe(card), 50);
    });

    // Coming soon placeholder
    const cs = document.createElement('div');
    cs.className = 'proj-card coming-soon-card reveal';
    cs.innerHTML = `
        <div class="cs-inner">
            <div class="cs-icon"><i class="fas fa-hammer"></i></div>
            <h4>More Coming Soon</h4>
            <p>Next project in the works</p>
        </div>`;
    grid.appendChild(cs);
    setTimeout(() => revObs.observe(cs), 50);

    if (count) count.textContent = `${projects.length} project${projects.length !== 1 ? 's' : ''}`;

    // Re-attach cursor hover to new elements
    if (cur && curRing) {
        grid.querySelectorAll('a,button').forEach(el => {
            el.addEventListener('mouseenter', () => { cur.classList.add('hov'); curRing.classList.add('hov'); });
            el.addEventListener('mouseleave', () => { cur.classList.remove('hov'); curRing.classList.remove('hov'); });
        });
    }

    renderAdminList();
}

function deleteProject(id) {
    projects = projects.filter(p => p.id !== id);
    saveProjects();
    renderProjects();
}

function renderAdminList() {
    const list = document.getElementById('apProjectsList');
    if (!list) return;
    list.innerHTML = projects.map(p => `
        <div class="ap-proj-row">
            <span class="apl-name">${p.name}</span>
            <span class="apl-status">${p.status}</span>
            <button class="ap-del" data-id="${p.id}" title="Delete"><i class="fas fa-trash"></i></button>
        </div>`).join('');
    list.querySelectorAll('.ap-del').forEach(btn => {
        btn.addEventListener('click', () => deleteProject(btn.dataset.id));
    });
}

// Add project form
document.getElementById('addProjectForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('pName').value.trim();
    const desc = document.getElementById('pDesc').value.trim();
    const stackRaw = document.getElementById('pStack').value.trim();
    const github = document.getElementById('pGithub').value.trim();
    const live = document.getElementById('pLive').value.trim();
    const status = document.getElementById('pStatus').value;

    if (!name || !desc) return;

    const newProj = {
        id: 'p' + Date.now(),
        name, desc,
        stack: stackRaw ? stackRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
        github, live, status
    };

    projects.push(newProj);
    saveProjects();
    renderProjects();
    e.target.reset();
});

/* =============================================
   ADMIN AUTH
============================================= */
const loginBackdrop = document.getElementById('loginBackdrop');
const loginForm = document.getElementById('loginForm');
const loginClose = document.getElementById('loginClose');
const loginError = document.getElementById('loginError');
const navAdminBtn = document.getElementById('navAdminBtn');
const adminIcon = document.getElementById('adminIcon');
const adminPanel = document.getElementById('adminPanel');
const apLogout = document.getElementById('apLogout');

navAdminBtn?.addEventListener('click', () => {
    if (isAdmin) {
        toggleAdminPanel();
    } else {
        loginBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
});

loginClose?.addEventListener('click', closeLogin);
loginBackdrop?.addEventListener('click', e => {
    if (e.target === loginBackdrop) closeLogin();
});

function closeLogin() {
    loginBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    loginError.classList.remove('show');
    loginForm.reset();
}

loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('adminUser').value;
    const p = document.getElementById('adminPass').value;
    if (u === ADMIN_USER && p === ADMIN_PASS) {
        isAdmin = true;
        document.body.classList.add('admin-mode');
        adminIcon.className = 'fas fa-lock-open';
        navAdminBtn.classList.add('active');
        closeLogin();
        adminPanel.classList.add('visible');
        renderAdminList();
    } else {
        loginError.classList.add('show');
        loginError.textContent = 'Invalid username or password.';
    }
});

function toggleAdminPanel() {
    adminPanel.classList.toggle('visible');
}

apLogout?.addEventListener('click', () => {
    isAdmin = false;
    document.body.classList.remove('admin-mode');
    adminIcon.className = 'fas fa-lock';
    navAdminBtn.classList.remove('active');
    adminPanel.classList.remove('visible');
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeLogin();
        closePdf();
    }
});

/* =============================================
   PDF.js VIEWER
============================================= */
const pdfModal = document.getElementById('pdfModal');
const pdfOverlay = document.getElementById('pdfOverlay');
const pdfCanvas = document.getElementById('pdfCanvas');
const pdfClose = document.getElementById('pdfClose');
const pdfPrev = document.getElementById('pdfPrev');
const pdfNext = document.getElementById('pdfNext');
const pdfCur = document.getElementById('pdfCur');
const pdfTotal = document.getElementById('pdfTotal');
const pdfTitle = document.getElementById('pdfTitle');
const pdfLoader = document.getElementById('pdfLoader');

let pdfDoc = null, pdfPage = 1, pdfRendering = null;

async function renderPdfPage(num) {
    const page = await pdfDoc.getPage(num);
    const area = document.getElementById('pdfArea');
    const scale = Math.min((area.clientWidth - 48) / page.getViewport({ scale: 1 }).width, 2);
    const vp = page.getViewport({ scale });
    pdfCanvas.width = vp.width;
    pdfCanvas.height = vp.height;
    if (pdfRendering) pdfRendering.cancel();
    pdfRendering = page.render({ canvasContext: pdfCanvas.getContext('2d'), viewport: vp });
    try { await pdfRendering.promise; } catch (e) { if (e.name !== 'RenderingCancelledException') throw e; }
    pdfCur.textContent = num;
    pdfPrev.disabled = num <= 1;
    pdfNext.disabled = num >= pdfDoc.numPages;
}

async function openPdf(src, title) {
    pdfModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    pdfTitle.textContent = title;
    pdfLoader.classList.remove('hidden');
    pdfCanvas.style.display = 'none';
    pdfPage = 1;
    try {
        pdfDoc = await pdfjsLib.getDocument(src).promise;
        pdfTotal.textContent = pdfDoc.numPages;
        pdfCanvas.style.display = 'block';
        pdfLoader.classList.add('hidden');
        await renderPdfPage(1);
    } catch (err) {
        pdfLoader.innerHTML = `<i class="fas fa-triangle-exclamation" style="font-size:24px;color:#ff5252;margin-bottom:8px"></i><span>Couldn't load PDF. Check the file exists in your repo at the correct path.</span>`;
        console.error(err);
    }
}

function closePdf() {
    if (!pdfModal.classList.contains('open')) return;
    pdfModal.classList.remove('open');
    document.body.style.overflow = '';
    if (pdfRendering) pdfRendering.cancel();
    pdfDoc = null;
    pdfCanvas.getContext('2d').clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
    pdfCanvas.style.display = 'none';
    pdfLoader.classList.remove('hidden');
    pdfLoader.innerHTML = '<div class="pdf-spinner"></div><span>Loading…</span>';
}

pdfClose?.addEventListener('click', closePdf);
pdfOverlay?.addEventListener('click', closePdf);
pdfPrev?.addEventListener('click', async () => { if (pdfPage > 1) await renderPdfPage(--pdfPage); });
pdfNext?.addEventListener('click', async () => { if (pdfDoc && pdfPage < pdfDoc.numPages) await renderPdfPage(++pdfPage); });

document.addEventListener('keydown', e => {
    if (!pdfModal?.classList.contains('open')) return;
    if (e.key === 'ArrowRight' && pdfDoc && pdfPage < pdfDoc.numPages) renderPdfPage(++pdfPage);
    if (e.key === 'ArrowLeft' && pdfPage > 1) renderPdfPage(--pdfPage);
});

document.querySelectorAll('.preview-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        openPdf(btn.dataset.pdf, btn.dataset.title || 'Preview');
    });
});

/* =============================================
   CONTACT FORM
============================================= */
const contactForm = document.getElementById('contactForm');
const cfOk = document.getElementById('cfOk');

contactForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.cf-submit');
    const span = btn.querySelector('span');
    const orig = span.textContent;
    span.textContent = 'Sending…'; btn.disabled = true;
    try {
        const res = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
            contactForm.reset();
            cfOk.classList.add('show');
            span.textContent = 'Sent!';
            setTimeout(() => { cfOk.classList.remove('show'); span.textContent = orig; btn.disabled = false; }, 5000);
        } else { throw new Error(); }
    } catch {
        span.textContent = 'Error — email me directly';
        setTimeout(() => { span.textContent = orig; btn.disabled = false; }, 4000);
    }
});

/* =============================================
   MAGNETIC BUTTONS (proj links)
============================================= */
function attachMagnetic() {
    document.querySelectorAll('.pl-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) * .25;
            const dy = (e.clientY - (r.top + r.height / 2)) * .25;
            btn.style.transform = `translate(${dx}px,${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => btn.style.transform = '');
    });
}

/* =============================================
   INIT
============================================= */
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    renderProjects();
    attachMagnetic();
    updateActiveNav();

    // Wrap all existing section children in reveal
    document.querySelectorAll('.sec-intro-grid, .projects-wrap, .samples-wrap, .contact-grid').forEach(el => {
        el.classList.add('reveal');
        revObs.observe(el);
    });
});
