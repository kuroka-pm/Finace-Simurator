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
        showDailyTip();
        setupSNSShare();
        renderLifeGoals();
        // Restore state from sessionStorage if exists
        const saved = sessionStorage.getItem('financeSimState');
        if (saved) {
            try { userState = JSON.parse(saved); } catch (e) { }
        }
        updateLevelWidget();
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
        updateLevelWidget();
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

    // --- Level System ---
    function calculateXP() {
        let xp = 0;
        if (userState.worries && userState.worries.length > 0) xp += 10;
        if (userState.riskType !== null) xp += 20;
        if (userState.educationCompleted) xp += 25;
        if (userState.quizScore >= 1) xp += 10;
        if (userState.quizScore >= 3) xp += 15;
        if (userState.quizScore >= 5) xp += 10;
        if (userState.badges.length >= 3) xp += 10;
        return Math.min(xp, 100);
    }

    function updateLevelWidget() {
        const xp = calculateXP();
        let currentLevel = LEVELS[0];
        for (let i = LEVELS.length - 1; i >= 0; i--) {
            if (xp >= LEVELS[i].minXP) {
                currentLevel = LEVELS[i];
                break;
            }
        }

        const nextLevel = LEVELS[Math.min(currentLevel.level, LEVELS.length - 1)];
        const xpInLevel = xp - currentLevel.minXP;
        const xpNeeded = nextLevel.minXP - currentLevel.minXP || 100;
        const progress = currentLevel.level >= 5 ? 100 : Math.round((xpInLevel / xpNeeded) * 100);

        const iconEl = document.getElementById('level-icon');
        const nameEl = document.getElementById('level-name');
        const fillEl = document.getElementById('level-xp-fill');
        if (!iconEl || !nameEl || !fillEl) return;

        iconEl.textContent = currentLevel.icon;
        nameEl.textContent = `Lv.${currentLevel.level} ${currentLevel.name}`;
        fillEl.style.width = `${progress}%`;
        fillEl.style.background = currentLevel.color;
    }

    // --- Daily Tip ---
    function showDailyTip() {
        if (typeof DAILY_TIPS === 'undefined' || !DAILY_TIPS.length) return;
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        const tipIndex = dayOfYear % DAILY_TIPS.length;
        const tip = DAILY_TIPS[tipIndex];

        const textEl = document.getElementById('daily-tip-text');
        const catEl = document.getElementById('daily-tip-category');
        if (textEl) textEl.textContent = tip.tip;
        if (catEl) catEl.textContent = tip.category;
    }

    // --- Life Goals ---
    function renderLifeGoals() {
        const grid = document.getElementById('life-goals-grid');
        if (!grid || typeof LIFE_GOALS === 'undefined') return;

        grid.innerHTML = LIFE_GOALS.map(goal => `
            <button class="life-goal-btn" data-goal="${goal.id}" style="--goal-color:${goal.color}">
                <span class="lg-icon">${goal.icon}</span>
                <span class="lg-name">${goal.name}</span>
            </button>
        `).join('');

        grid.querySelectorAll('.life-goal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                grid.querySelectorAll('.life-goal-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                showGoalTimeline(btn.dataset.goal);
            });
        });
    }

    function showGoalTimeline(goalId) {
        const goal = LIFE_GOALS.find(g => g.id === goalId);
        if (!goal) return;

        const resultEl = document.getElementById('life-goals-result');
        if (!resultEl) return;

        const monthly = parseInt(document.getElementById('slider-monthly')?.value || 20000);
        const rate = parseFloat(document.getElementById('slider-rate')?.value || 5);
        const monthlyRate = rate / 100 / 12;

        // Calculate months needed to reach goal
        let months = 0;
        if (monthlyRate > 0) {
            months = Math.ceil(Math.log(goal.targetAmount * monthlyRate / monthly + 1) / Math.log(1 + monthlyRate));
        } else {
            months = Math.ceil(goal.targetAmount / monthly);
        }
        const years = Math.floor(months / 12);
        const remainMonths = months % 12;

        resultEl.style.display = 'block';
        resultEl.innerHTML = `
            <div class="goal-result-card" style="border-color:${goal.color}">
                <div class="goal-result-header">
                    <span>${goal.icon}</span>
                    <span>${goal.name}（${goal.description}）</span>
                </div>
                <div class="goal-result-target">
                    目標額: <strong>${(goal.targetAmount / 10000).toLocaleString()}万円</strong>
                </div>
                <div class="goal-result-timeline">
                    月${(monthly / 10000).toFixed(1)}万円 × 年利${rate}% なら…<br>
                    <strong class="goal-years">${years > 0 ? years + '年' : ''}${remainMonths > 0 ? remainMonths + 'ヶ月' : ''}</strong> で達成！
                </div>
            </div>
        `;

        userState.selectedGoal = goalId;
        saveState();
    }

    // --- SNS Share ---
    function setupSNSShare() {
        const shareText = () => {
            const state = userState;
            const level = LEVELS.find((l, i) => {
                const xp = calculateXP();
                const next = LEVELS[i + 1];
                return !next || xp < next.minXP;
            });
            const riskName = state.riskType !== null ? RISK_TYPES[state.riskType]?.name : '';
            return `投資シミュレーターで${riskName ? '「' + riskName + '」と診断されました！' : '投資の勉強中！'} Lv.${level?.level || 1} ${level?.name || ''} #投資シミュレーター #資産形成`;
        };

        const appUrl = window.location.href;

        document.getElementById('btn-share-x')?.addEventListener('click', () => {
            const text = encodeURIComponent(shareText());
            const url = encodeURIComponent(appUrl);
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        });

        document.getElementById('btn-share-line')?.addEventListener('click', () => {
            const text = encodeURIComponent(shareText() + '\n' + appUrl);
            window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank');
        });

        document.getElementById('btn-share-copy')?.addEventListener('click', (e) => {
            navigator.clipboard.writeText(appUrl).then(() => {
                const btn = e.currentTarget;
                const original = btn.textContent;
                btn.textContent = '✅ コピーしました！';
                setTimeout(() => { btn.textContent = original; }, 2000);
            });
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

    return { init, navigateTo, getState, setState, addBadge, fireConfetti, formatCurrency, formatCurrencyExact, animateCountUp, renderCrashSimulation, updateReadinessMeter, updateLevelWidget, pages };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', App.init);
