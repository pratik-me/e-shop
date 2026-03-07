import { create } from "zustand";
import { persist } from "zustand/middleware";

type Product = {
  id: string;
  title: string;
  price: number;
  images: any;
  quantity?: number;
  sale_price: number;
  shopId: string;
};

type Store = {
  cart: Product[];
  wishlist: Product[];
  addToCart: (
    product: Product,
    user: any,
    location: any,
    deviceInfo: string
  ) => void;
  removeFromCart: (
    id: string,
    user: any,
    location: any,
    deviceInfo: string
  ) => void;

  addToWishlist: (
    product: Product,
    user: any,
    location: any,
    deviceInfo: string
  ) => void;
  removeFromWishlist: (
    id: string,
    user: any,
    location: any,
    deviceInfo: string
  ) => void;
};

export const useStore = create<Store>()(
  persist((set, get) => ({
    cart: [],
    wishlist: [],
    addToCart: (product, user, location, deviceInfo) => {
      set((state) => {
        const exisiting = state.cart?.find((item) => item.id === product.id);
        if (exisiting)
          return {
            cart: state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                : item
            ),
          };
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      });
    },
    removeFromCart: (id, user, location, deviceInfo) => {
        const removeProduct = get().cart.find((item) => item.id === id);
        set(state => ({
            cart: state.cart?.filter(item => item.id !== id),
        }))
    },

    addToWishlist: (product, user, location, deviceInfo) => {
        set(state => {
            if(state.wishlist.find(item => item.id === product.id)) return state;
            return {wishlist: [...state.wishlist, product]}
        })
    },
    removeFromWishlist: (id, user, location, deviceInfo) => {
        const removeProduct = get().wishlist.find(item => item.id === id);

        set(state => ({
            wishlist: state.wishlist.filter(item => item.id !== id)
        }))
    }
  }), {name: "store-storage"}),
);
