import { IProductItem } from "../../types";

export interface ICartModel {
  getCounter: () => number;
  getTotalSumProducts: () => number;
  addToCart(data: IProductItem): void;
  hasItem(item: IProductItem): boolean;
  deleteCardFromCart(item: IProductItem): void;
  clearCartProducts(): void
}

export class CartModel implements ICartModel {
  protected _cartItems: Set<IProductItem>;

  constructor() {
    this._cartItems = new Set();
  }

  set cartProducts(data: IProductItem[]) {
    this._cartItems = new Set(data);
  }

  get cartProducts(): IProductItem[] {
    return Array.from(this._cartItems);
  }

  getCounter() {
    return this._cartItems.size;
  }

  getTotalSumProducts() {
    let total = 0;
    this._cartItems.forEach((item) => {
      total += item.price;
    });
    return total;
  }

  hasItem(item: IProductItem): boolean {
    return this._cartItems.has(item);
  }

  addToCart(data: IProductItem) {
    this._cartItems.add(data);
  }

  deleteCardFromCart(item: IProductItem) {
    this._cartItems.delete(item);
  }

  clearCartProducts() {
    this._cartItems.clear();
  }
}