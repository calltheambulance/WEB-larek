import { IProductItem } from "../../types";
import { IEvents } from "../base/events";

export interface ICatalogModel {
  productCards: IProductItem[];
  selectedCard: IProductItem;
  setPreview(item: IProductItem): void;
}

export class CatalogModel implements ICatalogModel {
  protected _productCards: IProductItem[];
  selectedCard: IProductItem;

  constructor(protected events: IEvents) {
    this._productCards = []
  }

  set productCards(data: IProductItem[]) {
    this._productCards = data;
    this.events.emit('cards:receive');
  }

  get productCards() {
    return this._productCards;
  }

  setPreview(item: IProductItem) {
    this.selectedCard = item;
    this.events.emit('modalCard:open', item)
  }
}