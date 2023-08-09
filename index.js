import { createBareServer } from '@tomphttp/bare-server-node';
import http from 'http';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import nodeStatic from 'node-static';
import chalk from 'chalk';



const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bare = createBareServer('/bare/');
const serve = new nodeStatic.Server('static/');

const server = http.createServer();

server.on('request', (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    serve.serve(req, res);
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req, socket, head)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen({
  port: port,
}, () => {
  console.log(chalk.bold('Thanks for using Dynamic!'), chalk.red(`Please notice that ${chalk.red.bold('dynamic is currently in public BETA')}. please report all issues to the GitHub page. `))
  console.log(chalk.green.bold("[Dynamic] ") + "live at port " + chalk.bold.green(port));
});
