/* ========================================
   LOADER
======================================== */
const loader = document.getElementById('loader');
const loaderProgress = document.getElementById('loader-progress');
const loaderText = document.getElementById('loader-text');

window.addEventListener('load', () => {
    // Animate progress bar
    setTimeout(() => { loaderProgress.style.width = '100%'; }, 100);

    // Reveal text fill effect
    let chars = ['S', 'A', 'N'];
    let fullStr = '';
    chars.forEach((c, i) => {
        setTimeout(() => {
            fullStr += c;
            loaderText.textContent = fullStr;
        }, i * 200);
    });

    // Hide loader
    setTimeout(() => {
        loader.classList.add('done');
        document.body.classList.remove('loading');
    }, 2000);
});
document.body.classList.add('loading');

/* ========================================
   CUSTOM CURSOR
======================================== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && follower) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effects
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            follower.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            follower.classList.remove('hovering');
        });
    });

    // Section color shifts
    const writerSection = document.getElementById('content-writer');
    const devSection = document.getElementById('web-developer');

    function updateCursorColor() {
        const y = mouseY + window.scrollY;
        const writerTop = writerSection?.offsetTop ?? Infinity;
        const writerBottom = writerTop + (writerSection?.offsetHeight ?? 0);
        const devTop = devSection?.offsetTop ?? Infinity;
        const devBottom = devTop + (devSection?.offsetHeight ?? 0);

        cursor.classList.remove('writer', 'dev');
        follower.classList.remove('writer', 'dev');

        if (y >= writerTop && y < writerBottom) {
            cursor.classList.add('writer');
            follower.classList.add('writer');
        } else if (y >= devTop && y < devBottom) {
            cursor.classList.add('dev');
            follower.classList.add('dev');
        }
    }

    document.addEventListener('mousemove', updateCursorColor);
}

/* ========================================
   NAVBAR
======================================== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveNav();
});

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
    });
});

// Active nav link based on scroll
function updateActiveNav() {
    const sections = ['home', 'content-writer', 'web-developer', 'contact'];
    const scrollY = window.scrollY + 120;

    sections.forEach(id => {
        const section = document.getElementById(id);
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (!section || !link) return;

        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

/* ========================================
   SMOOTH SCROLL
======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offset = target.offsetTop - 72;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });
});

/* ========================================
   ANIMATED COUNTER (STATS)
======================================== */
function animateCounter(el, target, duration = 1800) {
    const start = 0;
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out expo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    }
    requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNums = entry.target.querySelectorAll('.stat-n');
            statNums.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ========================================
   SKILL RINGS ANIMATION
======================================== */
const ringObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fg-ring').forEach(ring => {
                ring.classList.add('animated');
            });
            ringObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-visual').forEach(el => ringObserver.observe(el));

/* ========================================
   REVEAL CARDS ON SCROLL
======================================== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger siblings
            const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal-card'));
            const idx = siblings.indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, idx * 120);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-card').forEach(el => revealObserver.observe(el));

/* ========================================
   PDF PREVIEW MODAL — PDF.js canvas renderer
   Works on Vercel/GitHub Pages (no iframe CORS issues)
======================================== */
const pdfModal = document.getElementById('pdfModal');
const pdfCanvas = document.getElementById('pdfCanvas');
const pdfClose = document.getElementById('pdfClose');
const pdfOverlay = document.getElementById('pdfOverlay');
const pdfModalTitle = document.getElementById('pdfModalTitle');
const pdfLoading = document.getElementById('pdfLoading');
const pdfCurrentPage = document.getElementById('pdfCurrentPage');
const pdfTotalPages = document.getElementById('pdfTotalPages');
const pdfPrev = document.getElementById('pdfPrev');
const pdfNext = document.getElementById('pdfNext');

let pdfDoc = null;
let currentPage = 1;
let renderTask = null;

async function renderPage(num) {
    const page = await pdfDoc.getPage(num);
    const wrap = document.getElementById('pdfCanvasWrap');
    const scale = Math.min((wrap.clientWidth - 48) / page.getViewport({ scale: 1 }).width, 1.8);
    const viewport = page.getViewport({ scale });

    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;

    if (renderTask) { renderTask.cancel(); }
    renderTask = page.render({
        canvasContext: pdfCanvas.getContext('2d'),
        viewport
    });

    try {
        await renderTask.promise;
    } catch (e) {
        if (e.name !== 'RenderingCancelledException') throw e;
    }

    pdfCurrentPage.textContent = num;
    pdfPrev.disabled = num <= 1;
    pdfNext.disabled = num >= pdfDoc.numPages;
}

