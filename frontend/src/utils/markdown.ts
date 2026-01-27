import matter from 'gray-matter';
import type { Article, Category } from '../types';

export const parseMarkdown = (content: string, slug: string): Article => {
  const { data, content: markdownContent } = matter(content);

  return {
    title: data.title || 'Untitled',
    slug: data.slug || slug,
    author: data.author || 'Anonymous',
    date: data.date || new Date().toISOString().split('T')[0],
    category: (data.category as Category) || 'HOME',
    image: data.image || '/images/default-cover.jpg',
    excerpt: data.excerpt || '',
    content: markdownContent,
  };
};

export const extractExcerpt = (content: string, maxLength: number = 150): string => {
  const plainText = content
    .replace(/#+\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
};
