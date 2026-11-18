/* ============================================================
   ANNIVERSARY SITE — Interactive Magic + Background Music
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initLoveLetter();
  initFlipCards();
  initFinalSurprise();
  initNextDestination();
  initCelebrate();
  initHeartsSpawner();
  initBackgroundMusic();
  detectInAppBrowser();
});

/* ---------- 1. COUNTDOWN ---------- */
function initCountdown() {
  const dateEl = document.getElementById('anniversary-date');
  const daysEl = document.getElementById('days');
  if (!daysEl || !dateEl) return;

  // 👇 CHANGE THESE to your real dates
  const ANNIVERSARY = new Date('2026-11-19T00:00:00');
  const START_DATE  = new Date('2023-11-19T00:00:00');

  dateEl.textContent = ANNIVERSARY.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  function update() {
    const now = new Date();
    let diff = ANNIVERSARY - now;
    if (diff < 0) diff = 0;

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    daysEl.textContent = d;
    document.getElementById('hours').textContent = String(h).padStart(2, '0');
    document.getElementById('mins').textContent  = String(m).padStart(2, '0');
    document.getElementById('secs').textContent  = String(s).padStart(2, '0');

    if (diff === 0) {
      const together = Math.floor((now - START_DATE) / 86400000);
      document.querySelector('.countdown').innerHTML =
        `<div style="grid-column: span 4; font-size:1.05rem; padding:1.25rem;">
           💕 <strong>${together.toLocaleString()}</strong> days together and counting
         </div>`;
      clearInterval(timer);
    }
  }
  update();
  const timer = setInterval(update, 1000);
}

/* ---------- 2. LOVE LETTER ---------- */
function initLoveLetter() {
  const btn = document.getElementById('letterBtn');
  const letter = document.getElementById('loveLetter');
  if (!btn || !letter) return;

  btn.addEventListener('click', () => {
    if (letter.hidden) {
      letter.hidden = false;
      btn.textContent = '💌 Close Letter';
      letter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      letter.hidden = true;
      btn.textContent = '💌 Open My Love Letter';
    }
  });
}

/* ---------- 3. FLIP CARDS ---------- */
function initFlipCards() {
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
}

/* ---------- 4. FINAL SURPRISE ---------- */
function initFinalSurprise() {
  const btn = document.getElementById('revealBtn');
  const msg = document.getElementById('finalMessage');
  if (!btn || !msg) return;

  btn.addEventListener('click', () => {
    if (msg.hidden) {
      msg.hidden = false;
      btn.textContent = '💖 Hide Message';
      msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      burstConfetti(40);
    } else {
      msg.hidden = true;
      btn.textContent = '🎁 One Last Surprise…';
    }
  });
}

/* ---------- 5. NEXT DESTINATION (wedding ring reveal) ---------- */
function initNextDestination() {
  const btn = document.getElementById('nextDestBtn');
  const section = document.getElementById('nextDestination');
  if (!btn || !section) return;

  btn.addEventListener('click', () => {
    if (section.hidden) {
      section.hidden = false;
      btn.textContent = '💍 Hide Our Next Destination';
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      burstConfetti(50);
      for (let i = 0; i < 15; i++) {
        setTimeout(() => spawnHeart(), i * 60);
      }
    } else {
      section.hidden = true;
      btn.textContent = '💍 Our Next Destination…';
    }
  });
}

/* ---------- 6. CELEBRATE ---------- */
function initCelebrate() {
  const btn = document.getElementById('celebrateBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    burstConfetti(120);
    for (let i = 0; i < 30; i++) {
      setTimeout(() => spawnHeart(), i * 40);
    }
  });
}

