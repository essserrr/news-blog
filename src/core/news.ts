import { Category } from './categories';
import { Tag } from './tags';
import { UserUnderscored } from './user';

interface NewsUnderscored {
  id: string;
  author: UserUnderscored | null;
  title: string;
  content: string;
  categories: Array<Category>;
  tags: Array<Tag>;
  main_image: string;
  aux_images: Array<string>;
  created_at: number;
}

type News = NewsUnderscored;

interface NewsRequest {
  author: string;
  title: string;
  content: string;
  category: number;
  tags: Array<number>;
  mainImage: string;
  auxImages: Array<string>;
}

export type { News, NewsUnderscored, NewsRequest };
