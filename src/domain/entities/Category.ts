import { FieldMissing } from "domain/errors/FieldMissing";

export class Category {
  public readonly id: string;
  public name: string;
  public icon?: string;

  constructor(props: Category) {
    Object.assign(this, props);
    if (!props.name) {
      throw new FieldMissing("Name");
    }
  }
}
