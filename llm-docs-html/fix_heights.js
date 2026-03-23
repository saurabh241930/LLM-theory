const fs = require('fs');

const files = [
    'feed_forward_animation.html',
    'residual_connections_animation.html',
    'attention_modifier_math.html',
    'qkv_matrix_animation.html',
    'multihead_attention_intuition.html'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');

        // Fix .playground heights
        content = content.replace(/height:\s*500px;/g, 'min-height: 700px;');
        content = content.replace(/min-height:\s*550px;/g, 'min-height: 700px;');
        content = content.replace(/min-height:\s*600px;/g, 'min-height: 700px;');

        // Fix #stage heights for qkv_matrix
        content = content.replace(/height:\s*500px;\s*background:\s*var\(--bg2\)/g, 'min-height: 600px; background: var(--bg2)');

        fs.writeFileSync(file, content);
        console.log('Fixed heights in', file);
    }
});
