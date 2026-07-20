export interface Product {
    id: string;
    name: string;
    price: number;
    options?: Record<string, any>[];
}

export interface CartProduct {
    id: string;
    name: string;
    price: number;
    quantity: number;
    options?: Record<string, any>[];
    total: number;
    note?: string;
}

interface CreateCartProductParams {
    product: Product;
    quantity?: number;
    options?: Record<string, any>[];
    note?: string;
}

export function cartProductFrom(params: CreateCartProductParams): CartProduct {
  const { product, quantity = 1, options, note = "" } = params;

  // Calculate extra prices ONLY if options exists and is a non-empty array
  const optionsExtraPrice = Array.isArray(options)
    ? options.reduce((sum, option) => {
        if (!option) return sum;
        const extra = option.extraPrice ?? option.extraprice ?? 0;
        return sum + (typeof extra === "number" ? extra : 0);
      }, 0)
    : 0;

  const unitPrice = product.price + optionsExtraPrice;
  const total = unitPrice * quantity;

  return {
    id: `${product.id}-${Date.now()}`,
    name: product.name,
    price: unitPrice,
    quantity,
    // Preserve undefined or null directly so Firebase updates don't write unwanted empty arrays
    ...(options !== undefined && { options }),
    note,
    total,
  };
}