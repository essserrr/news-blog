const timestampToInteger = (field: string) =>
  `extract(epoch from ${field})::int as ${field}` as const;

export { timestampToInteger };
