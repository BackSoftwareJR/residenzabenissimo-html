/**
 * Casa Famiglia Quercia - Hero Section JavaScript
 * Funzionalità:
 * 1. Caricamento video in base al dispositivo (desktop/mobile)
 * 2. CTA button sticky su mobile
 * 3. Gestione preferenze reduced motion
 */

document.addEventListener('DOMContentLoaded', function() {
    // Riferimenti elementi DOM
    const heroVideo = document.getElementById('heroVideo');
    const ctaButton = document.querySelector('.cta-button');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const servicesSection = document.querySelector('.services-section');
    // Hero background slideshow elements
    const heroSlides = document.querySelectorAll('.hero-slide');
    let heroSlideIndex = 0;
    let heroSlideTimer;
    
    // Il CTA mobile è stato rimosso su richiesta
    
    // 1. Gestione caricamento video con FCP ottimizzato
    function loadAppropriateVideo() {
        // Controllo se il browser supporta la media query prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Se l'utente preferisce reduced motion, non carichiamo il video
        if (prefersReducedMotion) {
            // Il CSS si occuperà di mostrare l'immagine fallback
            if (heroVideo) heroVideo.style.display = 'none';
            return;
        }
        
        // Determina se il dispositivo è mobile (< 768px) o desktop
        const isMobile = window.innerWidth < 768;
        
        // Prima mostra un'immagine di sfondo per migliorare il FCP
        const heroContainer = document.querySelector('.hero-video-container');
        if (heroContainer) {
            // Mostra subito un'immagine statica come sfondo
            const fallbackImage = isMobile ? 'images/foto casa/img1.webp' : 'images/foto casa/img2.webp';
            heroContainer.style.backgroundImage = `url("${fallbackImage}")`;
            heroContainer.style.backgroundSize = 'cover';
            heroContainer.style.backgroundPosition = 'center';
        }
        
        // Controlla se il video è già stato configurato correttamente
        const existingSource = heroVideo.querySelector('source');
        const correctSrc = isMobile ? 'videos/hero-mobile.mp4' : 'videos/hero-desktop.mp4';
        
        // Se il source esiste già ed è quello giusto, non facciamo nulla
        if (existingSource && existingSource.src.endsWith(correctSrc)) {
            return; // Evita il ricaricamento del video se è già configurato
        }
        
        // Carica il video in modo asincrono con un breve ritardo
        setTimeout(() => {
            const videoSource = document.createElement('source');
            
            // Imposta il percorso del video in base al dispositivo
            videoSource.src = correctSrc;
            videoSource.type = 'video/mp4';
            
            // Svuota eventuali source esistenti e aggiungi quella appropriata
            while (heroVideo.firstChild) {
                heroVideo.removeChild(heroVideo.firstChild);
            }
            
            heroVideo.appendChild(videoSource);
            
            // Assicura che il video sia in autoplay, mute e loop
            heroVideo.autoplay = true;
            heroVideo.muted = true;
            heroVideo.loop = true;
            heroVideo.playsInline = true; // Importante per iOS
            heroVideo.setAttribute('playsinline', ''); // Supporto extra per iOS
            
            // Imposta il poster per evitare flash di schermo grigio
            heroVideo.poster = fallbackImage;
            
            // Quando il video inizia a riprodursi, nascondi lo sfondo statico
            heroVideo.addEventListener('playing', () => {
                // Mostra il video e rimuovi lo sfondo statico
                heroVideo.style.opacity = '1';
                if (heroContainer) heroContainer.style.backgroundImage = 'none';
            }, { once: true });
            
            // Avvia la riproduzione del video
            heroVideo.play().catch(err => {
                console.log('Auto-play fallito:', err);
                // Mantieni l'immagine fallback se l'autoplay fallisce
                if (heroVideo) heroVideo.style.display = 'none';
            });
        }, 100); // Breve ritardo per dare priorità al caricamento degli elementi essenziali
    }
    
    // 2. Gestione CTA sticky su mobile
    function handleStickyButton() {
        if (!ctaButton) return; // Safety check
        
        window.addEventListener('scroll', () => {
            if (window.innerWidth < 768) {
                const scrollPosition = window.scrollY;
                const servicesOffset = servicesSection ? servicesSection.offsetTop : 0;
                
                ctaButton.classList.toggle('sticky', scrollPosition > servicesOffset);
            }
        });
    }
    
    // Esegui funzioni all'avvio se gli elementi esistono
    if (heroVideo) loadAppropriateVideo();
    if (ctaButton) handleStickyButton();
    // Avvia slideshow hero se presente
    if (heroSlides && heroSlides.length > 0) {
        // Set initial active slide
        heroSlides.forEach(s => s.classList.remove('is-active'));
        heroSlides[0].classList.add('is-active');
        heroSlideIndex = 0;
        // Autoplay every 6s
        heroSlideTimer = setInterval(() => {
            const current = heroSlides[heroSlideIndex];
            current.classList.remove('is-active');
            heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
            heroSlides[heroSlideIndex].classList.add('is-active');
        }, 6000);
    }
    
    // Gestione resize della finestra
    window.addEventListener('resize', function() {
        if (heroVideo) loadAppropriateVideo(); // Ricarica il video appropriato
        if (ctaButton) handleStickyButton(); // Aggiorna stato sticky button
    });
    
    // Gestione cambio preferenze reduced motion 
    if (heroVideo) {
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', loadAppropriateVideo);
    }
    
    // La sezione FAQ è stata rimossa

    // 4. Gestione Lightbox per Galleria Fotografica
    if (galleryItems.length > 0) {
        let currentIndex = 0;
        let galleryImages = [];

        // Popola l'array di immagini dalla galleria
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img) {
                galleryImages.push({
                    src: img.src,
                    alt: img.alt
                });
                
                // Aggiungi l'evento click su ogni immagine della galleria
                item.addEventListener('click', function() {
                    openLightbox(index);
                });
            }
        });

        // Funzione per aprire il lightbox
        function openLightbox(index) {
            currentIndex = index;
            updateLightboxContent();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Blocca lo scroll della pagina
        }

        // Funzione per chiudere il lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Ripristina lo scroll della pagina
            setTimeout(() => {
                if (lightboxImage) lightboxImage.src = '';
            }, 300);
        }

        // Funzione per aggiornare i contenuti del lightbox
        function updateLightboxContent() {
            if (!galleryImages[currentIndex]) return;
            
            const image = galleryImages[currentIndex];
            if (lightboxImage) lightboxImage.src = image.src;
            if (lightboxCaption) lightboxCaption.textContent = image.alt;
            
            // Mostra/nascondi i controlli in base alla posizione
            if (lightboxPrev) lightboxPrev.style.display = currentIndex > 0 ? 'flex' : 'none';
            if (lightboxNext) lightboxNext.style.display = currentIndex < galleryImages.length - 1 ? 'flex' : 'none';
        }

        // Funzione per mostrare l'immagine precedente
        function showPrevImage() {
            if (currentIndex > 0) {
                currentIndex--;
                updateLightboxContent();
            }
        }

        // Funzione per mostrare l'immagine successiva
        function showNextImage() {
            if (currentIndex < galleryImages.length - 1) {
                currentIndex++;
                updateLightboxContent();
            }
        }

        // Eventi per i controlli del lightbox
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
        if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

        // Chiudi il lightbox quando si clicca fuori dall'immagine
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }

        // Gestione navigazione da tastiera
        document.addEventListener('keydown', function(e) {
            if (!lightbox || !lightbox.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Gestione tema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }

    // Gestione tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Gestione sidebar
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainHeader = document.getElementById('mainHeader');

    if (menuToggle && sidebar && mainHeader) {
        // Toggle della sidebar
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = sidebar.classList.toggle('open');
            mainHeader.classList.toggle('sidebar-open');
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Chiudi sidebar quando si clicca fuori
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#sidebar') && !e.target.closest('#menuToggle')) {
                sidebar.classList.remove('open');
                mainHeader.classList.remove('sidebar-open');
            }
        });

        // Gestisci i click dentro la sidebar
        sidebar.addEventListener('click', (e) => {
            // Se è un link, chiudi la sidebar
            if (e.target.tagName === 'A') {
                sidebar.classList.remove('open');
                mainHeader.classList.remove('sidebar-open');
            }
            e.stopPropagation();
        });
    }
});