import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let hasFileToSort = false;
let noSortingRequired = true;

const sortObject = (source) => {
  const target = {};
  Object.keys(source)
    .sort()
    .forEach((key) => {
      let value = source[key];
      target[key] = value;
    });
  return target;
};

execSync('git status --porcelain=v1', { encoding: 'utf8' })
  .split('\n')
  .forEach((line) => {
    if (/frontend\/src\/shared\/locales\/.*\.json/.test(line)) {
      console.log('Found file to sort:', line);
      hasFileToSort = true;
      const relativeFilePath = line.slice(line.indexOf('src/frontend/') + 13);
      const _newDir =
        __dirname.slice(0, __dirname.indexOf('\\scripts')) +
        __dirname.slice(__dirname.indexOf('\\scripts') + '\\scripts'.length);
      const absoluteFilePath = path.join(_newDir, relativeFilePath);
      const content = JSON.parse(fs.readFileSync(absoluteFilePath, 'utf8'));
      const sorted = sortObject(content);
      if (JSON.stringify(content) !== JSON.stringify(sorted)) {
        fs.writeFileSync(absoluteFilePath, JSON.stringify(sorted, null, 2), 'utf8');
        console.log('\x1b[32m', 'sorted', relativeFilePath, '\x1b[0m');
        noSortingRequired = false;
      }
    }
  });

if (!hasFileToSort) {
  console.log('\x1b[31m', 'No file found to sort.', '\x1b[0m');
}

if (noSortingRequired) {
  console.log('\x1b[32m', 'No sorting required.', '\x1b[0m');
}

process.exit(0);
