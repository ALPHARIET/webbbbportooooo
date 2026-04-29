
const toggleButton = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const siteHeader = document.querySelector(".site-header");

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

if (siteHeader) {
    let lastScrollY = window.scrollY;

    const showHeader = () => {
        siteHeader.classList.remove("is-hidden");
    };

    const hideHeader = () => {
        if (!document.body.classList.contains("is-menu-open")) {
            siteHeader.classList.add("is-hidden");
        }
    };

    const updateHeaderStyle = () => {
        if (window.scrollY > 12) {
            siteHeader.classList.add("is-scrolled");
        } else {
            siteHeader.classList.remove("is-scrolled");
        }
    };

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;

        updateHeaderStyle();

        if (currentScrollY <= 16) {
            showHeader();
            lastScrollY = currentScrollY;
            return;
        }

        if (delta > 6) {
            hideHeader();
        } else if (delta < -6) {
            showHeader();
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    window.addEventListener("mousemove", (event) => {
        if (event.clientY <= 92) {
            showHeader();
        }
    });

    siteHeader.addEventListener("mouseenter", showHeader);
    window.addEventListener("touchstart", () => {
        if (window.scrollY > 16) {
            showHeader();
        }
    }, { passive: true });

    // Initialize header style on load
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
