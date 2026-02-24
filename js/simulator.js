// ============================================================
// Finance Simulator - Compound Interest Simulator
// ============================================================

const Simulator = (() => {
    let chart = null;
    let currentTypeIndex = 2;

    function init(typeIndex) {
        currentTypeIndex = typeIndex;
        const riskType = RISK_TYPES[typeIndex];

        // Set header
        document.getElementById('result-icon').textContent = riskType.icon;
        document.getElementById('result-name').textContent = riskType.name;
        document.getElementById('result-description').textContent = riskType.description;

        // Set sliders to recommended values
        document.getElementById('slider-monthly').value = riskType.monthlyAmount;
        document.getElementById('slider-rate').value = riskType.returnRate;

        // Set period based on diagnosis
        const state = App.getState();
        const periodAnswer = state.diagnosisAnswers?.period;
        const period = periodAnswer ? parseInt(periodAnswer.value) || 20 : 20;
        document.getElementById('slider-period').value = period;

        // Render allocation bars
        renderAllocation(riskType);

        // Setup slider listeners
        setupSliders();

        // Initial chart render
        updateSimulation();
    }

    function renderAllocation(riskType) {
        const container = document.getElementById('allocation-bars');
        const labels = { bonds: '債券', domestic: '国内株式', foreign: '海外株式', reit: 'REIT' };
        const colors = { bonds: '#4FC3F7', domestic: '#81C784', foreign: '#FFD54F', reit: '#FF8A65' };

        container.innerHTML = Object.entries(riskType.allocation).map(([key, val]) => `
      <div class="alloc-item">
        <span class="alloc-label">${labels[key]}</span>
        <div class="alloc-bar-track">
          <div class="alloc-bar-fill" style="background: ${colors[key]};" data-width="${val}"></div>
        </div>
        <span class="alloc-percent" style="color:${colors[key]}">${val}%</span>
      </div>
    `).join('');

        // Animate bars
        setTimeout(() => {
            container.querySelectorAll('.alloc-bar-fill').forEach(bar => {
                bar.style.width = `${bar.dataset.width}%`;
            });
        }, 300);
    }

    function setupSliders() {
        const sliders = ['slider-monthly', 'slider-period', 'slider-rate'];
        sliders.forEach(id => {
            const slider = document.getElementById(id);
            if (slider) {
                slider.addEventListener('input', updateSimulation);
            }
        });
    }

    function updateSimulation() {
        const monthly = parseInt(document.getElementById('slider-monthly').value);
        const years = parseInt(document.getElementById('slider-period').value);
        const rate = parseFloat(document.getElementById('slider-rate').value);

        // Update display values
        document.getElementById('val-monthly').textContent = `${(monthly / 10000).toFixed(1)}万円 / 月`;
        document.getElementById('val-period').textContent = `${years}年`;
        document.getElementById('val-rate').textContent = `${rate}%`;

        // Calculate compound interest
        const monthlyRate = rate / 100 / 12;
        const totalMonths = years * 12;
        const principal = monthly * totalMonths;

        // Generate yearly data points
        const labels = [];
        const principalData = [];
        const compoundData = [];

        for (let y = 0; y <= years; y++) {
            labels.push(`${y}年`);
            const months = y * 12;
            const p = monthly * months;
            principalData.push(p);

            if (monthlyRate === 0) {
                compoundData.push(p);
            } else {
                const fv = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
                compoundData.push(Math.round(fv));
            }
        }

        const totalCompound = compoundData[compoundData.length - 1];
        const profit = totalCompound - principal;
        const growthRate = principal > 0 ? ((totalCompound / principal - 1) * 100).toFixed(1) : 0;

        // Early start comparison (1 year earlier)
        const earlyMonths = (years + 1) * 12;
        const earlyTotal = monthlyRate === 0
            ? monthly * earlyMonths
            : monthly * ((Math.pow(1 + monthlyRate, earlyMonths) - 1) / monthlyRate);
        const earlyDiff = Math.round(earlyTotal - totalCompound - monthly * 12);

        // Update summary
        document.getElementById('sum-principal').textContent = App.formatCurrency(principal);
        document.getElementById('sum-profit').textContent = `+${App.formatCurrency(profit)}`;
        document.getElementById('sum-total').textContent = App.formatCurrency(totalCompound);
        document.getElementById('sum-rate').textContent = `+${growthRate}%`;
        document.getElementById('early-diff').textContent = `+${App.formatCurrency(Math.abs(earlyDiff))}`;

        // Render chart
        renderChart(labels, principalData, compoundData);

        // Render crash simulation
        App.renderCrashSimulation(monthly, years);
    }

    function renderChart(labels, principalData, compoundData) {
        const ctx = document.getElementById('compoundChart');
        if (!ctx) return;

        if (chart) {
            chart.data.labels = labels;
            chart.data.datasets[0].data = principalData;
            chart.data.datasets[1].data = compoundData;
            chart.update('active');
            return;
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '積立元本',
                        data: principalData,
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: true,
                        tension: 0,
                        pointRadius: 0,
                        pointHoverRadius: 5
                    },
                    {
                        label: '複利運用',
                        data: compoundData,
                        borderColor: '#4f8cff',
                        backgroundColor: (context) => {
                            const chart = context.chart;
                            const { ctx: c, chartArea } = chart;
                            if (!chartArea) return 'rgba(79, 140, 255, 0.1)';
                            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                            gradient.addColorStop(0, 'rgba(79, 140, 255, 0.3)');
                            gradient.addColorStop(1, 'rgba(79, 140, 255, 0.02)');
                            return gradient;
                        },
                        borderWidth: 3,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: '#4f8cff',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 800,
                    easing: 'easeOutQuart'
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'rgba(240, 240, 247, 0.7)',
                            font: { family: 'Inter, Noto Sans JP', size: 11 },
                            boxWidth: 12,
                            boxHeight: 2,
                            padding: 16,
                            usePointStyle: false
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 22, 56, 0.95)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        titleColor: '#f0f0f7',
                        bodyColor: 'rgba(240, 240, 247, 0.8)',
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: { family: 'Inter, Noto Sans JP', weight: '600' },
                        bodyFont: { family: 'Inter, Noto Sans JP' },
                        callbacks: {
                            label: function (context) {
                                return `${context.dataset.label}: ¥${Math.round(context.parsed.y).toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(240, 240, 247, 0.4)',
                            font: { family: 'Inter', size: 10 },
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: 'rgba(240, 240, 247, 0.4)',
                            font: { family: 'Inter', size: 10 },
                            callback: function (value) {
                                if (value >= 10000000) return `${(value / 10000000).toFixed(0)}千万`;
                                if (value >= 10000) return `${(value / 10000).toFixed(0)}万`;
                                return value;
                            }
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    return { init };
})();
