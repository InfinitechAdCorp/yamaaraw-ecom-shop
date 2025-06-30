import ProductCard from "./product-card";

interface ProductGridProps {
  products: Array<{
    id: string | number;
    name: string;
    price: number;
    original_price?: number;
    description: string;
    images: string[];
    category: string;
    in_stock: boolean;
    featured?: boolean;
    model?: string;
  }>;
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="text-4xl">🔍</div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500 text-lg">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
