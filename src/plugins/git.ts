import { execa } from 'execa';
import { Argv } from 'yargs';
function gitPlugin(yargs: Argv) {
  yargs.command({
    command: 'commit [files...]',
    describe: 'Commit changes to Git',
    builder: () => {
      yargs.positional('files', {
        describe: 'Files to be committed',
        type: 'string',
        default: '.'
      });
      yargs.option('push', {
        describe: 'Push changes to Git remote',
        type: 'boolean',
        default: false
      });
      yargs.option('message', {
        describe: 'Commit message',
        type: 'string',
        default: 'Update'
      });
      return yargs;
    },
    handler: async (argv) => {
      try {
        const files = argv.files?.join(' ') || '.';
        await execa('git', ['add', files]);
        await execa('git', ['commit', '-m', argv.message]);
        console.log(`Changes (${files}) have been committed to Git with message "${argv.message}".`);
        if (argv.push) {
          await execa('git', ['push']);
          console.log('Changes have been pushed to Git remote.');
        }
      } catch (error) {
        console.error('Failed to commit changes to Git:', error);
      }
    }
  })
}

const command = 'commit [files...]';
const describe = 'Commit changes to Git';

const builder = (yargs: Argv) => {
  yargs.positional('files', {
    describe: 'Files to be committed',
    type: 'string',
    default: '.'
  });
  yargs.option('push', {
    describe: 'Push changes to Git remote',
    type: 'boolean',
    default: false
  });
  yargs.option('message', {
    describe: 'Commit message',
    type: 'string',
    default: 'Update'
  });
  return yargs;
}


const handler = async (argv) => {
  try {
    const files = argv.files?.join(' ') || '.';
    await execa('git', ['add', files]);
    await execa('git', ['commit', '-m', argv.message]);
    console.log(`Changes (${files}) have been committed to Git with message "${argv.message}".`);
    if (argv.push) {
      await execa('git', ['push']);
      console.log('Changes have been pushed to Git remote.');
    }
  } catch (error) {
    console.error('Failed to commit changes to Git:', error);
  }
}

export default gitPlugin;
