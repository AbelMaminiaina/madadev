export type ArticleStatus = 'pending' | 'published' | 'rejected';

export interface Article {
  id?: number;
  title: string;
  slug: string;
  author: string;
  date: string;
  category: Category;
  image: string;
  excerpt: string;
  content: string;
  status?: ArticleStatus;
  author_id?: number;
}

export type Category =
  | 'HOME'
  | 'STORY'
  | 'TENDANCES'
  | 'IA'
  | 'CLOUD'
  | 'DATA'
  | 'BACK'
  | 'FRONT'
  | 'SECURITE'
  | 'MOBILE'
  | 'PRODUCT'
  | 'RH'
  | 'PODCAST'
  | 'AUTEURS';

export interface Author {
  name: string;
  avatar?: string;
  bio?: string;
}

export interface CategoryInfo {
  name: Category;
  label: string;
  color: string;
  bgColor: string;
}
