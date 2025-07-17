export class NotFoundError extends Error {
  constructor(public override message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
