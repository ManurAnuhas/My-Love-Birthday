document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const polaroids = document.querySelectorAll('.page-content img');
    const srcArray = Array.from(polaroids).map(img => img.src);
    for (let i = srcArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [srcArray[i], srcArray[j]] = [srcArray[j], srcArray[i]];
    }
    polaroids.forEach((img, i) => {
        img.src = srcArray[i];
    });

    // Initialize PageFlip Book
    const albumBook = document.getElementById('albumBook');
    if (albumBook && typeof St !== 'undefined') {
        const winW = window.innerWidth;
        const isMobile = winW < 768;

        // Dynamic sizing for better mobile experience
        let bookW = 450;
        let bookH = 550;

        if (winW < 480) {
            bookW = winW * 0.92;
            bookH = bookW * 1.3; // Maintain aspect ratio
        } else if (isMobile) {
            bookW = 380;
            bookH = 480;
        }

        const pageFlip = new St.PageFlip(albumBook, {
            width: bookW,
            height: bookH,
            size: "stretch",
            minWidth: 280,
            maxWidth: 550,
            minHeight: 350,
            maxHeight: 750,
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: true
        });

        pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        const btnPrev = document.getElementById('book-prev');
        const btnNext = document.getElementById('book-next');

        if (btnPrev) btnPrev.addEventListener('click', () => pageFlip.flipPrev());
        if (btnNext) btnNext.addEventListener('click', () => pageFlip.flipNext());
    }

    // Init Hero Decorations
    initHeroDecorations();
});

// Hero Decorations Generator
function initHeroDecorations() {
    const container = document.getElementById('hero-decorations');
    if (!container) return;

    const items = ['🎈', '🎁', '✨', '💖', '⭐', '🌸', '🍭'];
    const count = window.innerWidth < 768 ? 8 : 15;
    const colors = ['#ff3366', '#ff85a2', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0'];

    for (let i = 0; i < count; i++) {
        const item = document.createElement('div');
        item.classList.add('decoration-item');
        item.innerHTML = items[i % items.length];

        const top = Math.random() * 85;
        const left = Math.random() * 95;
        const size = Math.random() * 1.5 + 1.5;
        const delay = Math.random() * 5;
        const duration = Math.random() * 4 + 6;
        const color = colors[Math.floor(Math.random() * colors.length)];

        item.style.top = `${top}%`;
        item.style.left = `${left}%`;
        item.style.fontSize = `${size}rem`;
        item.style.animationDelay = `${delay}s`;
        item.style.animationDuration = `${duration}s`;
        if (item.innerHTML === '✨' || item.innerHTML === '⭐') {
            item.style.color = color;
            item.style.textShadow = `0 0 10px ${color}`;
        }

        container.appendChild(item);
    }
}

// Scroll offset function
function scrollToMemories() {
    document.getElementById('memories').scrollIntoView({ behavior: 'smooth' });
}

// Reveal elements on scroll
const revealElements = document.querySelectorAll('.reveal, .reveal-flip');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Fire confetti only once when message section appears
            if (entry.target.classList.contains('glass-card') && !entry.target.dataset.confettiFired) {
                fireConfetti();
                entry.target.dataset.confettiFired = true;
            }
        }
    });
};

