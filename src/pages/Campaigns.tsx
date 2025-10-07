import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

const campaigns = [
  { title: "Confirmare comenzi" },
  { title: "upsell-uri personalizate" },
  { title: "sunat feedback" },
];

const Campaigns = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
        <p className="text-muted-foreground">
          Manage your campaign options
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.title} className="p-6 flex flex-col items-center justify-center space-y-4 text-center">
            <Lock className="w-12 h-12 text-muted-foreground" />
            <h3 className="font-semibold text-lg">{campaign.title}</h3>
            <p className="text-sm text-muted-foreground">
              Contacteaza echipa Nanoassist pentru deblocare
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
