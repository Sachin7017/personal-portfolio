import { users, type User, type InsertUser, type InsertContact, type Contact, type InsertDevice, type Device, type InsertVoiceCommand, type VoiceCommand } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Device management
  createDevice(device: InsertDevice): Promise<Device>;
  getDevices(): Promise<Device[]>;
  getDeviceById(id: number): Promise<Device | undefined>;
  updateDevice(id: number, updates: Partial<Device>): Promise<Device | undefined>;
  deleteDevice(id: number): Promise<boolean>;
  
  // Voice command management
  createVoiceCommand(command: InsertVoiceCommand): Promise<VoiceCommand>;
  getVoiceCommands(): Promise<VoiceCommand[]>;
  getRecentCommands(limit: number): Promise<VoiceCommand[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private devices: Map<number, Device>;
  private voiceCommands: Map<number, VoiceCommand>;
  private currentUserId: number;
  private currentContactId: number;
  private currentDeviceId: number;
  private currentCommandId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.devices = new Map();
    this.voiceCommands = new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
    this.currentDeviceId = 1;
    this.currentCommandId = 1;
    
    // Initialize with demo devices
    this.initializeDemoDevices();
  }

  private initializeDemoDevices() {
    const demoDevices = [
      { name: "Living Room Light", type: "light", room: "Living Room", status: false, properties: '{"brightness": 100, "color": "white"}' },
      { name: "Bedroom Fan", type: "fan", room: "Bedroom", status: false, properties: '{"speed": 3}' },
      { name: "Kitchen Light", type: "light", room: "Kitchen", status: false, properties: '{"brightness": 80, "color": "warm"}' },
      { name: "Living Room TV", type: "tv", room: "Living Room", status: false, properties: '{"volume": 50, "channel": 1}' },
      { name: "Bedroom AC", type: "ac", room: "Bedroom", status: false, properties: '{"temperature": 24, "mode": "cool"}' },
      { name: "Smart Speaker", type: "speaker", room: "Living Room", status: false, properties: '{"volume": 70}' },
    ];

    demoDevices.forEach(deviceData => {
      const id = this.currentDeviceId++;
      const device: Device = {
        id,
        ...deviceData,
        createdAt: new Date(),
      };
      this.devices.set(id, device);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async createDevice(insertDevice: InsertDevice): Promise<Device> {
    const id = this.currentDeviceId++;
    const device: Device = {
      id,
      ...insertDevice,
      status: insertDevice.status || false,
      createdAt: new Date(),
    };
    this.devices.set(id, device);
    return device;
  }

  async getDevices(): Promise<Device[]> {
    return Array.from(this.devices.values());
  }

  async getDeviceById(id: number): Promise<Device | undefined> {
    return this.devices.get(id);
  }

  async updateDevice(id: number, updates: Partial<Device>): Promise<Device | undefined> {
    const device = this.devices.get(id);
    if (!device) return undefined;
    
    const updatedDevice = { ...device, ...updates };
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }

  async deleteDevice(id: number): Promise<boolean> {
    return this.devices.delete(id);
  }

  async createVoiceCommand(insertCommand: InsertVoiceCommand): Promise<VoiceCommand> {
    const id = this.currentCommandId++;
    const command: VoiceCommand = {
      id,
      ...insertCommand,
      timestamp: new Date(),
    };
    this.voiceCommands.set(id, command);
    return command;
  }

  async getVoiceCommands(): Promise<VoiceCommand[]> {
    return Array.from(this.voiceCommands.values());
  }

  async getRecentCommands(limit: number): Promise<VoiceCommand[]> {
    return Array.from(this.voiceCommands.values())
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
