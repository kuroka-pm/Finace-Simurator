// ============================================================
// Finance Simulator - Main App Controller
// ============================================================

const App = (() => {
    const pages = ['landing', 'diagnosis', 'result', 'education', 'quiz', 'brokers'];
    let currentPage = 'landing';
    let userState = {
        diagnosisAnswers: {},
        riskType: null,
        educationCompleted: false,
        quizScore: 0,
        badges: []
    };

    function init() {
        // Show loading screen then dismiss
        setTimeout(() => {
            document.getElementById('loading-screen')?.classList.add('hidden');
            // Start landing animations after loading
            setTimeout(() => {
                startTypewriter();
                animateMoneyDemo();
            }, 300);
        }, 1400);

        createParticles();
        setupNavDots();
        setupButtons();
        // Restore state from sessionStorage if exists
        const saved = sessionStorage.getItem('financeSimState');
        if (saved) {
            try { userState = JSON.parse(saved); } catch (e) { }
        }
    }

    // --- Typewriter Effect ---
    function startTypewriter() {
        const el = document.getElementById('landing-title');
        if (!el) return;
        const texts = [
            'お金、増やしてみない？',
            'あなたの未来を\nシミュレーション！',
            '複利の力、\n体感してみよう 💪'
        ];
        let textIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function tick() {
            const current = texts[textIdx];
            const displayed = current.substring(0, charIdx);
            el.innerHTML = displayed.replace(/\n/g, '<br>') + '<span class="typewriter-cursor"></span>';

            if (!isDeleting && charIdx < current.length) {
                charIdx++;
                setTimeout(tick, 80 + Math.random() * 40);
            } else if (!isDeleting && charIdx === current.length) {
                setTimeout(() => { isDeleting = true; tick(); }, 2500);
            } else if (isDeleting && charIdx > 0) {
                charIdx--;
                setTimeout(tick, 30);
            } else {
                isDeleting = false;
                textIdx = (textIdx + 1) % texts.length;
                setTimeout(tick, 400);
            }
        }
        tick();
    }

    // --- Money Demo Animation ---
    function animateMoneyDemo() {
        const savingEl = document.getElementById('demo-saving');
        const compoundEl = document.getElementById('demo-compound');
        const diffEl = document.getElementById('demo-diff');
        if (!savingEl || !compoundEl || !diffEl) return;

        const saving = 7200000;
        const compound = 12330000;
        const diff = compound - saving;
        const duration = 1500;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            const s = Math.round(saving * eased);
            const c = Math.round(compound * eased);
            const d = Math.round(diff * eased);

            savingEl.textContent = Math.round(s / 10000) + '\u4E07\u5186';
            compoundEl.textContent = Math.round(c / 10000).toLocaleString() + '\u4E07\u5186 \uD83C\uDF89';
            diffEl.textContent = '+' + Math.round(d / 10000) + '\u4E07\u5186';

            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // --- Page Navigation ---
    function navigateTo(pageName, skipAnimation) {
        if (!pages.includes(pageName)) return;

        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });

        const target = document.getElementById(`page-${pageName}`);
        if (target) {
            target.style.display = 'flex';
            // Force reflow for animation
            if (!skipAnimation) {
                target.style.animation = 'none';
                target.offsetHeight;
                target.style.animation = '';
            }
            target.classList.add('active');
        }

        currentPage = pageName;
        updateNavDots();
        saveState();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Nav Dots ---
    function setupNavDots() {
        document.querySelectorAll('.nav-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const page = dot.dataset.page;
                // Only allow navigation to pages user has already visited
                if (canVisitPage(page)) {
                    navigateTo(page);
                }
            });
        });
    }

    function canVisitPage(page) {
        const idx = pages.indexOf(page);
        if (idx <= 1) return true; // Landing & diagnosis always accessible
        if (idx === 2 && userState.riskType !== null) return true;
        if (idx === 3 && userState.riskType !== null) return true;
        if (idx === 4 && userState.riskType !== null) return true;
        if (idx === 5) return true; // Brokers always accessible
        return false;
    }

    function updateNavDots() {
        document.querySelectorAll('.nav-dot').forEach(dot => {
            dot.classList.toggle('active', dot.dataset.page === currentPage);
        });
    }

    // --- Buttons ---
    function setupButtons() {
        document.getElementById('btn-start')?.addEventListener('click', () => {
            navigateTo('diagnosis');
            Diagnosis.start();
        });

        document.getElementById('btn-to-education')?.addEventListener('click', () => {
            navigateTo('education');
            Education.init();
        });

        document.getElementById('btn-to-quiz')?.addEventListener('click', () => {
            navigateTo('quiz');
            Quiz.init();
        });

        document.getElementById('btn-restart')?.addEventListener('click', () => {
            userState = {
                diagnosisAnswers: {},
                riskType: null,
                educationCompleted: false,
                quizScore: 0,
                badges: []
            };
            sessionStorage.removeItem('financeSimState');
            navigateTo('landing');
        });
    }

    // --- Background Particles ---
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        const count = 30;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.background = `rgba(${79 + Math.random() * 60}, ${140 + Math.random() * 60}, 255, ${0.15 + Math.random() * 0.2})`;
            container.appendChild(particle);
        }
    }

    // --- State Management ---
    function saveState() {
        sessionStorage.setItem('financeSimState', JSON.stringify(userState));
    }

    function getState() { return userState; }
    function setState(partial) {
        Object.assign(userState, partial);
        saveState();
    }

    function addBadge(badgeName) {
        if (!userState.badges.includes(badgeName)) {
            userState.badges.push(badgeName);
            saveState();
            showToast(badgeName);
        }
    }

    // --- Toast Notification ---
    function showToast(badgeName) {
        const badge = typeof BADGES !== 'undefined' ? BADGES.find(b => b.name === badgeName) : null;
        const container = document.getElementById('toast-container');
        if (!container || !badge) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon">${badge.icon}</div>
            <div class="toast-content">
                <div class="toast-title">🏅 バッジ獲得！</div>
                <div class="toast-message">「${badge.name}」をアンロックしました</div>
            </div>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // --- Confetti ---
    function fireConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const colors = ['#4f8cff', '#8b5cf6', '#34d399', '#fb923c', '#f472b6', '#fbbf24'];

        for (let i = 0; i < 60; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
            piece.style.animationDelay = `${Math.random() * 0.5}s`;
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.width = `${Math.random() * 8 + 6}px`;
            piece.style.height = `${Math.random() * 8 + 6}px`;
            container.appendChild(piece);
        }

        setTimeout(() => container.remove(), 4000);
    }

    // --- Helpers ---
    function formatCurrency(num) {
        if (num >= 10000) {
            return `${Math.round(num / 10000)}万円`;
        }
        return `${num.toLocaleString()}円`;
    }

    function formatCurrencyExact(num) {
        return `¥${Math.round(num).toLocaleString()}`;
    }

    // --- Count-up Animation ---
    function animateCountUp(element, targetNum, duration, prefix) {
        const startTime = performance.now();
        prefix = prefix || '';

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) * (1 - progress);
            const current = Math.round(targetNum * eased);

            if (targetNum >= 10000) {
                element.textContent = `${prefix}${Math.round(current / 10000)}万円`;
            } else {
                element.textContent = `${prefix}${current.toLocaleString()}円`;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    return { init, navigateTo, getState, setState, addBadge, fireConfetti, formatCurrency, formatCurrencyExact, animateCountUp, pages };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', App.init);
