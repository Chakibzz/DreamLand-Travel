import { z } from "zod";

export const contactRequestSchema = z.object({
  fullname: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().min(6).max(30).optional().or(z.literal("")),
  message: z.string().min(10).max(3000),
  serviceType: z.enum(["CONTACT", "CUSTOM_TRIP", "OMRA", "TICKETING", "TRANSFER"]),
});

export const bookingRequestSchema = z.object({
  fullname: z.string().min(2).max(120),
  phone: z.string().min(6).max(30),
  destination: z.string().min(2).max(180),
  departureDate: z.coerce.date(),
  endDate: z.coerce.date(),
  adults: z.coerce.number().int().min(1).max(50),
  children: z.coerce.number().int().min(0).max(20),
  notes: z.string().max(3000).optional().or(z.literal("")),
  serviceType: z.enum(["CUSTOM_TRIP", "OMRA", "TICKETING", "TRANSFER"]),
}).superRefine((data, ctx) => {
  if (data.endDate < data.departureDate) {
    ctx.addIssue({
      code: "custom",
      path: ["endDate"],
      message: "La date de fin doit etre apres la date de depart.",
    });
  }
  if (data.adults + data.children > 50) {
    ctx.addIssue({
      code: "custom",
      path: ["children"],
      message: "Le total de voyageurs ne doit pas depasser 50.",
    });
  }
});

export const categorySchema = z.object({
  name: z.string().min(2).max(80),
});

export const announcementSchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().min(10).max(5000),
  price: z.coerce.number().min(0),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  priceOptions: z
    .array(
      z.object({
        label: z.string().trim().min(2).max(80),
        price: z.coerce.number().min(0),
      }),
    )
    .max(60)
    .default([]),
  richDetails: z.record(z.string(), z.unknown()).default({}),
  image: z.string().min(1),
  categoryId: z.string().min(1),
  location: z.string().min(2).max(180),
});

export const bookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONTACTED", "CONFIRMED", "CANCELLED"]),
});
