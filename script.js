/* =============================================
   ADMIN CREDENTIALS — change before deploying
============================================= */
const ADMIN_USER = 'san';
const ADMIN_PASS = 'admin2026';
const STORAGE_KEY = 'san_projects_v3';

/* =============================================
   DEFAULT PROJECTS
============================================= */
const DEFAULT_PROJECTS = [
    {
        id: 'p1',
        name: "Italian Dept. Website",
        desc: "Official site for the Italian Language & Culture department. Built with HTML, Tailwind CSS, and JS. Deployed via GitHub Pages.",
        stack: ["HTML", "Tailwind", "JavaScript"],
        github: "https://github.com/kaizer11th/italian_website",
        live: "https://cmellcsitalian.blog/",
        status: "live"
    },
    {
        id: 'p2',
        name: "Neuralgrid",
        desc: "Live GPU Sharing Network Simulator with real-time visualisation via Canvas API.",
        stack: ["HTML", "CSS3", "JavaScript"],
        github: "https://github.com/kaizer11th/neuralgrid",
        live: "https://neuralgrid-h4gg.onrender.com/",
        status: "live"
    },
    {
        id: 'p3',
        name: "Foundation Site",
        desc: "My first web project — regularly updated. Fundamentals of web development in practice.",
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
const loader       = document.getElementById('loader');
const loaderFill   = document.getElementById('loaderFill');
const loaderLabel  = document.getElementById('loaderLabel');

document.body.classList.add('loading');

const loaderSteps = ['Initialising', 'Loading Assets', 'Almost there'];
let step = 0;
const stepInterval = setInterval(() => {
    step++;
    if (step < loaderSteps.length) loaderLabel.textContent = loaderSteps[step];
}, 600);

window.addEventListener('load', () => {
    clearInterval(stepInterval);
    setTimeout(() => { loaderFill.style.width = '100%'; }, 80);
    setTimeout(() => {
        loader.classList.add('out');
        document.body.classList.remove('loading');
    }, 2000);
});

/* =============================================
   CURSOR
============================================= */
const cur     = document.getElementById('cur');
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
const nav       = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const navLinks  = document.getElementById('navLinks');

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
        navBurger?.classList.remove('open');
        navLinks?.classList.remove('open');
    });
});

function updateActiveNav() {
    const ids = ['hero', 'developer', 'experience', 'contact'];
    const y = window.scrollY + 100;
    ids.forEach(id => {
        const sec  = document.getElementById(id);
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
   HERO CANVAS — PARTICLE NETWORK (red theme)
============================================= */
function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles;

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x     = Math.random() * W;
            this.y     = Math.random() * H;
            this.vx    = (Math.random() - .5) * .25;
            this.vy    = (Math.random() - .5) * .25;
            this.r     = Math.random() * 1.2 + .4;
            this.alpha = Math.random() * .35 + .08;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(232,0,26,${this.alpha})`;
            ctx.fill();
        }
    }

    particles = Array.from({ length: 80 }, () => new Particle());

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx*dx + dy*dy);
                if (d < 110) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(232,0,26,${.045 * (1 - d / 110)})`;
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
        const t    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(2, -10 * t);
        el.textContent = t < 1 ? Math.floor(ease * target) : target;
        if (t < 1) requestAnimationFrame(tick);
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
   REVEAL ON SCROLL
============================================= */
const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const siblings = [...e.target.parentElement.querySelectorAll('.reveal')];
            const idx = siblings.indexOf(e.target);
            setTimeout(() => e.target.classList.add('in'), idx * 120);
            revObs.unobserve(e.target);
        }
    });
}, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* =============================================
   TIMELINE SCROLL REVEAL
