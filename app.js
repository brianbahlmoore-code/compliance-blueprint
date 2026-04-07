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
     FAQ Accordion Logic
  ------------------------------------------------------ */
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      trigger.closest('.accordion-item').classList.toggle('active');
    });
  });

  /* -----------------------------------------------------
     Interactive Kanban Logic
  ------------------------------------------------------ */
  const columnsOrder = ['backlog', 'in-progress', 'under-review', 'compliant'];
  
  const kanbanBoard = document.querySelector('.kanban-board');
  if (kanbanBoard) {
    kanbanBoard.addEventListener('click', (e) => {
      const card = e.target.closest('.kanban-card');
      if (!card) return;

      const currentContainer = card.closest('.kanban-cards');
      if (!currentContainer) return;

      const currentStatus = currentContainer.getAttribute('data-status');
      const currentIndex  = columnsOrder.indexOf(currentStatus);
      
      if (currentIndex !== -1 && currentIndex < columnsOrder.length - 1) {
        const nextStatus    = columnsOrder[currentIndex + 1];
        const nextContainer = document.querySelector(`.kanban-cards[data-status="${nextStatus}"]`);
        
        if (nextContainer) {
          card.style.transform = 'scale(0.95)';
          card.style.opacity   = '0.5';
          
          setTimeout(() => {
            nextContainer.appendChild(card);
            card.style.transform = '';
            card.style.opacity   = '1';
            updateKanbanCounts();
          }, 150);
        }
      }
    });
  }

  function updateKanbanCounts() {
    document.querySelectorAll('.kanban-column').forEach(col => {
      const countEl = col.querySelector('.kanban-count');
      const cards   = col.querySelectorAll('.kanban-card');
      if (countEl) countEl.textContent = cards.length;
    });
  }

});
