const fs = require('fs');

const data = JSON.parse(fs.readFileSync('seedblogs.json', 'utf8'));
const posts = data.filter(p => p.post_type === 'post' && p.post_status === 'publish');

console.log(`Found ${posts.length} published blog posts.`);

function cleanContent(rawContent) {
  if (!rawContent) return "";
  
  // If it's not a Divi builder post, return as-is
  if (!rawContent.includes('[et_pb_section')) {
    return rawContent;
  }
  
  // Extract all et_pb_text blocks
  const textBlocks = [];
  const textRegex = /\[et_pb_text[^\]]*\]([\s\S]*?)\[\/et_pb_text\]/gi;
  let match;
  while ((match = textRegex.exec(rawContent)) !== null) {
    textBlocks.push(match[1].trim());
  }
  
  if (textBlocks.length > 0) {
    return textBlocks.join('\n');
  }
  
  // Fallback: strip shortcode tags but keep inner content
  return rawContent.replace(/\[\/?et_pb_[^\]]*\]/g, "");
}

function extractSchema(rawContent) {
  if (!rawContent) return "";
  // Find et_pb_code content which contains JSON schemas
  const codeRegex = /\[et_pb_code[^\]]*\]([\s\S]*?)\[\/et_pb_code\]/gi;
  let match;
  const schemas = [];
  while ((match = codeRegex.exec(rawContent)) !== null) {
    const code = match[1].trim();
    if (code.includes('{') && code.includes('}')) {
      // Strip html comments if any
      const cleanedCode = code.replace(/<!--[\s\S]*?-->/g, "").trim();
      schemas.push(cleanedCode);
    }
  }
  return schemas.join('\n\n');
}

// Test on the first 3 posts
posts.slice(0, 3).forEach((p, idx) => {
  console.log(`\n=================== TEST POST ${idx + 1}: ${p.post_title} ===================`);
  const cleaned = cleanContent(p.post_content);
  const schema = extractSchema(p.post_content);
  console.log(`Cleaned Content Sample (first 500 chars):\n${cleaned.substring(0, 500)}...`);
  console.log(`\nExtracted Schema Sample:\n${schema.substring(0, 300)}...`);
});
