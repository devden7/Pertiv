export const calcTotalPrice = (
  cart_items: {
    id: string;
    quantity: number;
    title: string;
    description: string;
    imageUrl: string | null;
    price: number;
  }[]
) => {
  let totalPrice = 0;
  for (let i = 0; i < cart_items.length; i++) {
    totalPrice += cart_items[i].price * cart_items[i].quantity;
  }
  return totalPrice;
};
