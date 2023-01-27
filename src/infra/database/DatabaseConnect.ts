export interface DatabaseConnect {
    connect(): Promise<void>;
    setDatabase(database: string): void;
    get<R = any, Q = any>(query: Q, aggregate?: boolean): Promise<R[]>;
    delete<Q = any>(query: Q): Promise<void>;
    create<P = any>(params: P): Promise<void>;
    update<Q = any, P = any>(query: Q, params: P): Promise<void>;
    count<Q = any>(query: Q): Promise<number>;
  }
  