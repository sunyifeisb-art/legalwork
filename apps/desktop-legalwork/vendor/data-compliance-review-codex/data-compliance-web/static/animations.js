/**
 * ComplianceAI Animation System
 * Entrance animations, scroll triggers, micro-interactions, counters
 */
(function () {
  'use strict';

  const doc = document;
  const win = window;

  // ---- Reduced motion check ----
  const prefersReducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // ---- Easing constants ----
  const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

  // ---- Scroll-triggered animations ----
  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Optional: unobserve after first trigger
            // observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    doc.querySelectorAll('.ca-scroll, .ca-scroll-right').forEach((el) => observer.observe(el));

    // Stagger children
    doc.querySelectorAll('.ca-stagger-children').forEach((parent) => {
      const children = parent.querySelectorAll('.ca-scroll, .ca-scroll-right');
      children.forEach((child, i) => {
        child.style.setProperty('--ca-index', String(i));
      });
    });
  }

  // ---- Button ripple effect ----
  function initRipple() {
    doc.querySelectorAll('.ca-btn').forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = doc.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          top: ${y}px;
          left: ${x}px;
          width: 20px;
          height: 20px;
          background: rgba(255,255,255,0.25);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          pointer-events: none;
          animation: ca-ripple 0.5s linear forwards;
        `;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 520);
      });
    });
  }

  // ---- Number counter animation ----
  function animateCounter(el, target, duration = 900) {
    const start = performance.now();
    const startVal = 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
        el.classList.add('ca-pop');
        setTimeout(() => el.classList.remove('ca-pop'), 360);
      }
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            const target = parseInt(entry.target.dataset.counter, 10);
            if (!isNaN(target)) {
              animateCounter(entry.target, target);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    doc.querySelectorAll('.ca-counter').forEach((el) => observer.observe(el));
  }

  // ---- Smooth fold enhancement ----
  // Replaces display:none/block with grid transition for .ca-fold elements
  function initSmoothFolds() {
    doc.querySelectorAll('.fold-toggle').forEach((btn) => {
      const targetId = btn.dataset.target;
      if (!targetId) return;
      const target = doc.getElementById(targetId);
      if (!target) return;

      // Add ca-fold classes if not present
      if (!target.classList.contains('ca-fold')) {
        target.classList.add('ca-fold');
        // Wrap children in a ca-fold-inner container
        if (!target.querySelector('.ca-fold-inner')) {
          const inner = doc.createElement('div');
          inner.className = 'ca-fold-inner';
          while (target.firstChild) {
            inner.appendChild(target.firstChild);
          }
          target.appendChild(inner);
        }
      }

      btn.addEventListener('click', () => {
        const icon = btn.querySelector('.fold-icon');
        const open = target.classList.toggle('open');
        if (icon) {
          icon.style.transform = open ? 'rotate(180deg)' : '';
        }
      });
    });
  }

  // ---- Tab switch animation ----
  function initTabAnimations() {
    doc.querySelectorAll('.pack-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        // Existing active class toggle handled by inline script
        // We enhance by adding transition classes to panels
        const panels = doc.querySelectorAll('.pack-panel');
        panels.forEach((panel) => {
          panel.classList.remove('active');
        });

        const targetPanel = doc.getElementById('panel-' + tab.dataset.tab);
        if (targetPanel) {
          // Small delay to allow display change to happen first
          requestAnimationFrame(() => {
            targetPanel.classList.add('active');
          });
        }
      });
    });
  }

  // ---- Toast enhancement ----
  function enhanceToast() {
    const originalShow = win.showDownloadToast;
    win.showDownloadToast = function (message) {
      const toast = doc.getElementById('downloadToast');
      if (!toast) return;
      toast.classList.remove('hiding');
      toast.textContent = message;
      toast.classList.add('show');

      // Clear any existing timeout
      if (toast._hideTimer) clearTimeout(toast._hideTimer);

      toast._hideTimer = setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => {
          toast.classList.remove('show', 'hiding');
        }, 260);
      }, 4000);
    };
  }

  // ---- Upload zone drag enhancement ----
  function initUploadZone() {
    const zone = doc.querySelector('.upload-zone');
    if (!zone) return;

    ['dragenter', 'dragover'].forEach((evt) => {
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.add('drag-active');
      });
    });

    ['dragleave', 'drop'].forEach((evt) => {
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.remove('drag-active');
      });
    });
  }

  // ---- Page entrance stagger ----
  function initPageEntrance() {
    // ===== Landing page (home-mode) =====
    const homeBoard = doc.querySelector('.home-board');
    if (homeBoard && homeBoard.classList.contains('show')) {
      const kicker = homeBoard.querySelector('.home-kicker');
      const headline = homeBoard.querySelector('.home-headline');
      const english = homeBoard.querySelector('.home-english');
      const quick = homeBoard.querySelector('.home-quick');
      const visual = homeBoard.querySelector('.home-visual');

      if (kicker) kicker.classList.add('ca-entrance', 'ca-d1');
      if (headline) headline.classList.add('ca-entrance', 'ca-d2');
      if (english) english.classList.add('ca-entrance', 'ca-d3');
      if (quick) quick.classList.add('ca-entrance', 'ca-d4');
      if (visual) visual.classList.add('ca-entrance-right', 'ca-d3');
    }

    // Advantage items
    doc.querySelectorAll('.advantage-item').forEach((el, i) => {
      el.classList.add('ca-scroll');
      el.style.transitionDelay = (i * 0.1) + 's';
    });

    // Scenario items
    doc.querySelectorAll('.scenario-item').forEach((el, i) => {
      el.classList.add('ca-scroll');
      el.style.transitionDelay = (i * 0.12) + 's';
    });

    // Scenario metrics
    doc.querySelectorAll('.scenario-metric').forEach((el, i) => {
      el.classList.add('ca-scroll');
      el.style.transitionDelay = (i * 0.08) + 's';
    });

    // Workflow steps
    doc.querySelectorAll('.workflow-step').forEach((el, i) => {
      el.classList.add('ca-scroll');
      el.style.transitionDelay = (i * 0.1) + 's';
    });

    // Open source band
    const openSource = doc.querySelector('.open-source-band');
    if (openSource) openSource.classList.add('ca-scroll');

    // ===== Workbench mode =====
    const workbench = doc.querySelector('#workbenchPanel');
    if (workbench && workbench.style.display !== 'none') {
      const uploadCard = workbench.querySelector('.upload-card');
      if (uploadCard) uploadCard.classList.add('ca-entrance-scale', 'ca-d1');
    }

    // ===== Result page =====
    const overviewGrid = doc.querySelector('.overview-grid');
    if (overviewGrid) {
      overviewGrid.querySelectorAll('.ov-card').forEach((card, i) => {
        card.classList.add('ca-entrance-scale', 'ca-d' + (i + 1));
      });
    }

    // Risk items
    const riskList = doc.querySelector('.risk-list');
    if (riskList) {
      riskList.querySelectorAll('.risk-item').forEach((item, i) => {
        item.classList.add('ca-scroll');
        item.style.transitionDelay = (i * 0.06) + 's';
      });
    }

    // Cluster cards
    const clusterGrid = doc.querySelector('.cluster-grid');
    if (clusterGrid) {
      clusterGrid.querySelectorAll('.cluster-card').forEach((card, i) => {
        card.classList.add('ca-scroll');
        card.style.transitionDelay = (i * 0.08) + 's';
      });
    }

    // Task cards
    const taskList = doc.querySelector('.task-list');
    if (taskList) {
      taskList.querySelectorAll('.task-card').forEach((card, i) => {
        card.classList.add('ca-scroll');
        card.style.transitionDelay = (i * 0.06) + 's';
      });
    }

    // Evidence cards
    const evidenceCards = doc.querySelector('.evidence-cards');
    if (evidenceCards) {
      evidenceCards.querySelectorAll('.ev-card').forEach((card, i) => {
        card.classList.add('ca-scroll');
        card.style.transitionDelay = (i * 0.07) + 's';
      });
    }
  }

  // ---- Initialize everything ----
  function init() {
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', runInit);
    } else {
      runInit();
    }
  }

  function runInit() {
    initPageEntrance();
    initScrollAnimations();
    initRipple();
    initCounters();
    // initSmoothFolds(); // Skip: conflicts with inline JS display toggling
    // initTabAnimations(); // Skip: conflicts with inline JS display toggling
    enhanceToast();
    initUploadZone();
  }

  init();
})();
