import { CategoriesTable } from '../categories';
import { Parts, Recursive } from './constants';

const categoryObject = `
  '${CategoriesTable.ID}', ${Parts.CATEGORIES}.${CategoriesTable.ID}, 
  '${CategoriesTable.NAME}', ${Parts.CATEGORIES}.${CategoriesTable.NAME},
  '${CategoriesTable.PID}', ${Parts.CATEGORIES}.${CategoriesTable.PID},
  '${Recursive.LEVEL}', ${Parts.CATEGORIES}.${Recursive.LEVEL}
` as const;

export { categoryObject };
