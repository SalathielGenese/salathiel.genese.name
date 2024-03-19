import {join} from "node:path";
import {existsSync, readFileSync, statSync, symlinkSync} from "node:fs";

import {Datastore} from "@google-cloud/datastore";
import {Router} from "express";

import {DIST_FOLDER, GCP_CREDENTIALS, GCP_DATASTORE_DATABASE, GCP_PROJECT_ID, NODE_ENV} from "./env";
import type {Article} from "./src/app/services/article.service";
import {jsonFlatten, jsonNest} from "./src/util";
import {LANGUAGES} from "./src/constant";

try {
  // NOTE: Link Google Cloud Firestore/Datastore proto files at the expected path, before Datastore instantiation
  'development' === NODE_ENV && symlinkSync(join(DIST_FOLDER, 'protos'), join(DIST_FOLDER, '..', 'protos'));
} catch (ignored) {
}

const messages: Record<string, Record<string, string>> = {};
const datastore = new Datastore({
  credentials: JSON.parse(existsSync(GCP_CREDENTIALS) && statSync(GCP_CREDENTIALS).isFile()
      ? readFileSync(GCP_CREDENTIALS).toString()
      : GCP_CREDENTIALS),
  databaseId: GCP_DATASTORE_DATABASE,
  projectId: GCP_PROJECT_ID,
});

export const api = Router({strict: true, mergeParams: true, caseSensitive: true})
    .get('/articles/:slug', async (req, res) => {
      const metadata = {links: {self: req.originalUrl} as Record<string, string>};
      const {slug, languageTag} = req.params as Record<string, string>;

      try {
        const article = await datastore.get(datastore.key(['articles', slug]))
            .then(([article]: [null | Article & Partial<Record<'links', Record<string, string>>>]) => {
              return languageTag === article?.languageTag ? article : null;
            });

        if (article) {
          Object.entries(article.links ?? {}).forEach(([languageTag, slug]) => {
            metadata.links[languageTag] = `/${languageTag}/~/articles/${slug}`;
          });
          res.json(success({...article, links: undefined}, metadata));
        } else {
          res.status(404).json(error('Not Found', metadata, 'NOT_FOUND'));
        }
      } catch (err) {
        console.error(err);
        res.status(500).json(error('Internal Server Error', metadata));
      }
    })
    .post('/hires', async (req, res) => {
      const now = new Date();
      const metadata = {links: {self: req.originalUrl}};
      const {contactPhoneNumber, contactEmail, contactName, proposal, company} = req.body;
      const data = {contactPhoneNumber, contactEmail, contactName, proposal, company};
      const {headers: {'x-forwarded-host': xForwardedHost, origin, host}, protocol, secure} = req;

      datastore.upsert({
        data: {
          ...data,
          responded: false,
          now: now.toISOString(),
          '@': (origin ?? `${secure ? 'https' : protocol}://${xForwardedHost ?? host}`) + metadata.links.self,
        },
        key: datastore.key([
          'hires',
          `${contactEmail}-${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}`,
        ]),
      })
          .then(result => res.json(success(null, metadata)))
          .catch(err => {
            console.error(err);
            return res.status(500).json(error('Internal Server Error', metadata));
          });
    })
    .get('/i18n/*', (req, res) => {
      const {languageTag} = req.params as Record<string, string>;
      messages[languageTag] ??= (() => {
        const LOCALE_ASSET = join(DIST_FOLDER, 'assets', 'locales', `${languageTag}.json`);

        if (existsSync(LOCALE_ASSET)) {
          return jsonFlatten(JSON.parse(readFileSync(LOCALE_ASSET).toString()));
        } else {
          return undefined!;
        }
      })();
      const scoped = messages[languageTag] ?? {};
      res.json(success(
          jsonNest(decodeURIComponent(req.path.substring(6)).split(',')
              .reduce((projection, key) => ({
                [key]: scoped[key],
                ...projection,
              }), {})),
          {
            links: {
              self: req.originalUrl,
              localized: LANGUAGES.map(({tag}) => tag)
                  .filter(tag => languageTag !== tag)
                  .reduce((links, otherLanguageTag) => ({
                    [otherLanguageTag]: `/~/${otherLanguageTag}/${req.path.substring(6)}`,
                    ...links,
                  }), {}),
            },
          }));
    });

function success(content: any, metadata?: any) {
  return {
    status: 'SUCCESS',
    metadata,
    content,
  };
}

function error(message: string, metadata?: any, error?: any) {
  return {
    status: 'ERROR',
    metadata,
    message,
    error,
  };
}
