import { glob } from 'glob';
import { Plant } from '../interfaces';
import fs from 'fs';
import path from 'path';

export const generatePlantSlugs = (): string[] => {
  const blogs = glob.sync('plants/*.md')
  return blogs.map((filePath: string) => {
    console.log(filePath);
    const splits = filePath.split('/')
    const basename = splits[splits.length - 1];
    return basename.split('.md')[0]
  })
}

import matter from 'gray-matter';
export const getPlantData = async (slug: string): Promise<Plant> => {
  const filePath = path.join(process.cwd(), 'plants', `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = matter(fileContents);
  const date = data.data.date as Date;
  return {
    content: data.content,
    title: data.data.title,
    description: data.data.description,
    date: date.toDateString(),
    link: `/garden/plants/${slug}`,
    tags: data.data.tags.split(' '),
    stage: data.data.stage
  }
}

