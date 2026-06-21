// export type RowError = {
//   columnId?: string;
//   operator?: string;
//   value?: string;
//   alias?: string;
//   aggregate?: string;
//   direction?: string;
//   global?: string[];
// };

export type RowError = {
  columnId?: string;
  operator?: string;
  value?: string;
  alias?: string;
  aggregate?: string;
  direction?: string;
};

export type ValidationErrors = {
  select: RowError[];
  values: RowError[];
  where: RowError[];
  having: RowError[];
  orderBy: RowError[];
  global: string[];
};