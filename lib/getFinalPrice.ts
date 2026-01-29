export default function getFinalPrice(variant: any) {
  let finalPrice = variant.price;

  if (variant.discount?.type === "percent") {
    finalPrice =
      variant.price -
      (variant.price * variant.discount.value) / 100;
  }

  if (variant.discount?.type === "flat") {
    finalPrice = variant.price - variant.discount.value;
  }

  return Math.max(finalPrice, 0); // never negative
}
