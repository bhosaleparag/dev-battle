/**
 * Safely parse various input formats for code editor/runner
 * Handles: arrays, objects, strings, numbers, booleans, and mixed types
 */

/**
 * Main parser function - attempts multiple parsing strategies
 * @param {string} input - The input string to parse
 * @returns {Object} - { success: boolean, data: any, error: string|null }
 */
export default function parseInput(input) {
  try {
    return JSON.parse(input); // try strict JSON first
  } catch {
    try {
      return json5.parse(input); // allow single quotes, comments, etc.
    } catch {
      return input; // fallback: keep as string
    }
  }
}

/**
 * Parse multiple inputs (for test cases with multiple parameters)
 * @param {string[]} inputs - Array of input strings
 * @returns {Object} - { success: boolean, data: any[], errors: string[] }
 */
export function parseMultipleInputs(inputs) {
  const results = [];
  for (let i = 0; i < inputs.length; i++) {
    const result = parseInput(inputs[i]);
    results.push(result);
  }

  return results
}

/**
 * Format parsed data back to string (for display)
 * @param {any} data - The data to format
 * @returns {string} - Formatted string
 */
export function formatOutput(data) {
  if (data === null) return 'null';
  if (data === undefined) return 'undefined';
  if (typeof data === 'string') return data;
  if (typeof data === 'number' || typeof data === 'boolean') return String(data);
  
  try {
    return JSON.stringify(data, null, 2);
  } catch (e) {
    return String(data);
  }
}