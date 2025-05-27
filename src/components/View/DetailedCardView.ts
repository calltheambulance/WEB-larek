import { IActions, IProductItem } from "../../types";
import { IEvents } from "../base/events";
import { Card } from "./CardView";

export interface IDetailedCard {
  text: HTMLElement;
  button: HTMLButtonElement;
  render(data: IProductItem): HTMLElement;
  setButtonState(message: string): void;
}

export class DetailedCard extends Card implements IDetailedCard {
  text: HTMLElement;
  button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    super(template, events, actions);
    this.text = this._cardElement.querySelector('.card__text');
    this.button = this._cardElement.querySelector('.card__button');
    this.button.addEventListener('click', () => { this.events.emit('card:addToCart') });
  }

  protected getPriceText(value: number | null) {
    return value === null ? "Бесценно" : `${value} синапсов`;
  }

  setButtonState(text: "Купить" | "В корзине" | "Не продаётся"): void {
    this.button.textContent = text;
    switch(text) {
      case "Купить": {
        this.button.disabled = false;
        break;
      }
      case "В корзине": {
        this.button.disabled = true;
        break;
      }
      case "Не продаётся": {
        this.button.disabled = true;
        break;
      }
    }
  }

  render(data: IProductItem): HTMLElement {
    super.render(data);
    this.text.textContent = data.description;
    return this._cardElement;
  }
}