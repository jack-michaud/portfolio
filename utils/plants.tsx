import glob from 'glob';
import { Plant } from '../interfaces';
export const generatePlantSlugs = (): string[] => {
  const blogs = glob.sync('plants/*.md')
  return blogs.map((path: string) => {
    console.log(path);
    const splits = path.split('/')
    const basename = splits[splits.length - 1];
    return basename.split('.md')[0]
  })
}

import matter from 'gray-matter';
export const getPlantData = async (slug: string): Promise<Plant> => {
  const file = await import(`../plants/${slug}.md`);
  const data = matter(file.default);
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

