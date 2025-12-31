import fs from 'fs';
import path from 'path';

/**
 * viteStripHtmlComments — A Vite plugin that removes HTML comments from specified HTML files during the build process.
 * @param {object} options — Options for the plugin.
 * @param {Array<string>} options.targets — An array of file paths for the HTML files that need to have comments removed.
 * @returns {object} Vite plugin object.
 */
export function viteStripHtmlComments ({ targets = [] } = {}) {
  return {
    name: 'vite-plugin-strip-html-comments',
    // closeBundle — Hook that is triggered after the build process is completed.
    // It processes the specified HTML files and removes all HTML comments.
    closeBundle () {
      targets.forEach((filePath) => {
        // Resolving the absolute path of the file
        const resolvedPath = path.resolve(filePath);
        // Check if the file exists at the given path
        if (fs.existsSync(resolvedPath)) {
          try {
            // Read the HTML file's content
            const html = fs.readFileSync(resolvedPath, 'utf-8');
            // Remove all HTML comments using regular expression
            // Also removes any empty lines left after comment removal
            const commentRegex = new RegExp('<!--[\\s\\S]*?-->', 'g');
            const emptyLineRegex = new RegExp('^\\s*[\\r\\n]', 'gm');
            const strippedHtml = html
              .replace(commentRegex, '')
              .replace(emptyLineRegex, '')
              .trim();
            // Write the modified content back to the file
            fs.writeFileSync(resolvedPath, strippedHtml, 'utf-8');
            // Log a success message
            console.log(`✔ Comments removed from the file: ${path.relative(process.cwd(), resolvedPath)}`);
          } catch (err) {
            // Log a warning if an error occurs during processing
            console.warn(`⚠ Failed to process ${path.relative(process.cwd(), resolvedPath)}: ${err.message}`);
          }
        } else {
          // Log a warning if the file is not found
          console.warn(`⚠ File not found: ${path.relative(process.cwd(), resolvedPath)}`);
        }
      });
    }
  };
}
