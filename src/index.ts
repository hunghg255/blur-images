/* eslint-disable indent */
import pMap from 'p-map';
import sharp from 'sharp';

async function computeLqipImage(input: Buffer | string | Buffer[] | string[], opts = {}) {
  const { resize = 16, outputFormat = 'webp', outputOptions, blur = 1 } = opts as any;

  const image = sharp(input as any)
    .blur(blur)
    .rotate();
  const metadata: any = await image.metadata();

  const resized = image.resize(
    ...(Array.isArray(resize)
      ? resize
      : [Math.min(metadata.width, resize), Math.min(metadata.height, resize), { fit: 'inside' }]),
  );
  let output;

  if (outputFormat === 'webp') {
    output = resized.webp({
      quality: 20,
      alphaQuality: 20,
      smartSubsample: true,
      ...outputOptions,
    });
  } else if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
    output = resized.jpeg({
      quality: 20,
      ...outputOptions,
    });
  } else {
    throw new Error(`Invalid outputformat "${outputFormat}"`);
  }

  const { data, info } = await output.toBuffer({ resolveWithObject: true });

  return {
    content: data,
    metadata: {
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      width: info.width,
      height: info.height,
      type: outputFormat,
      dataURIBase64: `data:image/webp;base64,${data.toString('base64')}`,
    },
  };
}

/**
 * @name lqipModern
 *
 * @param {Buffer|string|Buffer[]|string[]} input - Either an array of image inputs or a single image input.
 * Each image input may either be a `Buffer` containing raw image data, or a `string` containing the filesystem path to a supported image type.
 * @param {Object} [opts] - Optional configuration options.
 * @param {number} [opts.concurrency=4] - Concurrency when processing an array of input images.
 * @param {string} [opts.outputFormat='webp'] - Output format to use; either `webp` or `jpeg` (passing `jpg` is the same as passing `jpeg`).
 * @param {Object} [opts.outputOptions] - Output options passed to either `sharp.webp` or `sharp.jpeg` dependent on `opts.outputFormat`.
 * @param {number|boolean} [opts.blur] - false to disable blur
 * @param {number|any[]} [opts.resize] - Options to pass to `sharp.resize`. Defaults to resizing inputs to a max dimension of `16`, with the other dimension being calculated to maintain aspect ratio. If you want more control, you can pass an array of args here which will be forwarded to `sharp.resize`.
 */
export function blurImage(input: Buffer | string | Buffer[] | string[], opts = {}) {
  const { concurrency = 4, ...rest } = opts as any;

  return Array.isArray(input)
    ? pMap(input as any, (image) => computeLqipImage(image as any, rest), {
        concurrency,
      })
    : computeLqipImage(input, opts);
}
