enum Parts {
  BODY = 'news_body',
  AUTHOR = 'news_author',
  TAGS = 'news_tags_list',
  TAGS_FULL = 'news_tags_list_full',
  IMAGES = 'news_aux_images_list',
  CATEGORIES = 'news_categories_list',
  CATEGORIES_FULL = 'news_categories_list_full',
}

enum NewsFields {
  TAGS = 'tags',
  AUX_IMAGES = 'aux_images',
}

enum Recursive {
  LEVEL = 'level',
}

export { Parts, NewsFields, Recursive };
