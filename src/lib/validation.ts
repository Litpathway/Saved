import { freightMethods } from "./freight";
import { z } from "zod";
const text = (n: number) => z.string().trim().min(1).max(n);
export const enquirySchema = z
  .object({
    kind: z.enum(["QUOTE", "CONTACT"]),
    name: text(100),
    email: z.email().max(254),
    phone: z.string().trim().max(40).default(""),
    origin: z.string().trim().max(160).default(""),
    destination: z.string().trim().max(160).default(""),
    method: z.enum(["", "Not sure", ...freightMethods]).default(""),
    cargo: z.string().trim().max(2000).default(""),
    weight: z.string().trim().max(80).default(""),
    dimensions: z.string().trim().max(100).default(""),
    message: text(4000),
    website: z.string().max(0).optional(),
  })
  .superRefine((v, c) => {
    if (v.kind === "QUOTE")
      for (const key of ["origin", "destination", "cargo"] as const)
        if (!v[key])
          c.addIssue({
            code: "custom",
            path: [key],
            message: "Required for shipping quotes",
          });
  });
export const shipmentSchema = z.object({
  origin: text(160),
  destination: text(160),
  method: z.enum(freightMethods),
  status: text(80),
  note: z.string().trim().max(500).default(""),
  estimatedDelivery: z.union([z.iso.date(), z.literal("")]).optional(),
});
export const trackingSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^SL-[A-F0-9]{16}$/,
    "Enter a tracking number in the format SL- followed by 16 letters or digits.",
  );
export const defaultStatuses = [
  "Shipment Registered",
  "Awaiting Pickup",
  "Picked Up",
  "Processing at Warehouse",
  "In Transit",
  "Arrived at Destination",
  "Customs Clearance",
  "Out for Delivery",
  "Delivered",
];
