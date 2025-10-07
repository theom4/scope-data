import { Card } from "@/components/ui/card";
import { QrCode } from "lucide-react";

const Whatsapp = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">WhatsApp Connection</h1>
        <p className="text-muted-foreground">
          Scan the QR code below to connect your WhatsApp number to the agent
        </p>
      </div>

      <Card className="p-8 flex flex-col items-center justify-center space-y-6 max-w-md mx-auto">
        <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
          <QrCode className="w-32 h-32 text-muted-foreground" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">Scan with WhatsApp</h3>
          <p className="text-sm text-muted-foreground">
            Open WhatsApp on your phone, go to Settings → Linked Devices → Link a Device
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Whatsapp;
