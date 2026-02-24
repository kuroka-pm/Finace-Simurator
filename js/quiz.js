// ============================================================
// Finance Simulator - Quiz & Gamification
// ============================================================

const Quiz = (() => {
  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  function init() {
    currentQuestion = 0;
    score = 0;
    answered = false;

    // Show quiz area, hide result
    document.getElementById('quiz-area').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';

    renderQuestion();
  }

  function renderQuestion() {
    const q = QUIZ_QUESTIONS[currentQuestion];
    const area = document.getElementById('quiz-area');
    if (!area || !q) return;
    answered = false;

    // Update progress
    const progress = (currentQuestion / QUIZ_QUESTIONS.length) * 100;
    document.getElementById('quiz-progress').textContent = `${QUIZ_QUESTIONS.length}問中 ${currentQuestion + 1}問目`;
    document.getElementById('quiz-progress-bar').style.width = `${progress}%`;

    const letters = ['A', 'B', 'C', 'D'];
    area.innerHTML = `
      <div class="quiz-question">${q.question}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}" id="quiz-opt-${currentQuestion}-${i}">
            <span class="quiz-option-letter">${letters[i]}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div id="quiz-explanation-area"></div>
    `;

    // Stagger animation
    const options = area.querySelectorAll('.quiz-option');
    options.forEach((opt, i) => {
      opt.style.opacity = '0';
      opt.style.transform = 'translateY(10px)';
      setTimeout(() => {
        opt.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        opt.style.opacity = '1';
        opt.style.transform = 'translateY(0)';
      }, 100 + i * 100);
    });

    // Click handlers
    options.forEach(opt => {
      opt.addEventListener('click', () => handleAnswer(parseInt(opt.dataset.index)));
    });
  }

  function handleAnswer(selectedIndex) {
    if (answered) return;
    answered = true;

    const q = QUIZ_QUESTIONS[currentQuestion];
    const isCorrect = selectedIndex === q.correct;

    if (isCorrect) {
      score++;
      App.fireConfetti();
    }

    // Mark options
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((opt, i) => {
      if (i === q.correct) {
        opt.classList.add('correct');
      } else if (i === selectedIndex && !isCorrect) {
        opt.classList.add('wrong');
      }
      if (i !== selectedIndex && i !== q.correct) {
        opt.classList.add('disabled');
      }
    });

    // Show explanation
    const explArea = document.getElementById('quiz-explanation-area');
    if (explArea) {
      explArea.innerHTML = `
        <div class="quiz-explanation">
          <h4>${isCorrect ? '🎉 正解！' : '😅 残念…'}</h4>
          <p>${q.explanation}</p>
        </div>
      `;
    }

    // Auto-advance
    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion < QUIZ_QUESTIONS.length) {
        renderQuestion();
      } else {
        showResult();
      }
    }, 3000);
  }

  function showResult() {
    document.getElementById('quiz-area').style.display = 'none';
    const resultArea = document.getElementById('quiz-result');
    resultArea.style.display = 'block';

    // Update progress bar to 100%
    document.getElementById('quiz-progress').textContent = `完了！`;
    document.getElementById('quiz-progress-bar').style.width = '100%';

    // Determine badge
    let badgeEarned;
    if (score === QUIZ_QUESTIONS.length) {
      badgeEarned = BADGES[3]; // 資産形成マスター
      App.addBadge('資産形成マスター');
      App.addBadge('見習いアナリスト');
    } else if (score >= 3) {
      badgeEarned = BADGES[2]; // 見習いアナリスト
      App.addBadge('見習いアナリスト');
    } else {
      badgeEarned = BADGES[0]; // 投資入門者
    }

    App.setState({ quizScore: score });

    // Fire confetti for good scores
    if (score >= 3) {
      App.fireConfetti();
      setTimeout(() => App.fireConfetti(), 500);
    }

    resultArea.innerHTML = `
      <div class="quiz-score-circle">
        <div class="quiz-score-number">${score}/${QUIZ_QUESTIONS.length}</div>
        <div class="quiz-score-text">正解数</div>
      </div>

      <div class="badge-earned">
        <span class="badge-icon">${badgeEarned.icon}</span>
        <span>「${badgeEarned.name}」バッジ獲得！</span>
      </div>

      <p style="color:var(--text-secondary);font-size:0.95rem;margin-bottom:var(--space-xl);max-width:360px;margin-left:auto;margin-right:auto;">
        ${getResultMessage(score)}
      </p>

      <button class="btn-primary" id="btn-to-stories">
        先輩の体験談を見る 📖
      </button>
      <br>
      <button class="btn-secondary mt-md" id="btn-retry-quiz">
        🔄 もう一度挑戦する
      </button>
    `;

    document.getElementById('btn-to-stories')?.addEventListener('click', () => {
      App.addBadge('未来の投資家');
      App.navigateTo('stories');
    });

    document.getElementById('btn-retry-quiz')?.addEventListener('click', init);
  }

  function getResultMessage(s) {
    if (s === QUIZ_QUESTIONS.length) return '素晴らしい！投資の基礎知識は完璧です。自信を持って第一歩を踏み出しましょう！';
    if (s >= 3) return 'いい線いってます！基礎知識はしっかり身についています。あとは実践あるのみ！';
    if (s >= 1) return 'まだまだ伸びしろがあります。教育コンテンツを復習して、再チャレンジしてみましょう！';
    return '大丈夫、最初はみんな初心者です。教育コンテンツをもう一度読んで再挑戦してみましょう！';
  }

  function renderBrokers() {
    // Render badges
    const badgesGrid = document.getElementById('badges-grid');
    if (badgesGrid) {
      const userBadges = App.getState().badges || [];
      badgesGrid.innerHTML = BADGES.map(badge => {
        const earned = userBadges.includes(badge.name);
        return `
          <div class="badge-item ${earned ? 'earned' : 'locked'}">
            <div class="badge-item-icon">${badge.icon}</div>
            <div class="badge-item-name">${badge.name}</div>
          </div>
        `;
      }).join('');
    }

    // Render broker cards
    const brokerCards = document.getElementById('broker-cards');
    if (brokerCards) {
      brokerCards.innerHTML = BROKERS.map(broker => `
        <div class="broker-card">
          ${broker.badge ? `<div class="broker-badge">${broker.badge}</div>` : ''}
          <div class="broker-top">
            <div class="broker-logo">${broker.logo}</div>
            <div>
              <div class="broker-name">${broker.name}</div>
              <div class="broker-rating">${'★'.repeat(Math.floor(broker.rating))} ${broker.rating}</div>
            </div>
          </div>
          <ul class="broker-features">
            ${broker.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
          <div class="broker-recommend">💡 ${broker.recommended}</div>
          <button class="broker-cta" style="background:${broker.color};" onclick="window.open('${broker.url}', '_blank')">
            無料で口座開設する →
          </button>
        </div>
      `).join('');
    }
  }

  return { init, renderBrokers };
})();
