// tools/clear.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const distPath = path.join(projectRoot, 'dist');

if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true });
  console.log('"dist" folder deleted successfully.');
} else {
  console.log('No "dist" folder found.');
}
