interface Author {
  uid: string;
  description: string | null;
}

type CheckAuthor = { author: string | null };

export type { Author, CheckAuthor };
