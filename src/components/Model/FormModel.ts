import { FormErrors, IOrder } from "../../types";
import { IEvents } from "../base/events";

export interface IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  setOrderAddress(field: string, value: string): void
  validateOrder(): boolean;
  setOrderContacts(field: string, value: string): void
  validateContacts(): boolean;
  getOrder(): IOrder;
}

export class FormModel implements IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  formErrors: FormErrors = {};

  constructor(protected events: IEvents) {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.total = 0;
    this.items = [];
  }

  setOrderAddress(field: string, value: string) {
    if (field === 'address') {
      this.address = value;
    }

    if (this.validateOrder()) {
      this.events.emit('order:ready', this.getOrder());
    }
  }

  validateOrder() {
    const errors: FormErrors = {};

    if (!this.address) {
      errors.address = 'Введите адрес'
    } else if (!this.payment) {
      errors.payment = 'Выберите способ оплаты'
    }

    this.formErrors = errors;
    this.events.emit('formErrors:address', this.formErrors);

    return Object.keys(errors).length === 0;
  }

  setOrderContacts(field: string, value: string) {
    if (field === 'email') {
      this.email = value;
    } else if (field === 'phone') {
      this.phone = value;
    }

    if (this.validateContacts()) {
      this.events.emit('order:ready', this.getOrder());
    }
  }

  validateContacts() {
    const errors: typeof this.formErrors = {};

    if (!this.email) {
      errors.email = 'Необходимо указать email'
    }

    if (!this.phone) {
      errors.phone = 'Необходимо указать телефон'
    }

    this.formErrors = errors;
    this.events.emit('formErrors:contacts', this.formErrors);

    return Object.keys(errors).length === 0;
  }

  getOrder() {
    return {
      ...this,
      items: this.items,
    }
  }
}