import { Offset, Limit } from 'src/core/database';

const limitation = (o: Offset, l: Limit) => `
  LIMIT ${l} OFFSET ${o}
`;

export { limitation };