const revealOptions = {
    threshold: 0.15,
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Floating hearts generator
const particlesContainer = document.getElementById('particles');

function createHeart() {
    if (!particlesContainer) return;
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';

    // Random position and size
    const left = Math.random() * 100;
    const size = Math.random() * 20 + 10;
    const duration = Math.random() * 5 + 5;

    heart.style.left = `${left}vw`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;

    particlesContainer.appendChild(heart);

    // Remove after animation completes
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

setInterval(createHeart, 500);

// Init initial hearts
for (let i = 0; i < 15; i++) {
    setTimeout(createHeart, Math.random() * 2000);
}

// Confetti effect
function fireConfetti() {
    if (typeof confetti !== 'function') return;
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}


// Music toggle & Autoplay via Overlay
let isPlaying = false;
const bgm = document.getElementById('bgm');
if (bgm) bgm.volume = 0.3; // Reducing volume to 30%
const doorOverlay = document.getElementById('door-overlay');
const openBtn = document.getElementById('giftClickArea');

// Prevent scrolling while overlay is visible
document.body.style.overflow = 'hidden';

function openSurprise() {
    const giftWrapper = document.getElementById('gift-wrapper');
    const countdownDisplay = document.getElementById('countdown-display');

    // Hide gift, show countdown
    if (giftWrapper) giftWrapper.style.display = 'none';
    if (countdownDisplay) countdownDisplay.style.display = 'block';

    let count = 5;
    countdownDisplay.innerText = count;

    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countdownDisplay.innerText = count;
        } else {
            clearInterval(timer);
            // Hide countdown container
            if (countdownDisplay) countdownDisplay.style.display = 'none';
            revealFinalContent();
        }
    }, 1000);

    // Start music early to set the mood
    if (bgm && !isPlaying) {
        bgm.play().then(() => {
            isPlaying = true;
        }).catch(e => console.log(e));
    }
}

function revealFinalContent() {
    // Hide overlay
    doorOverlay.classList.add('hidden');

    // Trigger cinematic entrance
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.classList.add('entrance-zoom');

    // Burst rose petals
    for (let i = 0; i < 60; i++) {
        setTimeout(createPetal, i * 20);
    }

    // Restore scrolling
    document.body.style.overflow = 'auto';

    // Remove it from DOM completely after animation
    setTimeout(() => {
        if (doorOverlay) doorOverlay.style.display = 'none';

        // Fire initial confetti when first entering the site
        fireConfetti();
    }, 1000);
}

if (openBtn) {
    openBtn.addEventListener('click', openSurprise);
}



// --- Tree Timeline Replaces Heart Collage ---
// The heart grid animation has been removed to support the vertical scrolling tree.

// --- Firefly System ---
function createFirefly() {
    const container = document.getElementById('firefly-container');
    if (!container) return;
    const firefly = document.createElement('div');
    firefly.classList.add('firefly');

    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 10 + 10;
    const driftX = (Math.random() - 0.5) * 200;

    firefly.style.left = Math.random() * 100 + 'vw';
    firefly.style.width = size + 'px';
    firefly.style.height = size + 'px';
    firefly.style.setProperty('--drift-x', driftX + 'px');
    firefly.style.animationDuration = duration + 's, 2s';

    container.appendChild(firefly);
    setTimeout(() => firefly.remove(), duration * 1000);
}
setInterval(createFirefly, 1000);

// --- Typewriter Effect ---
const messageLines = [
    "On Your Special Day, I wish you all the best things in the world. You came into my life and made everything more beautiful, and because of you I smile more and feel truly happy every day.",
    "",
    "I’m really sorry for the mistakes I’ve made, and I promise I won’t hurt you like that again. I just want you to stay this happy forever, because you mean so much to me, more than words can explain.",
    "",
    "Wishing my darling a wonderful and amazing year ahead. I will always love you ❤️✨"
];

let hasTyped = false;

async function typeWriter() {
    if (hasTyped) return;
    hasTyped = true;
    const container = document.getElementById('typewriter-msg');
    if (!container) return;

    for (let line of messageLines) {
        const lineEl = document.createElement('div');
        // If line is empty, it's a paragraph break - make it a full line height
        if (line === "") {
            lineEl.style.height = "1.5rem";
        } else {
            lineEl.style.marginBottom = "0.5rem";
        }
        container.appendChild(lineEl);

        for (let i = 0; i < line.length; i++) {
            lineEl.innerHTML += line.charAt(i);
            await new Promise(r => setTimeout(r, 40));
        }
        await new Promise(r => setTimeout(r, 300));
    }

    // Show signature after typing is done
    const signature = document.querySelector('.signature');
    if (signature) {
        signature.classList.add('active');
    }
}

// Update the reveal observer to trigger typewriter
const msgObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        // Longer delay to ensure user has stopped scrolling and settled on the section
        setTimeout(() => {
            typeWriter();
        }, 1200);
        msgObserver.disconnect();
    }
}, {
    // Use a tighter threshold and look at the whole message section
    threshold: 0.6,
    // rootMargin ensures it's well within the viewport from the bottom
    rootMargin: "0px 0px -10% 0px"
});

