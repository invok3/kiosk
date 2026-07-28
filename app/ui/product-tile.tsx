import { Product } from "@/app/types/product";

interface ProductTileProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export default function ProductTile({ product, onClick }: ProductTileProps) {
  return (
    <div
      onClick={() => onClick?.(product)}
      className="py-3 flex justify-between items-center px-2 hover:bg-cream-100/60 rounded-lg transition-colors cursor-pointer select-none active:bg-cream-200/60"
    >
      <div>
        <h4 className="font-semibold text-coffee-900 text-base">
          {product.label}
        </h4>
      </div>
      <span className="font-bold text-coffee-800 text-sm">
        {product.price.toFixed(2)} ₪
      </span>
    </div>
  );
}