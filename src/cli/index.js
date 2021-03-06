import commander from 'commander';
import { version } from '../version';

const program = commander;

program
  .version(version());

program
  .command('init', 'initialize a metalpress.config.js file');

program
  .command('new', 'creates a new metalpress project');

program
  .command('serve', 'start a server on http://localhost:3000');

program
  .command('deploy', 'deploy a metalpress project');

program.parse(process.argv);