import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/Model/ApiModel';
import { CatalogModel } from './components/Model/CatalogModel';
import { Card } from './components/View/CardView';
import { DetailedCard } from './components/View/DetailedCardView';
import { IOrderForm, IProductItem } from './types';
import { Modal } from './components/View/ModalView';
import { ensureElement } from './utils/utils';
import { CartModel } from './components/Model/CartModel';
import { Cart } from './components/View/CartView';
import { CartItem } from './components/View/CartItemView';
import { FormModel } from './components/Model/FormModel';
import { Order } from './components/View/FormOrderView';
import { Contacts } from './components/View/FormContactsView';
import { Success } from './components/View/SuccessOrderView';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const detailedCardTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardCartTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const eventEmitter = new EventEmitter();
const apiModel = new ApiModel(CDN_URL, API_URL);
const catalogModel = new CatalogModel(eventEmitter);
const cartModel = new CartModel();
const formModel = new FormModel(eventEmitter);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), eventEmitter);
const cart = new Cart(cartTemplate, eventEmitter);
const order = new Order(orderTemplate, eventEmitter);
const contacts = new Contacts(contactsTemplate, eventEmitter);

eventEmitter.on('cards:receive', () => {
  catalogModel.productCards.forEach(item => {
    const card = new Card(cardCatalogTemplate, eventEmitter, { onClick: () => eventEmitter.emit('card:select', item) });
    ensureElement<HTMLElement>('.gallery').append(card.render(item));
  });
});

eventEmitter.on('card:select', (item: IProductItem) => { catalogModel.setPreview(item) });

eventEmitter.on('modalCard:open', (item: IProductItem) => {
  const detailedCard = new DetailedCard(detailedCardTemplate, eventEmitter)

  if(!item.price) {
    detailedCard.setButtonState("Не продаётся");
  } else if(cartModel.hasItem(item)) {
    detailedCard.setButtonState("В корзине");
  } else {
    detailedCard.setButtonState("Купить");
  }

  modal.content = detailedCard.render(item);
  modal.render();
});

eventEmitter.on('card:addToCart', () => {
  cartModel.addToCart(catalogModel.selectedCard);
  cart.renderCartItemsCounter(cartModel.getCounter());
  modal.close();
});

eventEmitter.on('cart:open', () => {
  cart.renderTotalSumProducts(cartModel.getTotalSumProducts());
  cart.renderCards(cartModel.cartProducts, cardCartTemplate);
  modal.content = cart.render();
  modal.render();
});

eventEmitter.on('cart:cartItemRemove', (item: IProductItem) => {
  cartModel.deleteCardFromCart(item);
  cart.renderCartItemsCounter(cartModel.getCounter());
  cart.renderTotalSumProducts(cartModel.getTotalSumProducts());
  cart.renderCards(cartModel.cartProducts, cardCartTemplate);
});

eventEmitter.on('order:open', () => {
  modal.content = order.render();
  modal.render();
  formModel.items = cartModel.cartProducts.map(item => item.id);
});

eventEmitter.on('order:paymentSelection', (button: HTMLButtonElement) => {
  formModel.payment = button.name;
  formModel.validateOrder();
})

eventEmitter.on(`order:changeAddress`, (data: { field: string, value: string }) => {
  formModel.setOrderAddress(data.field, data.value);
});

eventEmitter.on('formErrors:address', (errors: Partial<IOrderForm>) => {
  const { address, payment } = errors;
  order.valid = !address && !payment;
  order.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
})

eventEmitter.on('contacts:open', () => {
  formModel.total = cartModel.getTotalSumProducts();
  modal.content = contacts.render();
  modal.render();
});

eventEmitter.on(`contacts:changeContacts`, (data: { field: string, value: string }) => {
  formModel.setOrderContacts(data.field, data.value);
});

eventEmitter.on('formErrors:contacts', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

eventEmitter.on('success:open', () => {
  apiModel.postOrder(formModel.getOrder())
    .then(() => {
      const success = new Success(successTemplate, eventEmitter);
      modal.content = success.render(cartModel.getTotalSumProducts());
      cartModel.clearCartProducts();
      cart.renderCartItemsCounter(cartModel.getCounter()); 
      modal.render();
    })
    .catch(error => console.log(error));
});

eventEmitter.on('success:close', () => modal.close());

eventEmitter.on('modal:open', () => {
  modal.locked = true;
});

eventEmitter.on('modal:close', () => {
  modal.locked = false;
});

apiModel
  .getListProductCard()
  .then(function (data: IProductItem[]) {
    catalogModel.productCards = data;
  })
  .catch(error => console.log(error))