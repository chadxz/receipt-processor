import Item from "./item";
import pointCalculator from "./points";
import type { ItemConstructParams } from "./item";

export interface ReceiptConstructParams {
  id: string;
  retailer: string;
  purchaseDate: string;
  purchaseTime: string;
  total: string;
  items: ItemConstructParams[];
}

/**
 * A receipt.
 */
export default class Receipt {
  id: string;
  retailer: string;
  purchaseDate: string;
  purchaseTime: string;
  total: string;
  points: number;
  items: Item[];

  constructor(params: ReceiptConstructParams) {
    this.id = params.id;
    this.retailer = params.retailer;
    this.purchaseDate = params.purchaseDate;
    this.purchaseTime = params.purchaseTime;
    this.total = params.total;
    this.items = params.items.map((ip) => new Item(ip));

    this.points = pointCalculator.calculatePoints(this);
  }
}
