import Receipt, { type ReceiptConstructParams } from "./receipt";

type ReceiptCreateParams = Omit<ReceiptConstructParams, "id">;

/**
 * In-memory store of receipts.
 */
const receipts = new Map<string, Receipt>();

/**
 * Receipts "ORM". Used to interact with the in-memory Receipts store.
 */
class Receipts {
  /**
   * Get a receipt by ID.
   */
  get(id: string): Receipt | undefined {
    return receipts.get(id);
  }

  /**
   * Create a new receipt.
   */
  create(params: ReceiptCreateParams): Receipt {
    const id = this.buildUniqueId();
    const receipt = new Receipt({
      id,
      ...params,
    });
    receipts.set(id, receipt);
    return receipt;
  }

  /**
   * Build a unique ID for a receipt to be created.
   */
  private buildUniqueId(): string {
    while (true) {
      const id = crypto.randomUUID();
      if (!receipts.has(id)) {
        return id;
      }
    }
  }
}

export default new Receipts();

/**
 * A test helper to clear all receipts from the in-memory store.
 */
export function clearReceipts() {
  receipts.clear();
}
