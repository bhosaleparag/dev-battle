// app/api/run-code/route.js
import { NextResponse } from 'next/server';

const PISTON_API = 'https://emkc.org/api/v2/piston';

// Queue system to respect 5 req/sec rate limit
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.requestsPerSecond = 5;
    this.interval = 1000 / this.requestsPerSecond; // 200ms between requests
  }

  async add(code, inputs) {
    return new Promise((resolve, reject) => {
      this.queue.push({ code, inputs, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const { code, inputs, resolve, reject } = this.queue.shift();

    try {
      const result = await this.executeCode(code, inputs);
      resolve(result);
    } catch (error) {
      reject(error);
    }

    // Wait before processing next request
    setTimeout(() => {
      this.processing = false;
      this.process();
    }, this.interval);
  }

  async executeCode(code, inputs) {
    const wrappedCode = `
const userFunction = ${code};
const inputs = ${JSON.stringify(inputs)};
const results = [];

for (const input of inputs) {
  try {
    const result = userFunction(...input);
    results.push({ output: result });
  } catch (error) {
    results.push({ error: error.message });
  }
}

console.log(JSON.stringify(results));
`;

    const response = await fetch(`${PISTON_API}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'javascript',
        version: '18.15.0',
        files: [{ content: wrappedCode }]
      })
    });

    if (!response.ok) {
      throw new Error(`Piston API error: ${response.status}`);
    }

    return await response.json();
  }
}

// Create single queue instance
const queue = new RequestQueue();

export async function POST(request) {
  try {
    const { code, inputs } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // Add to queue and wait for execution
    const result = await queue.add(code, inputs);

    // Handle response
    if (result.run.stderr) {
      return NextResponse.json({ error: result.run.stderr });
    }

    try {
      const output = JSON.parse(result.run.output);
      return NextResponse.json(output);
    } catch {
      return NextResponse.json({ error: 'Invalid output format' });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Check queue status and available languages
export async function GET() {
  try {
    const response = await fetch(`${PISTON_API}/runtimes`);
    const runtimes = await response.json();
    return NextResponse.json({ 
      status: 'ok',
      queueLength: queue.queue.length,
      javascript: runtimes.find(r => r.language === 'javascript') 
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message });
  }
}