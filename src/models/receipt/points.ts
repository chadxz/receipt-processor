import type Receipt from "./";

/**
 * Calculator that award points for a receipt in different scenarios.
 */
class PointsCalculator {
  /**
   * Calculate all points for a receipt.
   */
  calculatePoints(receipt: Receipt): number {
    return (
      this.alphanumericRetailerNamePoints(receipt) +
      this.wholeDollarAmountPoints(receipt) +
      this.quarterAmountPoints(receipt) +
      this.itemCountPoints(receipt) +
      this.itemDescriptionLengthPoints(receipt) +
      this.oddPurchaseDayPoints(receipt) +
      this.happyHourPoints(receipt)
    );
  }

  /**
   * 1 point for every alphanumeric character in the retailer name.
   */
  alphanumericRetailerNamePoints(receipt: Receipt): number {
    return receipt.retailer.replace(/[^a-zA-Z0-9]/g, "").length;
  }

  /**
   * 50 points if the total is a round dollar amount with no cents.
   */
  wholeDollarAmountPoints(receipt: Receipt): number {
    const total = parseFloat(receipt.total);
    return total % 1 === 0 ? 50 : 0;
  }

  /**
   * 25 points if the total is a multiple of 0.25.
   */
  quarterAmountPoints(receipt: Receipt): number {
    const total = parseFloat(receipt.total);
    return total % 0.25 === 0 ? 25 : 0;
  }

  /**
   * 5 points for every two items on the receipt.
   */
  itemCountPoints(receipt: Receipt): number {
    return Math.floor(receipt.items.length / 2) * 5;
  }

  /**
   * If the trimmed length of an item's description is a multiple of 3, multiply
   * the price by 0.2 and round up to the nearest integer. The result is the
   * number of points earned.
   */
  itemDescriptionLengthPoints(receipt: Receipt): number {
    return receipt.items.reduce((total, item) => {
      const descriptionLength = item.shortDescription.trim().length;
      return descriptionLength % 3 === 0
        ? total + Math.ceil(parseFloat(item.price) * 0.2)
        : total;
    }, 0);
  }

  /**
   * 6 points if the day in the purchase date is odd.
   */
  oddPurchaseDayPoints(receipt: Receipt): number {
    const day = parseInt(receipt.purchaseDate.split("-")[2] ?? "", 10);
    return day % 2 === 1 ? 6 : 0;
  }

  /**
   * 10 points if the time of purchase is after 2:00pm and before 4:00pm.
   */
  happyHourPoints(receipt: Receipt): number {
    const hour = parseInt(receipt.purchaseTime.split(":")[0] ?? "", 10);
    return hour >= 14 && hour < 16 ? 10 : 0;
  }
}

export default new PointsCalculator();
