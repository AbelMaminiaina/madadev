export interface Article {
  title: string;
  slug: string;
  author: string;
  date: string;
  category: Category;
  image: string;
  excerpt: string;
  content: string;
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
