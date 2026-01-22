function getActiveProject() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    const projects = Array.from(document.querySelectorAll('.project-content'));
    const activeProject = projects.find(project => project.dataset.project === projectId) || projects[0];

    projects.forEach(project => {
        project.classList.toggle('active', project === activeProject);
    });

    if (activeProject) {
        const titleEl = activeProject.querySelector('.project-title');
        if (titleEl) {
            document.title = `${titleEl.textContent} | Project View`;
        }
    }

    return activeProject;
}

function initSectionMedia(scope) {
    const mediaSections = scope.querySelectorAll('.section-media');
    mediaSections.forEach(container => {
        const mediaItems = Array.from(container.children).filter(child =>
            child.matches('img, .video-hover-container')
        );

        if (!mediaItems.length) return;

        let activeIndex = mediaItems.findIndex(item => item.classList.contains('active'));
        if (activeIndex === -1) {
            activeIndex = 0;
            mediaItems[0].classList.add('active');
    }

        if (mediaItems.length > 1) {
    const controls = document.createElement('div');
    controls.className = 'section-media-controls';
    
            mediaItems.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = `section-media-dot${index === activeIndex ? ' active' : ''}`;
                dot.setAttribute('aria-label', `View media ${index + 1}`);
                dot.addEventListener('click', () => showSectionImage(container, index));
        controls.appendChild(dot);
    });
    
            container.appendChild(controls);
    }
    });
}

function showSectionImage(container, index) {
    container.querySelectorAll('video').forEach(video => {
        video.pause();
    });
    
    const mediaElements = container.querySelectorAll('.video-hover-container, img');
    const dots = container.querySelectorAll('.section-media-dot');

    mediaElements.forEach(element => element.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (mediaElements[index]) mediaElements[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
}

function initHoverVideos(scope) {
    const hoverContainers = scope.querySelectorAll('.video-hover-container');
    hoverContainers.forEach(container => {
        const video = container.querySelector('video');
        const hint = container.querySelector('.hover-to-play-hint');
        if (!video) return;

        container.addEventListener('mouseenter', () => {
            video.play().catch(() => {});
            if (hint) hint.style.opacity = '0';
        });

        container.addEventListener('mouseleave', () => {
            video.pause();
            if (hint) hint.style.opacity = '1';
        });
    });
}

function initSectionNav(scope) {
    const navItems = scope.querySelectorAll('.section-nav-item');
    const headerOffset = document.querySelector('#top-nav')?.offsetHeight || 0;

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - headerOffset - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function updateActiveNavItem() {
    const activeProject = document.querySelector('.project-content.active');
    if (!activeProject) return;
    
    const sections = activeProject.querySelectorAll('.project-section');
    const navItems = activeProject.querySelectorAll('.section-nav-item');
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            sections.forEach(s => s.classList.remove('active'));
            navItems.forEach(item => item.classList.remove('active'));
            
            section.classList.add('active');
            if (navItems[index]) navItems[index].classList.add('active');
        }
    });
}

function initDesignGallery(scope) {
    scope.querySelectorAll('.design-gallery-item').forEach(item => {
        const img = item.querySelector('img');
        const titleEl = item.querySelector('.design-title-overlay');
        const title = titleEl ? titleEl.textContent.trim() : (img ? img.alt : '');

        item.addEventListener('click', () => {
            if (img) openImageModal(img.src, title);
        });
    });
}

function openImageModal(src, title) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';
    modal.style.padding = '2rem';

    const modalImg = document.createElement('img');
    modalImg.src = src;
    modalImg.alt = title;
    modalImg.style.maxWidth = '90%';
    modalImg.style.maxHeight = '80vh';
    modalImg.style.objectFit = 'contain';
    modalImg.style.marginBottom = '1rem';

    const modalTitle = document.createElement('h3');
    modalTitle.textContent = title;
    modalTitle.style.color = 'white';
    modalTitle.style.marginTop = '1rem';

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '1rem';
    closeButton.style.right = '1rem';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '2rem';
    closeButton.style.cursor = 'pointer';

    modal.appendChild(modalImg);
    modal.appendChild(modalTitle);
    modal.appendChild(closeButton);
    const closeModal = () => {
        document.body.removeChild(modal);
        document.removeEventListener('keydown', handleKeyDown);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    document.addEventListener('keydown', handleKeyDown);

    document.body.appendChild(modal);
} 

document.addEventListener('DOMContentLoaded', () => {
    const activeProject = getActiveProject();
    if (!activeProject) return;

    initSectionMedia(activeProject);
    initHoverVideos(activeProject);
    initSectionNav(activeProject);
    initDesignGallery(activeProject);

    setTimeout(updateActiveNavItem, 100);
    window.addEventListener('scroll', updateActiveNavItem);

    const backBtn = document.querySelector('.back-to-top');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});