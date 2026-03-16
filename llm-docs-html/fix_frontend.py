import re

with open('frontend.html', 'r') as f:
    content = f.read()

# Replace Q47
q47_rep = """        <div class="qa-container" id="q47">
            <h3>Q47: Explain the Browser Critical Rendering Path and how to optimize it</h3>
            <div class="answer">
                <div class="one-liner">The sequence of steps the browser takes to convert HTML, CSS, and JS into pixels on the screen, optimized by minimizing render-blocking resources.</div>
                <h4>Core Points</h4>
                <ul>
                    <li>  Steps: Parse HTML -> Build DOM -> Parse CSS -> Build CSSOM -> Render Tree -> Layout -> Paint -> Composite</li>
                    <li>  CSS is render-blocking: the browser won't render processed content until CSSOM is built</li>
                    <li>  JS is parser-blocking: when the parser encounters a script tag, it pauses HTML parsing to fetch and execute it</li>
                </ul>
                <div class="depth">
                    <strong>Depth (Senior Signal):</strong>
                    <ul>
                        <li>Use `async` (executes when downloaded, without blocking) or `defer` (executes after DOM parsing) for scripts</li>
                        <li>Preload critical assets using &lt;link rel="preload"&gt; to fetch them early in the lifecycle</li>
                    </ul>
                </div>
                <div class="trap">
                    <strong>Trap / Watch Out:</strong> Inlining all CSS/JS avoids network requests but ruins caching and balloons the initial HTML payload.
                </div>
            </div>
        </div>"""

content = re.sub(r'<div class="qa-container" id="q47">.*?</div>\s*</div>\s*</div>', q47_rep, content, flags=re.DOTALL)

# Replace Q48
q48_rep = """        <div class="qa-container" id="q48">
            <h3>Q48: What are Web Workers and Service Workers? How do they differ?</h3>
            <div class="answer">
                <div class="one-liner">Web Workers offload heavy CPU tasks to background threads; Service Workers act as network proxies for caching and offline support.</div>
                <h4>Core Points</h4>
                <ul>
                    <li>  JS is single-threaded. Heavy calculations block the main thread, causing UI freezes</li>
                    <li>  Web Workers execute scripts in a separate background thread without DOM access, communicating via postMessage</li>
                    <li>  Service Workers intercept network requests, enabling offline capabilities (PWA), background sync, and push notifications</li>
                </ul>
                <div class="depth">
                    <strong>Depth (Senior Signal):</strong>
                    <ul>
                        <li>Service workers have a distinct lifecycle: Install -> Wait -> Activate. An activated SW requires a reload to control clients</li>
                        <li>SharedWorkers can be accessed by multiple scripts across different windows/iframes of the same origin</li>
                    </ul>
                </div>
                <div class="trap">
                    <strong>Trap / Watch Out:</strong> Trying to manipulate the DOM or accessing `window` inside any Worker will throw an error since they run in a different global context.
                </div>
            </div>
        </div>"""
content = re.sub(r'<div class="qa-container" id="q48">.*?</div>\s*</div>\s*</div>', q48_rep, content, flags=re.DOTALL)

# Replace Q49
q49_rep = """        <div class="qa-container" id="q49">
            <h3>Q49: Explain CSS Flexbox vs CSS Grid and when to use each</h3>
            <div class="answer">
                <div class="one-liner">Flexbox is for 1D layouts (rows or columns), while CSS Grid is for 2D layouts (rows and columns simultaneously).</div>
                <h4>Core Points</h4>
                <ul>
                    <li>  Flexbox flows items in a single direction. Best for alignment, distributing space, and wrapping items</li>
                    <li>  CSS Grid defines a structured grid template, allowing items to span multiple tracks</li>
                    <li>  Flexbox is content-out (size driven by content), Grid is layout-in (content conforms to grid areas)</li>
                </ul>
                <div class="depth">
                    <strong>Depth (Senior Signal):</strong>
                    <ul>
                        <li>You can easily mix them: A grid item can be a flex container. Use Grid for page-level structure and Flexbox for components</li>
                        <li>minmax() and auto-fit/auto-fill in Grid allow for fully responsive layouts without media queries</li>
                    </ul>
                </div>
                <div class="trap">
                    <strong>Trap / Watch Out:</strong> Overusing Grid for simple single-axis alignments adds unnecessary complexity; default to Flexbox until you need a second dimension.
                </div>
            </div>
        </div>"""
content = re.sub(r'<div class="qa-container" id="q49">.*?</div>\s*</div>\s*</div>', q49_rep, content, flags=re.DOTALL)

# Replace Q57
q57_rep = """        <div class="qa-container" id="q57">
            <h3>Q57: What is Event Delegation and how does React handle events?</h3>
            <div class="answer">
                <div class="one-liner">Event delegation attaches a single listener to a parent element to manage events for all descendants, improving performance.</div>
                <h4>Core Points</h4>
                <ul>
                    <li>  Instead of putting onclick on 1,000 list items, you put one listener on the ul and use event.target</li>
                    <li>  React implements this through its SyntheticEvent system—a cross-browser wrapper around native events</li>
                    <li>  React attaches a single event listener to the root container for almost all events</li>
                </ul>
                <div class="depth">
                    <strong>Depth (Senior Signal):</strong>
                    <ul>
                        <li>React 17 changed event delegation from attaching to the document object to the root DOM container</li>
                        <li>This change allowed multiple React versions to safely coexist on the same page</li>
                    </ul>
                </div>
                <div class="trap">
                    <strong>Trap / Watch Out:</strong> Calling e.stopPropagation() in React stops the React SyntheticEvent propagation, not necessarily the native DOM propagation outside the React tree.
                </div>
            </div>
        </div>"""
content = re.sub(r'<div class="qa-container" id="q57">.*?</div>\s*</div>\s*</div>', q57_rep, content, flags=re.DOTALL)

# Fix JSX lint error
content = content.replace("<Component onClick={()=> fn()} />", "&lt;Component onClick={()=&gt; fn()} /&gt;")
# Fix Q58 Next.js Angular Universal mentions
content = re.sub(r'<li>\s*Angular Universal: server-side rendering for Angular apps — hydration re-attaches event listeners on\s*</li>\s*<li>client</li>', r'<li>  Modern SSR frameworks provide seamless routing while sending fully formed HTML on first load</li>', content)
content = re.sub(r'<li>\s*Full hydration: React/Angular re-renders the entire component tree client-side to attach event\s*</li>\s*<li>listeners</li>', r'<li>  Full hydration: Applications re-render the entire component tree client-side to attach event listeners</li>', content)

with open('frontend.html', 'w') as f:
    f.write(content)

print('done')
