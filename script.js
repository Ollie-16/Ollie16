// ============================================================================
// GLOBAL MEDIA SOUND TOGGLE & SAFARI PLAYBACK CONTROLLER
// ============================================================================
window.toggleMediaSound = function(event) {
  event.stopPropagation(); // Prevents lightbox from opening when clicking sound
  const btn = event.currentTarget;
  const card = btn.closest('.video-triptych-card') || btn.closest('.about-portrait-centered') || btn.closest('.work-card');
  const video = card ? card.querySelector('video') : null;

  if (video) {
    video.muted = !video.muted;
    
    // If video was suspended by browser, force play on click
    if (video.paused) {
      video.play().catch(e => console.log('Playback error:', e));
    }

    const icon = btn.querySelector('i');
    if (icon) {
      icon.textContent = video.muted ? 'volume_off' : 'volume_up';
    }
  }
};

// Force all inline videos to loop and play cleanly on page load (Safari Fix)
document.addEventListener('DOMContentLoaded', () => {
  const autoVideos = document.querySelectorAll('video');
  autoVideos.forEach(vid => {
    vid.muted = true;
    vid.playsInline = true;
    vid.loop = true;
    
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback: If Safari suspended autoplay, trigger on first user tap anywhere
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
});
/**
 * ============================================================================
 * ARCHETYPE ENGINE & DATA LAYER TRACKING SYSTEM
 * ============================================================================
 */

// 1. INITIALIZE GOOGLE TAG MANAGER DATA LAYER
window.dataLayer = window.dataLayer || [];

/**
 * Universal helper function to push clean events into GTM dataLayer
 */
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

// 2. DOM INITIALIZATION & INTERACTIVE UI ENGINE
document.addEventListener('DOMContentLoaded', () => {

    // Track Initial Page View Event
    trackDataLayerEvent('custom_page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
    });

    // ------------------------------------------------------------------------
    // A. LIGHTBOX POPUP & MEDIA TRACKING SYSTEM
    // ------------------------------------------------------------------------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const closeBtn = document.querySelector('.lightbox-close');
    const mediaContainers = document.querySelectorAll('.media-container');

    mediaContainers.forEach((container, index) => {
        container.addEventListener('click', () => {
            const activeImg = container.querySelector('img:not(.hidden)');
            const activeVideo = container.querySelector('video:not(.hidden)');
            const cardTitle = container.closest('.work-card')?.querySelector('h3')?.innerText || `Item ${index + 1}`;
            const cameraTag = container.querySelector('.camera-tag')?.innerText || 'Unspecified Gear';

            if (!lightbox) return;

            lightbox.classList.add('active');

            let mediaType = 'image';
            let mediaSrc = '';

            if (activeImg) {
                mediaType = 'image';
                mediaSrc = activeImg.src;
                if (lightboxImg) {
                    lightboxImg.style.display = 'block';
                    lightboxImg.src = mediaSrc;
                }
                if (lightboxVideo) lightboxVideo.style.display = 'none';
            } else if (activeVideo) {
                mediaType = 'video';
                const sourceTag = activeVideo.querySelector('source');
                mediaSrc = sourceTag ? sourceTag.src : activeVideo.src;
                if (lightboxVideo) {
                    lightboxVideo.style.display = 'block';
                    lightboxVideo.src = mediaSrc;
                    lightboxVideo.play().catch(e => console.log('Video play error:', e));
                }
                if (lightboxImg) lightboxImg.style.display = 'none';
            }

            // Fire DataLayer Event for Portfolio Media Engagement
            trackDataLayerEvent('portfolio_media_expand', {
                media_type: mediaType,
                media_src: mediaSrc,
                item_title: cardTitle,
                camera_spec: cameraTag,
                item_index: index + 1
            });
        });
    });

    // Block right-click context menu on images and videos
    document.addEventListener('contextmenu', (e) => {
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
        e.preventDefault();
      }
    });

    // Block drag-and-drop saving
    document.addEventListener('dragstart', (e) => {
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
        e.preventDefault();
      }
    });

    // Lightbox Close Handler
    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        if (lightboxImg) lightboxImg.src = '';
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.src = '';
        }

        trackDataLayerEvent('portfolio_media_close');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ------------------------------------------------------------------------
    // B. SOCIAL DOCK OUTBOUND CLICK TRACKING
    // ------------------------------------------------------------------------
    const socialButtons = document.querySelectorAll('.social-dock .social-btn');

    socialButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const platform = button.classList.contains('whatsapp-btn') ? 'whatsapp' :
                             button.classList.contains('instagram-btn') ? 'instagram' :
                             button.classList.contains('linkedin-btn') ? 'linkedin' :
                             button.classList.contains('email-btn') ? 'email_direct' : 'unknown';

            const destinationUrl = button.getAttribute('href');

            trackDataLayerEvent('contact_channel_click', {
                contact_platform: platform,
                destination_url: destinationUrl,
                click_location: 'social_dock'
            });
        });
    });

    // ------------------------------------------------------------------------
    // C. FORM SUBMISSION & DATA LAYER EVENT CAPTURE
    // ------------------------------------------------------------------------
    const newsletterForm = document.getElementById('newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const emailValue = emailInput ? emailInput.value.trim() : '';

            if (emailValue) {
                trackDataLayerEvent('newsletter_lead_submit', {
                    form_id: 'newsletter-form',
                    form_location: 'footer_audit_access',
                    user_email_provided: true
                });

                const submitButton = newsletterForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    const originalText = submitButton.innerText;
                    submitButton.innerText = 'ACCESS GRANTED ✓';
                    submitButton.style.backgroundColor = '#d4af37';
                    submitButton.style.color = '#000000';

                    setTimeout(() => {
                        submitButton.innerText = originalText;
                        submitButton.style.backgroundColor = '';
                        submitButton.style.color = '';
                        newsletterForm.reset();
                    }, 4000);
                }
            }
        });
    }

    // ------------------------------------------------------------------------
    // D. SKILLS CONSOLE INTERACTIVE LOGGING
    // ------------------------------------------------------------------------
    const skillCategoryElements = document.querySelectorAll('.skill-category');

    skillCategoryElements.forEach((cat) => {
        cat.addEventListener('mouseenter', () => {
            const categoryTitle = cat.querySelector('h3')?.innerText || 'Category';
            
            trackDataLayerEvent('archetype_skill_hover', {
                skill_category: categoryTitle
            });
        });
    });

    // ------------------------------------------------------------------------
    // E. DYNAMIC TOP STATUS COMMAND TICKER
    // ------------------------------------------------------------------------
    const statusPhrases = [
        "AVAILABLE FOR STRATEGY & CREATIVE DIRECTION",
        "BOOK ME: MEDIA PRODUCTIONS, FILM SETS & SHOOTS",
        "CUSTOMER JOURNEY MAPPING // FUNNELS & ANALYTICS",
        "RESERVE A DATE: LET'S BUILD TOGETHER",
        "PHOTOGRAPHY & CINEMATOGRAPHY COMMISSIONS OPEN"
    ];

    let statusIndex = 0;
    const statusEl = document.getElementById('dynamic-status-text');

    if (statusEl) {
        setInterval(() => {
            statusEl.style.opacity = '0';
            setTimeout(() => {
                statusIndex = (statusIndex + 1) % statusPhrases.length;
                statusEl.textContent = statusPhrases[statusIndex];
                statusEl.style.opacity = '1';
            }, 400);
        }, 3500);
    }

    // ------------------------------------------------------------------------
    // F. NATIVE TOUCH SWIPE CONTROLLER FOR MOBILE / TABLETS
    // ------------------------------------------------------------------------
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
            const cardContainer = e.target.closest('.media-container') || e.target.closest('.work-card');
            
            if (cardContainer) {
                const slides = Array.from(cardContainer.querySelectorAll('img, video'));
                if (slides.length <= 1) return;

                let activeIndex = slides.findIndex(s => !s.classList.contains('hidden'));
                if (activeIndex === -1) activeIndex = 0;

                slides[activeIndex].classList.add('hidden');

                if (diffX < 0) {
                    activeIndex = (activeIndex + 1) % slides.length;
                } else {
                    activeIndex = (activeIndex - 1 + slides.length) % slides.length;
                }

                slides[activeIndex].classList.remove('hidden');
            }
        }

        touchStartX = 0;
        touchStartY = 0;
    }, { passive: true });
});
// Universal Sound Toggle Handler
function toggleMediaSound(event) {
  event.stopPropagation(); // Prevents triggering Lightbox on click
  const btn = event.currentTarget;
  const card = btn.closest('.video-triptych-card') || btn.closest('.about-portrait-centered') || btn.closest('.work-card');
  const video = card ? card.querySelector('video') : null;

  if (video) {
    video.muted = !video.muted;
    const icon = btn.querySelector('i');
    if (icon) {
      icon.textContent = video.muted ? 'volume_off' : 'volume_up';
    }
  }
}
// ============================================================================
// INTERACTIVE PERSONA PORTAL SWITCHER
// ============================================================================
window.switchPersona = function(roleKey, clickedBtn) {
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
      badge: "EDITORIAL BRAND CASTING (ZARA / LUXURY RETAIL)",
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

  const selected = personaData[roleKey];
  if (!selected) return;

  // 1. Move active highlight pill to the newly clicked button
  document.querySelectorAll('.persona-btn').forEach(btn => btn.classList.remove('active'));
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  }

  // 2. Smooth fade-out, update text/badge, and fade back in
  const box = document.getElementById('persona-display');
  if (box) {
    box.style.opacity = '0';
    setTimeout(() => {
      document.getElementById('persona-badge').textContent = selected.badge;
      document.getElementById('persona-title').textContent = selected.title;
      document.getElementById('persona-desc').textContent = selected.desc;
      
      const cta = document.getElementById('persona-cta');
      cta.textContent = selected.ctaText;
      cta.setAttribute('href', selected.ctaMail);
      
      box.style.opacity = '1';
    }, 200);
  }
};
// ============================================================================
// GLOBAL PERSONA SWITCHER (Must sit outside DOMContentLoaded)
// ============================================================================
function switchPersona(roleKey, clickedBtn) {
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
      badge: "EDITORIAL BRAND CASTING (ZARA / LUXURY RETAIL)",
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

  const selected = personaData[roleKey];
  if (!selected) return;

  // 1. Move active pill highlight
  document.querySelectorAll('.persona-btn').forEach(btn => btn.classList.remove('active'));
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  }

  // 2. Update display box
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
    }, 200);
  }
}
// ============================================================================
// AUTOMATIC PERSONA PORTAL EVENT LISTENERS
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const personaButtons = document.querySelectorAll('.persona-btn');
  const personaDisplayBox = document.getElementById('persona-display');

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
      badge: "EDITORIAL BRAND CASTING (ZARA / LUXURY RETAIL)",
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

  personaButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const roleKey = button.getAttribute('data-persona');
      const selected = personaData[roleKey];
      if (!selected) return;

      // 1. Highlight the clicked button pill
      personaButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // 2. Smoothly update box content
      if (personaDisplayBox) {
        personaDisplayBox.style.opacity = '0';
        setTimeout(() => {
          document.getElementById('persona-badge').textContent = selected.badge;
          document.getElementById('persona-title').textContent = selected.title;
          document.getElementById('persona-desc').textContent = selected.desc;

          const cta = document.getElementById('persona-cta');
          if (cta) {
            cta.textContent = selected.ctaText;
            cta.setAttribute('href', selected.ctaMail);
          }
          personaDisplayBox.style.opacity = '1';
        }, 180);
      }
    });
  });
});