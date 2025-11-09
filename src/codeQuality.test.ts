import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const MAX_LINES = 300;

function getAllSourceFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);

    // Skip node_modules, dist, hidden directories, and package files
    if (file === 'node_modules' || file === 'dist' || file.startsWith('.') ||
        file === 'package-lock.json' || file === 'package.json') {
      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      getAllSourceFiles(filePath, fileList);
    } else if (
      file.endsWith('.ts') ||
      file.endsWith('.js') ||
      file.endsWith('.tsx') ||
      file.endsWith('.jsx') ||
      file.endsWith('.json')
    ) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function countLines(filePath: string): number {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

describe('Code Quality - File Size', () => {
  it('should have all source files under 300 lines', () => {
    const srcDir = path.join(__dirname, '..');
    const sourceFiles = getAllSourceFiles(srcDir);

    const oversizedFiles: { file: string; lines: number }[] = [];

    sourceFiles.forEach(file => {
      const lines = countLines(file);
      if (lines > MAX_LINES) {
        const relativePath = path.relative(srcDir, file);
        oversizedFiles.push({ file: relativePath, lines });
      }
    });

    if (oversizedFiles.length > 0) {
      const errorMessage = oversizedFiles
        .map(({ file, lines }) => `  - ${file}: ${lines} lines (exceeds ${MAX_LINES})`)
        .join('\n');

      console.log('Oversized files found:');
      console.log(errorMessage);
      expect(oversizedFiles.length, errorMessage).toBe(0);
    }

    expect(oversizedFiles.length).toBe(0);
  });
});
