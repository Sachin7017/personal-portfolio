import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, Bot, Zap, Settings, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechSynthesis = window.speechSynthesis;
      
      if (!SpeechRecognition || !speechSynthesis) {
        setIsSupported(false);
        return;
      }

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        processCommand(speechResult);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please check your microphone and try again.",
          variant: "destructive",
        });
      };

      setRecognition(recognitionInstance);
      setSynthesis(speechSynthesis);
    }
  }, []);

  // Voice command mutation
  const voiceCommandMutation = useMutation({
    mutationFn: (command: string) => apiRequest("POST", "/api/voice-command", { command }),
    onSuccess: (data) => {
      setLastResponse(data.result.response);
      speakResponse(data.result.response);
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/voice-commands"] });
    },
    onError: (error) => {
      toast({
        title: "Command Error",
        description: "Failed to process voice command.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    },
  });

  // Recent commands query
  const { data: recentCommands } = useQuery({
    queryKey: ["/api/voice-commands"],
    queryFn: () => apiRequest("GET", "/api/voice-commands?limit=5"),
  });

  const processCommand = (command: string) => {
    setIsProcessing(true);
    voiceCommandMutation.mutate(command);
  };

  const speakResponse = (text: string) => {
    if (synthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      synthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript("");
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleManualCommand = (command: string) => {
    setTranscript(command);
    processCommand(command);
  };

  const quickCommands = [
    "Turn on living room light",
    "Turn off bedroom AC",
    "Set kitchen light brightness to 50",
    "Turn on living room TV",
    "Set bedroom fan speed to 3",
    "What time is it?",
  ];

  if (!isSupported) {
    return (
      <section id="voice-assistant" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Voice Assistant</h2>
            <p className="text-lg text-gray-600 mb-8">
              Voice recognition is not supported in your browser. Please use a modern browser like Chrome or Firefox.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="voice-assistant" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Advanced Voice Assistant</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Control all your smart devices with voice commands. Just speak naturally and I'll understand.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Voice Interface */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white shadow-xl">
              <CardHeader className="text-center pb-8">
                <div className="relative mx-auto mb-6">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening ? 'bg-red-100 animate-pulse' : 'bg-primary/10'
                  }`}>
                    <Bot className={`w-16 h-16 ${isListening ? 'text-red-500' : 'text-primary'}`} />
                  </div>
                  {isListening && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping"></div>
                  )}
                </div>
                <CardTitle className="text-2xl mb-2">Voice Assistant</CardTitle>
                <p className="text-gray-600">
                  {isListening ? "Listening..." : "Click the microphone to start"}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Voice Control Button */}
                <div className="text-center">
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isProcessing}
                    className={`w-20 h-20 rounded-full text-white font-semibold transition-all duration-300 ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-primary hover:bg-secondary'
                    }`}
                  >
                    {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </Button>
                </div>

                {/* Transcript Display */}
                {transcript && (
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Volume2 className="w-5 h-5 text-primary mr-2" />
                      <span className="font-medium">You said:</span>
                    </div>
                    <p className="text-gray-700 italic">"{transcript}"</p>
                  </div>
                )}

                {/* Processing Indicator */}
                {isProcessing && (
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Processing command...
                    </div>
                  </div>
                )}

                {/* Assistant Response */}
                {lastResponse && (
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center mb-2">
                      <Bot className="w-5 h-5 text-primary mr-2" />
                      <span className="font-medium">Assistant:</span>
                    </div>
                    <p className="text-gray-700">{lastResponse}</p>
                  </div>
                )}

                {/* Quick Commands */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Commands</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quickCommands.map((command, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-left justify-start h-auto p-3"
                        onClick={() => handleManualCommand(command)}
                        disabled={isProcessing}
                      >
                        <span className="text-sm">{command}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Command History Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Recent Commands
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCommands?.commands?.map((cmd: any, index: number) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {cmd.command}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {cmd.action}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(cmd.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No recent commands
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Voice Assistant Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Device Control</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Natural Language</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Voice Feedback</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Smart Home Integration</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">Command History</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}