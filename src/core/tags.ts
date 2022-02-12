interface Tag {
  id: number;
  name: string;
}

type TagUpdate = Omit<Tag, 'id'>;

export type { Tag, TagUpdate };
