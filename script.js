
const toggleButton = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const siteHeader = document.querySelector(".site-header");

// --- Sliding blob indicator (Click to move) ---
if (navMenu) {
    const blob = document.createElement('div');
    blob.className = 'nav-blob';
    navMenu.appendChild(blob);

    const activeLink = navMenu.querySelector('.nav-link.is-active');

    function moveBlob(el) {
        if (!el) { blob.style.opacity = '0'; return; }
        const menuRect = navMenu.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        blob.style.left = (elRect.left - menuRect.left) + 'px';
        blob.style.width = elRect.width + 'px';
        blob.style.top = (elRect.top - menuRect.top) + 'px';
        blob.style.height = elRect.height + 'px';
        blob.style.opacity = '1';
    }

    // Initialize on active link
    if (activeLink) {
        requestAnimationFrame(() => requestAnimationFrame(() => moveBlob(activeLink)));
    }

    window.addEventListener('resize', () => moveBlob(navMenu.querySelector('.nav-link.is-active')));
}

if (toggleButton && navMenu) {
    toggleButton.addEventListener("click", () => {
        const isOpen = document.body.classList.toggle("is-menu-open");
        toggleButton.setAttribute("aria-expanded", String(isOpen));
        if (isOpen && siteHeader) {
            siteHeader.classList.remove("is-hidden");
        }
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            document.body.classList.remove("is-menu-open");
            toggleButton.setAttribute("aria-expanded", "false");
        });
    });
}

document.querySelectorAll("[data-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
});

const contactForm = document.querySelector("[data-contact-form]");
const formMessage = document.querySelector("[data-form-message]");

if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get("name");

        formMessage.textContent = `Terima kasih, ${name}. Pesanmu sudah terkirim secara demo di halaman ini.`;
        contactForm.reset();
    });
}

const filterButtons = document.querySelectorAll("[data-filter]");
const galleryCards = document.querySelectorAll("[data-category]");

if (filterButtons.length && galleryCards.length) {
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            filterButtons.forEach((item) => item.classList.remove("is-active"));
            button.classList.add("is-active");

            galleryCards.forEach((card) => {
                const match = filter === "all" || card.dataset.category === filter;
                card.classList.toggle("is-hidden", !match);
            });
        });
    });
}

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    revealItems.forEach((item) => observer.observe(item));
}

// ponytail: header scroll style — add hide/show logic here if needed later
if (siteHeader) {
    const updateHeaderStyle = () => {
        siteHeader.classList.toggle("is-scrolled", window.scrollY > 20);
    };

    window.addEventListener("scroll", updateHeaderStyle, { passive: true });
    updateHeaderStyle();
}

// --- Custom Music Player for Spotify ---
const playBtn = document.getElementById('music-play-btn');
const playIcon = document.getElementById('music-play-icon');
const musicPanel = document.querySelector('.hero-music-panel');

if (playBtn && musicPanel) {
    let spotifyController = null;
    let isPlaying = false;

    window.onSpotifyIframeApiReady = (IFrameAPI) => {
        const element = document.getElementById('spotify-player-container');
        const options = {
            uri: 'spotify:track:2gANywSFYF58YFMPdDSAjC',
            width: '100%',
            height: '80'
        };
        const callback = (EmbedController) => {
            spotifyController = EmbedController;

            EmbedController.addListener('playback_update', e => {
                if (e.data.isPaused) {
                    isPlaying = false;
                    musicPanel.classList.add('is-paused');
                    playIcon.classList.remove('fa-pause');
                    playIcon.classList.add('fa-play');
                } else {
                    isPlaying = true;
                    musicPanel.classList.remove('is-paused');
                    playIcon.classList.remove('fa-play');
                    playIcon.classList.add('fa-pause');
                }
            });
        };
        IFrameAPI.createController(element, options, callback);
    };

    // Load Spotify IFrame API
    const tag = document.createElement('script');
    tag.src = "https://open.spotify.com/embed/iframe-api/v1";
    tag.async = true;
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    playBtn.addEventListener('click', () => {
        if (spotifyController) {
            spotifyController.togglePlay();
        } else {
            alert("Memuat lagu dari Spotify... Silakan coba lagi dalam beberapa detik.");
        }
    });
}
