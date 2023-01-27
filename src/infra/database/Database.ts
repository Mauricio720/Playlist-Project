export interface Database {
  setDatabase(database: string): void;
  get<R = any, Q = any>(query: Q, aggregate?: boolean): Promise<R[]>;
  count<Q = any>(query: Q): Promise<number>;
  delete<Q = any>(query: Q): Promise<void>;
  create<P = any>(params: P): Promise<void>;
  update<Q = any, P = any>(query: Q, params: P): Promise<void>;
}
