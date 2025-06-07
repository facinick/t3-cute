"use client";

import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { useState } from "react";
import { Calendar } from "~/components/ui/calendar";
import { Card } from "~/components/ui/card";

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Team Meeting",
    date: new Date(2024, 2, 15),
    time: "10:00 AM",
  },
  {
    id: 2,
    title: "Project Review",
    date: new Date(2024, 2, 16),
    time: "2:00 PM",
  },
  {
    id: 3,
    title: "Client Call",
    date: new Date(2024, 2, 17),
    time: "11:30 AM",
  },
];

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDateEvents = MOCK_EVENTS.filter(
    (event) =>
      date &&
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
  );

  return (
    <Card className="w-[800px] p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Calendar */}
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            locale={enUS}
            formatters={{
              formatDay: (date) => format(date, "d"),
              formatWeekdayName: (date) => format(date, "EEE"),
              formatMonthCaption: (date) => format(date, "MMMM yyyy"),
            }}
          />
        </div>

        {/* Events List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">
            {date ? format(date, "MMMM d, yyyy", { locale: enUS }) : "Select a date"}
          </h3>
          
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <Card key={event.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.time}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No events scheduled</p>
          )}
        </div>
      </div>
    </Card>
  );
} 