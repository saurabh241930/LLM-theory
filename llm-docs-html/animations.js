/**
 * Shared Animation Utilities for LLM Theory Book
 */

document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-active');
                if (entry.target.dataset.animationFunc) {
                    const funcName = entry.target.dataset.animationFunc;
                    if (typeof window[funcName] === 'function') {
                        window[funcName](entry.target);
                    }
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
});

/**
 * 1. Text to Vector Flow Animation
 */
window.animateTextToVector = (container) => {
    const textNode = container.querySelector('.flow-text');
    const modelNode = container.querySelector('.flow-model');
    const vectorNode = container.querySelector('.flow-vector');
    const arrows = container.querySelectorAll('.flow-arrow-fill');

    // Sequence: Text -> Arrow 1 -> Model -> Arrow 2 -> Vector
    
    // Start with opacity 0
    [textNode, modelNode, vectorNode, ...arrows].forEach(el => { el.style.opacity = '0'; });

    setTimeout(() => {
        textNode.style.transition = 'opacity 0.5s ease-in';
        textNode.style.opacity = '1';
    }, 500);

    setTimeout(() => {
        arrows[0].style.transition = 'width 1s ease-out';
        arrows[0].style.width = '100%';
        arrows[0].style.opacity = '1';
    }, 1200);

    setTimeout(() => {
        modelNode.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s';
        modelNode.style.opacity = '1';
        modelNode.style.transform = 'scale(1.1)';
        setTimeout(() => modelNode.style.transform = 'scale(1)', 500);
    }, 2200);

    setTimeout(() => {
        arrows[1].style.transition = 'width 1s ease-out';
        arrows[1].style.width = '100%';
        arrows[1].style.opacity = '1';
    }, 3200);

    setTimeout(() => {
        vectorNode.style.transition = 'opacity 0.8s ease-in, transform 0.8s';
        vectorNode.style.opacity = '1';
        const vectorValues = vectorNode.querySelectorAll('.vector-val');
        vectorValues.forEach((val, i) => {
            val.style.transition = `opacity 0.2s ${i * 0.1}s`;
            val.style.opacity = '1';
        });
    }, 4200);
};

/**
 * 2. Semantic Space Plot Animation
 */
window.animateSemanticSpace = (container) => {
    const points = container.querySelectorAll('.point');
    const connections = container.querySelectorAll('.connection-line');
    
    points.forEach((point, i) => {
        point.style.opacity = '0';
        point.style.transform = 'scale(0)';
        setTimeout(() => {
            point.style.transition = 'opacity 0.5s, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            point.style.opacity = '1';
            point.style.transform = 'scale(1)';
        }, i * 300);
    });

    setTimeout(() => {
        connections.forEach(line => {
            line.style.transition = 'stroke-dashoffset 1s ease-in-out';
            line.style.strokeDashoffset = '0';
        });
    }, points.length * 300 + 200);
};
