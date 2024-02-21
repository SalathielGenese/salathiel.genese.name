import 'zone.js/node';

import {APP_BASE_HREF} from '@angular/common';
import {ngExpressEngine} from '@nguniversal/express-engine';
import * as express from 'express';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {AppServerModule} from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const DIST_FOLDER = join(process.cwd(), 'dist/salathiel.genese.name/browser');
  const INDEX_HTML = existsSync(join(DIST_FOLDER, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  return express()
      .engine('html', ngExpressEngine({
        bootstrap: AppServerModule
      }))
      .set('view engine', 'html')
      .set('views', DIST_FOLDER)
      .get('*.*', express.static(DIST_FOLDER, {
        maxAge: '1y'
      }))
      .get('*', (req, res) => {
        res.render(INDEX_HTML, {req, providers: [{provide: APP_BASE_HREF, useValue: req.baseUrl}]});
      });
}

function run(): void {
  const backlog = 2 ** 10;
  const port = +(process.env['PORT'] || 4000);
  const host = process.env['HOST'] ?? '0.0.0.0';
  process.on('SIGHUP', () => listeningServer.close());
  process.on('SIGINT', () => listeningServer.close());
  process.on('SIGQUIT', () => listeningServer.close());
  process.on('SIGTERM', () => listeningServer.close());

  const listeningServer = app()
      .listen(port, host, backlog, () => console.log(`STARTED http://${host}:${port}`));
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