function burstConfetti(count = 80) {
  const colors = ['#ff4d7d', '#ff6f9c', '#ff9ebd', '#ffe4ee', '#e63568', '#fff', '#f5b942'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}

/* ---------- 7. HEART SPAWNER ---------- */
function initHeartsSpawner() {
  setInterval(() => {
    if (Math.random() > 0.6) spawnHeart(true);
  }, 3000);
}

function spawnHeart(gentle = false) {
  const heart = document.createElement('div');
  heart.textContent = ['💕','💖','💗','💓','💞','❤️'][Math.floor(Math.random() * 6)];
  heart.style.cssText = `
    position: fixed;
    bottom: -40px;
    left: ${Math.random() * 100}vw;
    font-size: ${gentle ? '1.2rem' : '1.8rem'};
    pointer-events: none;
    z-index: 50;
    opacity: ${gentle ? 0.6 : 1};
    transition: transform 4s ease-out, opacity 4s ease-out;
  `;
  document.body.appendChild(heart);
  requestAnimationFrame(() => {
    heart.style.transform = `translateY(-100vh) translateX(${(Math.random() - 0.5) * 100}px) rotate(${(Math.random() - 0.5) * 90}deg)`;
    heart.style.opacity = '0';
  });
  setTimeout(() => heart.remove(), 4500);
}

/* ---------- 8. BACKGROUND MUSIC ---------- */
const MUSIC_KEY_POSITION = 'anniv_music_position';
const MUSIC_KEY_PLAYING  = 'anniv_music_playing';

function initBackgroundMusic() {
  const audio  = document.getElementById('bg-music');
  const toggle = document.getElementById('music-toggle');
  if (!audio || !toggle) return;

  const icon = toggle.querySelector('.music-icon');

  const savedPos   = parseFloat(sessionStorage.getItem(MUSIC_KEY_POSITION) || '0');
  const wasPlaying = sessionStorage.getItem(MUSIC_KEY_PLAYING) === 'true';

  audio.volume = 0.45;
  audio.currentTime = savedPos || 0;

  function updateButtonUI(isPlaying) {
    toggle.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    toggle.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
    toggle.setAttribute('title', isPlaying ? 'Pause music' : 'Play music');
    icon.textContent = isPlaying ? '🎵' : '🔇';
  }

  function fadeInPlay() {
    return audio.play()
      .then(() => {
        let vol = 0;
        audio.volume = 0;
        const fade = setInterval(() => {
          vol += 0.03;
          if (vol >= 0.45) {
            audio.volume = 0.45;
            clearInterval(fade);
          } else {
            audio.volume = vol;
          }
        }, 80);
        updateButtonUI(true);
        sessionStorage.setItem(MUSIC_KEY_PLAYING, 'true');
        return true;
      })
      .catch(() => false);
  }

  function pause() {
    audio.pause();
    updateButtonUI(false);
    sessionStorage.setItem(MUSIC_KEY_PLAYING, 'false');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    audio.paused ? fadeInPlay() : pause();
  });

  if (wasPlaying) fadeInPlay();

  // Instant autoplay-on-first-touch
  let started = false;
  function fireOnFirstContact() {
    if (started) return;
    started = true;

    const userMuted = sessionStorage.getItem(MUSIC_KEY_PLAYING) === 'false';
    if (!userMuted) fadeInPlay();

    ['pointerdown','touchstart','mousedown','keydown','scroll','wheel']
      .forEach(evt => {
        document.removeEventListener(evt, fireOnFirstContact, true);
        window.removeEventListener(evt, fireOnFirstContact, true);
      });
  }

  document.addEventListener('pointerdown', fireOnFirstContact, { capture: true });
  document.addEventListener('touchstart',  fireOnFirstContact, { capture: true, passive: true });
  document.addEventListener('mousedown',   fireOnFirstContact, { capture: true });
  document.addEventListener('keydown',     fireOnFirstContact, { capture: true });
  window.addEventListener('scroll',        fireOnFirstContact, { capture: true, passive: true, once: true });
  window.addEventListener('wheel',         fireOnFirstContact, { capture: true, passive: true, once: true });

  // Persist across page changes
  function saveState() {
    sessionStorage.setItem(MUSIC_KEY_POSITION, String(audio.currentTime));
    sessionStorage.setItem(MUSIC_KEY_PLAYING, audio.paused ? 'false' : 'true');
  }
  window.addEventListener('pagehide', saveState);
  window.addEventListener('beforeunload', saveState);
  setInterval(saveState, 2000);

  audio.addEventListener('pause', () => updateButtonUI(false));
  audio.addEventListener('play',  () => updateButtonUI(true));
  updateButtonUI(!audio.paused);
}

/* ---------- 9. IN-APP BROWSER DETECTION ---------- */
function detectInAppBrowser() {
  const ua = navigator.userAgent || '';
  const isInApp =
    /Instagram/i.test(ua) ||
    /FBAN|FBAV|FB_IAB/i.test(ua) ||
    /Messenger/i.test(ua) ||
    /TikTok/i.test(ua) ||
    /Line\//i.test(ua) ||
    /Snapchat/i.test(ua);

  if (isInApp) {
    const banner = document.getElementById('inappBanner');
    if (banner) banner.hidden = false;
  }
}