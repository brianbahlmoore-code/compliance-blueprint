// app.js

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------
     SCROLL-DRIVEN VIDEO HERO
  ------------------------------------------------------ */
  const video    = document.getElementById('scrollVideo');
  const track    = document.getElementById('heroTrack');
  const progressBar = document.getElementById('scrollProgressBar');
  const scrollCue   = document.getElementById('scrollCue');

  if (video && track) {

    // Once video metadata is ready we know the duration
    const initScrollVideo = () => {
      // Make sure video is paused — we drive time manually
      video.pause();
      video.currentTime = 0;

      window.addEventListener('scroll', onScroll, { passive: true });
      // Run once on load in case page starts scrolled
      onScroll();
    };

    const onScroll = () => {
      // How far the top of the scroll track is from the viewport top
      const trackTop    = track.getBoundingClientRect().top + window.scrollY;
      // Usable scroll distance = track height minus one viewport height
      const trackHeight = track.offsetHeight - window.innerHeight;
      const scrolled    = window.scrollY - trackTop;

      // progress: 0 (start) → 1 (end)
      const progress = Math.min(Math.max(scrolled / trackHeight, 0), 1);

      // Drive the video
      if (video.duration && isFinite(video.duration)) {
        video.currentTime = progress * video.duration;
      }

      // Update the thin progress bar
      if (progressBar) {
        progressBar.style.width = (progress * 100) + '%';
      }

      // Fade out the scroll cue arrow once user starts scrolling
      if (scrollCue) {
        scrollCue.style.opacity = progress > 0.02 ? '0' : '1';
      }
    };

    // loadedmetadata fires when duration is known
    if (video.readyState >= 1) {
      initScrollVideo();
    } else {
      video.addEventListener('loadedmetadata', initScrollVideo, { once: true });
    }
  }

  /* -----------------------------------------------------
     Hero text reveal (fires immediately on page load)
  ------------------------------------------------------ */
  document.querySelectorAll('.reveal-hero').forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('is-visible');
    }, 100 + i * 120);
  });

  /* -----------------------------------------------------
     Scroll Reveal Animation for page sections (IntersectionObserver)
  ------------------------------------------------------ */
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* -----------------------------------------------------
     Smooth Scroll for Navigation Links
  ------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* -----------------------------------------------------
     FAQ Accordion Logic
  ------------------------------------------------------ */
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      trigger.closest('.accordion-item').classList.toggle('active');
    });
  });

});

/* ======================================================
   SOC 2 AGENT — Pre-Baked Demo (Static Replay)
   No backend needed. Plays back pre-generated results
   with realistic animation delays.
====================================================== */

// ── State ─────────────────────────────────────────────
let demoPanelOpen = false;
let demoRunning = false;

// ── Toggle Panel ──────────────────────────────────────
function toggleDemoPanel() {
  const panel = document.getElementById('demoPanel');
  const btn   = document.getElementById('demoToggleBtn');
  if (!panel) return;

  demoPanelOpen = !demoPanelOpen;
  panel.classList.toggle('demo-panel-open', demoPanelOpen);

  if (btn) btn.textContent = demoPanelOpen ? '✕ Close Demo' : '✨ Try Demo';

  if (demoPanelOpen) {
    setTimeout(() => {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}

// ── Helpers ───────────────────────────────────────────
function demoAppendMsg(cls, html, id) {
  const log = document.getElementById('demoChatLog');
  if (!log) return null;
  const el = document.createElement('div');
  el.className = cls;
  el.innerHTML = html;
  if (id) el.id = id;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}

function demoRenderText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

function demoShowTyping() {
  return demoAppendMsg('demo-typing', '<span></span><span></span><span></span>', 'demoTyping');
}

function demoRemoveTyping() {
  const t = document.getElementById('demoTyping');
  if (t) t.remove();
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Main: Run Pre-Baked Demo ──────────────────────────
async function runDemoAgent() {
  if (demoRunning) return;
  demoRunning = true;

  const magicBtn = document.getElementById('demoMagicBtn');
  const hint     = document.getElementById('demoHint');
  const log      = document.getElementById('demoChatLog');
  if (!log) return;

  if (magicBtn) { magicBtn.disabled = true; magicBtn.innerHTML = '<i class="ph ph-spinner"></i> Analyzing...'; }
  if (hint) hint.textContent = 'Processing 224 pages across 3 reports…';

  try {
    // Load pre-baked demo data
    const resp = await fetch('demo-data.json');
    if (!resp.ok) throw new Error('Could not load demo data');
    const data = await resp.json();

    // Replay each step with realistic delays
    for (const step of data.replaySteps) {
      demoShowTyping();
      await sleep(step.delay);
      demoRemoveTyping();

      const text = step.text.trim();
      const cls = text.includes('✅') ? 'step-success' : text.includes('❌') ? 'step-error' : '';
      demoAppendMsg(`demo-msg demo-msg-step ${cls}`, demoRenderText(text));
    }

    // Show per-company summary cards
    if (data.summaryData && data.summaryData.length > 0) {
      await sleep(500);

      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;width:100%';

      data.summaryData.forEach(c => {
        const isClean = c.opinion && c.opinion.toLowerCase().includes('unqualified');
        const card = document.createElement('div');
        card.className = 'demo-company-card';
        card.innerHTML = `
          <div class="demo-company-card-top">
            <span class="demo-company-name">${c.company}</span>
            <span class="demo-opinion-pill ${isClean ? 'demo-opinion-clean' : 'demo-opinion-qualified'}">${c.opinion}</span>
          </div>
          <div class="demo-company-stats">
            <span>${c.exceptions > 0 ? '🔴' : '🟢'} ${c.exceptions} deviation(s)</span>
            <span>📋 ${c.remediations} remediation plan(s)</span>
            <span>🛡️ ${c.mitigating} mitigating control(s)</span>
          </div>
        `;
        wrap.appendChild(card);
      });

      log.appendChild(wrap);
      log.scrollTop = log.scrollHeight;
    }

    // Open Report button
    if (data.reportFile) {
      await sleep(400);
      const openBtn = document.createElement('a');
      openBtn.href = data.reportFile;
      openBtn.target = '_blank';
      openBtn.className = 'demo-open-btn';
      openBtn.innerHTML = '<i class="ph ph-file-text"></i> Open Unified Report';
      log.appendChild(openBtn);
      log.scrollTop = log.scrollHeight;
    }

    if (magicBtn) { magicBtn.disabled = false; magicBtn.innerHTML = '<i class="ph ph-sparkle"></i> Run again'; }
    if (hint) hint.textContent = 'Powered by Gemini AI · AICPA 2017 TSC';

  } catch (err) {
    demoRemoveTyping();
    demoAppendMsg('demo-msg demo-msg-step step-error', `❌ Error: ${err.message}`);
    if (magicBtn) { magicBtn.disabled = false; magicBtn.innerHTML = '<i class="ph ph-sparkle"></i> Try again'; }
    if (hint) hint.textContent = 'Something went wrong.';
  }

  demoRunning = false;
}

