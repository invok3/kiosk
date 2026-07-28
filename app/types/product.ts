import { OptionChoice, ProductOption } from "./option";

export interface Product {
    id: number;
    category_id: number;
    label: string;
    name: string;
    price: number;
    options?: ProductOption[];
    available: boolean;
}

export interface CartProduct {
    id: number;
    label: string;
    name: string;
    price: number;
    quantity: number;
    options?: (ProductOption | OptionChoice)[];
    total: number;
    note?: string;
}

interface CreateCartProductParams {
    product: Product;
    quantity?: number;
    options?: (ProductOption | OptionChoice)[];
    note?: string;
}

export function cartProductFrom(params: CreateCartProductParams): CartProduct {
  const { product, quantity = 1, options, note = "" } = params;

  // Calculate extra prices ONLY if options exists and is a non-empty array
  const optionsExtraPrice = Array.isArray(options)
    ? options.reduce((sum, option) => {
        if (!option) return sum;
        const extra = option.extraPrice ?? 0;
        return sum + (typeof extra === "number" ? extra : 0);
      }, 0)
    : 0;

  const unitPrice = product.price + optionsExtraPrice;
  const total = unitPrice * quantity;

  return {
    id: product.id,
    label:product.label,
    name: product.name,
    price: unitPrice,
    quantity,
    // Preserve undefined or null directly so Firebase updates don't write unwanted empty arrays
    ...(options !== undefined && { options }),
    note,
    total,
  };
}