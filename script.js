function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Initialize sections and navigation
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash || '#profile';
  const targetSection = document.querySelector(hash);
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  updateScrollState();

  // Remove any existing click handlers and add new ones
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    const oldLink = link.cloneNode(true);
    link.parentNode.replaceChild(oldLink, link);
    oldLink.addEventListener('click', handleNavClick, {
      passive: false,
      capture: true
    });
  });

  // Initialize scrolling text
  createScrollingText();

  document.querySelectorAll('.project-item .button').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const projectId = `project${index + 1}`;
      window.location.href = `project-view.html?project=${projectId}`;
    });
  });
});

// Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const handleScroll = debounce(() => {
  updateScrollState();
}, 50);

window.addEventListener('scroll', handleScroll, { passive: true });

// Handle navigation link clicks
function handleNavClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const targetId = this.getAttribute('href').slice(1);
  const targetSection = document.getElementById(targetId);
  if (!targetSection) return;
  
  targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Close hamburger menu if open
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      icon.classList.remove('open');
    }

    // Update navigation visibility based on target section
    if (targetId === 'profile') {
      document.body.classList.add('on-profile');
      document.body.classList.remove('not-on-profile');
    } else {
      document.body.classList.remove('on-profile');
      document.body.classList.add('not-on-profile');
    }
}

// More accurate section detection
function getCurrentSection() {
  const sections = document.querySelectorAll('section');
  const viewportMiddle = window.scrollY + (window.innerHeight / 2);
  const threshold = window.innerHeight * 0.3; // 30% threshold for section change
  
  let currentSection = sections[0];
  
  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const sectionMiddle = window.scrollY + rect.top + (rect.height / 2);
    
    // Check if we're within the threshold of this section
    if (Math.abs(viewportMiddle - sectionMiddle) < threshold) {
      currentSection = section;
      break;
    }
  }
  
  return currentSection.id;
}

// Update scroll state and navigation visibility
function updateScrollState() {
  const currentSection = getCurrentSection();
  
  // Update body class based on current section
  if (currentSection === 'profile') {
    document.body.classList.add('on-profile');
    document.body.classList.remove('not-on-profile');
  } else {
    document.body.classList.remove('on-profile');
    document.body.classList.add('not-on-profile');
  }
}

// Scrolling Text Effect for Projects Section
function createScrollingText() {
  const container = document.querySelector('#bento-grid .title-container');
  if (!container) return;

  // Clear any existing content
  container.innerHTML = '';

  const text = 'MY PROJECTS';
  const copies = 40;

  // Create wrapper for infinite scroll
  const wrapper = document.createElement('div');
  wrapper.className = 'scroll-wrapper';
  
  // Create two identical scrollers for seamless loop
  const scrollerDiv1 = document.createElement('div');
  const scrollerDiv2 = document.createElement('div');
  scrollerDiv1.className = 'scroller';
  scrollerDiv2.className = 'scroller';

  // Fill both scrollers with the same content
  let content = '';
  for (let i = 0; i < copies; i++) {
    content += `<span class="scroll-text">${text}</span>`;
  }
  scrollerDiv1.innerHTML = content;
  scrollerDiv2.innerHTML = content;

  const parallaxDiv = document.createElement('div');
  parallaxDiv.className = 'parallax';
  
  // Add both scrollers to wrapper
  wrapper.appendChild(scrollerDiv1);
  wrapper.appendChild(scrollerDiv2);
  parallaxDiv.appendChild(wrapper);
  container.appendChild(parallaxDiv);

  // Animation variables
  let scrollPos = 0;
  let animationFrameId;
  let scrollWidth = 0;
  let lastTimestamp = 0;
  const pixelsPerSecond = 100; // Adjust speed as needed

  // Get the width of the content
  function updateScrollWidth() {
    scrollWidth = scrollerDiv1.offsetWidth;
    // Position the second scroller right after the first one
    scrollerDiv2.style.transform = `translate3d(${scrollWidth}px, 0, 0)`;
  }

  // Initial width calculation with a slight delay to ensure proper rendering
  setTimeout(updateScrollWidth, 100);
  
  // Update width on resize
  window.addEventListener('resize', updateScrollWidth);

  function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    // Calculate movement based on time passed
    const pixelsToMove = (deltaTime / 1000) * pixelsPerSecond;
    scrollPos += pixelsToMove;

    // Reset position smoothly when first scroller is fully scrolled
    if (scrollPos >= scrollWidth) {
      scrollPos = scrollPos - scrollWidth;
    }

    // Move both scrollers with smooth transitions
    scrollerDiv1.style.transform = `translate3d(-${scrollPos}px, 0, 0)`;
    scrollerDiv2.style.transform = `translate3d(${scrollWidth - scrollPos}px, 0, 0)`;

    animationFrameId = requestAnimationFrame(animate);
  }

  // Start animation
  animationFrameId = requestAnimationFrame(animate);

  // Cleanup function
  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}

