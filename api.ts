import {join} from "node:path";
import {existsSync, readFileSync} from "node:fs";
import {Router} from "express";
import {KEY_DIST_FOLDER, LANGUAGES} from "./src/constant";
import {jsonFlatten, jsonNest} from "./src/util";

const messages: Record<string, Record<string, string>> = {};

export const api = Router({strict: true, mergeParams: true, caseSensitive: true})
    .get('/i18n/*', (req, res) => {
      const {languageTag} = req.params as Record<string, string>;
      messages[languageTag] ??= (() => {
        const DIST_FOLDER = req.app.get(KEY_DIST_FOLDER);
        const LOCALE_ASSET = join(DIST_FOLDER, 'assets', 'locales', `${languageTag}.json`);

        if (existsSync(LOCALE_ASSET)) {
          return jsonFlatten(JSON.parse(readFileSync(LOCALE_ASSET).toString()));
        } else {
          return undefined!;
        }
      })();
      const scoped = messages[languageTag] ?? {};
      res.json(success(
          jsonNest(req.path.substring(6).split(',')
              .reduce((projection, key) => ({
                [key]: scoped[key],
                ...projection,
              }), {})),
          {
            links: {
              self: req.originalUrl,
              localized: LANGUAGES.map(({tag}) => tag)
                  .filter(tag => languageTag !== tag)
                  .reduce((links, tag) => ({
                    [tag]: `/${tag}/${req.originalUrl.substring(2 + languageTag.length)}`,
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
