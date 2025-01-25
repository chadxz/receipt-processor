import pointsCalculator from "./points";
import Index from "./index";

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
  it("calculates all points for the first reference receipt", () => {
    const receipt = new Index(referenceReceipt1);

    expect(pointsCalculator.calculatePoints(receipt)).toBe(28);
  });

  it("calculates all points for the second reference receipt", () => {
    const receipt = new Index(referenceReceipt2);

    expect(pointsCalculator.calculatePoints(receipt)).toBe(109);
  });
});
