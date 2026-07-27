import { Category } from "@/app/types/category";

export const MENU = {
  categories: [
    {
      id: "hot-drinks",
      title: "مشروبات ساخنة",
      products: [
        {
          id: "1",
          name: "إسبريسو",
          price: 12.0,
          options: [
            {
              id: "milk_type",
              name: "نوع الحليب",
              type: "radio",
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
        },
        { id: "2", name: "لاتيه", price: 18.0 },
        { id: "3", name: "كابتشينو", price: 16.0 },
        { id: "4", name: "أمريكانو", price: 14.0 },
      ],
    },
    {
      id: "soft-drinks",
      title: "مشروبات باردة",
      products: [
        { id: "5", name: "آيس لاتيه", price: 20.0 },
        { id: "6", name: "آيس أمريكانو", price: 15.0 },
        { id: "7", name: "كولد برو", price: 22.0 },
        { id: "8", name: "موهيتو ليمون ونعناع", price: 17.0 },
      ],
    },
  ] satisfies Category[],
  edited: false,
};
