export type CamelCase<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<CamelCase<Tail>>}`
    : S;

// Recursively convert object keys
export type Camelize<T> = {
  [K in keyof T as K extends string ? CamelCase<K> : K]: T[K] extends Record<
    string,
    any
  >
    ? Camelize<T[K]>
    : T[K];
};
