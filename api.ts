import {Router} from "express";
import {KEY_DIST_FOLDER} from "./src/constant";

export const api = Router({strict: true, mergeParams: true, caseSensitive: true})
    .get('/i18n', (req, res) => {
      res.json({
        DIST_FOLDER: req.app.get(KEY_DIST_FOLDER),
        originalUrl: req.originalUrl,
        params: req.params,
        path: req.path,
        url: req.url,
      });
    });
