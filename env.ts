import {join} from "node:path";
import {env, cwd} from "node:process";

export const {
  NODE_ENV = 'development',
  GCP_CREDENTIALS = '/dev/null',
  GCP_PROJECT_ID = 'my-project-id',
  GCP_DATASTORE_DATABASE = '(default)',
} = env;
export const DIST_FOLDER = join(cwd(), 'dist/salathiel.genese.name/browser');
