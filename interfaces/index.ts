export interface Plant {
  date: string;
  content?: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  stage: Stage;
}

export type Stage = 'sprout' | 'sapling' | 'tree';
