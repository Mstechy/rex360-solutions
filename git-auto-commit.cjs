const { execSync } = require('child_process');
const path = require('path');

const repoDir = path.resolve(__dirname);

console.log('Staging all changes...');
execSync('git add .', { cwd: repoDir, stdio: 'inherit' });

console.log('Committing changes...');
execSync('git commit -m "Complete ServicesSection timelines update (72hrs, 5-14 days, etc.), Services.jsx features arrays, Registration.jsx/App.jsx refinements, vite.config.js, multiple TODO updates"', { cwd: repoDir, stdio: 'inherit' });

console.log('Handling dev branch...');
const branches = execSync('git branch --list dev', { cwd: repoDir }).toString().trim();
if (!branches) {
  execSync('git checkout -b dev', { cwd: repoDir, stdio: 'inherit' });
} else {
  execSync('git checkout dev', { cwd: repoDir, stdio: 'inherit' });
}

console.log('Pushing to origin dev...');
execSync('git push origin dev', { cwd: repoDir, stdio: 'inherit' });

console.log('Git operations completed programmatically!');