const messageSection = document.getElementById('message');
if (messageSection) msgObserver.observe(messageSection);

// --- Photo Heart Burst ---
function createBurstHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.classList.add('burst-heart');

    const tx = (Math.random() - 0.5) * 200;
    const ty = (Math.random() - 1) * 200;
    const tr = Math.random() * 360;

    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.setProperty('--tx', tx + 'px');
    heart.style.setProperty('--ty', ty + 'px');
    heart.style.setProperty('--tr', tr + 'deg');

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
}

document.querySelectorAll('.page-content img').forEach(item => {
    item.addEventListener('click', (e) => {
        // Prevent event bubbling if necessary
        for (let i = 0; i < 8; i++) {
            createBurstHeart(e.clientX, e.clientY);
        }
    });
});

// --- Final Surprise ---
const surpriseBtn = document.getElementById('surpriseBtn');
const hiddenMsg = document.getElementById('hidden-love-msg');

if (surpriseBtn) {
    surpriseBtn.addEventListener('click', () => {
        surpriseBtn.style.display = 'none';
        hiddenMsg.classList.add('active');

        // Massive celebratory confetti
        const end = Date.now() + (5 * 1000);
        const colors = ['#ff3366', '#ffffff', '#ff85a2', '#ffeb3b'];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Heart emoji explosion in the center
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                createBurstHeart(window.innerWidth / 2, window.innerHeight / 2);
            }, i * 80);
        }

        // Reveal the Secret Gift Section after a delay
        setTimeout(() => {
            const giftSection = document.getElementById('gift-section');
            if (giftSection) {
                giftSection.style.display = 'block';
                giftSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 6000);
    });
}

// --- Secret Gift Order Logic ---
const placeOrderBtn = document.getElementById('placeOrderBtn');
const giftShopView = document.getElementById('gift-shop-view');
const checkoutView = document.getElementById('checkout-view');
const orderConfirmedView = document.getElementById('order-confirmed-view');

// Typing simulation function
async function typeFill(elementId, value) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.add('filling');
    el.value = "";
    for (let i = 0; i < value.length; i++) {
        el.value += value.charAt(i);
        await new Promise(r => setTimeout(r, 50));
    }
    el.classList.remove('filling');
    await new Promise(r => setTimeout(r, 400));
}

