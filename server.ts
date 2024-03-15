import 'zone.js/node';

import {APP_BASE_HREF} from '@angular/common';
import {ngExpressEngine} from '@nguniversal/express-engine';
import * as express from 'express';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {AppServerModule} from './src/main.server';
import * as cookieParser from "cookie-parser";
import {COOKIE_LANGUAGE_TAG, HEADER_ACCEPT_LANGUAGE, LANGUAGES} from "./src/constant";
import {DIST_FOLDER} from "./env";
import {api} from "./api";
import * as url from "url";

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const URL_START_WITH_LANGUAGE_REGEX = /^\/[a-z]{2}-[A-Z]{2}(?:\/.*)?$/;
  const INDEX_HTML = existsSync(join(DIST_FOLDER, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  return express()
      .use(cookieParser())
      .use(express.json())
      .engine('html', ngExpressEngine({
        bootstrap: AppServerModule
      }))
      .set('view engine', 'html')
      .set('views', DIST_FOLDER)
      .get('*.*', express.static(DIST_FOLDER, {maxAge: '1y'}))
      .use((req, res, next) => {
        const {url} = req;
        const resolvedLanguageTag = resolveLanguageTag(req.headers[HEADER_ACCEPT_LANGUAGE]);

        if (!url.match(URL_START_WITH_LANGUAGE_REGEX)) {
          // NOTE: If the URL does not start by a language tag pattern, just prepend one
          res.redirect(301, `/${resolvedLanguageTag}${url}`);
        } else if (LANGUAGES.some(({tag}) => url.startsWith(`/${tag}`))) {
          // NOTE: If the URL starts with one of the supported language tags, go for it
          res.cookie(COOKIE_LANGUAGE_TAG, LANGUAGES.find(({tag}) => url.startsWith(`/${tag}`))?.tag, {
            maxAge: 365 * 86_400 * 1_000,
            sameSite: 'strict',
          });
          next();
        } else {
          // NOTE: Otherwise, replace whatever unsupported language with a supported one
          res.redirect(`/${resolvedLanguageTag}${url.substring(6)}`);
        }
      })
      .use('/:languageTag/~', (req, res, next) => {
        const {languageTag} = req.params;

        if (LANGUAGES.some(({tag}) => tag === languageTag)) {
          next();
        } else {
          res.status(400).json({
            message: `Unsupported language tag: '${languageTag}'`,
            routeParam: 'languageTag',
            status: 'ERROR',
            context: 'PATH',
          });
        }
      }, api)
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

function resolveLanguageTag(acceptLanguage = ';') {
  const languages = [
    // NOTE: Extract primary language tag and assign weight of 1
    [acceptLanguage.substring(0, acceptLanguage.indexOf(',')), 1] as const,
    // NOTE: Extract fallback language tags with their respective weights
    ...acceptLanguage
        .substring(1 + acceptLanguage.indexOf(','))
        .split(',')
        .map(_ => _.trim().split(';'))
        .map(([languageTag, quantifier]) => [
          languageTag.trim(),
          parseFloat(quantifier.trim().substring(2)),
        ] as const)]
      // NOTE: Filter out undefined language tags
      .filter(([_]) => _)
      // NOTE: Sort accepted language tags by descending weight order
      .sort(([, a], [, b]) => b - a)
      // NOTE: Only extract accepted language tags
      .map(([_]) => _);

  // NOTE: Iterate over language tags to find the best matches, starting with the highest weighted one
  for (const languageTag of languages) {
    if (LANGUAGES.some(({tag}) => tag === languageTag)) {
      return languageTag;
    } else {
      const globalLanguageTag = LANGUAGES
          .find(({tag}) => tag.startsWith(languageTag + '-'))
          ?.tag;

      if (globalLanguageTag) {
        return globalLanguageTag;
      }
    }
  }

  // NOTE: If everything failed, go for English (Great Britain)
  return 'en-GB';
}
