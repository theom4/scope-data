import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Loader2, QrCode } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Session name is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  account_protection: z.boolean().default(true),
  log_messages: z.boolean().default(true),
  read_incoming_messages: z.boolean().default(false),
  auto_reject_calls: z.boolean().default(false),
  always_online: z.boolean().default(true),
  webhook_enabled: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

const API_TOKEN = "1307|TCwsLrRI8BEQn1EZYt8iNTuSLFC92Cyheh2UDgAE9aedc9a1";

const Whatsapp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [existingSessions, setExistingSessions] = useState<any[]>([]);
  const [checkingSession, setCheckingSession] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account_protection: true,
      log_messages: true,
      read_incoming_messages: false,
      auto_reject_calls: false,
      always_online: true,
      webhook_enabled: false,
    },
  });

  useEffect(() => {
    const checkExistingSessions = async () => {
      try {
        const response = await fetch("https://www.wasenderapi.com/api/whatsapp-sessions", {
          headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
          },
        });

        const result = await response.json();

        if (response.ok && result.success && result.data.length > 0) {
          setExistingSessions(result.data);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setCheckingSession(false);
      }
    };

    checkExistingSessions();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setQrCode(null);

    try {
      // Create session
      const createResponse = await fetch("https://www.wasenderapi.com/api/whatsapp-sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          phone_number: data.phone_number,
          account_protection: data.account_protection,
          log_messages: data.log_messages,
          read_incoming_messages: data.read_incoming_messages,
          webhook_enabled: data.webhook_enabled,
          webhook_events: ["messages.received", "session.status", "messages.update"],
        }),
      });

      const createResult = await createResponse.json();

      if (!createResponse.ok || !createResult.success) {
        throw new Error(createResult.message || "Failed to create session");
      }

      toast({
        title: "Session created successfully",
        description: "Connecting session...",
      });

      // Connect the session first
      const sessionId = createResult.data.id;
      const connectResponse = await fetch(`https://www.wasenderapi.com/api/whatsapp-sessions/${sessionId}/connect`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
        },
      });

      const connectResult = await connectResponse.json();

      if (!connectResponse.ok || !connectResult.success) {
        throw new Error("Failed to connect session");
      }

      toast({
        title: "Session connected",
        description: "Fetching QR code...",
      });

      // Get QR code
      const qrResponse = await fetch(`https://www.wasenderapi.com/api/whatsapp-sessions/${sessionId}/qrcode`, {
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
        },
      });

      const qrResult = await qrResponse.json();

      if (!qrResponse.ok || !qrResult.success) {
        throw new Error("Failed to fetch QR code");
      }

      setQrCode(qrResult.data.qrCode);
      toast({
        title: "Success!",
        description: "Please scan the QR code with WhatsApp",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="container mx-auto p-6 max-w-2xl flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (existingSessions.length > 0) {
    const session = existingSessions[0];
    
    const handleConnect = async () => {
      setIsLoading(true);
      setQrCode(null);
      
      try {
        const connectResponse = await fetch(`https://www.wasenderapi.com/api/whatsapp-sessions/${session.id}/connect`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
          },
        });

        const connectResult = await connectResponse.json();

        if (!connectResponse.ok || !connectResult.success) {
          throw new Error("Failed to connect session");
        }

        toast({
          title: "Session connected",
          description: "Fetching QR code...",
        });

        // Get QR code
        const qrResponse = await fetch(`https://www.wasenderapi.com/api/whatsapp-sessions/${session.id}/qrcode`, {
          headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
          },
        });

        const qrResult = await qrResponse.json();

        if (!qrResponse.ok || !qrResult.success) {
          throw new Error("Failed to fetch QR code");
        }

        setQrCode(qrResult.data.qrCode);
        toast({
          title: "Success!",
          description: "Please scan the QR code with WhatsApp",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to connect session",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">WhatsApp Session</h1>
            <p className="text-muted-foreground">
              Your active WhatsApp session
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label>Session Name</Label>
                <p className="text-lg font-medium">{session.name}</p>
              </div>
              <div>
                <Label>Phone Number</Label>
                <p className="text-lg font-medium">{session.phone_number}</p>
              </div>
              <div>
                <Label>Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    session.status === 'connected' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {session.status}
                  </span>
                </div>
              </div>
              <div>
                <Label>Created At</Label>
                <p className="text-lg font-medium">{new Date(session.created_at).toLocaleString()}</p>
              </div>
              
              {session.status !== 'connected' && (
                <Button onClick={handleConnect} disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Connect Session
                </Button>
              )}
            </div>
          </Card>
          
          {/* QR Code Display */}
          {qrCode && (
            <Card className="p-8 flex flex-col items-center justify-center space-y-6">
              <div className="w-64 h-64 bg-background rounded-lg flex items-center justify-center border-2 border-border overflow-hidden">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrCode)}`}
                  alt="WhatsApp QR Code"
                  className="w-full h-full"
                />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Scan with WhatsApp</h3>
                <p className="text-sm text-muted-foreground">
                  Open WhatsApp on your phone, go to Settings → Linked Devices → Link a Device
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create WhatsApp Session</h1>
          <p className="text-muted-foreground">
            Set up a new WhatsApp session. You will need to scan a QR code to connect after creating.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Session Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Session Name <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                (used to identify different WhatsApp sessions)
              </p>
              <Input
                id="name"
                placeholder="My WhatsApp Session"
                {...register("name")}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone_number">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone_number"
                placeholder="Enter the WhatsApp number you want to connect"
                {...register("phone_number")}
                disabled={isLoading}
              />
              {errors.phone_number && (
                <p className="text-sm text-destructive">{errors.phone_number.message}</p>
              )}
            </div>

            {/* Account Protection */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="account_protection"
                checked={watch("account_protection")}
                onCheckedChange={(checked) => setValue("account_protection", checked as boolean)}
                disabled={isLoading}
              />
              <div className="space-y-1">
                <Label htmlFor="account_protection" className="cursor-pointer">
                  Enable Account Protection
                </Label>
                <p className="text-xs text-muted-foreground">
                  Helps prevent WhatsApp from restricting your account by controlling message sending frequency.
                </p>
              </div>
            </div>

            {/* Message Logging */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="log_messages"
                checked={watch("log_messages")}
                onCheckedChange={(checked) => setValue("log_messages", checked as boolean)}
                disabled={isLoading}
              />
              <div className="space-y-1">
                <Label htmlFor="log_messages" className="cursor-pointer">
                  Enable Message Logging
                </Label>
                <p className="text-xs text-muted-foreground">
                  When disabled, only delivery statuses are recorded. When enabled, full message content and recipient details are stored.
                </p>
              </div>
            </div>

            {/* Read Incoming Messages */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="read_incoming_messages"
                checked={watch("read_incoming_messages")}
                onCheckedChange={(checked) => setValue("read_incoming_messages", checked as boolean)}
                disabled={isLoading}
              />
              <div className="space-y-1">
                <Label htmlFor="read_incoming_messages" className="cursor-pointer">
                  Read Incoming Messages
                </Label>
                <p className="text-xs text-muted-foreground">
                  When enabled, messages will be marked as read automatically when received. This lets senders know you've seen their messages.
                </p>
              </div>
            </div>

            {/* Auto Reject Calls */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="auto_reject_calls"
                checked={watch("auto_reject_calls")}
                onCheckedChange={(checked) => setValue("auto_reject_calls", checked as boolean)}
                disabled={isLoading}
              />
              <div className="space-y-1">
                <Label htmlFor="auto_reject_calls" className="cursor-pointer">
                  Auto Reject Calls
                </Label>
                <p className="text-xs text-muted-foreground">
                  When enabled, incoming calls will be automatically rejected.
                </p>
              </div>
            </div>

            {/* Always Online */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="always_online"
                checked={watch("always_online")}
                onCheckedChange={(checked) => setValue("always_online", checked as boolean)}
                disabled={isLoading}
              />
              <div className="space-y-1">
                <Label htmlFor="always_online" className="cursor-pointer">
                  Always Online
                </Label>
                <p className="text-xs text-muted-foreground">
                  When enabled, your session will always appear online to your contacts, even when you're not actively using WhatsApp. This can be useful for business accounts to let customers know you're available.
                </p>
              </div>
            </div>

            {/* Webhook Notifications */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="webhook_enabled"
                checked={watch("webhook_enabled")}
                onCheckedChange={(checked) => setValue("webhook_enabled", checked as boolean)}
                disabled={isLoading}
              />
              <div className="space-y-1">
                <Label htmlFor="webhook_enabled" className="cursor-pointer">
                  Enable Webhook Notifications (Optional)
                </Label>
                <p className="text-xs text-muted-foreground">
                  When enabled, events will be sent to the webhook URL above.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create & Connect Session
            </Button>
          </form>
        </Card>

        {/* QR Code Display */}
        {qrCode && (
          <Card className="p-8 flex flex-col items-center justify-center space-y-6">
            <div className="w-64 h-64 bg-background rounded-lg flex items-center justify-center border-2 border-border overflow-hidden">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrCode)}`}
                alt="WhatsApp QR Code"
                className="w-full h-full"
              />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">Scan with WhatsApp</h3>
              <p className="text-sm text-muted-foreground">
                Open WhatsApp on your phone, go to Settings → Linked Devices → Link a Device
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Whatsapp;
