const load = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.src = url;
  });
};
const cache: Record<string, string> = {};
const imagesCache: Record<string, HTMLImageElement> = {};

const images = {
  scale: "/assets/icons/scale.png",
  rotate: "/assets/icons/rotate.png",
  translate: "/assets/icons/rotate.png",
  warp: "/assets/icons/rotate.png",
};
export async function getRotatedImage(
  radians: number,
  image: keyof typeof images
) {
  const path = images[image];
  radians = Number(radians.toFixed(2));
  const cacheKey = `${radians}-${path}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  const canvas: HTMLCanvasElement = document.createElement("canvas");

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const img = imagesCache[cacheKey] ? imagesCache[cacheKey] : await load(path);

  imagesCache[cacheKey] = img;
  canvas.width = img.height / 2;
  canvas.height = img.height / 2;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.translate(canvas.width / -2, canvas.height / -2);

  ctx.drawImage(img, 0, 0, img.width / 2, img.height / 2);

  cache[cacheKey] = canvas.toDataURL();

  return canvas.toDataURL();
}
