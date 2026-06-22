/**
 * Residenza Benissimo - Galleria Fotografica
 * Script per gestire la galleria a schermo intero con scorrimento automatico
 * e visualizzazione ottimizzata delle immagini
 */

document.addEventListener('DOMContentLoaded', function() {
    // Riferimenti agli elementi DOM
    const slides = document.querySelectorAll('.gallery-slide');
    const prevButton = document.querySelector('.gallery-prev');
    const nextButton = document.querySelector('.gallery-next');
    const indicators = document.querySelectorAll('.gallery-indicator');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Variabili di stato
    let currentSlide = 0;
    let slideInterval;
    const slideDelay = 5000; // 5 secondi tra ogni slide
    
    // Funzione per mostrare una slide specifica
    function showSlide(index) {
        // Rimuovi la classe active da tutte le slide
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Rimuovi la classe active da tutti gli indicatori
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Aggiungi la classe active alla slide corrente
        slides[index].classList.add('active');
        
        // Aggiungi la classe active all'indicatore corrente
        indicators[index].classList.add('active');
        
        // Aggiorna l'indice della slide corrente
        currentSlide = index;
    }
    
    // Funzione per passare alla slide successiva
    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slides.length) {
            newIndex = 0; // Torna alla prima slide se siamo all'ultima
        }
        showSlide(newIndex);
    }
    
    // Funzione per passare alla slide precedente
    function prevSlide() {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) {
            newIndex = slides.length - 1; // Vai all'ultima slide se siamo alla prima
        }
        showSlide(newIndex);
    }
    
    // Funzione per avviare lo scorrimento automatico
    function startSlideshow() {
        // Ferma eventuali intervalli precedenti
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        
        // Avvia un nuovo intervallo
        slideInterval = setInterval(nextSlide, slideDelay);
    }
    
    // Funzione per fermare lo scorrimento automatico
    function stopSlideshow() {
        clearInterval(slideInterval);
    }
    
    // Ottimizza il caricamento delle immagini
    function preloadNextImage(index) {
        // Precarica l'immagine successiva per un'esperienza più fluida
        const nextIndex = (index + 1) % slides.length;
        const nextImg = slides[nextIndex].querySelector('img');
        if (nextImg && nextImg.getAttribute('src')) {
            const preloadImg = new Image();
            preloadImg.src = nextImg.getAttribute('src');
        }
    }
    
    // Inizializza la galleria
    function initGallery() {
        // Mostra la prima slide
        showSlide(0);
        
        // Avvia lo scorrimento automatico
        startSlideshow();
        
        // Aggiungi event listener ai pulsanti
        if (prevButton) {
            prevButton.addEventListener('click', function(e) {
                e.preventDefault();
                prevSlide();
                // Riavvia lo slideshow dopo l'interazione dell'utente
                startSlideshow();
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function(e) {
                e.preventDefault();
                nextSlide();
                // Riavvia lo slideshow dopo l'interazione dell'utente
                startSlideshow();
            });
        }
        
        // Aggiungi event listener agli indicatori
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function(e) {
                e.preventDefault();
                showSlide(index);
                // Riavvia lo slideshow dopo l'interazione dell'utente
                startSlideshow();
            });
        });
        
        // Pausa lo slideshow quando il mouse è sopra la galleria
        const gallery = document.querySelector('.gallery-fullscreen');
        if (gallery) {
            gallery.addEventListener('mouseenter', stopSlideshow);
            gallery.addEventListener('mouseleave', startSlideshow);
            
            // Gestione touch per dispositivi mobili
            gallery.addEventListener('touchstart', function() {
                stopSlideshow();
            }, {passive: true});
            
            gallery.addEventListener('touchend', function() {
                startSlideshow();
            }, {passive: true});
            
            // Aggiungi event listener per l'apertura del lightbox al click sulle slide
            slides.forEach((slide, index) => {
                slide.addEventListener('click', function(e) {
                    e.preventDefault();
                    openLightbox(index);
                });
            });
        }
        
        // Precarica le prime immagini
        preloadNextImage(0);
    }
    
    // Funzioni per il lightbox
    function openLightbox(index) {
        if (!lightbox || !lightboxImage || !lightboxCaption) return;
        
        // Ferma lo slideshow quando apriamo il lightbox
        stopSlideshow();
        
        // Ottieni i dati dell'immagine
        const img = slides[index].querySelector('img');
        const caption = slides[index].querySelector('.gallery-caption');
        
        if (img) {
            // Imposta l'immagine nel lightbox
            lightboxImage.src = img.src;
            
            // Imposta la didascalia
            if (caption && lightboxCaption) {
                lightboxCaption.textContent = caption.textContent;
            }
            
            // Mostra il lightbox
            lightbox.classList.add('active');
            
            // Blocca lo scroll della pagina
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Avvia la galleria se ci sono slide
    if (slides.length > 0) {
        initGallery();
    }
    
    // Gestione eventi del lightbox
    if (lightbox) {
        // Chiudi lightbox
        const closeBtn = document.querySelector('.lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
                
                // Riavvia lo slideshow dopo la chiusura del lightbox
                startSlideshow();
            });
        }
        
        // Chiudi lightbox cliccando fuori dall'immagine
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
                
                // Riavvia lo slideshow dopo la chiusura del lightbox
                startSlideshow();
            }
        });
        
        // Gestione pulsanti prev/next nel lightbox
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', function(e) {
                e.preventDefault();
                let newIndex = currentSlide - 1;
                if (newIndex < 0) newIndex = slides.length - 1;
                
                // Aggiorna la slide corrente e il lightbox
                showSlide(newIndex);
                openLightbox(newIndex);
            });
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', function(e) {
                e.preventDefault();
                let newIndex = currentSlide + 1;
                if (newIndex >= slides.length) newIndex = 0;
                
                // Aggiorna la slide corrente e il lightbox
                showSlide(newIndex);
                openLightbox(newIndex);
            });
        }
    }
});
