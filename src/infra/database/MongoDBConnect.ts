import { DatabaseConnect } from "./DatabaseConnect";
import { MongoClient, Collection } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

export class MongoDBConnect implements DatabaseConnect {
  private static client: MongoClient;
  private collection!: Collection;

  async connect(): Promise<void> {
    try {
      if (!MongoDBConnect.client) {
        MongoDBConnect.client = new MongoClient(process.env.MONGO_URL);
        MongoDBConnect.client.connect();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async setDatabase(database: string): Promise<void> {
    this.collection = MongoDBConnect.client
      .db(process.env.MONGO_DATABASE_NAME)
      .collection(database);
  }

  async get(query: any, aggregate = false): Promise<any> {
    const result = aggregate
      ? await this.collection.aggregate(query).toArray()
      : await this.collection.find(query).toArray();

    result.forEach((result) => {
      delete result._id;
      return result;
    });

    return result;
  }

  async count(query: any): Promise<number> {
    const result = await this.collection.countDocuments(query);
    return result;
  }

  async create(params: any): Promise<void> {
    await this.collection.insertOne(params, { forceServerObjectId: true });
  }

  async update(query: any, params: any): Promise<void> {
    await this.collection.updateOne(query, { $set: params }, { upsert: true });
  }

  async delete(query: any): Promise<void> {
    await this.collection.deleteOne(query);
  }
}
