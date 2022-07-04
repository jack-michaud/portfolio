export type BanditImageType = "houseExternals" | "uiTest";
export interface BanditImage { url: string, id: string };
export interface BanditImageSet {
  id: string;
  sourceUrl: string;
  type: BanditImageType;
  images: BanditImage[]; 
}

export const loadBanditImageSet = async (): Promise<BanditImageSet[]> => {
  return ((await import("../bandit_leverset.json")).default as BanditImageSet[]).filter((is) => is.type == "houseExternals");
}

export const loadUiTest = async (): Promise<BanditImageSet[]> => {
  return ((await import("../bandit_leverset.json")).default as BanditImageSet[]).filter((is) => is.type == "uiTest");
}

export enum ImageActionChoice { like, dislike };

export interface ImageAction {
  action: ImageActionChoice;
  photosetId: string;
  photoId: string;
}
