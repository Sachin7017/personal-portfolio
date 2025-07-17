import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // light, fan, ac, tv, etc.
  room: text("room").notNull(),
  status: boolean("status").default(false),
  properties: text("properties"), // JSON string for device-specific properties
  createdAt: timestamp("created_at").defaultNow(),
});

export const voiceCommands = pgTable("voice_commands", {
  id: serial("id").primaryKey(),
  command: text("command").notNull(),
  deviceId: integer("device_id").references(() => devices.id),
  action: text("action").notNull(), // on, off, dim, set_temperature, etc.
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export const insertDeviceSchema = createInsertSchema(devices).pick({
  name: true,
  type: true,
  room: true,
  status: true,
  properties: true,
});

export const insertVoiceCommandSchema = createInsertSchema(voiceCommands).pick({
  command: true,
  deviceId: true,
  action: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devices.$inferSelect;
export type InsertVoiceCommand = z.infer<typeof insertVoiceCommandSchema>;
export type VoiceCommand = typeof voiceCommands.$inferSelect;
