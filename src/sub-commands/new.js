import {
  which,
  rm,
  exec
} from 'shelljs';
import SubCommand from '../models/sub-command';
import Create from '../tasks/create';
import GitPull from '../tasks/git-pull';
import ProjectSettings from '../models/project-settings';

// eventually allow users to create new projects based on a flag
// ie. they can create a new react-redux-starter-kit or a new
// universal react starter kit, etc.

export default class New extends SubCommand {
  constructor() {
    super();
    this.createDirTask = new Create(this.environment);
    this.gitPullTask = new GitPull(this.environment);
  }

  printUserHelp() {
    this.ui.write('Creates a new metalpress project from a git repo starter boilerplate.\n');
  }

  run(cliArgs) {
    this.confirmGit();
    this.createDirTask.run(cliArgs).then(() => {
      let fetch_url;
      
      fetch_url = 'https://github.com/cameronroe/metalpress-boilerplate.git';
      // if (cliArgs.useBoilerplate) {
      //   fetch_url = 'https://github.com/cameronroe/metalpress-boilerplate.git';
      // } else if (cliArgs.useUIKit) {
      //   fetch_url = 'https://github.com/SpencerCDixon/redux-cli-ui-kit-boilerplate.git';
      // } else {
      //   fetch_url = 'https://github.com/davezuko/react-redux-starter-kit.git';
      // }

      // if (cliArgs.useSsh) {
      //   this.ui.writeInfo('Using SSH to fetch repo');

      //   if (cliArgs.useBoilerplate) {
      //     fetch_url = 'git@github.com:SpencerCDixon/redux-cli-boilerplate.git';
      //   } else if (cliArgs.useUIKit) {
      //     fetch_url = 'https://github.com/SpencerCDixon/redux-cli-ui-kit-boilerplate.git';
      //   } else {
      //     fetch_url = 'git@github.com:davezuko/react-redux-starter-kit.git';
      //   }
      // }

      this.gitPullTask.run(fetch_url).then(() => {
        this.createProjectSettings();
        this.resetGitHistory();
      });
    });
  }

  confirmGit() {
    if (!which('git')) {
      this.ui.writeError('This script requires you have git installed');
      this.ui.writeInfo('If you have homebrew installed try: brew install git');
      process.exit(1);
    }
  }

  // Should maybe prompt user for permission to do this since it's dangerous.
  resetGitHistory() {
    this.ui.writeInfo('Removing .git folder');
    rm('-rf', '.git');
    exec('git init && git add -A && git commit -m "Initial commit"', {
      silent: true
    });
    this.ui.writeCreate('Created new .git history for your project');
    this.ui.writeInfo('Congrats! New Metalpress site ready to go. CLI generators configured and ready to go.');
  }

  // All settings for react-redux-starter-kit live in this template so when
  // new projects get created users can immediately start using the CLI
  createProjectSettings() {
    this.ui.writeInfo('creating a default .metalpress for your project');
    const configTemplate = '../../templates/.metalpress';
    const settings = new ProjectSettings(configTemplate);
    settings.save();

    this.ui.writeCreate('.metalpress with boilerplate settings saved.');
  }
}