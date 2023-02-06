import { User } from "domain/entities/User";
import { Strategy } from "./Strategy";

type CallbackFunctions = {
  name: string;
  callback: (user: User) => Promise<boolean>;
};

export class GateAdapter {
  static callbacksFunctions: CallbackFunctions[] = [];
  static strategy: Strategy;

  constructor(strategy: Strategy) {
    GateAdapter.strategy = strategy;
  }

  static registerGate(
    nameGate: string,
    gate: (user: User) => Promise<boolean>
  ) {
    this.callbacksFunctions.push({ name: nameGate, callback: gate });
  }

  static async allows(gateName: string): Promise<boolean> {
    const callback = this.callbacksFunctions.find(
      (callbackItem) => callbackItem.name === gateName
    );

    return await callback?.callback(
      await GateAdapter.strategy.getAuthenticateUser()
    );
  }
}
