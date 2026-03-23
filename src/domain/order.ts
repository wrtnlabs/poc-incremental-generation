import { tags } from "typia";

export interface OrderDraft {
  customer: {
    name: string;
    email: string & tags.Format<"email">;
  };
  shipping: {
    address1: string;
    city: string;
    postalCode: string;
  };
  items: OrderItem[];
  note: string | null;
}

export interface OrderItem {
  sku: string;
  quantity: number;
}
