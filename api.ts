import {join} from "node:path";
import {existsSync, readFileSync, statSync, symlinkSync} from "node:fs";

import {Datastore} from "@google-cloud/datastore";
import {Router} from "express";

import {DIST_FOLDER, GCP_CREDENTIALS, GCP_DATASTORE_DATABASE, GCP_PROJECT_ID} from "./env";
import {jsonFlatten, jsonNest} from "./src/util";
import {LANGUAGES} from "./src/constant";

try {
  // NOTE: Link Google Cloud Firestore/Datastore proto files at the expected path, before Datastore instantiation
  symlinkSync(join(DIST_FOLDER, 'protos'), join(DIST_FOLDER, '..', 'protos'));
} catch (ignored) {
}

const messages: Record<string, Record<string, string>> = {};

export const api = Router({strict: true, mergeParams: true, caseSensitive: true})
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
