import itemSchema from "./item";

describe("Item JSON Schema", () => {
  const validItem = {
    shortDescription: "Candy",
    price: "6.49",
  };

  it("validates a good item", () => {
    itemSchema.parse(validItem);
  });

  it("disallows invalid short descriptions", () => {
    const result = itemSchema.safeParse({
      ...validItem,
      shortDescription: "Garbledegook!#@%$O(",
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatchInlineSnapshot(`
      [ZodError: [
        {
          "validation": "regex",
          "code": "invalid_string",
          "message": "Item short description must be defined and may only contain letters, numbers, spaces, and hyphens.",
          "path": [
            "shortDescription"
          ]
        }
      ]]
    `);
  });

  it("disallows invalid prices", () => {
    const result = itemSchema.safeParse({
      ...validItem,
      price: "22",
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatchInlineSnapshot(`
      [ZodError: [
        {
          "validation": "regex",
          "code": "invalid_string",
          "message": "Price must be a valid number with 2 decimal places.",
          "path": [
            "price"
          ]
        }
      ]]
    `);
  });
});
