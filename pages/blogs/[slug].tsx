import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import GithubIcon from '../../components/GithubIcon';
import ReactMarkdown from 'react-markdown';
import CodeBlock from '../../components/CodeBlock';


import { Blog as BlogType } from '../../interfaces';
interface IProps {
  blog: BlogType;
}
const Blog = (props: IProps) => {
  const {
    content,
    title,
    date,
    tags
  } = props.blog;
  return (
    <Layout title={title}>
      <div className="header">
        <div className="app md:flex items-center justify-center">
          <div className="mb-5">
            <Link href="/">
              <span className="text-6xl hover:text-blue-200 cursor-pointer font-mono tracking-tighter">Jack Michaud</span>
            </Link><br/>
            <span className="text-3xl tracking-tight font-mono flex items-center">
              Full Stack Developer 
              <a href="https://github.com/jack-michaud/" target="_blank"><GithubIcon /></a>
            </span><br/>
            <span className="text-3xl tracking-tight flex items-center">
              { title }
            </span><br/>
            <div className="flex">
              {
                tags.map((t, idx) => <button key={idx} className="btn sm mr-3">{ t }</button>)
              }
            </div>
            <span className="text-sm text-blue-300 tracking-tight flex items-center">
              <time>{date}</time>
            </span>
          </div>
        </div>
      </div>
      <div className="blog">
        <div className="py-10 app">
          <ReactMarkdown source={content}
            renderers={{ code: CodeBlock }}/>
        </div>
      </div>
    </Layout>
  )
}

import { GetStaticProps, GetStaticPaths } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getBlogData, generateBlogSlugs } from '../../utils/blog';

interface PathParams extends ParsedUrlQuery {
  slug: string;
}
export const getStaticProps: GetStaticProps<IProps, PathParams> = async (ctx) => {
  const slug = ctx.params?.slug;
  if (slug == null) {
    throw '404';
  }
  const blogData = await getBlogData(slug);
  return {
    props: {
      blog: blogData
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = generateBlogSlugs();
  return {
    paths: slugs.map(slug => `/blogs/${slug}`),
    fallback: false
  }
}

export default Blog;
