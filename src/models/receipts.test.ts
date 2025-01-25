import receipts, { clearReceipts } from "./receipts";

describe("Receipts ORM", () => {
  beforeEach(() => {
    clearReceipts();
  });

  describe("get", () => {
    it("returns undefined when the receipt does not exist", () => {
      expect(
        receipts.get("deadbeef-dead-beef-dead-beefdeadbeef"),
      ).toBeUndefined();
    });

    it("returns the receipt when it exists", () => {
      const receipt = receipts.create({
        retailer: "M&M Corner Market",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        total: "6.49",
        items: [
          {
            shortDescription: "Candy",
            price: "6.49",
          },
        ],
      });

      expect(receipts.get(receipt.id)).toBe(receipt);
    });
  });

  describe("create", () => {
    it("creates a new receipt", () => {
      const receipt = receipts.create({
        retailer: "M&M Corner Market",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        total: "6.49",
        items: [
          {
            shortDescription: "Candy",
            price: "6.49",
          },
        ],
      });

      expect(receipts.get(receipt.id)).toBe(receipt);
    });

    it("generates a unique ID", () => {
      const receipt1 = receipts.create({
        retailer: "M&M Corner Market",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:01",
        total: "6.49",
        items: [
          {
            shortDescription: "Candy",
            price: "6.49",
          },
        ],
      });

      const receipt2 = receipts.create({
        retailer: "M&M Corner Market",
        purchaseDate: "2022-01-01",
        purchaseTime: "13:02",
        total: "6.50",
        items: [
          {
            shortDescription: "Coke",
            price: "2.50",
          },
        ],
      });

      expect(receipt1.id).toStrictEqual(expect.stringMatching(/^\S+$/));
      expect(receipt2.id).toStrictEqual(expect.stringMatching(/^\S+$/));
      expect(receipt1.id).not.toBe(receipt2.id);
    });
  });
});
