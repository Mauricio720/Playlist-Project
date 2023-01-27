import { Database } from "./Database";
import { DatabaseConnect } from "./DatabaseConnect";

export class DatabaseAdapter implements Database {
  constructor(private databaseConnect: DatabaseConnect) {
    this.databaseConnect.connect();
  }

  setDatabase(database: string): void {
    this.databaseConnect.setDatabase(database);
  }

  async get<R = any, Q = any>(query: Q, aggregate?: boolean): Promise<R[]> {
    return await this.databaseConnect.get(query, aggregate);
  }

  async count<Q = any>(query: Q): Promise<number> {
    return await this.databaseConnect.count(query);
  }

  async delete<Q = any>(query: Q): Promise<void> {
    await this.databaseConnect.delete(query);
  }

  async create<P = any>(params: P): Promise<void> {
    await this.databaseConnect.create(params);
  }

  async update<Q = any, P = any>(query: Q, params: P): Promise<void> {
    await this.databaseConnect.update(query, params);
  }
}
