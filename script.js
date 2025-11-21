// DOM Elements
const landingPage = document.getElementById('landing-page');
const landingText = document.getElementById('landing-text');
const clickToEnter = document.getElementById('click-to-enter');
const mainContent = document.querySelector('main');
const musicPlayer = document.getElementById('music-player');
const bgMusic = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const volumeSlider = document.getElementById('volume-slider');
const trackName = document.getElementById('track-name');

const typingText = document.getElementById('typing-text');
const projectsGrid = document.getElementById('projects-grid');
const cmdWidget = document.getElementById('cmd-widget');
const cmdInput = document.getElementById('cmd-input');
const cmdOutput = document.getElementById('cmd-output');
const bgCanvas = document.getElementById('bg-canvas');
const ctx = bgCanvas ? bgCanvas.getContext('2d') : null;

// --- Custom Cursor (Inverted Block) ---
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

// Mouse listener moved to Background section for unified tracking

// Hover effects
document.querySelectorAll('a, button, input, textarea, .cmd-header, .music-player').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.transform = 'translate(-50%, -50%) rotate(45deg)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    });
});

// --- Landing Page & Music ---
if (landingPage && landingText && clickToEnter) {
    const landingMsg = "Welcome to my portfolio.";
    let landingIndex = 0;

    function typeLanding() {
        if (landingIndex < landingMsg.length) {
            landingText.textContent += landingMsg.charAt(landingIndex);
            landingIndex++;
            setTimeout(typeLanding, 100);
        } else {
            clickToEnter.classList.remove('hidden');
        }
    }

    // Start typing on load
    window.addEventListener('load', typeLanding);

    // Enter Site
    clickToEnter.addEventListener('click', () => {
        landingPage.classList.add('fade-out');
        if (mainContent) {
            mainContent.classList.remove('hidden-content');
            mainContent.classList.add('visible-content');
        }
        if (musicPlayer) musicPlayer.classList.remove('hidden');

        // Attempt to play music
        if (bgMusic) {
            bgMusic.volume = 0.05;
            bgMusic.play().then(() => {
                if (playPauseBtn) playPauseBtn.textContent = '⏸';
                if (trackName) trackName.textContent = "Loser - Tame Impala";
            }).catch(err => {
                console.log("Autoplay blocked or file missing:", err);
                if (trackName) trackName.textContent = "Music Paused / Missing";
            });
        }

        // Start main typing effect after entry
        setTimeout(type, 1000);
    });
}

// Music Controls
if (playPauseBtn && bgMusic) {
    playPauseBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            playPauseBtn.textContent = '⏸';
            if (trackName) trackName.textContent = "Loser - Tame Impala";
        } else {
            bgMusic.pause();
            playPauseBtn.textContent = '▶';
            if (trackName) trackName.textContent = "Paused";
        }
    });
}

if (volumeSlider && bgMusic) {
    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value;
    });
}

// --- Main Typing Effect ---
if (typingText) {
    const phrases = [
        "Junior Web Developer",
        "Web Enthusiast",
        "Problem Solver",
        "Caffein Addict"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        // Only run if main content is visible
        if (mainContent && !mainContent.classList.contains('visible-content')) return;

        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
}

// --- ASCII Fluid Background (Code Force Field) ---
if (bgCanvas && ctx) {
    const chars = "01";
    const fontSize = 14;
    let columns;
    let drops = [];
    let mouseX = 0;
    let mouseY = 0;

    // Track mouse for canvas interaction
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Update cursor position (existing logic)
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    function resizeCanvas() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
        columns = Math.floor(bgCanvas.width / (fontSize * 2));
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function drawMatrix() {
        // Translucent black background to create trail effect
        // Increased opacity to 0.2 to make trails/scratches fade faster
        ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
        ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

        ctx.fillStyle = '#d600ff'; // Purple text
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));

            // Randomize color slightly for depth
            if (Math.random() > 0.98) ctx.fillStyle = '#fff';
            else ctx.fillStyle = '#d600ff';

            const x = i * fontSize * 2;
            const y = drops[i] * fontSize;

            // Force Field Logic
            const dx = x - mouseX;
            const dy = y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            let drawX = x;

            // Repel radius
            if (dist < 150) {
                const force = (150 - dist) / 150;
                const sign = dx > 0 ? 1 : -1;
                drawX += sign * force * 100; // Push away by up to 100px
            }

            ctx.fillText(text, drawX, y);

            // Reset drop to top randomly or if off screen
            if (drops[i] * fontSize > bgCanvas.height && Math.random() > 0.99) {
                drops[i] = 0;
            }

            drops[i] += 0.5;
        }
        requestAnimationFrame(drawMatrix);
    }

    drawMatrix();
}

