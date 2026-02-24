// ============================================================
// Finance Simulator - Main App Controller
// ============================================================

const App = (() => {
    const pages = ['landing', 'empathy', 'diagnosis', 'result', 'education', 'quiz', 'stories', 'brokers'];
    let currentPage = 'landing';
    let userState = {
        diagnosisAnswers: {},
        riskType: null,
        educationCompleted: false,
        quizScore: 0,
        badges: [],
        worries: []
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
        if (idx <= 2) return true; // Landing, empathy, diagnosis always accessible
        if (idx === 3 && userState.riskType !== null) return true;
        if (idx === 4 && userState.riskType !== null) return true;
        if (idx === 5 && userState.riskType !== null) return true;
        if (idx === 6 && userState.riskType !== null) return true;
        if (idx === 7) return true; // Brokers always accessible
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
            navigateTo('empathy');
        });

        document.getElementById('btn-to-diagnosis')?.addEventListener('click', () => {
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

        document.getElementById('btn-to-brokers')?.addEventListener('click', () => {
            navigateTo('brokers');
            Quiz.renderBrokers();
            updateReadinessMeter();
        });

        document.getElementById('btn-restart')?.addEventListener('click', () => {
            userState = {
                diagnosisAnswers: {},
                riskType: null,
                educationCompleted: false,
                quizScore: 0,
                badges: [],
                worries: []
            };
            sessionStorage.removeItem('financeSimState');
            navigateTo('landing');
        });

        // Empathy cards interaction
        setupEmpathyCards();
    }

    // --- Empathy Cards ---
    function setupEmpathyCards() {
        const cards = document.querySelectorAll('.empathy-card');
        let selectedCount = 0;
        if (!userState.worries) userState.worries = [];

        cards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('selected');
                const worry = card.dataset.worry;
                if (card.classList.contains('selected')) {
                    if (!userState.worries.includes(worry)) userState.worries.push(worry);
                    selectedCount++;
                } else {
                    userState.worries = userState.worries.filter(w => w !== worry);
                    selectedCount--;
                }

                // After selecting at least 1 card, show encouragement
                if (selectedCount >= 1) {
                    document.getElementById('empathy-encouragement').style.display = 'block';
                    document.getElementById('btn-to-diagnosis').style.display = '';
                }
            });
        });
    }

    // --- Crash Simulation ---
    function renderCrashSimulation(monthly, period) {
        const container = document.getElementById('crash-timeline');
        if (!container) return;

        const crashes = [
            { name: 'コロナショック', year: 2020, drop: -34, recovery: '約6ヶ月', emoji: '🦠' },
            { name: 'リーマンショック', year: 2008, drop: -53, recovery: '約4年', emoji: '📉' },
            { name: 'ブラックマンデー', year: 1987, drop: -22, recovery: '約2年', emoji: '⚡' }
        ];

        const totalInvested = monthly * 12 * Math.min(period, 3);

        container.innerHTML = crashes.map(c => {
            const lostAmount = Math.round(totalInvested * Math.abs(c.drop) / 100);
            return `
                <div class="crash-event">
                    <div class="crash-event-header">
                        <span>${c.emoji} ${c.name}（${c.year}年）</span>
                        <span class="crash-drop">${c.drop}%</span>
                    </div>
                    <div class="crash-event-body">
                        <div class="crash-bar">
                            <div class="crash-bar-fill" style="width:${100 + c.drop}%"></div>
                        </div>
                        <div class="crash-recovery">🔄 回復期間: <strong>${c.recovery}</strong></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // --- Readiness Meter ---
    function updateReadinessMeter() {
        let score = 0;
        if (userState.worries && userState.worries.length > 0) score += 15;
        if (userState.riskType !== null) score += 25;
        if (userState.educationCompleted) score += 25;
        if (userState.quizScore >= 3) score += 20;
        if (userState.quizScore >= 5) score += 15;

        const bar = document.getElementById('readiness-bar');
        const label = document.getElementById('readiness-label');
        const msg = document.getElementById('readiness-msg');
        if (!bar || !label || !msg) return;

        setTimeout(() => {
            bar.style.width = score + '%';
            label.textContent = score + '%';
        }, 300);

        if (score >= 80) {
            msg.textContent = '🎉 準備バッチリ！あとは口座を作るだけ！';
        } else if (score >= 50) {
            msg.textContent = '💪 いい調子！もう少しで準備完了です';
        } else if (score >= 20) {
            msg.textContent = '🌱 順調に学習中。もっとコンテンツを見てみよう';
        } else {
            msg.textContent = '📖 診断を始めて投資準備度を上げよう！';
        }
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

    return { init, navigateTo, getState, setState, addBadge, fireConfetti, formatCurrency, formatCurrencyExact, animateCountUp, renderCrashSimulation, updateReadinessMeter, pages };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', App.init);