if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', async () => {
        // Switch to checkout view
        if (giftShopView && checkoutView) {
            giftShopView.style.display = 'none';
            checkoutView.style.display = 'block';
            checkoutView.scrollIntoView({ behavior: 'smooth' });
        }

        // Start Auto-fill Sequence
        const statusText = document.getElementById('status-text');
        const progressFill = document.getElementById('progress-fill');
        const processingStatus = document.getElementById('processing-status');

        await new Promise(r => setTimeout(r, 800));

        statusText.innerText = "Filling Recipient Details...";
        await typeFill('checkout-name', "My Beautiful Rabbit 🐰");
        progressFill.style.width = "30%";

        statusText.innerText = "Setting Delivery Location...";
        await typeFill('checkout-address', "Deepest Corner of My Heart ❤️");
        progressFill.style.width = "60%";

        statusText.innerText = "Verifying Contact Info...";
        await typeFill('checkout-contact', "+94 (LOVE) INFINITY");
        progressFill.style.width = "85%";

        // Final Processing
        statusText.innerText = "Securing Order with Love...";
        processingStatus.style.display = 'block';

        let progress = 85;
        const interval = setInterval(() => {
            progress += 1;
            progressFill.style.width = progress + "%";
            if (progress >= 100) {
                clearInterval(interval);
                // Details loaded, show the confirm button
                setTimeout(() => {
                    const confirmOrderBtn = document.getElementById('confirmOrderBtn');
                    if (confirmOrderBtn) {
                        statusText.innerText = "Order Ready! Please confirm below. ❤️";
                        confirmOrderBtn.style.setProperty('display', 'block', 'important');
                        confirmOrderBtn.scrollIntoView({ behavior: 'smooth' });

                        // Handler for final confirmation
                        confirmOrderBtn.style.setProperty('display', 'block', 'important');
                        confirmOrderBtn.disabled = true; // Disabled initially
                        confirmOrderBtn.style.opacity = "0.5";
                        confirmOrderBtn.innerText = "Please Enter Your Email... ❤️";
                        confirmOrderBtn.scrollIntoView({ behavior: 'smooth' });

                        const emailInput = document.getElementById('checkout-email');

                        // Check email validity in real-time
                        emailInput.addEventListener('input', () => {
                            if (emailInput.checkValidity() && emailInput.value.length > 5) {
                                confirmOrderBtn.disabled = false;
                                confirmOrderBtn.style.opacity = "1";
                                confirmOrderBtn.innerText = "Confirm Order & Receive Wish ❤️";
                                emailInput.style.borderColor = "#4caf50";
                            } else {
                                confirmOrderBtn.disabled = true;
                                confirmOrderBtn.style.opacity = "0.5";
                                confirmOrderBtn.innerText = "Please Enter Your Email... ❤️";
                                emailInput.style.borderColor = "#ff3366";
                            }
                        });

                        // Handler for final confirmation
                        confirmOrderBtn.onclick = async () => {
                            if (confirmOrderBtn.disabled) return;

                            // Show processing again for real email sending
                            confirmOrderBtn.disabled = true;
                            confirmOrderBtn.innerText = "Sending your wish to your inbox... ✨";

                            const recipientEmail = emailInput.value;
                            const recipientName = document.getElementById('checkout-name').value || "Princess";

                            try {
                                // SEND THE REAL EMAIL
                                await sendRealEmail(recipientEmail, recipientName);
                                console.log("Email successfully sent to:", recipientEmail);
                            } catch (error) {
                                console.error("Email sending failed:", error);
                                // Show a visible warning if sending fails
                                alert("Email sending failed! Error: " + (error.text || error.message || "Unknown error") + "\n\nPlease check your EmailJS settings.");
                            }

                            if (checkoutView && orderConfirmedView) {
                                checkoutView.style.display = 'none';
                                orderConfirmedView.style.display = 'block';
                                fireConfetti();
                                orderConfirmedView.scrollIntoView({ behavior: 'smooth' });
                            }
                        };
                    }
                }, 800);
            }
        }, 50);
    });
}

// --- Cinematic Entrance Systems ---

// Rose Petals
function createPetal() {
    const container = document.getElementById('petal-container');
    if (!container) return;
    const petal = document.createElement('div');
    petal.classList.add('petal');

    const size = Math.random() * 15 + 10;
    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 4;
    const delay = Math.random() * 2;

    petal.style.left = left + 'vw';
    petal.style.width = size + 'px';
    petal.style.height = (size * 0.8) + 'px';
    petal.style.animationDuration = duration + 's';
    petal.style.animationDelay = delay + 's';

    container.appendChild(petal);
    setTimeout(() => petal.remove(), (duration + delay) * 1000);
}

// Sparkle Cursor
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.1) return; // Limit sparkle count
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
});

// Also support touch for sparkle
document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    sparkle.style.left = touch.clientX + 'px';
    sparkle.style.top = touch.clientY + 'px';
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
});

// (Heart timeline observer removed)

// --- EmailJS Integration Activated ---
(function () {
    emailjs.init("MBD_Ss2cr6umocbrI");
})();

async function sendRealEmail(email, name) {
    const templateParams = {
        email: email, // Matches {{email}} in Reply-To
        name: name,   // Matches {{name}} in the message
        title: "Happy Birthday My Love! ❤️", // Matches {{title}} in subject
        message: "Wishing you a birthday as beautiful as your heart. May every dream of yours come true, and may our love grow stronger with every passing second. You are my everything! ❤️✨", // Matches {{message}}
        time: new Date().toLocaleString() // Matches {{time}} in the template
    };
    return emailjs.send("service_e8ggzij", "template_79nj90d", templateParams);
}
