import glob from 'glob';
import { Blog } from '../interfaces';
export const generateBlogSlugs = (): string[] => {
  const blogs = glob.sync('blogs/*.md')
  return blogs.map(path => {
    console.log(path);
    const splits = path.split('/')
    const basename = splits[splits.length - 1];
    return basename.split('.md')[0]
  })
}

import matter from 'gray-matter';
export const getBlogData = async (slug: string): Promise<Blog> => {
  const file = await import(`../blogs/${slug}.md`);
  const data = matter(file.default);
  const date = data.data.date as Date;
  return {
    content: data.content,
    title: data.data.title,
    description: data.data.description,
    date: date.toDateString(),
    link: `/blogs/${slug}`,
    tags: data.data.tags.split(' '),
    draft: data.data.draft
  }
}
