export interface PosterTextStrokeInfo {
  strokeStyle: string;
  widthRatio: number;
  offsetX?: number;
  offsetY?: number;
}

export interface FontPackage {
  fontType: string;
  fontColor: string;
  fontSizeRatio: number;
  strokeInfo?: PosterTextStrokeInfo;
}
