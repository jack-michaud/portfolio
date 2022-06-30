export type BanditImageType = "houseExternals";
export interface BanditImage { url: string };
export interface BanditImageSet {
  sourceUrl: string;
  type: BanditImageType;
  images: BanditImage[]; 
}

export const loadBanditImageSet = async (): Promise<BanditImageSet[]> => {
  return (await import("../bandit_leverset.json")).default as BanditImageSet[];
}
