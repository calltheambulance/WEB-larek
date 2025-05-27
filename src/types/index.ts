export interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IActions {
  onClick: (event: MouseEvent) => void;
}

export interface IOrderForm {
payment?: string;
address?: string;
phone?: string;
email?: string;
total?: string | number;
}

export interface IOrder extends Required<Omit<IOrderForm, 'total'>> {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;