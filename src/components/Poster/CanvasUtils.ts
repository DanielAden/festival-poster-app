// based off of the following comment from stackoverflow
// https://stackoverflow.com/a/15666143/1215360

export const pixelRatio = (ctx: CanvasRenderingContext2D) => {
      const dpr = window.devicePixelRatio || 1;
      const bsr = (ctx as any).webkitBackingStorePixelRatio ||
                  (ctx as any).mozBackingStorePixelRatio ||
                  (ctx as any).msBackingStorePixelRatio ||
                  (ctx as any).oBackingStorePixelRatio ||
                  (ctx as any).backingStorePixelRatio || 1;
  return dpr / bsr;
}

export const createHiDPICanvas = function(can: HTMLCanvasElement, w: number, h: number,) {
  const ctx = can.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context to create HiDPI canvas')
  const ratio = pixelRatio(ctx);
  can.width = w * ratio;
  can.height = h * ratio;
  can.style.width = w + "px";
  can.style.height = h + "px";
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return can;
}

