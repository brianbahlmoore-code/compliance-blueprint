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
   SOC 2 AGENT — Native Demo Panel
   Calls the Railway-hosted backend /api/demo endpoint.
   Update DEMO_API_URL once Railway is deployed.
====================================================== */

// ── Config ────────────────────────────────────────────
const DEMO_API_URL = 'RAILWAY_URL_PLACEHOLDER/api/demo';

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
    // Smooth scroll to panel
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

// ── Main: Run Demo Agent ──────────────────────────────
async function runDemoAgent() {
  if (demoRunning) return;

  const magicBtn = document.getElementById('demoMagicBtn');
  const hint     = document.getElementById('demoHint');
  const log      = document.getElementById('demoChatLog');

  if (!log) return;

  // Check if Railway URL has been configured
  if (DEMO_API_URL.includes('RAILWAY_URL_PLACEHOLDER')) {
    demoAppendMsg('demo-msg demo-msg-agent', `
      <p>⚠️ <strong>Demo not yet configured.</strong></p>
      <p style="margin-top:8px;font-size:13px;color:#787774">
        The backend is being deployed to Railway. Check back soon — or 
        <a href="https://github.com/brianbahlmoore-code/SOC-2-Agent-Analyzer" target="_blank" style="color:#111">clone the repo</a> 
        and run it locally.
      </p>
    `);
    return;
  }

  demoRunning = true;
  if (magicBtn) { magicBtn.disabled = true; magicBtn.innerHTML = '<i class="ph ph-spinner"></i> Analyzing...'; }
  if (hint) hint.textContent = 'Processing 224 pages across 3 reports…';

  const typing = demoShowTyping();

  let reportFilename = null;

  try {
    const resp = await fetch(DEMO_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!resp.ok) throw new Error(`Server error: ${resp.status}`);

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n\n');
      buffer = lines.pop(); // keep incomplete chunk

      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        let event;
        try { event = JSON.parse(line.slice(5).trim()); } catch { continue; }

        demoRemoveTyping();

        switch (event.type) {
          case 'step': {
            const text = (event.text || '').trim();
            const cls = text.includes('✅') ? 'step-success' : text.includes('❌') ? 'step-error' : '';
            demoAppendMsg(`demo-msg demo-msg-step ${cls}`, demoRenderText(text));
            demoShowTyping();
            break;
          }
          case 'found':
          case 'progress':
          case 'msg': {
            const text = (event.text || '').trim();
            if (text) demoAppendMsg('demo-msg demo-msg-step', demoRenderText(text));
            demoShowTyping();
            break;
          }
          case 'done': {
            demoRemoveTyping();
            reportFilename = event.reportFilename || null;

            // Summary text
            if (event.text) {
              demoAppendMsg('demo-msg demo-msg-step step-success', demoRenderText(event.text));
            }

            // Per-company cards
            if (event.summaryData && event.summaryData.length > 0) {
              const wrap = document.createElement('div');
              wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;width:100%';

              event.summaryData.forEach(c => {
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

              const chatLog = document.getElementById('demoChatLog');
              if (chatLog) { chatLog.appendChild(wrap); chatLog.scrollTop = chatLog.scrollHeight; }
            }

            // Open Report button
            if (reportFilename) {
              const baseUrl = DEMO_API_URL.replace('/api/demo', '');
              const openBtn = document.createElement('a');
              openBtn.href = `${baseUrl}/output-file?name=${encodeURIComponent(reportFilename)}`;
              openBtn.target = '_blank';
              openBtn.className = 'demo-open-btn';
              openBtn.innerHTML = '<i class="ph ph-file-text"></i> Open Unified Report';
              const chatLog = document.getElementById('demoChatLog');
              if (chatLog) { chatLog.appendChild(openBtn); chatLog.scrollTop = chatLog.scrollHeight; }
            }

            if (magicBtn) { magicBtn.disabled = false; magicBtn.innerHTML = '<i class="ph ph-sparkle"></i> Run again'; }
            if (hint) hint.textContent = 'Powered by Gemini AI · AICPA 2017 TSC';
            demoRunning = false;
            break;
          }
          case 'error': {
            demoRemoveTyping();
            demoAppendMsg('demo-msg demo-msg-step step-error', demoRenderText(event.text || 'An error occurred.'));
            if (magicBtn) { magicBtn.disabled = false; magicBtn.innerHTML = '<i class="ph ph-sparkle"></i> Try again'; }
            if (hint) hint.textContent = 'Something went wrong — try again.';
            demoRunning = false;
            break;
          }
          case 'end':
            demoRemoveTyping();
            demoRunning = false;
            break;
        }
      }
    }
  } catch (err) {
    demoRemoveTyping();
    demoAppendMsg('demo-msg demo-msg-step step-error', `❌ Connection error: ${err.message}`);
    if (magicBtn) { magicBtn.disabled = false; magicBtn.innerHTML = '<i class="ph ph-sparkle"></i> Try again'; }
    if (hint) hint.textContent = 'Could not connect to demo server.';
    demoRunning = false;
  }
}
