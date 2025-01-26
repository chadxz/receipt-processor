import receiptSchema from "./receipt";

describe("Receipt JSON Schema", () => {
  const validReceipt = {
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
  };

  it("validates a good receipt", () => {
    receiptSchema.parse(validReceipt);
  });

  it("disallows invalid retailer names", () => {
    const result = receiptSchema.safeParse({
      ...validReceipt,
      retailer: "Garbledegook!#@%$O(",
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatchInlineSnapshot(`
      [ZodError: [
        {
          "validation": "regex",
          "code": "invalid_string",
          "message": "Retailer name must be defined and may only contain letters, numbers, spaces, hyphens, and ampersands.",
          "path": [
            "retailer"
          ]
        }
      ]]
    `);
  });

  it("disallows invalid purchase dates", () => {
    const result = receiptSchema.safeParse({
      ...validReceipt,
      purchaseDate: "thisisnotadate",
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatchInlineSnapshot(`
      [ZodError: [
        {
          "code": "invalid_string",
          "validation": "date",
          "message": "Must be a valid date in YYYY-MM-DD format.",
          "path": [
            "purchaseDate"
          ]
        }
      ]]
    `);
  });

  it("disallows invalid purchase times", () => {
    const result = receiptSchema.safeParse({
      ...validReceipt,
      purchaseTime: "thisisnotatime",
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatchInlineSnapshot(`
      [ZodError: [
        {
          "validation": "regex",
          "code": "invalid_string",
          "message": "Time must be in 24-hour format and should not include seconds.",
          "path": [
            "purchaseTime"
          ]
        }
      ]]
    `);
  });

  it("disallows invalid total", () => {
    const result = receiptSchema.safeParse({
      ...validReceipt,
      total: "22",
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatchInlineSnapshot(`
      [ZodError: [
        {
          "validation": "regex",
          "code": "invalid_string",
          "message": "Total must be a valid number with 2 decimal places.",
          "path": [
            "total"
          ]
        }
      ]]
    `);
  });

  it("requires at least 1 item", () => {
    const result = receiptSchema.safeParse({
      ...validReceipt,
      items: [],
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatchInlineSnapshot(`
      [ZodError: [
        {
          "code": "too_small",
          "minimum": 1,
          "type": "array",
          "inclusive": true,
          "exact": false,
          "message": "Array must contain at least 1 element(s)",
          "path": [
            "items"
          ]
        }
      ]]
    `);
  });
});
