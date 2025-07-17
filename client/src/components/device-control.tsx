import { useState } from "react";
import { 
  Lightbulb, 
  Fan, 
  Tv, 
  Thermometer, 
  Volume2, 
  Power, 
  Plus, 
  Settings, 
  Trash2,
  Home,
  Wifi,
  WifiOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function DeviceControl() {
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "light",
    room: "",
    properties: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch devices
  const { data: devicesData, isLoading } = useQuery({
    queryKey: ["/api/devices"],
    queryFn: () => apiRequest("GET", "/api/devices"),
  });

  const devices = devicesData?.devices || [];

  // Get unique rooms
  const rooms = ["all", ...new Set(devices.map((device: any) => device.room))];

  // Filter devices by room
  const filteredDevices = selectedRoom === "all" 
    ? devices 
    : devices.filter((device: any) => device.room === selectedRoom);

  // Update device mutation
  const updateDeviceMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) => 
      apiRequest("PUT", `/api/devices/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      toast({
        title: "Success",
        description: "Device updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update device.",
        variant: "destructive",
      });
    },
  });

  // Add device mutation
  const addDeviceMutation = useMutation({
    mutationFn: (device: any) => apiRequest("POST", "/api/devices", device),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      setIsAddDialogOpen(false);
      setNewDevice({ name: "", type: "light", room: "", properties: "" });
      toast({
        title: "Success",
        description: "Device added successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add device.",
        variant: "destructive",
      });
    },
  });

  // Delete device mutation
  const deleteDeviceMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/devices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      toast({
        title: "Success",
        description: "Device deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete device.",
        variant: "destructive",
      });
    },
  });

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "light":
        return Lightbulb;
      case "fan":
        return Fan;
      case "tv":
        return Tv;
      case "ac":
        return Thermometer;
      case "speaker":
        return Volume2;
      default:
        return Power;
    }
  };

  const toggleDevice = (device: any) => {
    updateDeviceMutation.mutate({
      id: device.id,
      updates: { status: !device.status }
    });
  };

  const updateDeviceProperty = (device: any, property: string, value: any) => {
    const properties = JSON.parse(device.properties || "{}");
    properties[property] = value;
    updateDeviceMutation.mutate({
      id: device.id,
      updates: { 
        properties: JSON.stringify(properties),
        status: true // Turn on when adjusting settings
      }
    });
  };

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.room) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Set default properties based on device type
    let defaultProperties = "{}";
    switch (newDevice.type) {
      case "light":
        defaultProperties = '{"brightness": 100, "color": "white"}';
        break;
      case "fan":
        defaultProperties = '{"speed": 3}';
        break;
      case "tv":
        defaultProperties = '{"volume": 50, "channel": 1}';
        break;
      case "ac":
        defaultProperties = '{"temperature": 24, "mode": "cool"}';
        break;
      case "speaker":
        defaultProperties = '{"volume": 70}';
        break;
    }

    addDeviceMutation.mutate({
      ...newDevice,
      properties: newDevice.properties || defaultProperties
    });
  };

  const renderDeviceControls = (device: any) => {
    const properties = JSON.parse(device.properties || "{}");
    
    return (
      <div className="space-y-3">
        {/* Brightness control for lights */}
        {device.type === "light" && (
          <div className="space-y-2">
            <Label className="text-sm">Brightness: {properties.brightness || 100}%</Label>
            <Slider
              value={[properties.brightness || 100]}
              onValueChange={(value) => updateDeviceProperty(device, "brightness", value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        )}

        {/* Temperature control for AC */}
        {device.type === "ac" && (
          <div className="space-y-2">
            <Label className="text-sm">Temperature: {properties.temperature || 24}°C</Label>
            <Slider
              value={[properties.temperature || 24]}
              onValueChange={(value) => updateDeviceProperty(device, "temperature", value[0])}
              min={16}
              max={30}
              step={1}
              className="w-full"
            />
          </div>
        )}

        {/* Volume control for TV and speakers */}
        {(device.type === "tv" || device.type === "speaker") && (
          <div className="space-y-2">
            <Label className="text-sm">Volume: {properties.volume || 50}%</Label>
            <Slider
              value={[properties.volume || 50]}
              onValueChange={(value) => updateDeviceProperty(device, "volume", value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        )}

        {/* Speed control for fans */}
        {device.type === "fan" && (
          <div className="space-y-2">
            <Label className="text-sm">Speed: {properties.speed || 3}</Label>
            <Slider
              value={[properties.speed || 3]}
              onValueChange={(value) => updateDeviceProperty(device, "speed", value[0])}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section id="device-control" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading devices...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="device-control" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Smart Device Control</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage all your smart devices from one central dashboard. Control them manually or use voice commands.
          </p>
        </div>

        {/* Room Filter and Add Device */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="room-filter" className="text-sm font-medium">Filter by room:</Label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room} value={room}>
                    {room === "all" ? "All Rooms" : room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="device-name">Device Name</Label>
                  <Input
                    id="device-name"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                    placeholder="e.g., Living Room Light"
                  />
                </div>
                <div>
                  <Label htmlFor="device-type">Device Type</Label>
                  <Select value={newDevice.type} onValueChange={(value) => setNewDevice({ ...newDevice, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="fan">Fan</SelectItem>
                      <SelectItem value="tv">TV</SelectItem>
                      <SelectItem value="ac">Air Conditioner</SelectItem>
                      <SelectItem value="speaker">Speaker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="device-room">Room</Label>
                  <Input
                    id="device-room"
                    value={newDevice.room}
                    onChange={(e) => setNewDevice({ ...newDevice, room: e.target.value })}
                    placeholder="e.g., Living Room"
                  />
                </div>
                <Button onClick={handleAddDevice} className="w-full">
                  Add Device
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDevices.map((device: any) => {
            const IconComponent = getDeviceIcon(device.type);
            const properties = JSON.parse(device.properties || "{}");
            
            return (
              <Card key={device.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${device.status ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <IconComponent className={`w-5 h-5 ${device.status ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Home className="w-3 h-3 mr-1" />
                          {device.room}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {device.status ? (
                        <Wifi className="w-4 h-4 text-green-500" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Device Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge variant={device.status ? "default" : "secondary"}>
                        {device.status ? "On" : "Off"}
                      </Badge>
                    </div>
                    <Switch
                      checked={device.status}
                      onCheckedChange={() => toggleDevice(device)}
                      disabled={updateDeviceMutation.isPending}
                    />
                  </div>

                  {/* Device-specific Controls */}
                  {device.status && renderDeviceControls(device)}

                  {/* Device Actions */}
                  <div className="flex justify-between pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteDeviceMutation.mutate(device.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredDevices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No devices found</h3>
            <p className="text-gray-500 mb-4">
              {selectedRoom === "all" 
                ? "Add your first smart device to get started." 
                : `No devices found in ${selectedRoom}.`
              }
            </p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary hover:bg-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Device
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}