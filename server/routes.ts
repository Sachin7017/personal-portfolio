import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertDeviceSchema, insertVoiceCommandSchema } from "@shared/schema";
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
    const resumePath = path.join(process.cwd(), "attached_assets", "Sachin Resume-1_1752646852479.pdf");
    
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

  // Device management endpoints
  app.get("/api/devices", async (req, res) => {
    try {
      const devices = await storage.getDevices();
      res.json({ success: true, devices });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch devices" });
    }
  });

  app.post("/api/devices", async (req, res) => {
    try {
      const deviceData = insertDeviceSchema.parse(req.body);
      const device = await storage.createDevice(deviceData);
      res.json({ success: true, message: "Device added successfully!", device });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid device data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to add device" });
      }
    }
  });

  app.put("/api/devices/:id", async (req, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      const updates = req.body;
      const device = await storage.updateDevice(deviceId, updates);
      
      if (!device) {
        return res.status(404).json({ success: false, message: "Device not found" });
      }
      
      res.json({ success: true, message: "Device updated successfully!", device });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update device" });
    }
  });

  app.delete("/api/devices/:id", async (req, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      const deleted = await storage.deleteDevice(deviceId);
      
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Device not found" });
      }
      
      res.json({ success: true, message: "Device deleted successfully!" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete device" });
    }
  });

  // Voice command processing
  app.post("/api/voice-command", async (req, res) => {
    try {
      const { command } = req.body;
      
      if (!command || typeof command !== 'string') {
        return res.status(400).json({ success: false, message: "Voice command is required" });
      }
      
      const result = await processVoiceCommand(command);
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to process voice command" });
    }
  });

  // Voice command history
  app.get("/api/voice-commands", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const commands = await storage.getRecentCommands(limit);
      res.json({ success: true, commands });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch voice commands" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Voice command processing function
async function processVoiceCommand(command: string) {
  const lowerCommand = command.toLowerCase();
  const devices = await storage.getDevices();
  
  // Parse the command to extract device, action, and room
  const commandInfo = parseVoiceCommand(lowerCommand, devices);
  
  if (!commandInfo.device) {
    return {
      response: "I couldn't find that device. Please check the device name and try again.",
      action: "error"
    };
  }
  
  // Execute the command
  let updatedDevice;
  let responseText = "";
  
  switch (commandInfo.action) {
    case "turn_on":
      updatedDevice = await storage.updateDevice(commandInfo.device.id, { status: true });
      responseText = `${commandInfo.device.name} is now turned on.`;
      break;
      
    case "turn_off":
      updatedDevice = await storage.updateDevice(commandInfo.device.id, { status: false });
      responseText = `${commandInfo.device.name} is now turned off.`;
      break;
      
    case "toggle":
      updatedDevice = await storage.updateDevice(commandInfo.device.id, { status: !commandInfo.device.status });
      responseText = `${commandInfo.device.name} is now ${!commandInfo.device.status ? 'on' : 'off'}.`;
      break;
      
    case "set_brightness":
      if (commandInfo.device.type === "light") {
        const brightness = extractNumber(lowerCommand) || 100;
        const properties = JSON.parse(commandInfo.device.properties || "{}");
        properties.brightness = Math.min(100, Math.max(0, brightness));
        updatedDevice = await storage.updateDevice(commandInfo.device.id, { 
          properties: JSON.stringify(properties),
          status: true 
        });
        responseText = `${commandInfo.device.name} brightness set to ${brightness}%.`;
      } else {
        responseText = `${commandInfo.device.name} doesn't support brightness control.`;
      }
      break;
      
    case "set_temperature":
      if (commandInfo.device.type === "ac") {
        const temperature = extractNumber(lowerCommand) || 24;
        const properties = JSON.parse(commandInfo.device.properties || "{}");
        properties.temperature = Math.min(30, Math.max(16, temperature));
        updatedDevice = await storage.updateDevice(commandInfo.device.id, { 
          properties: JSON.stringify(properties),
          status: true 
        });
        responseText = `${commandInfo.device.name} temperature set to ${temperature}°C.`;
      } else {
        responseText = `${commandInfo.device.name} doesn't support temperature control.`;
      }
      break;
      
    case "set_volume":
      if (commandInfo.device.type === "tv" || commandInfo.device.type === "speaker") {
        const volume = extractNumber(lowerCommand) || 50;
        const properties = JSON.parse(commandInfo.device.properties || "{}");
        properties.volume = Math.min(100, Math.max(0, volume));
        updatedDevice = await storage.updateDevice(commandInfo.device.id, { 
          properties: JSON.stringify(properties),
          status: true 
        });
        responseText = `${commandInfo.device.name} volume set to ${volume}%.`;
      } else {
        responseText = `${commandInfo.device.name} doesn't support volume control.`;
      }
      break;
      
    case "set_speed":
      if (commandInfo.device.type === "fan") {
        const speed = extractNumber(lowerCommand) || 3;
        const properties = JSON.parse(commandInfo.device.properties || "{}");
        properties.speed = Math.min(5, Math.max(1, speed));
        updatedDevice = await storage.updateDevice(commandInfo.device.id, { 
          properties: JSON.stringify(properties),
          status: true 
        });
        responseText = `${commandInfo.device.name} speed set to ${speed}.`;
      } else {
        responseText = `${commandInfo.device.name} doesn't support speed control.`;
      }
      break;
      
    default:
      responseText = "I didn't understand that command. Try saying 'turn on living room light' or 'set bedroom AC to 22 degrees'.";
  }
  
  // Log the command
  if (commandInfo.device) {
    await storage.createVoiceCommand({
      command: command,
      deviceId: commandInfo.device.id,
      action: commandInfo.action
    });
  }
  
  return {
    response: responseText,
    action: commandInfo.action,
    device: updatedDevice || commandInfo.device
  };
}

// Helper function to parse voice commands
function parseVoiceCommand(command: string, devices: any[]) {
  // Common action patterns
  const actionPatterns = [
    { pattern: /turn on|switch on|open/i, action: "turn_on" },
    { pattern: /turn off|switch off|close/i, action: "turn_off" },
    { pattern: /toggle/i, action: "toggle" },
    { pattern: /set.*brightness|brightness.*to|dim.*to/i, action: "set_brightness" },
    { pattern: /set.*temperature|temperature.*to|cool.*to|heat.*to/i, action: "set_temperature" },
    { pattern: /set.*volume|volume.*to/i, action: "set_volume" },
    { pattern: /set.*speed|speed.*to/i, action: "set_speed" },
  ];
  
  let action = "unknown";
  for (const pattern of actionPatterns) {
    if (pattern.pattern.test(command)) {
      action = pattern.action;
      break;
    }
  }
  
  // Find the device mentioned in the command
  let targetDevice = null;
  for (const device of devices) {
    const deviceName = device.name.toLowerCase();
    const deviceType = device.type.toLowerCase();
    const deviceRoom = device.room.toLowerCase();
    
    if (command.includes(deviceName) || 
        command.includes(deviceType) || 
        (command.includes(deviceRoom) && command.includes(deviceType))) {
      targetDevice = device;
      break;
    }
  }
  
  return {
    device: targetDevice,
    action: action
  };
}

// Helper function to extract numbers from text
function extractNumber(text: string): number | null {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : null;
}
