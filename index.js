/**
 * ============================================================================
 * ATELIÊ AUTORAL — ALFAIATARIA PERSONALIZADA & ALTA-COSTURA
 * Sistema de Controle da Landing Page & Otimização de Conversão
 * ============================================================================
 */

'use strict';

/**
 * ----------------------------------------------------------------------------
 * 1. CONFIGURAÇÃO CENTRALIZADA DO NEGÓCIO
 * Edite os dados abaixo para personalizar o número do WhatsApp, nome da marca,
 * redes sociais e textos de atendimento sem precisar mexer no HTML ou CSS.
 * ----------------------------------------------------------------------------
 */
const ATELIER_CONFIG = {
  // Nome da profissional ou ateliê
  brandName: "Ateliê Autoral",

  // Título e especialidade da profissional
  specialistTitle: "Alfaiataria Feminina & Peças Sob Medida",

  // Número comercial de WhatsApp (formato internacional: DDI + DDD + Número, sem símbolos)
  // Exemplo para São Paulo: "5511999999999"
  phoneInternational: "5511999999999",

  // Cidade e área de atendimento
  cityState: "São Paulo, SP • Atendimento com Hora Marcada",

  // Redes sociais oficiais
  instagramHandle: "@atelieautoral",
  instagramUrl: "https://instagram.com",

  // Mensagens contextuais pré-definidas para cada ponto de conversão
  messages: {
    hero: "Olá! Conheci seu trabalho de alfaiataria personalizada e gostaria de criar uma peça inspirada em uma referência que tenho. Como funciona o atendimento e o orçamento?",
    process: "Olá! Gostaria de entender como funciona a criação sob medida a partir de uma foto de inspiração que tenho.",
    galleryGeneral: "Olá! Vi as inspirações da galeria no site e gostaria de conversar sobre a criação de um modelo personalizado.",
    specialist: "Olá! Gostaria de conversar diretamente com a especialista sobre a confecção de uma peça de alfaiataria sob medida.",
    finalCta: "Olá! Escolhi uma foto de referência de um look que quero desenvolver sob medida. Gostaria de enviar a foto e conversar sobre o orçamento.",
    floating: "Olá! Gostaria de tirar algumas dúvidas sobre a confecção de peças sob medida a partir de referências.",
    mobileDrawer: "Olá! Gostaria de agendar um atendimento ou solicitar um orçamento sob medida para uma peça inspirada em uma foto.",
    faq: "Olá! Li as dúvidas frequentes no site e gostaria de saber mais sobre a confecção sob medida para o meu modelo."
  },

  // Configurações de Rastreamento (GA4, GTM, Meta Pixel)
  tracking: {
    enabled: true,
    logToConsole: true // Mude para false em produção se preferir silenciar o console
  }
};

/**
 * ----------------------------------------------------------------------------
 * 2. RASTREAMENTO DE EVENTOS (GTM, GA4, META PIXEL)
 * Integração preparada de forma segura sem dependências externas obrigatórias.
 * ----------------------------------------------------------------------------
 */
function trackEvent(eventName, eventParams = {}) {
  if (!ATELIER_CONFIG.tracking.enabled) return;

  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...eventParams
  };

  if (ATELIER_CONFIG.tracking.logToConsole) {
    console.info(`[Analytics Event] ${eventName}:`, payload);
  }

  // Google Tag Manager / GA4 via dataLayer
  if (window.dataLayer && Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }

  // Google Analytics gtag direto
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }

  // Meta Pixel (Facebook)
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, eventParams);
  }
}

/**
 * ----------------------------------------------------------------------------
 * 3. GERADOR DE LINK WHATSAPP
 * ----------------------------------------------------------------------------
 */
function getWhatsAppUrl(customMessage) {
  const phone = ATELIER_CONFIG.phoneInternational.replace(/\D/g, '');
  const message = encodeURIComponent(customMessage || ATELIER_CONFIG.messages.hero);
  return `https://wa.me/${phone}?text=${message}`;
}

/**
 * ----------------------------------------------------------------------------
 * 4. INICIALIZAÇÃO DA INTERFACE & BINDINGS
 * ----------------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {

  // A. Injetar dados configuráveis no DOM
  injectConfigurableData();

  // B. Configurar todos os botões de WhatsApp com suas mensagens contextuais
  setupWhatsAppLinks();

  // C. Configurar navegação, cabeçalho sticky e menu mobile
  setupNavigation();

  // D. Configurar galeria de inspirações e filtro por categoria
  setupGalleryFilters();

  // E. Configurar lightbox para ampliação de imagens da galeria
  setupLightbox();

  // F. Configurar acordeão de Perguntas Frequentes (FAQ)
  setupFaqAccordion();

  // G. Configurar observador de scroll para animações e visualização de seções
  setupScrollObservers();

  // H. Configurar botão flutuante de WhatsApp
  setupFloatingButton();

  // I. Atualizar ano no rodapé
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

/**
 * Injeta as variáveis de ATELIER_CONFIG nos elementos com [data-config]
 */
function injectConfigurableData() {
  document.querySelectorAll('[data-config]').forEach(element => {
    const key = element.getAttribute('data-config');
    if (ATELIER_CONFIG[key]) {
      element.textContent = ATELIER_CONFIG[key];
    }
  });

  document.querySelectorAll('.js-instagram-link').forEach(link => {
    link.href = ATELIER_CONFIG.instagramUrl;
    link.textContent = ATELIER_CONFIG.instagramHandle;
  });
}

