
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const moods = [
  { name: 'Inspiring', color: 'from-blue-400/20 to-purple-400/20' },
  { name: 'Informative', color: 'from-green-400/20 to-teal-400/20' },
  { name: 'Creative', color: 'from-pink-400/20 to-rose-400/20' },
  { name: 'Peaceful', color: 'from-sky-400/20 to-indigo-400/20' },
  { name: 'Energetic', color: 'from-orange-400/20 to-amber-400/20' },
];

const MoodFilter = () => {
  return (
    <Card className="col-span-12 md:col-span-4">
      <CardHeader>
        <CardTitle>Mood Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {moods.map((mood) => (
            <Button
              key={mood.name}
              variant="outline"
              className={`w-full justify-start h-12 bg-gradient-to-r ${mood.color} hover:opacity-80`}
            >
              {mood.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodFilter;
