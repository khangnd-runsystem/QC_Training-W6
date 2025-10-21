import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

/**
 * Read JSON file synchronously and parse to T
 */
export function readJson<T>(relativePath: string): T {
  const filePath = path.resolve(process.cwd(), relativePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

/**
 * Read CSV file (synchronously) and return array of objects where keys are taken from the header row.
 */
export function readCsv<T = Record<string, string>>(relativePath: string, delimiter = ','): T[] {
  const filePath = path.resolve(process.cwd(), relativePath);
  const raw = fs.readFileSync(filePath, 'utf8');
  return parse(raw, { columns: true, delimiter, skip_empty_lines: true }) as T[];
}


