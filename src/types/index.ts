export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  weight: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviews: number;
  deliveryMinutes: number;
  image: string;
  emoji: string;
  tags: string[];
  inStock: boolean;
  description: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  color: string;
  itemCount: number;
};

export type Offer = {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  gradient: string;
  emoji: string;
};

export type CartItem = { productId: string; quantity: number };
