const timestampToInteger = (field: string, as: string = field, mode: 'as' | 'none' = 'as') =>
  `extract(epoch from ${field})::int${mode === 'as' ? ` as ${as}` : ''}` as const;

export { timestampToInteger };
