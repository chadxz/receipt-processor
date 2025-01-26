import pointsCalculator from "./points";
import Receipt from "./index";

const referenceReceipt1 = {
  id: "adb6b560-0eef-42bc-9d16-df48f30e89b2",
  retailer: "Target",
  purchaseDate: "2022-01-01",
  purchaseTime: "13:01",
  items: [
    {
      shortDescription: "Mountain Dew 12PK",
      price: "6.49",
    },
    {
      shortDescription: "Emils Cheese Pizza",
      price: "12.25",
    },
    {
      shortDescription: "Knorr Creamy Chicken",
      price: "1.26",
    },
    {
      shortDescription: "Doritos Nacho Cheese",
      price: "3.35",
    },
    {
      shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
      price: "12.00",
    },
  ],
  total: "35.35",
};

const referenceReceipt2 = {
  id: "adb6b560-0eef-42bc-9d16-df48f30e89b2",
  retailer: "M&M Corner Market",
  purchaseDate: "2022-03-20",
  purchaseTime: "14:33",
  items: [
    {
      shortDescription: "Gatorade",
      price: "2.25",
    },
    {
      shortDescription: "Gatorade",
      price: "2.25",
    },
    {
      shortDescription: "Gatorade",
      price: "2.25",
    },
    {
      shortDescription: "Gatorade",
      price: "2.25",
    },
  ],
  total: "9.00",
};

describe("Points Calculator", () => {
  describe("calculatePoints", () => {
    it("calculates all points for the first reference receipt", () => {
      const receipt = new Receipt(referenceReceipt1);

      expect(pointsCalculator.calculatePoints(receipt)).toBe(28);
    });

    it("calculates all points for the second reference receipt", () => {
      const receipt = new Receipt(referenceReceipt2);

      expect(pointsCalculator.calculatePoints(receipt)).toBe(109);
    });
  });

  describe("alphanumericRetailerNamePoints", () => {
    describe.each([
      { retailer: "", expected: 0 },
      { retailer: "Target", expected: 6 },
      { retailer: "Pan3ra Br34d", expected: 11 },
      { retailer: "M&M Corner Market", expected: 14 },
    ])("when the retailer name is '$retailer'", ({ retailer, expected }) => {
      it(`returns ${expected} points`, () => {
        const receipt = new Receipt({ ...referenceReceipt1, retailer });
        const actual = pointsCalculator.alphanumericRetailerNamePoints(receipt);
        expect(actual).toBe(expected);
      });
    });
  });

  describe("wholeDollarAmountPoints", () => {
    describe.each([
      { total: "0.00", expected: 50 },
      { total: "22.00", expected: 50 },
      { total: "0.01", expected: 0 },
      { total: "14.23", expected: 0 },
    ])("when the total amount is '$total'", ({ total, expected }) => {
      it(`returns ${expected} points`, () => {
        const receipt = new Receipt({ ...referenceReceipt1, total });
        const actual = pointsCalculator.wholeDollarAmountPoints(receipt);
        expect(actual).toBe(expected);
      });
    });
  });

  describe("quarterAmountPoints", () => {
    describe.each([
      { total: "0.00", expected: 25 },
      { total: "22.00", expected: 25 },
      { total: "0.25", expected: 25 },
      { total: "0.75", expected: 25 },
      { total: "0.50", expected: 25 },
      { total: "14.23", expected: 0 },
      { total: "1.11", expected: 0 },
      { total: "12.99", expected: 0 },
    ])("when the total amount is '$total'", ({ total, expected }) => {
      it(`returns ${expected} points`, () => {
        const receipt = new Receipt({ ...referenceReceipt1, total });
        const actual = pointsCalculator.quarterAmountPoints(receipt);
        expect(actual).toBe(expected);
      });
    });
  });

  describe("itemCountPoints", () => {
    describe.each([
      { items: [], expected: 0 },
      {
        items: [
          { shortDescription: "foo", price: "10.00" },
          { shortDescription: "bar", price: "1.00" },
        ],
        expected: 5,
      },
      {
        items: [
          { shortDescription: "foo", price: "10.00" },
          { shortDescription: "bar", price: "1.00" },
          { shortDescription: "baz", price: "2.00" },
          { shortDescription: "bux", price: "3.00" },
        ],
        expected: 10,
      },
    ])("when there are $items items", ({ items, expected }) => {
      it(`returns ${expected} points`, () => {
        const receipt = new Receipt({ ...referenceReceipt1, items });
        const actual = pointsCalculator.itemCountPoints(receipt);
        expect(actual).toBe(expected);
      });
    });
  });

  describe("itemDescriptionLengthPoints", () => {
    describe.each([
      { items: [], expected: 0 },
      {
        items: [
          { shortDescription: "foo ", price: "10.25" },
          { shortDescription: "barr", price: "1.00" },
        ],
        expected: 3,
      },
      {
        items: [
          { shortDescription: "food", price: "10.00" },
          { shortDescription: "  bartering", price: "12.00" },
          { shortDescription: "baz ", price: "200.30" },
          { shortDescription: "  buxdog ", price: "3.00" },
        ],
        expected: 45,
      },
    ])("when there are $items items", ({ items, expected }) => {
      it(`returns ${expected} points`, () => {
        const receipt = new Receipt({ ...referenceReceipt1, items });
        const actual = pointsCalculator.itemDescriptionLengthPoints(receipt);
        expect(actual).toBe(expected);
      });
    });
  });

  describe("oddPurchaseDayPoints", () => {
    describe.each([
      { purchaseDate: "2021-03-01", expected: 6 },
      { purchaseDate: "1975-04-29", expected: 6 },
      { purchaseDate: "2025-04-28", expected: 0 },
      { purchaseDate: "1982-07-16", expected: 0 },
    ])(
      "when the purchaseDate is '$purchaseDate'",
      ({ purchaseDate, expected }) => {
        it(`returns ${expected} points`, () => {
          const receipt = new Receipt({ ...referenceReceipt1, purchaseDate });
          const actual = pointsCalculator.oddPurchaseDayPoints(receipt);
          expect(actual).toBe(expected);
        });
      },
    );
  });

  describe("happyHourPoints", () => {
    describe.each([
      { purchaseTime: "14:00:00", expected: 10 },
      { purchaseTime: "15:59:59", expected: 10 },
      { purchaseTime: "16:00:00", expected: 0 },
      { purchaseTime: "13:59:59", expected: 0 },
    ])(
      "when the purchaseTime is '$purchaseTime'",
      ({ purchaseTime, expected }) => {
        it(`returns ${expected} points`, () => {
          const receipt = new Receipt({ ...referenceReceipt1, purchaseTime });
          const actual = pointsCalculator.happyHourPoints(receipt);
          expect(actual).toBe(expected);
        });
      },
    );
  });
});
