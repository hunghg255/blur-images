import fs from 'node:fs/promises';
import path from 'node:path';

import * as globby from 'globby';

import { blurImage } from '../src';

const fixtures = globby.globbySync('test/original/*.{jpg,jpeg,webp,png}');
const outputDir = 'test/output';

const start = async () => {
  for (const fixture of fixtures) {
    const name = fixture.split('/').pop().split('.').shift();

    const result = await blurImage(fixture);

    await fs.writeFile(path.join(outputDir, `${name}.webp`), result.content);

    const result1 = await blurImage(fixture, { outputFormat: 'jpeg' });

    await fs.writeFile(path.join(outputDir, `${name}.jpeg`), result1.content);
  }
};

start();
