// ─── types ───────────────────────────────────────────────────────────────────

export interface GarmentProduct {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviewCount: string;
  status: string;
  description: string;
  fabric: string;
  sizes: string[];
  badge: string;
  badgeColor: string;
  category: string;
  discount: number;
}

// ─── data ────────────────────────────────────────────────────────────────────

export const PRODUCTS: GarmentProduct[] = [
  {
    id: "1",
    title: "Cotton Blend Co-ord Set",
    brand: "Aurelia",
    price: 1299,
    originalPrice: 1899,
    image:
      "https://res.cloudinary.com/dquki4xol/image/upload/v1776077841/Square_Neck_Textured_Waist-Cinching_Maroon_Dress_vheg55.webp",
    rating: 4.5,
    reviewCount: "128",
    status: "New",
    category: "Women",
    description: "",
    fabric: "100% Cotton",
    sizes: ["XS", "S", "M", "L", "XL"],
    badge: "New Arrival",
    badgeColor: "#16a34a",
    discount: 32,
  },
  {
    id: "2",
    title: "Embroidered Frok",
    brand: "Biba",
    price: 2150,
    originalPrice: 3200,
    image:
      "https://res.cloudinary.com/dquki4xol/image/upload/v1776078520/images_6_vfn6rc.jpg",
    rating: 4,
    reviewCount: "75",
    status: "Bestseller",
    category: "Ethnic",
    description: "",
    fabric: "Georgette",
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Sale",
    badgeColor: "#f97316",
    discount: 33,
  },
  {
    id: "3",
    title: "Slim Fit Stretch Jeans",
    brand: "FabIndia",
    price: 899,
    originalPrice: 1299,
    image:
      "https://res.cloudinary.com/dquki4xol/image/upload/v1776077580/images_4_rs50b4.jpg",
    rating: 4.5,
    reviewCount: "99",
    status: "Bestseller",
    category: "Men",
    description: "",
    fabric: "Cotton Blend",
    sizes: ["30", "32", "34", "36", "38"],
    badge: "Bestseller",
    badgeColor: "#111111",
    discount: 31,
  },
  {
    id: "4",
    title: "Tropical Rayon Camp Shirt",
    brand: "Manyavar",
    price: 749,
    originalPrice: 1100,
    image:
      "https://res.cloudinary.com/dquki4xol/image/upload/v1776077580/images_5_f8olir.jpg",
    rating: 4.5,
    reviewCount: "214",
    status: "Trending",
    category: "Men",
    description: "",
    fabric: "Rayon",
    sizes: ["S", "M", "L", "XL"],
    badge: "Trending",
    badgeColor: "#ea580c",
    discount: 32,
  },
  {
    id: "5",
    title: "Kids Dungaree Playsuit",
    brand: "H&M Kids",
    price: 599,
    originalPrice: 899,
    image:
      "https://res.cloudinary.com/dquki4xol/image/upload/v1776152849/kidsno.1_y5j49b.png",
    rating: 4.8,
    reviewCount: "61",
    status: "New",
    category: "Kids",
    description: "",
    fabric: "Denim Cotton",
    sizes: ["2Y", "4Y", "6Y", "8Y"],
    badge: "New Arrival",
    badgeColor: "#16a34a",
    discount: 33,
  },
  {
    id: "6",
    title: "Palazzo Sharara Set",
    brand: "W for Woman",
    price: 1799,
    originalPrice: 2499,
    image:
      "https://res.cloudinary.com/dquki4xol/image/upload/v1776078520/k2ujc_512_yf0fzu.webp",
    rating: 4.3,
    reviewCount: "88",
    status: "Bestseller",
    category: "Ethnic",
    description: "",
    fabric: "Silk Blend",
    sizes: ["S", "M", "L", "XL"],
    badge: "Sale",
    badgeColor: "#f97316",
    discount: 28,
  },
  {
    id: "7",
    title: "Flared Denim Jeans",
    brand: "Levis",
    price: 1499,
    originalPrice: 2299,
    image:
      "https://res.cloudinary.com/dquki4xol/image/upload/v1776077580/images_3_prsjj5.jpg",
    rating: 4.6,
    reviewCount: "302",
    status: "Trending",
    category: "Men",
    description: "",
    fabric: "98% Denim",
    sizes: ["26", "28", "30", "32"],
    badge: "Trending",
    badgeColor: "#ea580c",
    discount: 35,
  },
  {
    id: "8",
    title: "Bandhgala Nehru Jacket",
    brand: "Manyavar",
    price: 3299,
    originalPrice: 4999,
    image:
      "https://res.cloudinary.com/dquki4xol/image/upload/v1776078689/three-elegant-mens-suits-different-colors-perfect-business-formal-events-highquality-fabrics-tailoring_191095-85761_ilaw9v.avif",
    rating: 4.7,
    reviewCount: "47",
    status: "New",
    category: "Western",
    description: "",
    fabric: "Art Silk",
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "New Arrival",
    badgeColor: "#16a34a",
    discount: 34,
  },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

export const FILTERS = [
  "All",
  "Women",
  "Men",
  "Kids",
  "Ethnic",
  "Western",
] as const;
export type FilterType = (typeof FILTERS)[number];

export const FILTER_ICONS: Record<string, string> = {
  Women: "👗",
  Men: "👔",
  Kids: "👶",
  Ethnic: "🪡",
  Western: "🧥",
};

export const getFilteredProducts = (filter: FilterType): GarmentProduct[] =>
  filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
