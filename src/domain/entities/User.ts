import { Category } from "domain/entities/Category";
import { Artist } from "domain/entities/Artist";
import { FieldMissing } from "domain/errors/FieldMissing";

export namespace User {
  export interface Props {
    readonly id: string;
    name: string;
    email: string;
    password?: string;
    dateRegister?: Date;
    favoriteCategory?: Category.Props[];
    favoriteArtist?: Artist[];
  }
}

export class User {
  public readonly id: string;
  public name: string;
  public email: string;
  public password?: string;
  public dateRegister: Date;
  public favoriteCategory: Category[];
  public favoriteArtist: Artist[];
  public active = true;

  constructor(props: User.Props) {
    Object.assign(this, props);

    if (!this.name || !this.email) {
      throw new FieldMissing("Name and Email");
    }
  }

  update(props:Partial<User.Props>){
    Object.assign(this, props);
  }

  delete(){
    this.active=false;
  }
}