// Project Modal Functionality
let currentImageIndex = 0;
const projectData = {
  'project1': {
    title: 'FrogHire.ai',
    images: [
      './assets/project1-1.jpg',
      './assets/project1-2.jpg',
      './assets/project1-3.jpg'
    ]
  },
  'project2': {
    title: 'Aloega',
    images: [
      './assets/project2-1.jpg',
      './assets/project2-2.jpg',
      './assets/project2-3.jpg'
    ]
  },
  'project3': {
    title: 'NAUSICA NYC',
    images: [
      './assets/project3-1.jpg',
      './assets/project3-2.jpg',
      './assets/project3-3.jpg'
    ]
  },
};

function openModal(project) {
  const modal = document.getElementById('project-modal');
  const modalTitle = modal.querySelector('.modal-title');
  const gallery = modal.querySelector('.image-gallery');
  const dots = modal.querySelector('.image-dots');

  // clear old slides & dots
  gallery.innerHTML = '';
  dots.innerHTML = '';

  modalTitle.textContent = project.title;

  project.images.forEach((src, i) => {
    let el;

    if (/\.(mp4|webm)$/i.test(src)) {
      // video
      el = document.createElement('video');
      el.src       = src;
      el.loop      = true;
      el.muted     = true;
      el.autoplay  = true;
      el.playsInline = true;
      el.style.objectFit = 'cover';
      el.style.width     = '100%';
      el.style.height    = '100%';
    }
    else if (/\.pdf$/i.test(src)) {
      // embed PDF
      el = document.createElement('embed');
      el.src            = src;
      el.setAttribute('type', 'application/pdf');
      el.style.width    = '100%';
      el.style.height   = '100%';
      el.style.border   = 'none';
    }
    else {
      // image
      el = document.createElement('img');
      el.src = src;
      el.alt = `${project.title} – slide ${i+1}`;
    }

    el.classList.add('modal-media');
    if (i === 0) el.classList.add('active');
    gallery.appendChild(el);

    // create dot
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showImage(i));
    dots.appendChild(dot);
  });

  // show modal…
  modal.style.display = 'flex';
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  currentImageIndex = 0;
}

function closeModal() {
  const modal = document.getElementById('project-modal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restore scrolling
}

function showImage(idx) {
  const slides = document.querySelectorAll('.modal-media');
  const dots   = document.querySelectorAll('.dot');
  slides[currentImageIndex].classList.remove('active');
  dots  [currentImageIndex].classList.remove('active');
  currentImageIndex = idx;
  if (idx<0)                  currentImageIndex = slides.length-1;
  if (idx>=slides.length)     currentImageIndex = 0;
  slides[currentImageIndex].classList.add('active');
  dots  [currentImageIndex].classList.add('active');
}

function nextImage() {
  showImage(currentImageIndex + 1);
}

function prevImage() {
  showImage(currentImageIndex - 1);
}

// Event Listeners
document.querySelector('.close-modal').addEventListener('click', closeModal);
document.querySelector('.next-btn').addEventListener('click', nextImage);
document.querySelector('.prev-btn').addEventListener('click', prevImage);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('project-modal');
  if (e.target === modal) {
    closeModal();
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (document.getElementById('project-modal').style.display === 'flex') {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  }
});

// Add cleanup for hamburger menu
window.addEventListener('resize', () => {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  if (window.innerWidth > 768) { // Adjust breakpoint as needed
    menu.classList.remove("open");
    icon.classList.remove("open");
  }
});

// create one shared cursor node
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.textContent = 'View Site';
document.body.appendChild(cursor);

// Project URLs mapping
const projectUrls = {
  'project1': 'https://froghire.ai',
  'project2': 'https://aloega.medium.com/',
  'project3': 'https://2023.philemerge.com/a_group5/'
};

// hook every video container
document.querySelectorAll('.image-gallery').forEach(el => {
  el.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursor.style.opacity = 1;
    cursor.classList.add('hover');
  });
  
  el.addEventListener('mouseleave', () => {
    cursor.style.opacity = 0;
    cursor.classList.remove('hover');
  });

  el.addEventListener('click', () => {
    // Get the current active media element
    const activeMedia = el.querySelector('.modal-media.active');
    if (!activeMedia) return;
    
    // Get the modal title
    const modalTitle = document.querySelector('.modal-title');
    if (!modalTitle) return;
    
    // Find the matching project
    const projectId = Object.keys(projectUrls).find(id => 
      projectData[id].title === modalTitle.textContent
    );
    
    if (projectId && projectUrls[projectId]) {
      window.open(projectUrls[projectId], '_blank');
    }
  });
});

// Add cursor movement lag for smooth effect
let cursorX = 0;
let cursorY = 0;
let currentX = 0;
let currentY = 0;

function updateCursor() {
  const easing = 0.15;
  
  currentX += (cursorX - currentX) * easing;
  currentY += (cursorY - currentY) * easing;
  
  cursor.style.left = currentX + 'px';
  cursor.style.top = currentY + 'px';
  
  requestAnimationFrame(updateCursor);
}

document.querySelectorAll('.image-gallery').forEach(el => {
  el.addEventListener('mousemove', e => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursor.style.opacity = 1;
    cursor.classList.add('hover');
  });
});

updateCursor(); // Start the cursor animation loop
