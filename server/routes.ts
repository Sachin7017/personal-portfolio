import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, message: "Message sent successfully!", contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid form data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to send message" });
      }
    }
  });

  // Download resume endpoint
  app.get("/api/resume/download", (req, res) => {
    const resumePath = path.join(process.cwd(), "attached_assets", "Sachin_Kumar_Resume.pdf");
    
    if (fs.existsSync(resumePath)) {
      res.download(resumePath, "Sachin_Kumar_Resume.pdf", (err) => {
        if (err) {
          console.error("Error downloading resume:", err);
          res.status(500).json({ success: false, message: "Failed to download resume" });
        }
      });
    } else {
      res.status(404).json({ success: false, message: "Resume not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
