import { Phone, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CallRecordings = () => {
  const recording = {
    id: 1,
    date: "11 Octombrie 2025",
    duration: "5:31",
    url: "https://storage-gw-de-01.voximplant.com/voxdata-de-rec/2025/10/11/NjBmMzZmNWI3N2UzMDM5MDUxYThlNDhlOWVjZDM3ODAvaHR0cDovL3d3dy1mci0wNi0yMTIudm94aW1wbGFudC5jb206ODA4MC9yZWNvcmRzLzIwMjUvMTAvMTEvQjVDODc0OTQzMEU1RjdENC4xNzYwMTg0NDU3LjUzMTE2Mi5tcDM-.mp3?record_id=1795472760"
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Phone className="h-8 w-8" />
          Înregistrări Apeluri
        </h1>
        <p className="text-muted-foreground mt-2">
          Ascultă și gestionează înregistrările apelurilor
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Înregistrări Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div 
              onClick={() => window.open(recording.url, '_blank')}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Apel #{recording.id}</p>
                  <p className="text-sm text-muted-foreground">{recording.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{recording.duration}</p>
                <p className="text-xs text-muted-foreground">Durată</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallRecordings;
