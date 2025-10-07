import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    
    // Simulate AI response (you'll replace this with actual AI integration)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Aceasta este o versiune demo. Integrarea cu AI va fi adăugată în curând." 
      }]);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Chat</h1>
        <p className="text-muted-foreground">
          Pune orice intrebare despre apelurile sau mesajele procesate de sistem
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-center max-w-2xl">
                Pune orice intrebare despre apelurile sau mesajele procesate de sistem, de exemplu 'cat de multumiti au fost clientii care au vorbit cu robotul in ultima perioada?'
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Scrie mesajul tau aici..."
              className="flex-1"
            />
            <Button onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
