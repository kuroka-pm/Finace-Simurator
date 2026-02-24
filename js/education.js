// ============================================================
// Finance Simulator - Education Content
// ============================================================

const Education = (() => {
    let currentCard = 0;

    function init() {
        currentCard = 0;
        renderCards();
        renderDots();
        setupControls();
        updateView();
    }

    function renderCards() {
        const carousel = document.getElementById('edu-carousel');
        if (!carousel) return;

        carousel.innerHTML = EDUCATION_CARDS.map((card, i) => `
      <div class="edu-card ${i === 0 ? 'active' : ''}" id="edu-card-${i}">
        <div class="edu-card-inner" style="--card-color: ${card.color};">
          <div style="position:absolute;top:0;left:0;right:0;height:4px;background:${card.color};border-radius:16px 16px 0 0;"></div>
          <div class="edu-card-icon">${card.icon}</div>
          <h3>${card.title}</h3>
          <div class="edu-card-content">${card.content}</div>
          <div class="edu-card-fact">${card.fact}</div>
        </div>
      </div>
    `).join('');
    }

    function renderDots() {
        const dotsContainer = document.getElementById('edu-dots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = EDUCATION_CARDS.map((_, i) =>
            `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" id="edu-dot-${i}"></button>`
        ).join('');

        dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                currentCard = parseInt(dot.dataset.index);
                updateView();
            });
        });
    }

    function setupControls() {
        const prevBtn = document.getElementById('edu-prev');
        const nextBtn = document.getElementById('edu-next');

        prevBtn?.addEventListener('click', () => {
            if (currentCard > 0) {
                currentCard--;
                updateView();
            }
        });

        nextBtn?.addEventListener('click', () => {
            if (currentCard < EDUCATION_CARDS.length - 1) {
                currentCard++;
                updateView();
            }
        });

        // Touch/swipe support
        const carousel = document.getElementById('edu-carousel');
        if (carousel) {
            let touchStartX = 0;
            let touchEndX = 0;

            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0 && currentCard < EDUCATION_CARDS.length - 1) {
                        currentCard++;
                    } else if (diff < 0 && currentCard > 0) {
                        currentCard--;
                    }
                    updateView();
                }
            }
        }
    }

    function updateView() {
        // Show active card
        document.querySelectorAll('.edu-card').forEach((card, i) => {
            card.classList.toggle('active', i === currentCard);
        });

        // Update dots
        document.querySelectorAll('#edu-dots .carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentCard);
        });

        // Update button states
        const prevBtn = document.getElementById('edu-prev');
        const nextBtn = document.getElementById('edu-next');
        if (prevBtn) prevBtn.disabled = currentCard === 0;
        if (nextBtn) nextBtn.disabled = currentCard === EDUCATION_CARDS.length - 1;

        // Check if all cards viewed
        if (currentCard === EDUCATION_CARDS.length - 1) {
            App.addBadge('知識の芽生え');
            App.setState({ educationCompleted: true });
        }
    }

    return { init };
})();
