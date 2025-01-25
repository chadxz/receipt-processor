export interface ItemConstructParams {
  shortDescription: string;
  price: string;
}

/**
 * A receipt line item.
 */
export default class Item {
  shortDescription: string;
  price: string;

  constructor(params: ItemConstructParams) {
    this.shortDescription = params.shortDescription;
    this.price = params.price;
  }
}
