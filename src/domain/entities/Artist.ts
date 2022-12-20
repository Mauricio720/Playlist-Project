import { FieldMissing } from "domain/errors/FieldMissing";

export class Artist {
  public readonly id: string;
  public name: string;

  constructor(props: Artist) {
    Object.assign(this, props);
    if (!this.name) {
      throw new FieldMissing("Name");
    }
  }
}
