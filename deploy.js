// Upload remaining files to GitHub
const fs = require('fs');
const { execSync } = require('child_process');

// Read script.js file
const scriptContent = fs.readFileSync('script.js', 'utf8');
const base64Content = Buffer.from(scriptContent).toString('base64');

// Upload using GitHub CLI
try {
    const result = execSync(`gh api repos/rohithnani0282-1/sridevi-pindi-vantalu/contents/script.js --method PUT --field message="Add complete JavaScript functionality" --field content="${base64Content}"`, { encoding: 'utf8' });
    console.log('JavaScript uploaded successfully!');
    console.log(result);
} catch (error) {
    console.error('Error uploading JavaScript:', error.message);
}
