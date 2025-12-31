/**
 * viteMoveScripts — A Vite plugin that moves <script> tags from <head> to <body> in HTML files during the build process.
 * @returns {object} Vite plugin object.
 */
export function viteMoveScripts () {
  return {
    name: 'vite-plugin-move-scripts',
    transformIndexHtml (html, ctx) {
      try {
        if (!ctx || !ctx.chunk || !ctx.chunk.isEntry) {
          return html;
        }
        const fileName = ctx.chunk.fileName;
        const scriptRegex = new RegExp('<script[^>]*src=["\']?(?:.*\\/)?' + fileName + '["\']?[^>]*></script>', 'i');
        const match = html.match(scriptRegex);
        if (!match) {
          console.warn(`\n⚠ Entry script '${fileName}' not found`);
          return html;
        }
        const script = match[0];
        html = html.replace(scriptRegex, '');
        if (!html.includes('</body>')) {
          console.warn('\n⚠ </body> not found — cannot inject script');
          return html;
        }
        html = html.replace('</body>', script + '\n</body>');
        console.log(`\n✔ Script '${fileName}' moved to <body>`);
        return html;
      } catch (err) {
        const file = ctx?.filename || 'unknown.html';
        console.warn(`\n⚠ Failed to process ${file}: ${err.message}`);
        return html;
      }
    }
  };
}
