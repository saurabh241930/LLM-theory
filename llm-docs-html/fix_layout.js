const fs = require('fs');

const files = [
  'transformer_animation.html',
  'encoder_animation.html',
  'decoder_animation.html',
  'deepseek_animation.html',
  'bert_vs_gpt_animation.html'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Add wikipedia.css before <style>
  if (!content.includes('wikipedia.css')) {
    content = content.replace('<style>', '<link rel="stylesheet" href="wikipedia.css?v=2">\n<style>');
  }

  // 2. Fix body styles by removing flex properties, and create .animation-wrapper
  if (content.includes('display: flex;') && content.includes('justify-content: center;')) {
    content = content.replace(/body\s*\{[\s\S]*?padding:\s*0;([\s\S]*?)\}/, (match, inner) => {
      // Create a clean body and a new .animation-wrapper
      return `body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, system-ui, sans-serif;
  overflow-x: hidden;
}

.animation-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}
`;
    });
  }

  // 3. Wrap <div id="app"> in <div class="content-wrapper animation-wrapper">
  if (!content.includes('class="content-wrapper animation-wrapper"')) {
    content = content.replace('<div id="app">', '<div class="content-wrapper animation-wrapper">\n<div id="app">');
    // Find the last </body> and insert closing div before it, along with sidebar script
    content = content.replace(/<\/body>\s*<\/html>/, '</div>\n<script src="sidebar.js?v=2"></script>\n</body>\n</html>');
  }

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
}
