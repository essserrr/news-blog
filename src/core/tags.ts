interface Tag {
  id: number;
  name: string;
}

type TagUpdate = Pick<Tag, 'name'>;

export type { Tag, TagUpdate };
