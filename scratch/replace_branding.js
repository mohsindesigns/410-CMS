const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Case-insensitive replacement of "Eagle Revolution" -> "410 Muscle Therapy"
    const newContent = content.replace(/Eagle\s+Revolution/gi, '410 Muscle Therapy');
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
                traverseDir(fullPath);
            }
        } else {
            const ext = path.extname(file);
            if (['.ts', '.tsx', '.js', '.jsx', '.json', '.cjs', '.mjs', '.css', '.html'].includes(ext)) {
                replaceInFile(fullPath);
            }
        }
    }
}

// Target the src folder and scripts folder
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const scriptsDir = path.join(projectRoot, 'scripts');

if (fs.existsSync(srcDir)) {
    console.log(`Starting replacement in: ${srcDir}`);
    traverseDir(srcDir);
}
if (fs.existsSync(scriptsDir)) {
    console.log(`Starting replacement in: ${scriptsDir}`);
    traverseDir(scriptsDir);
}
console.log("Replacement complete!");
