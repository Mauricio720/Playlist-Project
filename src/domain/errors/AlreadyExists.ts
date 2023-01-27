export class AlreadyExists extends Error {
  constructor(object: string) {
    super(`${object} already exists`);
    this.name = "AlreadyExists";
  }
}
