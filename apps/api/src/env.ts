import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootEnvPath = resolve(currentDir, '../../../.env');

config({ path: rootEnvPath });

if (!process.env.DATABASE_URL) {
  throw new Error(
    `DATABASE_URL is missing. Create ${rootEnvPath} from .env.example before starting the API.`,
  );
}
