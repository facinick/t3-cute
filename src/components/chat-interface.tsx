"use client";

import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "them",
    message: "Hey! How's it going?",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "me",
    message: "Pretty good! Just working on some new components",
    time: "10:31 AM",
  },
  {
    id: 3,
    sender: "them",
    message: "That sounds interesting! What kind of components?",
    time: "10:32 AM",
  },
];

export function ChatInterface() {
  return (
    <Card className="w-[400px] h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">John Doe</h3>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {MOCK_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === "me"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p>{msg.message}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === "me"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
} 