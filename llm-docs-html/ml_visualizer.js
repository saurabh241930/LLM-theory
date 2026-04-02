/**
 * ML Visualizer Shared Utility
 * Provides a premium theme and helper functions for Chart.js interactive demos.
 */

const ML_COLORS = {
    primary: '#3366cc',
    secondary: '#dc3912',
    tertiary: '#ff9900',
    quaternary: '#109618',
    background: 'rgba(51, 102, 204, 0.1)',
    grid: '#e5e5e5',
    text: '#54595d'
};

const CHART_CONFIG_BASE = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            labels: {
                font: { family: 'inherit', size: 12 },
                color: ML_COLORS.text
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: { size: 14 },
            bodyFont: { size: 12 }
        }
    },
    scales: {
        x: {
            grid: { color: ML_COLORS.grid },
            ticks: { color: ML_COLORS.text }
        },
        y: {
            grid: { color: ML_COLORS.grid },
            ticks: { color: ML_COLORS.text }
        }
    },
    animation: {
        duration: 800,
        easing: 'easeInOutQuart'
    }
};

// Helper to generate synthetic regression data
function generateRegressionData(n = 50, noise = 5) {
    const data = [];
    const true_w = 2;
    const true_b = 5;
    for (let i = 0; i < n; i++) {
        const x = Math.random() * 10;
        const y = true_w * x + true_b + (Math.random() - 0.5) * noise;
        data.push({ x, y });
    }
    return data;
}

// Helper to generate synthetic classification data
function generateClassificationData(n = 50) {
    const data = [];
    for (let i = 0; i < n; i++) {
        const x = Math.random() * 10;
        const y = Math.random() * 10;
        const label = (x + y > 10) ? 1 : 0;
        data.push({ x, y, label });
    }
    return data;
}

window.ML_COLORS = ML_COLORS;
window.CHART_CONFIG_BASE = CHART_CONFIG_BASE;
window.generateRegressionData = generateRegressionData;
window.generateClassificationData = generateClassificationData;
