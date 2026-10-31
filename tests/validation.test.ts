import { test } from "node:test";
import assert from "node:assert/strict";
import {
  enquirySchema,
  shipmentSchema,
  trackingSchema,
} from "../src/lib/validation";
const quote = {
  kind: "QUOTE",
  name: "Test Customer",
  email: "customer@example.test",
  origin: "City A",
  destination: "City B",
  cargo: "Cartons",
  message: "Please review these requirements.",
};
test("quote requires route and cargo while contact does not", () => {
  assert.equal(enquirySchema.safeParse(quote).success, true);
  assert.equal(
    enquirySchema.safeParse({ ...quote, origin: "" }).success,
    false,
  );
  assert.equal(
    enquirySchema.safeParse({
      kind: "CONTACT",
      name: "Test",
      email: "a@example.test",
      message: "Hello",
    }).success,
    true,
  );
});
test("forms reject spam honeypots, invalid email, and oversized input", () => {
  assert.equal(
    enquirySchema.safeParse({ ...quote, website: "https://spam.test" }).success,
    false,
  );
  assert.equal(
    enquirySchema.safeParse({ ...quote, email: "invalid" }).success,
    false,
  );
  assert.equal(
    enquirySchema.safeParse({ ...quote, message: "a".repeat(4001) }).success,
    false,
  );
});
test("tracking accepts normalized random capability identifiers only", () => {
  assert.equal(
    trackingSchema.parse(" sl-a123456789abcdef "),
    "SL-A123456789ABCDEF",
  );
  for (const number of ["1234", "SL-123", "<script>", "SL-123456789ABCDEFG"])
    assert.equal(trackingSchema.safeParse(number).success, false);
});
test("shipment data requires fields and an actual date format", () => {
  const shipment = {
    origin: "City A",
    destination: "City B",
    method: "Sea",
    status: "In Transit",
  };
  assert.equal(shipmentSchema.safeParse(shipment).success, true);
  assert.equal(
    shipmentSchema.safeParse({ ...shipment, estimatedDelivery: "tomorrow" })
      .success,
    false,
  );
  assert.equal(
    shipmentSchema.safeParse({ ...shipment, origin: "" }).success,
    false,
  );
});

test("only sea and air freight can be requested or assigned to a shipment", () => {
  for (const method of ["Sea", "Air"]) {
    assert.equal(enquirySchema.safeParse({ ...quote, method }).success, true);
    assert.equal(
      shipmentSchema.safeParse({
        origin: "China",
        destination: "Nigeria",
        status: "In Transit",
        method,
      }).success,
      true,
    );
  }
  for (const method of ["Road", "Rail", "Sea freight or rail"]) {
    assert.equal(enquirySchema.safeParse({ ...quote, method }).success, false);
    assert.equal(
      shipmentSchema.safeParse({
        origin: "China",
        destination: "Nigeria",
        status: "In Transit",
        method,
      }).success,
      false,
    );
  }
});
