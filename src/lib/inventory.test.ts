import assert from "node:assert/strict";
import test from "node:test";
import { assertCanPurchase, availableQuantity } from "./inventory";

const unlimited = { trackStock: false, stockQuantity: 0, variants: [] };
const tracked = { trackStock: true, stockQuantity: 2, variants: [] };
const withVariants = {
  trackStock: true,
  stockQuantity: 9,
  variants: [
    { trackStock: true, stockQuantity: 1 },
    { trackStock: false, stockQuantity: 0 },
  ],
};

test("unlimited products have no quantity cap", () => {
  assert.equal(availableQuantity(unlimited, null), null);
  assert.doesNotThrow(() => assertCanPurchase(unlimited, null, 20));
});

test("tracked products reject sold out and over-quantity", () => {
  assert.equal(availableQuantity(tracked, null), 2);
  assert.throws(() => assertCanPurchase({ ...tracked, stockQuantity: 0 }, null, 1), /Sold out/);
  assert.throws(() => assertCanPurchase(tracked, null, 3), /Only 2 left/);
  assert.doesNotThrow(() => assertCanPurchase(tracked, null, 2));
});

test("variant stock is used when a product has options", () => {
  assert.equal(availableQuantity(withVariants, withVariants.variants[0]), 1);
  assert.equal(availableQuantity(withVariants, withVariants.variants[1]), null);
  assert.throws(() => assertCanPurchase(withVariants, withVariants.variants[0], 2), /Only 1 left/);
});
