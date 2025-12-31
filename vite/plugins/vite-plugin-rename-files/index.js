import fs from 'fs';
import path from 'path';

/**
 * viteRenameFiles — A Vite plugin that renames files during the build process.
 * @param {object} options — Options for the plugin.
 * @param {Array<object>} options.targets — An array of objects, where each object contains:
 *   - `from`: The current file path (source).
 *   - `to`: The new file path (destination).
 * @returns {object} Vite plugin object.
 */
export function viteRenameFiles ({ targets = [] } = {}) {
  return {
    name: 'vite-plugin-rename-files',
    // closeBundle — Hook that is triggered after the build process is completed.
    // It renames the specified files from the old path to the new path.
    closeBundle () {
      // Iterate over each target object to rename files
      for (const { from, to } of targets) {
        // Resolve absolute paths for the old (source) and new (destination) file paths
        const oldPath = path.resolve(from);
        const newPath = path.resolve(to);
        // Check if the source file exists
        if (fs.existsSync(oldPath)) {
          try {
            // Rename the file from oldPath to newPath
            fs.renameSync(oldPath, newPath);
            // Log success message
            console.log(`✔ Renamed ${path.relative(process.cwd(), from)} → ${path.relative(process.cwd(), to)}`);
          } catch (err) {
            // Log warning if file renaming fails
            console.warn(`⚠ Failed to rename ${path.relative(process.cwd(), from)} → ${path.relative(process.cwd(), to)}: ${err.message}`);
          }
        } else {
          // Log a warning if the file is not found
          console.warn(`⚠ File not found: ${path.relative(process.cwd(), from)}`);
        }
      }
    }
  };
}
