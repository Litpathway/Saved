import test from "node:test";
import assert from "node:assert/strict";
import { containerStage, containerStages, containerTimeline } from "../src/lib/container-tracking";
import { trackingSchema } from "../src/lib/validation";

const loaded = new Date("2026-01-01T15:00:00Z");
const arrival = new Date("2026-02-20T00:00:00Z");
const on = (date: string) => new Date(`${date}T12:00:00Z`);

test("Yiwu and Guangzhou manifests normalize while legacy codes remain valid", () => {
  assert.equal(trackingSchema.parse(" sl0001012 "), "SL0001012");
  assert.equal(trackingSchema.parse("gz0000405"), "GZ0000405");
  assert.equal(trackingSchema.parse("sl001198"), "SL001198");
  assert.equal(trackingSchema.parse("gz000405"), "GZ000405");
  assert.equal(trackingSchema.parse("sl-a123456789abcdef"), "SL-A123456789ABCDEF");
  for (const invalid of ["SL00119", "GZ00004050", "AB0000405", "SL0001ABC"])
    assert.equal(trackingSchema.safeParse(invalid).success, false);
});

test("container stage changes on day 4, day 34, arrival day, and the day after", () => {
  assert.equal(containerStage(loaded, arrival, on("2026-01-03")), containerStages.loaded);
  assert.equal(containerStage(loaded, arrival, on("2026-01-04")), containerStages.sea);
  assert.equal(containerStage(loaded, arrival, on("2026-02-02")), containerStages.sea);
  assert.equal(containerStage(loaded, arrival, on("2026-02-03")), containerStages.clearing);
  assert.equal(containerStage(loaded, arrival, on("2026-02-20")), containerStages.offloading);
  assert.equal(containerStage(loaded, arrival, on("2026-02-21")), containerStages.offloaded);
  assert.deepEqual(
    containerTimeline(loaded, arrival, on("2026-02-03")).map((m) => m.status),
    [containerStages.loaded, containerStages.sea, containerStages.clearing],
  );
});
