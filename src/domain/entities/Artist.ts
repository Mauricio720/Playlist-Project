import { FieldMissing } from "domain/errors/FieldMissing";
import "dotenv/config";

export namespace Artist{
  export interface Props{
      readonly id:string;
      name:string;
      picture?:string;
  }
}

export class Artist {
  public readonly id: string;
  public name: string;
  public picture="";

  constructor(props: Artist.Props) {
    Object.assign(this, props);
    
    if (!this.name) {
      throw new FieldMissing("Name");
    }

    if(this.picture!==''){
      this.picture=`${process.env.URI_BACKEND}${this.picture}`
    }
    

  }
}