async function openPdf(src, title) {
    pdfModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    pdfModalTitle.textContent = title;
    pdfLoading.classList.remove('hidden');
    pdfCanvas.style.display = 'none';
    currentPage = 1;

    try {
        pdfDoc = await pdfjsLib.getDocument(src).promise;
        pdfTotalPages.textContent = pdfDoc.numPages;
        pdfCanvas.style.display = 'block';
        pdfLoading.classList.add('hidden');
        await renderPage(1);
    } catch (err) {
        pdfLoading.innerHTML = `
            <i class="fas fa-triangle-exclamation" style="font-size:28px;color:var(--accent);margin-bottom:4px"></i>
            <span>Could not load PDF.<br>Make sure the file exists at the correct path in your repo.</span>`;
        console.error('PDF.js error:', err);
    }
}

function closePdfModal() {
    pdfModal.classList.remove('open');
    document.body.style.overflow = '';
    if (renderTask) renderTask.cancel();
    pdfDoc = null;
    const ctx = pdfCanvas.getContext('2d');
    ctx.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
    pdfCanvas.style.display = 'none';
    pdfLoading.classList.remove('hidden');
    pdfLoading.innerHTML = '<div class="pdf-spinner"></div><span>Loading PDF…</span>';
}

document.querySelectorAll('.preview-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-pdf');
        const title = btn.closest('.sample-card').querySelector('.sample-title')?.textContent || 'Preview';
        openPdf(src, title);
    });
});

pdfPrev?.addEventListener('click', async () => {
    if (currentPage > 1) { currentPage--; await renderPage(currentPage); }
});
pdfNext?.addEventListener('click', async () => {
    if (pdfDoc && currentPage < pdfDoc.numPages) { currentPage++; await renderPage(currentPage); }
});
pdfClose?.addEventListener('click', closePdfModal);
pdfOverlay?.addEventListener('click', closePdfModal);
document.addEventListener('keydown', (e) => {
    if (!pdfModal?.classList.contains('open')) return;
    if (e.key === 'Escape') closePdfModal();
    if (e.key === 'ArrowRight' && pdfDoc && currentPage < pdfDoc.numPages) { currentPage++; renderPage(currentPage); }
    if (e.key === 'ArrowLeft' && currentPage > 1) { currentPage--; renderPage(currentPage); }
});

/* ========================================
   CONTACT FORM
======================================== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.submit-btn');
        const originalText = btn.querySelector('.submit-text').textContent;

        btn.querySelector('.submit-text').textContent = 'Sending...';
        btn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                contactForm.reset();
                formSuccess.classList.add('show');
                btn.querySelector('.submit-text').textContent = 'Sent!';
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                    btn.querySelector('.submit-text').textContent = originalText;
                    btn.disabled = false;
                }, 5000);
            } else {
                throw new Error();
            }
        } catch {
            btn.querySelector('.submit-text').textContent = 'Error — try email directly';
            btn.disabled = false;
        }
    });
}

/* ========================================
   PROJECT ROW HOVER — MAGNETIC LINKS
======================================== */
document.querySelectorAll('.proj-link').forEach(link => {
    link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.3;
        const dy = (e.clientY - cy) * 0.3;
        link.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    link.addEventListener('mouseleave', () => {
        link.style.transform = '';
    });
});

/* ========================================
   ORBIT ITEMS — COUNTER ROTATION
   (Keep icons upright as orbit spins)
======================================== */
function setupOrbitCounterRotation() {
    const orbit1 = document.querySelector('.orbit-1');
    const orbit2 = document.querySelector('.orbit-2');

    function tick() {
        if (orbit1) {
            const angle1 = parseFloat(
                (orbit1.style.transform || '').match(/rotate\(([-\d.]+)deg\)/)?.[ 1] || 0
            );
            orbit1.querySelectorAll('.orbit-item').forEach(item => {
                const itemAngle = parseFloat(
                    getComputedStyle(item).getPropertyValue('--angle') || 0
                );
                item.style.transform = `translate(-50%, -50%) rotate(${itemAngle}) translateX(110px) rotate(${-itemAngle})`;
            });
        }
        requestAnimationFrame(tick);
    }
    // Don't need dynamic counter-rotation — CSS handles it with negated angle
    // Just apply it once via the CSS --angle var
}
setupOrbitCounterRotation();

/* ========================================
   PARALLAX — HERO GRID LINES
======================================== */
const gridLines = document.querySelector('.grid-lines');
window.addEventListener('scroll', () => {
    if (!gridLines) return;
    const scrolled = window.scrollY;
    gridLines.style.transform = `translateY(${scrolled * 0.15}px)`;
});
