const { execSync } = require('child_process');
const prompt = require('prompt');
const pkg = require('./package.json');

const repoName = process.env.REPO || '[REPOSITORY_NAME]';

const version = {
  prepatch: {
    type: 'prepatch',
    text: 'Are you sure to create patch version with build number?',
  },
  preminor: {
    type: 'preminor',
    text: 'Are you sure to create minor version with build number?',
  },
  premajor: {
    type: 'premajor',
    text: 'Are you sure to create major version with build number?',
  },
  prerelease: {
    type: 'prerelease',
    text: 'Are you sure to increase build number?',
  },
  patch: {
    type: 'patch',
    text: 'Are you sure to create final patch version?',
  },
  minor: {
    type: 'minor',
    text: 'Are you sure to create final minor version?',
  },
  major: {
    type: 'major',
    text: 'Are you sure to create final major version?',
  },
};

const releaseTypes = 'prepatch|preminor|premajor|prerelease|patch|minor|major|rollout';
const releaseTypesX = new RegExp(releaseTypes);

const params = process.argv;

if (/\?|--help|-h/.test(params[2]) || (params[4] && /\?|--help|-h/.test(params[4]))) {
  console.log('\n');
  console.log('Usage:');
  console.log(
    `node release.js [branch=branch-name] [release-type=${releaseTypes}] [custom-message]`
  );
  console.log('\n');
  console.log('%s\x1b[34m%s\x1b[0m', 'created by: ', '@denisetya1');
  console.log('\n');

  process.exit();
}

const branch = params[2];
const releaseType = params[3];
const msg = params[4] || null;

if (!releaseTypesX.test(releaseType)) {
  console.log('\n');
  console.log('\x1b[33m%s\x1b[0m', 'Please refer to this command!');
  console.log(
    `node release.js [branch=branch-name] [release-type=${releaseTypes}] [custom-message]`
  );
  console.log('\n');
  process.exit();
}

if (releaseType === 'rollout') {
  console.log('initialize...\n');
  console.log('update release branch...\n');

  console.log(execSync(`git checkout ${branch}`).toString());
  console.log(execSync(`git pull origin ${branch}`).toString());
  console.log(execSync(`git pull origin main`).toString());
  console.log(execSync(`npm version prepatch`).toString());
  const prepatchVersion = execSync(
    `npm version ${version[releaseType].type} -m 'prepare next release %s'`
  ).toString();

  console.log(execSync(`git push origin v${prepatchVersion.replace('v', '')}`).toString());
  console.log(execSync(`git push origin ${branch}`).toString());
  console.log('rollout finished...\n');
  process.exit();
}

console.log('====================================================');
console.log('%s\x1b[34m%s\x1b[0m', `App Name: `, pkg.name);
console.log('%s\x1b[34m%s\x1b[0m', `Current Version: `, pkg.version);
console.log('====================================================');
console.log('starting new release...');

const gitBranch = execSync('git branch').toString();
const matchBranch = gitBranch.match(/\* ([^\\]+)/);

// console.log('curent branch '+currentBranch);
if (matchBranch[1].replace('\n', '') !== branch) {
  const checkout = execSync(`git checkout ${branch}`).toString();

  console.log(checkout);
} else {
  console.log(`On branch ${branch}`);
}

const gitStatusOutput = execSync('git status').toString();

console.log('checking branch...');
if (/working tree clean/.test(gitStatusOutput)) {
  // console.log('branch is ok...');
  console.log('\n');
} else {
  console.log(gitStatusOutput);
  console.log('\x1b[31m%s\x1b[0m', 'working directory not clean..');
  console.log('\x1b[31m%s\x1b[0m', 'Process Stopped!');
  console.log('\n');
  process.exit();
}

console.log('pulling updates...');
const gitPull = execSync(`git pull origin ${branch}`).toString();

console.log(gitPull);

if (/conflict/gi.test(gitPull)) {
  execSync(`git merge --abort`);
  console.log('\x1b[31m%s\x1b[0m', '\nPulling aborted\nPlease fix conflict manually.\n');
  process.exit();
}

console.log('\n');
console.log('\x1b[33m%s\x1b[0m', 'make sure latest updates have been merged to this branch...');
console.log('\x1b[33m%s\x1b[0m', 'last commit:');
const gitLog = execSync('git log --oneline -6').toString();

console.log('\x1b[33m%s\x1b[0m', gitLog);
console.log('\n');

console.log('npm checking all...');
execSync('npm run check-all');

prompt.start();
// disable prefix message & colors
prompt.message = '';
prompt.delimiter = '';
prompt.colors = false;

// wait for user confirmation
prompt.get(
  {
    properties: {
      // setup the dialog
      confirm: {
        // allow yes, no, y, n, YES, NO, Y, N as answer
        pattern: /^(yes|no|y|n)$/gi,
        description: version[releaseType].text,
        message: 'Type yes/no',
        required: true,
        default: 'no',
      },
    },
  },
  function (err, result) {
    // transform to lower case
    const c = result.confirm.toLowerCase();

    // yes or y typed ? otherwise abort
    if (c !== 'y' && c !== 'yes') {
      console.log('release cancelled.');

      return;
    }

    console.log('%s\x1b[35m%s\x1b[0m', 'running ', `\`npm version ${version[releaseType].type}\``);
    let newVersion = execSync(
      `npm version ${version[releaseType].type} -m 'build: update ${branch} version to %s ${
        msg && msg !== null ? `, ${msg}` : ''
      }'`
    ).toString();

    newVersion = `v${newVersion.replace('v', '')}`;

    console.log('%s\x1b[32m%s\x1b[0m', 'New version created: ', newVersion);

    console.log('deploying new version...');
    const pushTags = execSync(`git push origin ${newVersion}`).toString();

    console.log(pushTags);

    console.log(`update ${branch} branch...`);
    const push = execSync(`git push origin ${branch}`).toString();

    console.log(push);

    console.log(
      '\x1b[32m%s\x1b[0m',
      `\n
    .|'''.|  '||'  '|'   ..|'''.|   ..|'''.| '||''''|   .|'''.|   .|'''.| 
    ||..  '   ||    |  .|'     '  .|'     '   ||  .     ||..  '   ||..  ' 
     ''|||.   ||    |  ||         ||          ||''|      ''|||.    ''|||. 
   .     '||  ||    |  '|.      . '|.      .  ||       .     '|| .     '||
   |'....|'    '|..'    ''|....'   ''|....'  .||.....| |'....|'  |'....|' \n\n`
    );

    console.log('\x1b[32m%s\x1b[0m', 'Congratulation, new version has been created.');
    console.log('\n');
    console.log(
      "don't forget to re-check latest commit on latest release number\nto make sure all updates has been included."
    );
    console.log(`https://github.com/tiket/${repoName}/commits/${newVersion}`);
    console.log('\n');
  }
);
