import { FieldMissing } from "domain/errors/FieldMissing";

export namespace Category {
  export interface Props {
    readonly id: string;
    name: string;
    icon?: string;
  }
}

export class Category {
  public readonly id: string;
  public name: string;
  public active = true;
  public icon?: string;
  public urlIcon?: string;

  constructor(props: Category.Props) {
    Object.assign(this, props);
    if (this.icon) {
      this.urlIcon = `${process.env.URI_BACKEND}${this.icon}`;
    }
    this.active = true;
    if (!this.name) {
      throw new FieldMissing("Name");
    }
  }

  update(props: Partial<Category.Props>) {
    Object.assign(this, props);
    if (this.icon) {
      this.urlIcon = `${process.env.URI_BACKEND}${this.icon}`;
    }
  }
}
