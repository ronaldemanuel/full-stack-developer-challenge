export class RelationshipNotLoadedError extends Error {
  constructor(public override message: string) {
    super(message);
    this.name = 'RelationshipNotLoadedError';
  }
}
