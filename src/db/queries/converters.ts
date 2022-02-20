const timestampToInteger = (field: string, as: string = field) =>
  `extract(epoch from ${field})::int as ${as}` as const;

export { timestampToInteger };
