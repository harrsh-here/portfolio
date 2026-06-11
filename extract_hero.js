const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:/Users/DELL/.gemini/antigravity-ide/brain/6fcdef05-94ef-45c5-97f4-015d03cc4a73/.system_generated/logs/transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('HeroSection.jsx')) {
      const obj = JSON.parse(line);
      if (obj.content && obj.content.includes('HARSH')) {
        console.log("FOUND!");
        console.log(obj.content);
        break; // stop after first find
      }
      if (obj.tool_calls) {
        for (const call of obj.tool_calls) {
           if (call.args && call.args.TargetContent && call.args.TargetContent.includes('HARSH')) {
              console.log("FOUND IN TARGET CONTENT!");
              console.log(call.args.TargetContent);
              return;
           }
        }
      }
    }
  }
}

processLineByLine();
