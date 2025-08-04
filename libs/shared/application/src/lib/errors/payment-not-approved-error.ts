export class PaymentNotApprovedError extends Error {
  constructor(message = "Payment not approved") {
    super(message);
    this.name = "PaymentNotApprovedError";
  }
}
