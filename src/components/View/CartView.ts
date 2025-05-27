import { IProductItem } from "../../types";
import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { CartItem } from "./CartItemView";

export interface ICart {
  cart: HTMLElement;
  title: HTMLElement;
  cartList: HTMLElement;
  button: HTMLButtonElement;
  cartPrice: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;
  renderCartItemsCounter(value: number): void;
  renderTotalSumProducts(total: number): void;
  renderCards(products: IProductItem[], cardCartTemplate: HTMLTemplateElement): void;
  render(): HTMLElement;
}

export class Cart implements ICart {
  cart: HTMLElement;
  title: HTMLElement;
  cartList: HTMLElement;
  button: HTMLButtonElement;
  cartPrice: HTMLElement;
  headerBasketButton: HTMLButtonElement;
  headerBasketCounter: HTMLElement;
  
  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.cart = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.title = this.cart.querySelector('.modal__title');
    this.cartList = this.cart.querySelector('.basket__list');
    this.button = this.cart.querySelector('.basket__button');
    this.cartPrice = this.cart.querySelector('.basket__price');
    this.headerBasketButton = document.querySelector('.header__basket');
    this.headerBasketCounter = document.querySelector('.header__basket-counter');
    
    this.button.addEventListener('click', () => { this.events.emit('order:open') });
    this.headerBasketButton.addEventListener('click', () => { this.events.emit('cart:open') });

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.cartList.replaceChildren(...items);
      this.button.removeAttribute('disabled');
    } else {
      this.button.setAttribute('disabled', 'true');
      this.cartList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }

  renderCartItemsCounter(value: number) {
    this.headerBasketCounter.textContent = String(value);
  }
  
  renderTotalSumProducts(total: number) {
    this.cartPrice.textContent = String(total + ' синапсов');
  }

  renderCards(products: IProductItem[], cardCartTemplate: HTMLTemplateElement) {
    let i = 0;
    this.items = products.map((item) => {
      const basketItem = new CartItem(cardCartTemplate, this.events, { onClick: () => this.events.emit('cart:cartItemRemove', item) });
      i = i + 1;
      return basketItem.render(item, i);
    })
  }

  render() {
    this.title.textContent = 'Корзина';
    return this.cart;
  }
}