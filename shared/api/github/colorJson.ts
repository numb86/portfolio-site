// This file is based on the code below.
// from https://github.com/ozh/github-colors/blob/6d05cd6bfe18fb67e8b2c1bab556aefe21fbe2f4/colors.json

import fs from 'fs';
import path from 'path';

export type ColorJson = {[x: string]: {color: string | null}};

const COLOR_JSON_DIR_NAME = 'shared/api/github';
const COLOR_JSON_FILE_NAME = './color.json';

const dir = path.join(process.cwd(), COLOR_JSON_DIR_NAME);
const filePath = path.join(dir, COLOR_JSON_FILE_NAME);

export const colorJson: ColorJson = JSON.parse(
  fs.readFileSync(filePath, 'utf8')
);
