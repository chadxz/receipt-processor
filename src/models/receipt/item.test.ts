import Item from "./item";

describe("Item", () => {
  it("can be constructed", () => {
    const item = new Item({
      shortDescription: "Candy",
      price: "6.49",
    });

    expect(item.shortDescription).toBe("Candy");
    expect(item.price).toBe("6.49");
  });
});
