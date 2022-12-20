export class FieldMissing extends Error {
  constructor(field: string) {
    super(`${field} is missing`);
    this.name = "FieldMissing";
  }
}
