import { createBareServer } from '@tomphttp/bare-server-node';
import http from 'http';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import nodeStatic from 'node-static';
import chalk from 'chalk';
import open from 'open';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT || 3000;
const _v = process.env.npm_package_version;

const bare = createBareServer('/bare/');
const serve = new nodeStatic.Server('static/');

const server = http.createServer();

server.on('request', (req, res) => {
  if (req.url === '/version') {
    // Handle version endpoint
    const versionResponse = {
      version: _v,
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(versionResponse));
  } else if (bare.shouldRoute(req)) {
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

const URL = `http://localhost:${port}/`;
server.listen(port, () => {
  console.log(chalk.bold('Thanks for using Dynamic!'), chalk.red(`Please notice that ${chalk.red.bold('dynamic is currently in public BETA')}. please report all issues to the GitHub page. `))
  console.log(chalk.green.bold(`Dynamic ${_v} `) + "live at port " + chalk.bold.green(port));
  (async () => {
    try {
      await open(URL);
    } catch (ERR) {
      console.error(ERR);
    }
  })();
});
