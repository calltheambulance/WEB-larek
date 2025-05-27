import { IActions, IProductItem } from "../../types";
import { IEvents } from "../base/events";

export interface ICartItem {
  cartItem: HTMLElement;
	index:HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;
	render(data: IProductItem, item: number): HTMLElement;
}

export class CartItem implements ICartItem {
  cartItem: HTMLElement;
	index:HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	buttonDelete: HTMLButtonElement;

  constructor (template: HTMLTemplateElement, protected events: IEvents, actions?: IActions) {
    this.cartItem = template.content.querySelector('.basket__item').cloneNode(true) as HTMLElement;
		this.index = this.cartItem.querySelector('.basket__item-index');
		this.title = this.cartItem.querySelector('.card__title');
		this.price = this.cartItem.querySelector('.card__price');
		this.buttonDelete = this.cartItem.querySelector('.basket__item-delete');

		if (actions?.onClick) {
			this.buttonDelete.addEventListener('click', actions.onClick);
		}
  }

	protected getPriceText(value: number | null) {
    return value === null ? "Бесценно" : String(value) + " синапсов"
  }

	render(data: IProductItem, item: number) {
		this.index.textContent = String(item);
		this.title.textContent = data.title;
		this.price.textContent = this.getPriceText(data.price);
		return this.cartItem;
	}
}