// --- GitHub Projects ---
if (projectsGrid) {
    async function fetchProjects() {
        try {
            const response = await fetch('https://api.github.com/users/faustinuuu/repos?sort=updated&per_page=6');
            const data = await response.json();

            projectsGrid.innerHTML = '';

            data.forEach(repo => {
                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available.'}</p>
                    <div class="project-stats">
                        <span>★ ${repo.stargazers_count}</span>
                        <span>⑂ ${repo.forks_count}</span>
                        <span>${repo.language || 'Code'}</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="project-link">View Repository</a>
                `;
                projectsGrid.appendChild(card);
            });
        } catch (error) {
            projectsGrid.innerHTML = '<p class="error">> Error fetching projects. System malfunction.</p>';
            console.error('GitHub API Error:', error);
        }
    }

    fetchProjects();
}

// --- CMD Widget ---
if (cmdWidget && cmdInput && cmdOutput) {
    function toggleCmd() {
        cmdWidget.classList.toggle('closed');
    }

    // Expose toggleCmd to global scope for onclick
    window.toggleCmd = toggleCmd;

    const commands = {
        'help': 'Available commands: help, about, projects, contact, clear, github',
        'about': 'Navigating to About section...',
        'projects': 'Navigating to Projects section...',
        'contact': 'Navigating to Contact section...',
        'clear': 'Clearing terminal...',
        'github': 'Opening GitHub profile...'
    };

    cmdInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = cmdInput.value.trim().toLowerCase();
            const outputLine = document.createElement('p');
            outputLine.innerHTML = `<span class="prompt">user@portfolio:~$</span> ${input}`;
            cmdOutput.appendChild(outputLine);

            if (commands[input]) {
                const responseLine = document.createElement('p');
                responseLine.textContent = `> ${commands[input]}`;
                responseLine.style.color = '#ccc';
                cmdOutput.appendChild(responseLine);
                executeCommand(input);
            } else if (input !== '') {
                const errorLine = document.createElement('p');
                errorLine.textContent = `> Command not found: ${input}`;
                errorLine.style.color = '#ff0033';
                cmdOutput.appendChild(errorLine);
            }

            if (input === 'clear') {
                cmdOutput.innerHTML = '';
            }

            cmdInput.value = '';
            cmdOutput.scrollTop = cmdOutput.scrollHeight;
        }
    });

    function executeCommand(cmd) {
        switch (cmd) {
            case 'about':
                const aboutSec = document.getElementById('about');
                if (aboutSec) aboutSec.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'projects':
                const projSec = document.getElementById('projects');
                if (projSec) projSec.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'contact':
                const contactSec = document.getElementById('contact');
                if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'github':
                window.open('https://github.com/faustinuuu', '_blank');
                break;
        }
    }
}

// --- Contact Form (Discord Webhook) ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Disable button to prevent multiple submissions
        submitBtn.disabled = true;
        submitBtn.textContent = '[ Sending... ]';

        const webhookURL = 'https://discord.com/api/webhooks/1441434266373324872/gprelmolQeO50aeGPIZ8Kpu6wkcULHXkgmeZvgXsIrTXCbb4bKYh2c6uxup906v-wZv9';

        const payload = {
            "content": null,
            "embeds": [
                {
                    "title": email,
                    "description": message,
                    "color": 14024959, // Purple color to match theme
                    "author": {
                        "name": name
                    }
                }
            ],
            "attachments": []
        };

        try {
            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Message sent successfully! I will get back to you shortly.');
                contactForm.reset();
            } else {
                throw new Error('Webhook failed');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again later.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '[ Send Message ]';
        }
    });
}
