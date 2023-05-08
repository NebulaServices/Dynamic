#!/usr/bin/env node
import { execa } from 'execa';
import chalk from 'chalk';
import commands from './commands.js';

const [command, ...args] = process.argv.slice(2);

async function runCommand(commandName) {
  const { command: cmd, answer } = commands[commandName];
  try {
    
    await execa(cmd, { stdio: 'inherit', shell: true });
  } catch (e) { 
    console.log('')
  } 
  console.log(chalk.green.bold('[Dynamic] ') + answer);
}

function showHelp() {
  console.log(
    chalk.green.bold('[Dynamic] ') +
      `Commands:\nhelp: shows this message\nbuild: builds all scripts necessary for Dynamic to properly run.\nstart: starts Dynamic.`
  );
}

function showVersion() {
  console.log(
    `${chalk.green.bold.underline('v1.0.0')}\n${chalk.green('Written')} by ${chalk.bold.yellow(
      'EnderKingJ'
    )}\n${chalk.green('UI')} designed by ${chalk.green.bold(
      'GreenWorld'
    )}\nMade with ${chalk.red.bold('<3')} at ${chalk.magenta.bold(
      'Nebula Services'
    )}`
  );
}

async function main() {
  if (command === undefined) {
    console.log(
      chalk.green.bold('[Dynamic] ') +
        chalk.red("Invalid command. Try running 'dynamic help'")
    );
  } else if (command in commands) {
    try {
      await runCommand(command);
    } catch (error) {
      console.error(chalk.red(`Error running command: ${command}`));
      console.error(error);
      process.exit(1);
    }
  } else if (command === 'version' || command === 'ver') {
    showVersion();
  } else if (command === 'help' || command === '-h') {
    showHelp();
  } else {
    console.error(chalk.red(`Invalid command: ${command}`));
    process.exit(1);
  }
}

main();
