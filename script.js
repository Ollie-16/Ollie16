// ==========================================================================
// PORTFOLIO LIGHTBOX (Click-to-Expand) SYSTEM
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const closeBtn = document.querySelector('.lightbox-close');
    const mediaContainers = document.querySelectorAll('.media-container');

   function openLightbox(card) {
  // 1. Find the active slide (or fall back to the first image/video)
  const activeMedia = card.querySelector('.media-container img.active, .media-container video.active') 
                   || card.querySelector('.media-container img, .media-container video');

  if (!activeMedia) return;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');

  // 2. Display the exact active image or video inside the Lightbox
  if (activeMedia.tagName.toLowerCase() === 'img') {
    if (lightboxImg) {
      lightboxImg.src = activeMedia.src;
      lightboxImg.classList.remove('hidden');
    }
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.classList.add('hidden');
    }
  } else if (activeMedia.tagName.toLowerCase() === 'video') {
    if (lightboxVideo) {
      const src = activeMedia.querySelector('source')?.src || activeMedia.src;
      lightboxVideo.src = src;
      lightboxVideo.classList.remove('hidden');
      lightboxVideo.play();
    }
    if (lightboxImg) {
      lightboxImg.classList.add('hidden');
    }
  }

  // 3. Reveal Lightbox Modal
  lightbox.classList.remove('hidden');
  lightbox.classList.add('flex');
}

    // Close Lightbox function
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
        lightboxVideo.src = '';
        lightboxVideo.pause();
    };

    // Close on clicking Close Button or clicking outside the media
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});
/**
 * ============================================================================
 * ARCHETYPE ENGINE & DATA LAYER TRACKING SYSTEM
 * ============================================================================
 * Handles both the interactive editorial UI (lightbox, sliders, video controls)
 * and initializes the Google Tag Manager (GTM) dataLayer event pipeline.
 */

// 1. INITIALIZE GOOGLE TAG MANAGER DATA LAYER
window.dataLayer = window.dataLayer || [];

/**
 * Universal helper function to push clean events into GTM dataLayer
 * @param {string} eventName - Name of the custom event (e.g., 'contact_click')
 * @param {Object} eventParams - Contextual metadata associated with the event
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
    
    // Developer console log for real-time testing and debugging
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
            const activeImg = container.querySelector('img');
            const activeVideo = container.querySelector('video');
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

            // Fire DataLayer Event for Direct Lead Generation / Social Clicks
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
                // Fire DataLayer Event for Newsletter Lead Capture
                trackDataLayerEvent('newsletter_lead_submit', {
                    form_id: 'newsletter-form',
                    form_location: 'footer_audit_access',
                    // Note: Email address is passed cleanly to the dataLayer for CRM hashing
                    user_email_provided: true
                });

                // Display a clean confirmation state on the button
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
    // D. SKILLS CONSOLE ("THE BRAIN") INTERACTIVE LOGGING
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
});