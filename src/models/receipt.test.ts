import Receipt from "./receipt";

describe("Receipt", () => {
  it("can be constructed", () => {
    const receipt = new Receipt({
      id: "adb6b560-0eef-42bc-9d16-df48f30e89b2",
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

    expect(receipt.id).toBe("adb6b560-0eef-42bc-9d16-df48f30e89b2");
    expect(receipt.retailer).toBe("M&M Corner Market");
    expect(receipt.purchaseDate).toBe("2022-01-01");
    expect(receipt.purchaseTime).toBe("13:01");
    expect(receipt.total).toBe("6.49");
    expect(receipt.items.length).toBe(1);

    const item = receipt.items[0];
    expect(item).toBeDefined();
    expect(item!.shortDescription).toBe("Candy");
    expect(item!.price).toBe("6.49");
  });

  it("calculates points", () => {
    const receipt = new Receipt({
      id: "adb6b560-0eef-42bc-9d16-df48f30e89b2",
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

    expect(receipt.points).toBe(0);
  });
});
