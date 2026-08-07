const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace emails with antoine.lyles@yahoo.com
    content = content.replace(/[a-zA-Z0-9._%+-]+@eaglerevolution\.com/gi, 'antoine.lyles@yahoo.com');
    content = content.replace(/banderson@eaglerevolution\.com/gi, 'antoine.lyles@yahoo.com');
    content = content.replace(/admin@eaglerevolution\.com/gi, 'antoine.lyles@yahoo.com');
    content = content.replace(/info@eaglerevolution\.com/gi, 'antoine.lyles@yahoo.com');
    
    // Replace domains with 410-muscletherapy.com
    content = content.replace(/eaglerevolution\.com/gi, '410-muscletherapy.com');
    content = content.replace(/https:\/\/eaglerevolution\.com/gi, 'https://410-muscletherapy.com');
    
    // Replace social handles
    content = content.replace(/@EagleRevolution/gi, '@410MuscleTherapy');
    content = content.replace(/Eagle-Revolution-61564977483096/gi, '410-Muscle-Therapy-61564977483096');
    
    // Replace database names
    content = content.replace(/eagle_revolution/gi, '410_muscle_therapy');
    
    // Replace remaining variations
    content = content.replace(/Eagle\s+Edge/gi, '410 Edge');
    content = content.replace(/The\s+Eagle\s+Edge/gi, 'The 410 Edge');
    content = content.replace(/Eagle\s+Revolution/gi, '410 Muscle Therapy');
    
    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
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

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const scriptsDir = path.join(projectRoot, 'scripts');

if (fs.existsSync(srcDir)) {
    console.log(`Starting comprehensive replacement in: ${srcDir}`);
    traverseDir(srcDir);
}
if (fs.existsSync(scriptsDir)) {
    console.log(`Starting comprehensive replacement in: ${scriptsDir}`);
    traverseDir(scriptsDir);
}
console.log("Comprehensive replacement complete!");