/**
 * Associa links dinâmicos do WhatsApp a todos os botões com .js-whatsapp-link
 */
function setupWhatsAppLinks() {
  document.querySelectorAll('.js-whatsapp-link').forEach(link => {
    const source = link.getAttribute('data-whatsapp-source') || 'general';
    let message = ATELIER_CONFIG.messages.hero;

    switch (source) {
      case 'header':
      case 'hero':
        message = ATELIER_CONFIG.messages.hero;
        break;
      case 'process':
        message = ATELIER_CONFIG.messages.process;
        break;
      case 'gallery-general':
        message = ATELIER_CONFIG.messages.galleryGeneral;
        break;
      case 'specialist':
        message = ATELIER_CONFIG.messages.specialist;
        break;
      case 'final-cta':
        message = ATELIER_CONFIG.messages.finalCta;
        break;
      case 'floating':
        message = ATELIER_CONFIG.messages.floating;
        break;
      case 'mobile-drawer':
        message = ATELIER_CONFIG.messages.mobileDrawer;
        break;
      default:
        if (source.startsWith('gallery-')) {
          const itemTitle = link.closest('.gallery-card')?.querySelector('.gallery-card-title')?.textContent || 'referência';
          message = `Olá! Vi o modelo "${itemTitle}" na galeria do site e gostaria de saber sobre a possibilidade de criar uma peça sob medida inspirada nele.`;
        } else {
          message = ATELIER_CONFIG.messages.hero;
        }
        break;
    }

    link.href = getWhatsAppUrl(message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    link.addEventListener('click', (e) => {
      trackEvent('whatsapp_click', {
        cta_source: source,
        message_sent: message,
        target_phone: ATELIER_CONFIG.phoneInternational
      });
    });
  });
}

/**
 * Navegação, Header com blur no scroll e Menu Mobile
 */
function setupNavigation() {
  const header = document.getElementById('siteHeader');
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('mobileCloseBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');
  const mobileLinks = document.querySelectorAll('.js-mobile-link');

  // Sticky header com redução sutil ao rolar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  function openDrawer() {
    drawer?.classList.add('open');
    backdrop?.classList.add('open');
    drawer?.setAttribute('aria-hidden', 'false');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer?.classList.remove('open');
    backdrop?.classList.remove('open');
    drawer?.setAttribute('aria-hidden', 'true');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Fecha menu mobile com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * Filtros interativos da galeria
 */
function setupGalleryFilters() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const cards = document.querySelectorAll('.gallery-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });

      trackEvent('gallery_filter', {
        selected_category: filter
      });
    });
  });
}

/**
 * Modal Lightbox para ampliação de imagens da galeria
 */
function setupLightbox() {
  const modal = document.getElementById('lightboxModal');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const imgEl = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl = document.getElementById('lightboxDesc');
  const whatsappBtn = document.getElementById('lightboxWhatsappBtn');
  const zoomBtns = document.querySelectorAll('.js-gallery-zoom');

  function openLightbox(imgSrc, title, desc) {
    if (!modal) return;
    imgEl.src = imgSrc;
    imgEl.alt = title;
    titleEl.textContent = title;
    descEl.textContent = desc;

    // Atualiza link de WhatsApp contextual para este item
    const customMessage = `Olá! Me interessei pelo modelo "${title}" da galeria do ateliê e gostaria de conversar sobre a criação de uma peça personalizada inspirada nele.`;
    whatsappBtn.href = getWhatsAppUrl(customMessage);
    whatsappBtn.target = "_blank";
    whatsappBtn.rel = "noopener noreferrer";

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    trackEvent('gallery_item_zoom', {
      item_title: title,
      image_src: imgSrc
    });
  }

  function closeLightbox() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  zoomBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = btn.getAttribute('data-image');
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      openLightbox(imgSrc, title, desc);
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/**
 * Acordeão Interativo e Acessível para Quebra de Objeções (FAQ)
 */
function setupFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Fecha todos os outros itens para um comportamento editorial limpo
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');

        trackEvent('faq_toggle', {
          question: trigger.querySelector('span')?.textContent?.trim() || 'unknown'
        });
      }
    });
  });
}

/**
 * Scroll Observers:
 * - Revelação suave com fade-in ao entrar no viewport
 * - Rastreamento de visualização de seções para CRO
 */
function setupScrollObservers() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in-up').forEach(el => el.classList.add('in-view'));
    return;
  }

  // Fade in animation observer
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  });

  document.querySelectorAll('.fade-in-up').forEach(el => {
    fadeObserver.observe(el);
  });

  // Section view analytics observer
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        trackEvent('section_view', {
          section_id: sectionId
        });
      }
    });
  }, {
    threshold: 0.4
  });

  document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
  });
}

/**
 * Botão flutuante de WhatsApp: aparece discretamente após o usuário rolar
 */
function setupFloatingButton() {
  const floatingBtn = document.getElementById('floatingWhatsappBtn');
  if (!floatingBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      floatingBtn.classList.add('visible');
    } else {
      floatingBtn.classList.remove('visible');
    }
  }, { passive: true });
}