============================================= */
const tlObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const idx = parseInt(e.target.dataset.index) || 0;
            setTimeout(() => {
                e.target.classList.add('in');
                e.target.classList.add('revealed');
            }, idx * 180);
            tlObs.unobserve(e.target);
        }
    });
}, { threshold: .15, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.tl-item').forEach(el => tlObs.observe(el));

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
    const grid  = document.getElementById('projectsGrid');
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
            ${p.stack?.length ? `
            <div class="proj-stack">
                ${p.stack.map(s => `<span>${s}</span>`).join('')}
            </div>` : ''}
            <div class="proj-links">
                ${p.github ? `<a href="${p.github}" target="_blank" class="pl-btn"><i class="fab fa-github"></i> GitHub</a>` : ''}
                ${p.live   ? `<a href="${p.live}"   target="_blank" class="pl-btn live-btn"><i class="fas fa-arrow-up-right-from-square"></i> Live</a>` : ''}
            </div>`;

        card.querySelector('.proj-delete-btn')?.addEventListener('click', ev => {
            ev.stopPropagation();
            deleteProject(p.id);
        });

        grid.appendChild(card);
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

    // Re-attach cursor listeners
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

document.getElementById('addProjectForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const name     = document.getElementById('pName').value.trim();
    const desc     = document.getElementById('pDesc').value.trim();
    const stackRaw = document.getElementById('pStack').value.trim();
    const github   = document.getElementById('pGithub').value.trim();
    const live     = document.getElementById('pLive').value.trim();
    const status   = document.getElementById('pStatus').value;

    if (!name || !desc) return;

    projects.push({
        id: 'p' + Date.now(),
        name, desc,
        stack: stackRaw ? stackRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
        github, live, status
    });
    saveProjects();
    renderProjects();
    e.target.reset();
});

/* =============================================
   ADMIN AUTH
============================================= */
const loginBackdrop = document.getElementById('loginBackdrop');
const loginForm     = document.getElementById('loginForm');
const loginClose    = document.getElementById('loginClose');
const loginError    = document.getElementById('loginError');
const navAdminBtn   = document.getElementById('navAdminBtn');
const adminIcon     = document.getElementById('adminIcon');
const adminPanel    = document.getElementById('adminPanel');
const apLogout      = document.getElementById('apLogout');

navAdminBtn?.addEventListener('click', () => {
    if (isAdmin) {
        toggleAdminPanel();
    } else {
        loginBackdrop.style.display = 'flex';
        // small delay so display:flex is painted before opacity transition kicks in
        requestAnimationFrame(() => loginBackdrop.classList.add('open'));
        document.body.style.overflow = 'hidden';
    }
});

loginClose?.addEventListener('click', closeLogin);
loginBackdrop?.addEventListener('click', e => {
    if (e.target === loginBackdrop) closeLogin();
});

function closeLogin() {
    loginBackdrop?.classList.remove('open');
    // wait for opacity fade-out before hiding
    setTimeout(() => {
        if (loginBackdrop) loginBackdrop.style.display = 'none';
    }, 320);
    document.body.style.overflow = '';
    loginError?.classList.remove('show');
    loginForm?.reset();
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
    adminPanel?.classList.toggle('visible');
}

apLogout?.addEventListener('click', () => {
    isAdmin = false;
    document.body.classList.remove('admin-mode');
    adminIcon.className = 'fas fa-lock';
    navAdminBtn?.classList.remove('active');
    adminPanel?.classList.remove('visible');
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLogin();
});

/* =============================================
   CONTACT FORM
============================================= */
const contactForm = document.getElementById('contactForm');
const cfOk        = document.getElementById('cfOk');

contactForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = contactForm.querySelector('.cf-submit');
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
   MAGNETIC BUTTONS
============================================= */
function attachMagnetic() {
    document.querySelectorAll('.pl-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r  = btn.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width  / 2)) * .25;
            const dy = (e.clientY - (r.top  + r.height / 2)) * .25;
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

    document.querySelectorAll('.sec-intro-grid, .projects-wrap, .contact-grid, .exp-header, .exp-cta').forEach(el => {
        el.classList.add('reveal');
        revObs.observe(el);
    });
});
