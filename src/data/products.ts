import type { Product, Offer } from "@/types";
import { categories, brands } from "./categories";

const seed = [
  { name: "Fresh Bananas", emoji: "🍌", cat: 0, weight: "1 dozen", price: 49 },
  { name: "Organic Apples", emoji: "🍎", cat: 0, weight: "1 kg", price: 189 },
  { name: "Ripe Mangoes", emoji: "🥭", cat: 0, weight: "1 kg", price: 249 },
  { name: "Fresh Strawberries", emoji: "🍓", cat: 0, weight: "200 g", price: 149 },
  { name: "Green Grapes", emoji: "🍇", cat: 0, weight: "500 g", price: 99 },
  { name: "Watermelon", emoji: "🍉", cat: 0, weight: "1 pc", price: 79 },
  { name: "Fresh Tomatoes", emoji: "🍅", cat: 0, weight: "1 kg", price: 39 },
  { name: "Broccoli", emoji: "🥦", cat: 0, weight: "500 g", price: 89 },
  { name: "Baby Spinach", emoji: "🥬", cat: 0, weight: "250 g", price: 45 },
  { name: "Carrots", emoji: "🥕", cat: 0, weight: "500 g", price: 35 },

  { name: "Whole Milk", emoji: "🥛", cat: 1, weight: "1 L", price: 68 },
  { name: "Farm Eggs", emoji: "🥚", cat: 1, weight: "12 pcs", price: 89 },
  { name: "Greek Yogurt", emoji: "🍶", cat: 1, weight: "400 g", price: 129 },
  { name: "Cheddar Cheese", emoji: "🧀", cat: 1, weight: "200 g", price: 199 },
  { name: "Salted Butter", emoji: "🧈", cat: 1, weight: "100 g", price: 58 },
  { name: "Paneer Fresh", emoji: "🧀", cat: 1, weight: "200 g", price: 89 },
  { name: "Almond Milk", emoji: "🥛", cat: 1, weight: "1 L", price: 189 },
  { name: "Cream", emoji: "🍦", cat: 1, weight: "250 ml", price: 79 },

  { name: "Sourdough Loaf", emoji: "🍞", cat: 2, weight: "400 g", price: 149 },
  { name: "Butter Croissant", emoji: "🥐", cat: 2, weight: "2 pcs", price: 99 },
  { name: "Chocolate Muffin", emoji: "🧁", cat: 2, weight: "4 pcs", price: 129 },
  { name: "Whole Wheat Bread", emoji: "🍞", cat: 2, weight: "400 g", price: 55 },
  { name: "Bagels", emoji: "🥯", cat: 2, weight: "4 pcs", price: 120 },
  { name: "Pretzels", emoji: "🥨", cat: 2, weight: "200 g", price: 85 },

  { name: "Salted Popcorn", emoji: "🍿", cat: 3, weight: "100 g", price: 49 },
  { name: "Potato Chips", emoji: "🥔", cat: 3, weight: "60 g", price: 25 },
  { name: "Roasted Peanuts", emoji: "🥜", cat: 3, weight: "200 g", price: 79 },
  { name: "Trail Mix", emoji: "🌰", cat: 3, weight: "250 g", price: 199 },
  { name: "Cookies Pack", emoji: "🍪", cat: 3, weight: "150 g", price: 65 },
  { name: "Crackers", emoji: "🍘", cat: 3, weight: "200 g", price: 55 },
  { name: "Namkeen Mix", emoji: "🥨", cat: 3, weight: "200 g", price: 60 },

  { name: "Fresh Orange Juice", emoji: "🧃", cat: 4, weight: "1 L", price: 149 },
  { name: "Cold Brew Coffee", emoji: "☕", cat: 4, weight: "250 ml", price: 129 },
  { name: "Sparkling Water", emoji: "💧", cat: 4, weight: "750 ml", price: 89 },
  { name: "Coconut Water", emoji: "🥥", cat: 4, weight: "500 ml", price: 65 },
  { name: "Green Tea", emoji: "🍵", cat: 4, weight: "25 bags", price: 199 },
  { name: "Kombucha", emoji: "🍾", cat: 4, weight: "330 ml", price: 149 },
  { name: "Lemonade", emoji: "🍋", cat: 4, weight: "1 L", price: 99 },

  { name: "Instant Noodles", emoji: "🍜", cat: 5, weight: "4 pack", price: 60 },
  { name: "Ready Pasta", emoji: "🍝", cat: 5, weight: "200 g", price: 89 },
  { name: "Cup Soup", emoji: "🍲", cat: 5, weight: "70 g", price: 35 },
  { name: "Frozen Pizza", emoji: "🍕", cat: 5, weight: "300 g", price: 249 },
  { name: "Ready Dal", emoji: "🥘", cat: 5, weight: "300 g", price: 99 },

  { name: "Dish Soap", emoji: "🧴", cat: 6, weight: "500 ml", price: 129 },
  { name: "Floor Cleaner", emoji: "🧽", cat: 6, weight: "1 L", price: 189 },
  { name: "Laundry Detergent", emoji: "🧺", cat: 6, weight: "1 kg", price: 249 },
  { name: "Toilet Cleaner", emoji: "🚽", cat: 6, weight: "500 ml", price: 99 },

  { name: "Body Wash", emoji: "🧼", cat: 7, weight: "250 ml", price: 199 },
  { name: "Shampoo", emoji: "🧴", cat: 7, weight: "340 ml", price: 285 },
  { name: "Toothpaste", emoji: "🪥", cat: 7, weight: "150 g", price: 99 },
  { name: "Face Wash", emoji: "🧖", cat: 7, weight: "100 ml", price: 189 },
  { name: "Deodorant", emoji: "💨", cat: 7, weight: "150 ml", price: 199 },
  { name: "Sunscreen SPF 50", emoji: "☀️", cat: 7, weight: "50 ml", price: 349 },

  { name: "Chicken Breast", emoji: "🍗", cat: 8, weight: "500 g", price: 299 },
  { name: "Fish Fillet", emoji: "🐟", cat: 8, weight: "500 g", price: 389 },
  { name: "Prawns", emoji: "🍤", cat: 8, weight: "250 g", price: 349 },
  { name: "Mutton Curry Cut", emoji: "🍖", cat: 8, weight: "500 g", price: 449 },

  { name: "Frozen Peas", emoji: "🟢", cat: 9, weight: "500 g", price: 89 },
  { name: "Veg Nuggets", emoji: "🍗", cat: 9, weight: "300 g", price: 149 },
  { name: "French Fries", emoji: "🍟", cat: 9, weight: "500 g", price: 129 },

  { name: "Baby Diapers", emoji: "🍼", cat: 10, weight: "36 pcs", price: 599 },
  { name: "Baby Wipes", emoji: "👶", cat: 10, weight: "72 pcs", price: 199 },
  { name: "Baby Shampoo", emoji: "🧴", cat: 10, weight: "200 ml", price: 189 },

  { name: "Dog Food Chicken", emoji: "🐕", cat: 11, weight: "1 kg", price: 449 },
  { name: "Cat Litter", emoji: "🐈", cat: 11, weight: "5 kg", price: 549 },

  { name: "Trash Bags", emoji: "🗑️", cat: 12, weight: "30 pcs", price: 99 },
  { name: "Aluminium Foil", emoji: "🧻", cat: 12, weight: "9 m", price: 89 },
  { name: "Paper Towels", emoji: "🧻", cat: 12, weight: "4 rolls", price: 149 },

  { name: "Dark Chocolate", emoji: "🍫", cat: 13, weight: "100 g", price: 149 },
  { name: "Gulab Jamun", emoji: "🍡", cat: 13, weight: "500 g", price: 199 },
  { name: "Rasgulla Tin", emoji: "🍮", cat: 13, weight: "1 kg", price: 289 },

  { name: "Assam Tea", emoji: "🍵", cat: 14, weight: "250 g", price: 189 },
  { name: "Instant Coffee", emoji: "☕", cat: 14, weight: "100 g", price: 299 },
  { name: "Filter Coffee", emoji: "☕", cat: 14, weight: "500 g", price: 399 },

  { name: "Oats", emoji: "🥣", cat: 15, weight: "500 g", price: 189 },
  { name: "Cornflakes", emoji: "🌽", cat: 15, weight: "475 g", price: 249 },
  { name: "Muesli", emoji: "🥣", cat: 15, weight: "500 g", price: 399 },
  { name: "Pancake Mix", emoji: "🥞", cat: 15, weight: "400 g", price: 199 },

  { name: "Olive Oil", emoji: "🫒", cat: 16, weight: "500 ml", price: 549 },
  { name: "Sunflower Oil", emoji: "🌻", cat: 16, weight: "1 L", price: 189 },
  { name: "Ghee", emoji: "🧈", cat: 16, weight: "500 ml", price: 449 },

  { name: "Tomato Ketchup", emoji: "🍅", cat: 17, weight: "500 g", price: 129 },
  { name: "Soy Sauce", emoji: "🥢", cat: 17, weight: "200 ml", price: 89 },
  { name: "Mayo", emoji: "🥚", cat: 17, weight: "250 g", price: 149 },
  { name: "Hot Sauce", emoji: "🌶️", cat: 17, weight: "150 ml", price: 199 },

  { name: "Vanilla Ice Cream", emoji: "🍨", cat: 18, weight: "1 L", price: 289 },
  { name: "Choco Bar", emoji: "🍫", cat: 18, weight: "6 pcs", price: 149 },
  { name: "Mango Kulfi", emoji: "🥭", cat: 18, weight: "4 pcs", price: 129 },

  { name: "Milk Chocolate Bar", emoji: "🍫", cat: 19, weight: "80 g", price: 99 },
  { name: "Gummy Bears", emoji: "🐻", cat: 19, weight: "150 g", price: 79 },
  { name: "Toffee Mix", emoji: "🍬", cat: 19, weight: "250 g", price: 129 },
  { name: "Lollipops", emoji: "🍭", cat: 19, weight: "20 pcs", price: 89 },
];

