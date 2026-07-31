/**
 * ============================================================================
 * 16 EDT // MASTER JAVASCRIPT ENGINE & MOBILE UX INFRASTRUCTURE
 * ============================================================================
 */

// ==========================================
// 1. GTM DATA LAYER TRACKING CORE
// ==========================================
window.dataLayer = window.dataLayer || [];

function trackDataLayerEvent(eventName, eventParams = {}) {
  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    screen_resolution: `${window.innerWidth}x${window.innerHeight}`,
    ...eventParams
  };

  window.dataLayer.push(payload);
  console.log(`[DataLayer Event]: ${eventName}`, payload);
}

// ==========================================
// 2. MANDATORY FULLSCREEN COOKIE POPUP MODAL
// ==========================================
function initGlobalCookieModal() {
  if (localStorage.getItem('cookie_consent_accepted')) return;

  // Lock background scrolling while modal is active
  document.body.style.overflow = 'hidden';

  const modal = document.createElement('div');
  modal.id = 'cookie-modal-overlay';
  modal.className = 'fixed inset-0 z-[500] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6';
  modal.innerHTML = `
    <div class="bg-[#121212] border border-[#262626] max-w-md w-full p-6 sm:p-8 rounded-lg shadow-2xl text-center space-y-5 font-sans">
      <div class="inline-flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-widest border border-[#d4af37]/30 bg-[#0a0a0a] px-3 py-1 rounded-full">
        <span class="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
        GTM ACTIVE & COOKIE CONSENT
      </div>
      
      <h3 class="text-2xl font-serif text-[#f5f5f7]">Welcome to 16 EDT</h3>
      
      <p class="text-xs font-mono text-[#86868b] leading-relaxed">
        We utilize functional cookies and Google Tag Manager analytics to deliver a seamless editorial experience, protect digital architecture, and optimize retention pipelines.
      </p>
      
      <div class="pt-2">
        <button id="accept-cookies-btn" class="w-full py-3 bg-[#d4af37] text-black font-mono text-xs uppercase tracking-widest font-bold rounded hover:bg-white transition-colors cursor-pointer shadow-lg">
          Accept & Continue to Site
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('accept-cookies-btn').addEventListener('click', () => {
    localStorage.setItem('cookie_consent_accepted', 'true');
    document.body.style.overflow = '';
    modal.remove();
    
    trackDataLayerEvent('cookie_consent_accepted', {
      consent_type: 'functional_and_analytics',
      gtm_status: 'initialized'
    });
  });
}

// ==========================================
// 3. MOBILE DROPDOWN MENU ENGINE
// ==========================================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuDropdown = document.getElementById('mobile-menu-dropdown');
  const menuIcon = document.getElementById('menu-icon');

  if (menuBtn && menuDropdown) {
    menuBtn.addEventListener('click', () => {
      const isVisible = menuDropdown.style.display === 'block';
      if (!isVisible) {
        menuDropdown.style.display = 'block';
        if (menuIcon) menuIcon.textContent = 'close';
      } else {
        menuDropdown.style.display = 'none';
        if (menuIcon) menuIcon.textContent = 'menu';
      }
    });
  }
}

// ==========================================
// 4. MEDIA SOUND CONTROLLER
// ==========================================
window.toggleMediaSound = function(event) {
  event.stopPropagation();
  const btn = event.currentTarget;
  const card = btn.closest('.video-triptych-card') || btn.closest('.work-card') || btn.closest('.media-container');
  const video = card ? card.querySelector('video') : null;

  if (video) {
    video.muted = !video.muted;
    if (video.paused) {
      video.play().catch(e => console.log('Playback error:', e));
    }
    const icon = btn.querySelector('i');
    if (icon) {
      icon.textContent = video.muted ? 'volume_off' : 'volume_up';
    }
  }
};

// ==========================================
// 5. INTERACTIVE PERSONA PORTAL SWITCHER
// ==========================================
const personaData = {
  hr: {
    badge: "TALENT & RECRUITMENT",
    title: "Are you looking to fill a strategic or creative leadership role?",
    desc: "I bring a hybrid engine: high-fashion editorial execution paired with technical growth architecture (GA4, GTM server-side, Klaviyo workflows). Ready to step into a full-time dynamic team.",
    ctaText: "REQUEST COMPLETE CV & SCHEDULE SCREENING →",
    ctaMail: "mailto:keiantrevorkaweesa@gmail.com?subject=HR Inquiry: Talent Opportunity"
  },
  creative: {
    badge: "CREATIVE DIRECTORS & PRODUCERS",
    title: "Need a vision-aligned co-director, photographer, or onset talent?",
    desc: "From lookbooks to set choreography and camera work. I step onto set prepared with fast composition, moodboard alignment, and disciplined visual rhythm.",
    ctaText: "INITIATE DIRECT CREATIVE BRIEF →",
    ctaMail: "mailto:keiantrevorkaweesa@gmail.com?subject=Creative Brief / Set Collaboration"
  },
  brand: {
    badge: "EDITORIAL BRAND CASTING (LUXURY RETAIL)",
    title: "Seeking modern, editorial modeling or visual brand representation?",
    desc: "Lean physique, controlled soft presence, and natural camera fluidity for luxury streetwear, high-fashion campaigns, and editorial stills.",
    ctaText: "BOOK FOR CAMPAIGN / MODELING COMMISSIONS →",
    ctaMail: "mailto:keiantrevorkaweesa@gmail.com?subject=Brand Modeling & Campaign Inquiry"
  },
  strategy: {
    badge: "GROWTH STRATEGY & AUDITS",
    title: "Looking to map out customer journeys, funnels, and tracking?",
    desc: "I audit existing retention flows, build first-party data capture architectures, and craft custom lifecycle strategies that scale high-ticket retail and hospitality brands.",
    ctaText: "BOOK A STRATEGIC AUDIT & BLUEPRINT →",
    ctaMail: "mailto:keiantrevorkaweesa@gmail.com?subject=Growth Audit & Blueprint Request"
  },
  collab: {
    badge: "CREATIVE PEERS & DESIGN STUDENTS",
    title: "Want to build an experimental project or conceptual series together?",
    desc: "Let's innovate. Whether it's testing new visual media, short film concepts, or experimental direction, I'm always open to high-energy creative syncs.",
    ctaText: "SEND A COLLAB IDEA →",
    ctaMail: "mailto:keiantrevorkaweesa@gmail.com?subject=Creative Collaboration Sync"
  }
};

function switchPersona(roleKey, clickedBtn) {
  const selected = personaData[roleKey];
  if (!selected) return;

  trackDataLayerEvent('persona_switch', {
    persona_role: roleKey,
    persona_badge: selected.badge
  });

  document.querySelectorAll('.persona-btn').forEach(btn => btn.classList.remove('active'));
  if (clickedBtn) clickedBtn.classList.add('active');

  const box = document.getElementById('persona-display');
  if (box) {
    box.style.opacity = '0';
    setTimeout(() => {
      document.getElementById('persona-badge').textContent = selected.badge;
      document.getElementById('persona-title').textContent = selected.title;
      document.getElementById('persona-desc').textContent = selected.desc;

      const cta = document.getElementById('persona-cta');
      if (cta) {
        cta.textContent = selected.ctaText;
        cta.setAttribute('href', selected.ctaMail);
      }
      box.style.opacity = '1';
    }, 180);
  }
}

// ==========================================
// 6. MULTI-SLIDE CAROUSEL & LIGHTBOX ENGINE
// ==========================================
function initSlideshows() {
  const containers = document.querySelectorAll('.media-container');
  containers.forEach((container, cardIndex) => {
    const items = container.querySelectorAll('img, video');
    if (items.length <= 1) {
      container.onclick = (e) => {
        if (e.target.closest('.vid-btn')) return;
        const single = items[0];
        if (single) {
          const type = single.tagName.toLowerCase() === 'video' ? 'video' : 'image';
          openLightboxForElement(single, type, container, cardIndex);
        }
      };
      return;
    }

    container.classList.add('multi-slide');
    let activeIndex = 0;

    items.forEach((item, index) => {
      if (index === 0) item.classList.add('active');
      else item.classList.remove('active');
    });

    const prevBtn = document.createElement('button');
    prevBtn.className = 'slide-nav prev';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.innerHTML = '<i class="material-icons">chevron_left</i>';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'slide-nav next';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.innerHTML = '<i class="material-icons">chevron_right</i>';

    const indicators = document.createElement('div');
    indicators.className = 'slide-indicators';
    items.forEach((_, index) => {
      const dash = document.createElement('span');
      dash.className = `indicator-dash ${index === 0 ? 'active' : ''}`;
      dash.onclick = (e) => {
        e.stopPropagation();
        goToSlide(index);
      };
      indicators.appendChild(dash);
    });

    container.appendChild(prevBtn);
    container.appendChild(nextBtn);
    container.appendChild(indicators);

    function goToSlide(newIndex) {
      items[activeIndex].classList.remove('active');
      indicators.children[activeIndex].classList.remove('active');

      if (items[activeIndex].tagName.toLowerCase() === 'video') {
        items[activeIndex].pause();
      }

      activeIndex = (newIndex + items.length) % items.length;

      items[activeIndex].classList.add('active');
      indicators.children[activeIndex].classList.add('active');

      if (items[activeIndex].tagName.toLowerCase() === 'video') {
        items[activeIndex].play().catch(() => {});
      }
    }

    prevBtn.onclick = (e) => {
      e.stopPropagation();
      goToSlide(activeIndex - 1);
    };

    nextBtn.onclick = (e) => {
      e.stopPropagation();
      goToSlide(activeIndex + 1);
    };

    container.onclick = (e) => {
      if (e.target.closest('.slide-nav') || e.target.closest('.slide-indicators') || e.target.closest('.vid-btn')) {
        return;
      }
      const activeMedia = items[activeIndex];
      const type = activeMedia.tagName.toLowerCase() === 'video' ? 'video' : 'image';
      openLightboxForElement(activeMedia, type, container, cardIndex);
    };
  });
}

function openLightboxForElement(mediaElement, type, container = null, index = 0) {
  const lightbox = document.getElementById('portfolio-lightbox') || document.getElementById('lightbox');
  const wrapper = document.getElementById('lightbox-content-wrapper');
  if (!lightbox) return;

  const cardTitle = container?.closest('.work-card')?.querySelector('h3')?.innerText || `Item ${index + 1}`;
  const cameraTag = container?.querySelector('.camera-tag')?.innerText || 'Unspecified Gear';

  if (wrapper) {
    wrapper.innerHTML = '';
    if (type === 'image') {
      const img = document.createElement('img');
      img.src = mediaElement.src;
      img.className = 'lightbox-content';
      img.alt = mediaElement.alt || 'Zoom View';
      wrapper.appendChild(img);
    } else if (type === 'video') {
      const video = document.createElement('video');
      video.className = 'lightbox-content';
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      const source = document.createElement('source');
      const originalSource = mediaElement.querySelector('source');
      source.src = originalSource ? originalSource.src : mediaElement.src;
      source.type = 'video/mp4';
      video.appendChild(source);
      wrapper.appendChild(video);
    }
  }

  lightbox.classList.add('active');

  trackDataLayerEvent('portfolio_media_expand', {
    media_type: type,
    media_src: mediaElement.src,
    item_title: cardTitle,
    camera_spec: cameraTag,
    item_index: index + 1
  });
}

function closeLightbox() {
  const lightbox = document.getElementById('portfolio-lightbox') || document.getElementById('lightbox');
  const wrapper = document.getElementById('lightbox-content-wrapper');
  if (wrapper) wrapper.innerHTML = '';
  if (lightbox) lightbox.classList.remove('active');

  trackDataLayerEvent('portfolio_media_close');
}

// ==========================================
// 7. MAIN DOM INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

  // Initialize Mandatory Cookie Modal
  initGlobalCookieModal();

  // Initialize Mobile Hamburger Menu
  initMobileMenu();

  // Track Page View
  trackDataLayerEvent('custom_page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname
  });

  // Safari Autoplay Fallback Protocol
  const autoVideos = document.querySelectorAll('video');
  autoVideos.forEach(vid => {
    vid.muted = true;
    vid.playsInline = true;
    vid.loop = true;

    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const startPlay = () => {
          vid.play();
          document.removeEventListener('touchstart', startPlay);
          document.removeEventListener('click', startPlay);
        };
        document.addEventListener('touchstart', startPlay, { once: true });
        document.addEventListener('click', startPlay, { once: true });
      });
    }
  });

  // Initialize Carousels
  initSlideshows();

  // Persona Portal Event Listeners
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.persona-btn');
    if (btn) {
      const roleKey = btn.getAttribute('data-persona');
      switchPersona(roleKey, btn);
    }
  });

  // Lightbox Close Handlers
  const closeBtn = document.querySelector('.lightbox-close');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Right Click & Drag Protection
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
      e.preventDefault();
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  // Automatically highlight active navbar tab based on current URL
  highlightActiveNavLink();

  // Initialize Mandatory Cookie Modal
  initGlobalCookieModal();

  // Initialize Mobile Hamburger Menu
  initMobileMenu();

  // ... rest of your existing JS code ...
});
// ==========================================
// AUTOMATIC NAVBAR ACTIVE TAB HIGHLIGHTER
// ==========================================
function highlightActiveNavLink() {
  // Get current page file name (default to index.html if on root '/')
  let currentPage = window.location.pathname.split('/').pop();
  if (!currentPage || currentPage === '') currentPage = 'index.html';

  const allLinks = document.querySelectorAll('.nav-desktop-links a, #mobile-menu-dropdown a');

  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto')) return;

    // Check if link matches current page
    if (href === currentPage) {
      // Apply Active Gold Styles
      if (link.classList.contains('block')) {
        // Mobile Link Active
        link.className = 'block text-[#d4af37] font-bold py-2 border-b border-[#d4af37]';
      } else {
        // Desktop Link Active
        link.className = 'text-[#d4af37] font-bold border-b border-[#d4af37] pb-1 transition-colors';
      }
    } else {
      // Apply Inactive Gray Styles
      if (link.classList.contains('block')) {
        // Mobile Link Inactive
        link.className = 'block text-[#86868b] hover:text-[#f5f5f7] py-2 border-b border-[#262626]/40 transition-colors';
      } else {
        // Desktop Link Inactive
        link.className = 'text-[#86868b] hover:text-[#f5f5f7] transition-colors';
      }
    }
  });
}