import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GreenSock ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Clean up existing ScrollTriggers to support Vite HMR cleanly
ScrollTrigger.getAll().forEach(t => t.kill())

/* ==========================================================================
   NAVIGATION LOGIC
   ========================================================================== */

// Shrinking sticky header on scroll
const header = document.querySelector('.header')
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled')
  } else {
    header.classList.remove('scrolled')
  }
})

// Scroll progress bar calculation
const scrollProgress = document.getElementById('scroll-progress')
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrolled = (scrollTop / docHeight) * 100
  scrollProgress.style.width = scrolled + '%'
})

// Mobile menu toggle
const mobileToggle = document.querySelector('.mobile-menu-toggle')
const navMenu = document.querySelector('.nav-menu')
const navLinks = document.querySelectorAll('.nav-link')

mobileToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open')
  mobileToggle.classList.toggle('active')
  
  // Animate hamburger bars to close shape
  const bars = mobileToggle.querySelectorAll('.bar')
  if (navMenu.classList.contains('open')) {
    bars[0].style.transform = 'translateY(8px) rotate(45deg)'
    bars[1].style.opacity = '0'
    bars[2].style.transform = 'translateY(-8px) rotate(-45deg)'
  } else {
    bars[0].style.transform = 'none'
    bars[1].style.opacity = '1'
    bars[2].style.transform = 'none'
  }
})

// Close mobile menu when clicking links
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open')
    mobileToggle.classList.remove('active')
    const bars = mobileToggle.querySelectorAll('.bar')
    bars[0].style.transform = 'none'
    bars[1].style.opacity = '1'
    bars[2].style.transform = 'none'
  })
})

// Navigation active link highlighting based on scroll position
const sections = document.querySelectorAll('section, div[id="about"]')
window.addEventListener('scroll', () => {
  let current = ''
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (window.scrollY >= (sectionTop - varHeaderHeight() - 100)) {
      current = section.getAttribute('id')
    }
  })

  navLinks.forEach(link => {
    link.classList.remove('active')
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active')
    }
  })
})

function varHeaderHeight() {
  return window.innerWidth <= 768 ? 70 : 80
}

/* ==========================================================================
   CONTACT FORM HANDLER
   ========================================================================== */
const quoteForm = document.getElementById('quote-form')
const formSuccess = document.getElementById('form-success-msg')

if (quoteForm) {
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // Simulate API request submission
    const submitBtn = quoteForm.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML
    submitBtn.disabled = true
    submitBtn.innerHTML = 'SENDING INQUIRY <i class="fas fa-spinner fa-spin"></i>'
    
    setTimeout(() => {
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
      
      // Hide form and show beautiful success message
      quoteForm.style.display = 'none'
      formSuccess.style.display = 'flex'
      
      // Dynamic details in console
      console.log('Inquiry Sent Successfully from Amol Aluminum website:', {
        name: document.getElementById('full_name').value,
        phone: document.getElementById('phone_number').value,
        email: document.getElementById('email_address').value,
        project: document.getElementById('project_type').value,
        message: document.getElementById('message').value
      })
    }, 1500)
  })
}

/* ==========================================================================
   PREMIUM SCROLL ANIMATIONS (GSAP & SCROLLTRIGGER)
   ========================================================================== */

// 1. Initial Page Load Animation
window.addEventListener('load', () => {
  // Hero Background subtle scale
  gsap.fromTo('.hero-banner', 
    { backgroundPosition: 'center 45%', scale: 1.05 },
    { backgroundPosition: 'center 50%', scale: 1, duration: 1.8, ease: 'power2.out' }
  )
  
  // Hero card text reveals - animates the entire container as a single cohesive unit
  gsap.from('.hero-card', {
    x: -60,
    opacity: 0,
    duration: 2.2, /* Majestic slide-in timing increased to 2.2s for cinematic smooth feel */
    ease: 'power3.out'
  })

  // Force ScrollTrigger to refresh and recalculate all heights after load is complete
  ScrollTrigger.refresh()
})

// 2. Staggered Statistics Counter Animation
gsap.utils.toArray('.stat-number').forEach(stat => {
  const target = parseFloat(stat.getAttribute('data-target'))
  const obj = { val: 0 }
  
  gsap.to(obj, {
    val: target,
    duration: 2.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: stat,
      start: 'top 95%',
      toggleActions: 'play none none none'
    },
    onUpdate: () => {
      stat.textContent = Math.floor(obj.val)
    }
  })
})

// 3. Section Title & Tag Reveals
const titleTriggers = ['.company-profile-section', '.specializations-dark-block', '.specialized-services', '.our-clients', '.recent-projects-block-dark', '.contact-content-grid']
titleTriggers.forEach(trigger => {
  if (document.querySelector(trigger)) {
    const sectionTag = document.querySelector(`${trigger} .section-tag`)
    const sectionTitle = document.querySelector(`${trigger} .section-title`)
    const sectionIntro = document.querySelector(`${trigger} .profile-text, ${trigger} .details-intro, ${trigger} .text-muted`)
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    })
    
    if (sectionTag) tl.from(sectionTag, { opacity: 0, y: 15, duration: 0.4 })
    if (sectionTitle) tl.from(sectionTitle, { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
    if (sectionIntro) tl.from(sectionIntro, { opacity: 0, y: 15, duration: 0.5 }, '-=0.2')
  }
})

