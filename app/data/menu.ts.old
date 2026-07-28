import { Category } from "@/app/types/category";
import { Product } from "@/app/types/product";

export const CATEGORIES = [
  {
    id: 0,
    name: "hot-drinks",
    label: "مشروبات ساخنة",
    available: true,
  },
  {
    id: 1,
    name: "soft-drinks",
    label: "مشروبات باردة",
    available: true,
  },
  {
    id: 2,
    name: "ice-cream",
    label: "بوظة",
    available: false,
  },
] satisfies Category[];

export const PRODUCTS = [
  {
    id: 1,
    category_id: 0,
    name: "espresso",
    label: "إسبريسو",
    price: 12.0,
    options: [
      {
        id: "milk_type",
        name: "نوع الحليب",
        type: "radio",
        extraPrice: 0,
        required: true,
        choices: [
          { id: "whole_milk", name: "حليب كامل الدسم", extraPrice: 0 },
          { id: "oat_milk", name: "حليب شوفان", extraPrice: 3.0 },
          { id: "almond_milk", name: "حليب لوز", extraPrice: 3.0 },
        ],
      },
      {
        id: "extra_hot",
        name: "ساخن جداً",
        type: "checkbox",
        extraPrice: 0,
      },
      {
        id: "extra_shot",
        name: "جرعة إضافية (Extra Shot)",
        type: "checkbox",
        extraPrice: 4.0,
      },
    ],
    available: true,
  },
  {
    id: 2,
    category_id: 0,
    name: "latte",
    label: "لاتيه",
    price: 18.0,
    available: true,
  },
  { id: 3, category_id: 0, name: "cappuccino", label: "كابتشينو", price: 16.0, available: true },
  { id: 4, category_id: 0, name: "americano", label: "أمريكانو", price: 14.0, available: true },
  { id: 5, category_id: 1, name: "iced-latte", label: "آيس لاتيه", price: 20.0, available: true },
  { id: 6, category_id: 1, name: "iced-americano", label: "آيس أمريكانو", price: 15.0, available: true },
  { id: 7, category_id: 1, name: "cold-brew", label: "كولد برو", price: 22.0, available: true },
  { id: 8, category_id: 1, name: "mojito-lemon-mint", label: "موهيتو ليمون ونعناع", price: 17.0, available: true },
] satisfies Product[];
