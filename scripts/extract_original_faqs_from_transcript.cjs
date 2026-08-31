const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function extractOriginalFaqs() {
  const file = 'C:\\Users\\dell\\.gemini\\antigravity-ide\\brain\\75fbc0ec-a9b3-4715-a777-bdab9af1c5df\\.system_generated\\logs\\transcript.jsonl';
  if (!fs.existsSync(file)) {
    console.log('Transcript not found');
    return;
  }

  const rl = readline.createInterface({ input: fs.createReadStream(file) });
  let foundSnippets = [];

  for await (const line of rl) {
    if (line.includes('Frequently Asked Questions') || line.includes('FAQs – Massage Near Me')) {
      foundSnippets.push(line);
    }
  }

  console.log(`Found ${foundSnippets.length} occurrences in transcript!`);
  for (let i = 0; i < Math.min(foundSnippets.length, 10); i++) {
    console.log(`\n--- Snippet #${i+1} ---`);
    console.log(foundSnippets[i].substring(0, 1000));
  }
}

extractOriginalFaqs();
