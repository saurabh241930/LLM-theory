/**
 * genai_visualizer.js
 * Shared utilities for GenAI interactive components.
 */

const GENAI_COLORS = {
    token: '#3366cc',
    probability: '#109618',
    attention: '#ff9900',
    vector: '#990099',
    query: '#dc3912',
    background: '#f8f9fa',
    border: '#e0e0e0'
};

const GENAI_CHART_THEME = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: { size: 12 },
            bodyFont: { size: 12 },
            padding: 10
        }
    },
    scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { grid: { borderDash: [2, 2] }, ticks: { font: { size: 10 } } }
    }
};

/**
 * Generates a mock vocabulary distribution
 */
function generateVocabDistribution(size = 10) {
    let raw = Array.from({ length: size }, () => Math.random() ** 2);
    let sum = raw.reduce((a, b) => a + b, 0);
    return raw.map(v => v / sum).sort((a, b) => b - a);
}

/**
 * Apply Temperature to a probability distribution
 */
function applyTemperature(probs, temp) {
    if (temp === 0) {
        // Greedy: 1 for max, 0 for others
        const maxIdx = probs.indexOf(Math.max(...probs));
        return probs.map((_, i) => i === maxIdx ? 1 : 0);
    }
    let adjusted = probs.map(p => Math.exp(Math.log(p + 1e-10) / temp));
    let sum = adjusted.reduce((a, b) => a + b, 0);
    return adjusted.map(v => v / sum);
}

/**
 * Apply Top-P (Nucleus) filtering
 */
function applyTopP(probs, p) {
    let sorted = probs.map((val, idx) => ({ val, idx })).sort((a, b) => b.val - a.val);
    let cumulative = 0;
    let filtered = probs.map(() => 0);

    for (let item of sorted) {
        cumulative += item.val;
        filtered[item.idx] = item.val;
        if (cumulative >= p) break;
    }

    let sum = filtered.reduce((a, b) => a + b, 0);
    return filtered.map(v => v / sum);
}

/**
 * Apply Top-K filtering
 */
function applyTopK(probs, k) {
    let sorted = probs.map((val, idx) => ({ val, idx })).sort((a, b) => b.val - a.val);
    let filtered = probs.map(() => 0);

    for (let i = 0; i < Math.min(k, sorted.length); i++) {
        filtered[sorted[i].idx] = sorted[i].val;
    }

    let sum = filtered.reduce((a, b) => a + b, 0);
    return filtered.map(v => v / sum);
}
