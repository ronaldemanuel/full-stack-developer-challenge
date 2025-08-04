export class EntityNotFinishedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EntityNotFinishedError";
  }
}
