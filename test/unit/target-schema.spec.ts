import typia from "typia";

import type { OrderDraft } from "../../src/domain/order";

describe("OrderDraft schema fixtures", () => {
  it("accepts a fully complete object", () => {
    const result = typia.validate<OrderDraft>({
      customer: {
        name: "Alice",
        email: "alice@example.com",
      },
      shipping: {
        address1: "123 Main St",
        city: "Seoul",
        postalCode: "04524",
      },
      items: [
        {
          sku: "SKU-001",
          quantity: 2,
        },
      ],
      note: null,
    });
    expect(result.success).toBe(true);
  });

  it("treats omitted required nullable note as missing", () => {
    const result = typia.validate<OrderDraft>({
      customer: {
        name: "Alice",
        email: "alice@example.com",
      },
      shipping: {
        address1: "123 Main St",
        city: "Seoul",
        postalCode: "04524",
      },
      items: [
        {
          sku: "SKU-001",
          quantity: 2,
        },
      ],
    });
    expect(result.success).toBe(false);
    if (result.success === false) {
      expect(result.errors.some((error) => error.path === "$input.note")).toBe(true);
    }
  });
});