// 4. About Us Cards Reveal (Left & Right columns)
gsap.from('.iq-card', {
  scrollTrigger: {
    trigger: '.infrastructure-quality',
    start: 'top 85%'
  },
  opacity: 0,
  y: 30,
  stagger: 0.2,
  duration: 0.8,
  ease: 'power2.out'
})

gsap.from('.pillars-card', {
  scrollTrigger: {
    trigger: '.pillars-card',
    start: 'top 85%'
  },
  opacity: 0,
  x: 50,
  duration: 1,
  ease: 'power2.out'
})

gsap.from('.pillar-item', {
  scrollTrigger: {
    trigger: '.pillars-card',
    start: 'top 80%'
  },
  opacity: 0,
  x: 20,
  stagger: 0.2,
  duration: 0.6,
  ease: 'power2.out'
})

// 5. Specialization Cards Reveal (Dark Block)
gsap.from('.spec-card', {
  scrollTrigger: {
    trigger: '.specializations-dark-block',
    start: 'top 80%'
  },
  opacity: 0,
  y: 40,
  stagger: 0.2,
  duration: 0.8,
  ease: 'power2.out'
})



// 8. Clients Cards Reveal
gsap.from('.client-grid-card', {
  scrollTrigger: {
    trigger: '.clients-interactive-grid',
    start: 'top 85%'
  },
  opacity: 0,
  scale: 0.9,
  stagger: 0.15,
  duration: 0.7,
  ease: 'power2.out'
})

gsap.from('.project-box', {
  scrollTrigger: {
    trigger: '.project-boxes-grid',
    start: 'top 90%'
  },
  opacity: 0,
  y: 30,
  stagger: 0.1,
  duration: 0.7,
  ease: 'power2.out'
})

// 9. Recent Projects Gallery Stagger
gsap.from('.gallery-item', {
  scrollTrigger: {
    trigger: '.portfolio-gallery-grid',
    start: 'top 85%'
  },
  opacity: 0,
  y: 50,
  stagger: 0.2,
  duration: 0.8,
  ease: 'power2.out'
})

// 10. Contact Details & Form Entrance
gsap.from('.details-list li', {
  scrollTrigger: {
    trigger: '.details-list',
    start: 'top 85%'
  },
  opacity: 0,
  x: -30,
  stagger: 0.15,
  duration: 0.7,
  ease: 'power2.out'
})

gsap.from('.quote-form-card', {
  scrollTrigger: {
    trigger: '.quote-form-card',
    start: 'top 85%'
  },
  opacity: 0,
  y: 50,
  duration: 0.9,
  ease: 'power2.out'
})

// 11. Visual Map Entrance Pin
gsap.from('.map-marker-ping', {
  scrollTrigger: {
    trigger: '.styled-map-section',
    start: 'top 75%'
  },
  opacity: 0,
  scale: 0,
  duration: 0.8,
  ease: 'back.out(2)'
})

// 12. Trust Banner Stagger
gsap.from('.trust-icon-box', {
  scrollTrigger: {
    trigger: '.trust-icons-grid',
    start: 'top 90%'
  },
  opacity: 0,
  y: 30,
  stagger: 0.15,
  duration: 0.8,
  ease: 'power2.out'
})

/* ==========================================================================
   FLOATING CONTACT POPUP LOGIC
   ========================================================================== */
const fabBtn = document.getElementById('floating-fab-btn')
const contactCard = document.getElementById('contact-options-card')
const closeCardBtn = document.getElementById('coc-close-btn')
const quoteLink = document.getElementById('coc-quote-link')

if (fabBtn && contactCard) {
  const mainIcon = fabBtn.querySelector('.main-icon')
  const closeIcon = fabBtn.querySelector('.close-icon')
  
  // Toggle popup on FAB click
  fabBtn.addEventListener('click', () => {
    const isVisible = contactCard.style.display === 'block'
    if (isVisible) {
      contactCard.style.display = 'none'
      mainIcon.style.display = 'block'
      closeIcon.style.display = 'none'
    } else {
      contactCard.style.display = 'block'
      mainIcon.style.display = 'none'
      closeIcon.style.display = 'block'
    }
  })
  
  // Close popup on close button click
  if (closeCardBtn) {
    closeCardBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      contactCard.style.display = 'none'
      mainIcon.style.display = 'block'
      closeIcon.style.display = 'none'
    })
  }
  
  // Close popup when clicking the quote option (which scrolls)
  if (quoteLink) {
    quoteLink.addEventListener('click', () => {
      contactCard.style.display = 'none'
      mainIcon.style.display = 'block'
      closeIcon.style.display = 'none'
    })
  }
  
  // Close popup when clicking outside the widget
  document.addEventListener('click', (e) => {
    if (!fabBtn.contains(e.target) && !contactCard.contains(e.target)) {
      contactCard.style.display = 'none'
      mainIcon.style.display = 'block'
      closeIcon.style.display = 'none'
    }
  })
}
// 👇 yahan paste karo (file ke end mein)
const counters = document.querySelectorAll('.stat-number');

counters.forEach(counter => {
  const target = +counter.getAttribute('data-target');
  let count = 0;

  const updateCount = () => {
    const increment = target / 100;

    if (count < target) {
      count += increment;
      counter.innerText = Math.ceil(count);
      setTimeout(updateCount, 20);
    } else {
      counter.innerText = target;
    }
  };

  updateCount();
});