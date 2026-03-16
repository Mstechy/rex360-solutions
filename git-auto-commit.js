#!/usr/bin/env node
import { execSync } from 'child_process';
import { resolve } from 'path';
import { exit } from 'process';

const repoDir = resolve('./');

try {
  console.log('Staging all changes...');
  execSync('git add .', { cwd: repoDir, stdio: 'inherit' });

  console.log('Committing changes...');
  execSync(`git commit -m "Complete ServicesSection timelines update (72hrs, 5-14 days, etc.), Services.jsx features arrays, Registration.jsx/App.jsx refinements, vite.config.js, multiple TODO updates"`, { cwd: repoDir, stdio: 'inherit' });

  console.log('Checking dev branch...');
  let branches;
  try {
    branches
