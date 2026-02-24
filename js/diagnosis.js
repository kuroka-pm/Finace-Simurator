// ============================================================
// Finance Simulator - Diagnosis Flow
// ============================================================

const Diagnosis = (() => {
    let currentStep = 0;
    let answers = {};

    function start() {
        currentStep = 0;
        answers = {};
        renderQuestion();
    }

    function renderQuestion() {
        const q = DIAGNOSIS_QUESTIONS[currentStep];
        const area = document.getElementById('question-area');
        if (!area || !q) return;

        // Update progress
        const progress = ((currentStep) / DIAGNOSIS_QUESTIONS.length) * 100;
        document.getElementById('diagnosis-progress').style.width = `${progress}%`;
        document.getElementById('progress-step').textContent = `質問 ${currentStep + 1} / ${DIAGNOSIS_QUESTIONS.length}`;
        document.getElementById('progress-percent').textContent = `${Math.round(progress)}%`;

        area.innerHTML = `
      <div class="question-icon">${q.icon}</div>
      <h2>${q.title}</h2>
      <p class="question-subtitle">${q.subtitle}</p>
      <div class="options-grid">
        ${q.options.map((opt, i) => `
          <button class="option-card" data-index="${i}" data-value="${opt.value}" data-score="${opt.score}" id="opt-${q.id}-${i}">
            <div class="option-radio"></div>
            <span>${opt.label}</span>
          </button>
        `).join('')}
      </div>
    `;

        // Stagger animation
        const cards = area.querySelectorAll('.option-card');
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, 100 + i * 80);
        });

        // Option click handler
        cards.forEach(card => {
            card.addEventListener('click', () => handleOptionClick(card, q));
        });
    }

    function handleOptionClick(card, question) {
        // Visual feedback
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        // Store  answer
        answers[question.id] = {
            value: card.dataset.value,
            score: parseInt(card.dataset.score)
        };

        // Auto-advance after a brief delay for visual feedback
        setTimeout(() => {
            currentStep++;
            if (currentStep < DIAGNOSIS_QUESTIONS.length) {
                renderQuestion();
            } else {
                completeDiagnosis();
            }
        }, 500);
    }

    function completeDiagnosis() {
        // Calculate risk score (average of all scores)
        const scores = Object.values(answers).map(a => a.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        // Map to risk type (0-4)
        let typeIndex;
        if (avgScore <= 1.5) typeIndex = 0;
        else if (avgScore <= 2.5) typeIndex = 1;
        else if (avgScore <= 3.2) typeIndex = 2;
        else if (avgScore <= 4) typeIndex = 3;
        else typeIndex = 4;

        const riskType = RISK_TYPES[typeIndex];

        // Update app state
        App.setState({
            diagnosisAnswers: answers,
            riskType: typeIndex
        });
        App.addBadge('投資入門者');

        // Update progress to 100%
        document.getElementById('diagnosis-progress').style.width = '100%';
        document.getElementById('progress-percent').textContent = '100%';

        // Navigate to results
        setTimeout(() => {
            App.navigateTo('result');
            Simulator.init(typeIndex);
        }, 600);
    }

    return { start };
})();
