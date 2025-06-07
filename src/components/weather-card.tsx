"use client";

import { Cloud, CloudRain, Sun, Wind } from "lucide-react";
import { Card } from "~/components/ui/card";

const MOCK_WEATHER = {
  location: "San Francisco",
  temperature: 72,
  condition: "Sunny",
  humidity: 65,
  windSpeed: 8,
  forecast: [
    { day: "Mon", temp: 70, icon: Sun },
    { day: "Tue", temp: 68, icon: Cloud },
    { day: "Wed", temp: 65, icon: CloudRain },
    { day: "Thu", temp: 69, icon: Cloud },
    { day: "Fri", temp: 72, icon: Sun },
  ],
};

export function WeatherCard() {
  return (
    <Card className="w-[400px] p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm">
      <div className="space-y-6">
        {/* Current Weather */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{MOCK_WEATHER.location}</h2>
            <p className="text-4xl font-bold mt-2">
              {MOCK_WEATHER.temperature}°F
            </p>
            <p className="text-muted-foreground">{MOCK_WEATHER.condition}</p>
          </div>
          <Sun className="h-16 w-16 text-yellow-500" />
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Wind</p>
              <p className="font-medium">{MOCK_WEATHER.windSpeed} mph</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="font-medium">{MOCK_WEATHER.humidity}%</p>
            </div>
          </div>
        </div>

        {/* Forecast */}
        <div className="pt-4 border-t">
          <div className="flex justify-between">
            {MOCK_WEATHER.forecast.map((day) => (
              <div key={day.day} className="text-center">
                <p className="text-sm text-muted-foreground">{day.day}</p>
                <day.icon className="h-6 w-6 mx-auto my-2" />
                <p className="font-medium">{day.temp}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
} 