function makeImage(emoji: string, bg: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' rx='20' fill='${bg}'/><text x='50%' y='55%' font-size='110' text-anchor='middle' dominant-baseline='middle'>${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const products: Product[] = seed.map((p, i) => {
  const cat = categories[p.cat];
  const discount = [0, 10, 15, 20, 25, 30, 40, 50][i % 8];
  const original = discount > 0 ? Math.round(p.price / (1 - discount / 100)) : p.price;
  return {
    id: `p${i + 1}`,
    name: p.name,
    brand: brands[i % brands.length],
    category: cat.name,
    categorySlug: cat.slug,
    weight: p.weight,
    price: p.price,
    originalPrice: original,
    discountPercent: discount,
    rating: 3.8 + ((i * 7) % 12) / 10,
    reviews: 20 + ((i * 37) % 480),
    deliveryMinutes: 8 + (i % 8),
    image: makeImage(p.emoji, cat.color),
    emoji: p.emoji,
    tags: i % 5 === 0 ? ["Bestseller"] : i % 7 === 0 ? ["New"] : [],
    inStock: i % 23 !== 0,
    description: `Premium quality ${p.name.toLowerCase()} sourced fresh and delivered to your door in minutes. Handpicked for freshness with love.`,
  };
});

export const offers: Offer[] = [
  { id: "o1", title: "Flat 40% OFF", subtitle: "On your first order", code: "FRESH40", gradient: "from-emerald-500 to-green-600", emoji: "🎉" },
  { id: "o2", title: "Free Delivery", subtitle: "Orders over ₹199", code: "FREESHIP", gradient: "from-orange-400 to-rose-500", emoji: "🚚" },
  { id: "o3", title: "Weekend Sale", subtitle: "Up to 60% off snacks", code: "WEEKEND60", gradient: "from-fuchsia-500 to-purple-600", emoji: "🍿" },
  { id: "o4", title: "Fruit Bonanza", subtitle: "Buy 2 get 1 free", code: "FRUIT3", gradient: "from-yellow-400 to-orange-500", emoji: "🍇" },
  { id: "o5", title: "Dairy Discount", subtitle: "₹50 off ₹299", code: "MILK50", gradient: "from-sky-400 to-blue-600", emoji: "🥛" },
  { id: "o6", title: "Night Owl", subtitle: "10% off after 10 PM", code: "NIGHT10", gradient: "from-indigo-500 to-purple-700", emoji: "🌙" },
  { id: "o7", title: "Bakery Fresh", subtitle: "Combo starting ₹99", code: "BAKE99", gradient: "from-amber-400 to-orange-600", emoji: "🥐" },
  { id: "o8", title: "Cashback ₹100", subtitle: "Prepaid orders", code: "PAY100", gradient: "from-teal-400 to-emerald-600", emoji: "💸" },
  { id: "o9", title: "Instant Meals", subtitle: "Flat 30% off", code: "QUICK30", gradient: "from-red-500 to-pink-600", emoji: "🍜" },
  { id: "o10", title: "Refer & Earn", subtitle: "₹150 per friend", code: "REFER150", gradient: "from-lime-400 to-green-600", emoji: "🎁" },
];

export const reviews = Array.from({ length: 20 }).map((_, i) => ({
  id: `r${i + 1}`,
  user: ["Aarav", "Isha", "Rohan", "Priya", "Kabir", "Ananya", "Vihaan", "Meera"][i % 8] + " " + ["S.", "K.", "M.", "R."][i % 4],
  rating: 4 + (i % 2),
  date: `${1 + (i % 28)} Nov 2025`,
  text: [
    "Delivered in 8 minutes flat. Everything was fresh and perfectly packed.",
    "The produce quality is genuinely better than my local supermarket.",
    "App is buttery smooth and the offers actually work. Big fan.",
    "Late night order arrived hot and on time. Impressed.",
    "Prices are competitive and the packaging is fully recyclable.",
  ][i % 5],
}));

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
