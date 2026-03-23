import type { DeepPartial } from "@typia/interface";

import type { OrderDraft } from "./order";

export type OrderPatch = DeepPartial<OrderDraft>;

export interface IOrderPatchApplication {
  submit(props: {
    draft: OrderPatch;
  }): void;
}
