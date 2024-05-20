<p align="center">
<a href="https://www.npmjs.com/package/blur-images" target="_blank" rel="noopener noreferrer">
<img src="https://api.iconify.design/material-symbols:photo-library-outline-rounded.svg?color=%23ff6190" alt="logo" width='100'/></a>
</p>

<p align="center">
  Modern approach to Low Quality Image Placeholders (LQIP) using webp and sharp.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/blur-images" target="_blank" rel="noopener noreferrer"><img src="https://badge.fury.io/js/blur-images.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/blur-images" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/dt/blur-images.svg?logo=npm" alt="NPM Downloads" /></a>
  <a href="https://bundlephobia.com/result?p=blur-images" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/bundlephobia/minzip/blur-images" alt="Minizip" /></a>
  <a href="https://github.com/hunghg255/blur-images/graphs/contributors" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/all_contributors-1-orange.svg" alt="Contributors" /></a>
  <a href="https://github.com/hunghg255/blur-images/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/github/license/hunghg255/blur-images" alt="License" /></a>
</p>

## Demo

- [Demo](https://blur-images.vercel.app/)

## Installation

```bash
npm i blur-images
```

## Usage

```js
import { blurImage } from 'blur-images';
const result = await blurImage('fixtures/brooklyn.jpg');
```

which outputs

```js
{
  content: <Buffer>,
  metadata: {
    originalWidth: 1400,
    originalHeight: 350,
    width: 16,
    height: 4,
    type: 'webp',
    dataURIBase64: 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADQAQCdASoQAAQABUB8JYgCdADjazMu8AD+flCYsVr2GH6CLYVog1jhRLpBUIu8UmqhGnoAAAA='
  }
}
```

## How It Works

This package uses a very similar LQIP approach to the one used by [Medium](https://medium.com/).

We use `sharp` to resize input images to a max dimension of `16px` and output `webp` (default) or `jpeg` images with an encoding `quality` set to 20. The max dimension is a single, simple variable to tradeoff between encoded image size and visual fidelity.

This resuls in very efficient placeholder images that have noticeable artifacts due to the low quality encoding. These artifacts are then hidden in the browser using a simple blur filter.

```css
.placeholder {
  filter: blur(20px);
  transform: scale(1.1);
}
```

Note that Medium uses this scale transform on its placeholder images for two reasons:

- Hide the [artifacts around the edges](http://volkerotto.net/2014/07/03/css-background-image-blur-without-blury-edges/) of the blurred images.
- Provide an aesthetically pleasing feeling of zooming into the original image once it's loaded.

An alternative to using this `blur` + `transform` technique is to use a CSS [backdrop-filter](https://css-tricks.com/almanac/properties/b/backdrop-filter/). This technique has less [cross-browser support](https://caniuse.com/#search=backdrop-filter), but it produces clean blurred preview images without the need to transform the placeholder.

```css
.placeholder::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(20px);
  pointer-events: none;
}
```

## Related

- [lqip](https://github.com/zouhir/lqip) - Original Low Quality Image Placeholders (LQIP) module.
- [sqip](https://github.com/axe312ger/sqip) - Really solid SVG-based LQIP alternative.
  - See their comprehensive [comparison](https://axe312ger.github.io/sqip/) of LQIP techniques.
  - The biggest disadvantage of this approach is that it's ~10-100x slower to compute these images.
- [blurhash](https://github.com/woltapp/blurhash) - Really nice, compact placeholder images.
  - Requires non-native client-side decoding which makes it awkward and slow for browser usage.
  - Encoding speed is pretty slow (on par with sqip).
  - Under the hood, the `webp` format performs a similar set of transforms as the one used by blurhash.
