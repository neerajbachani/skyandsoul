import assert from "node:assert/strict";
import test from "node:test";
import { assertTransition, canTransition } from "./order-status";

test("confirmed orders can move to processing, cancelled, or refunded", () => {
  assert.equal(canTransition("CONFIRMED", "PROCESSING"), true);
  assert.equal(canTransition("CONFIRMED", "DELIVERED"), false);
  assert.throws(
    () => assertTransition("CONFIRMED", "DELIVERED"),
    /Cannot move an order from CONFIRMED to DELIVERED/,
  );
});

test("shipped requires a tracking number", () => {
  assert.throws(
    () => assertTransition("PROCESSING", "SHIPPED", "  "),
    /tracking number/,
  );
  assert.doesNotThrow(() => assertTransition("PROCESSING", "SHIPPED", "AWB123"));
});

test("cancelled and refunded are terminal", () => {
  assert.equal(canTransition("CANCELLED", "CONFIRMED"), false);
  assert.equal(canTransition("REFUNDED", "DELIVERED"), false);
  assert.equal(canTransition("DELIVERED", "REFUNDED"), true);
});
