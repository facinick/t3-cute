"use client";

import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Slider } from "~/components/ui/slider";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);

  return (
    <Card className="w-[350px] p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Album Art */}
        <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-white text-4xl">🎵</span>
        </div>

        {/* Song Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">Midnight Dreams</h3>
          <p className="text-sm text-muted-foreground">Luna & The Stars</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider defaultValue={[30]} max={100} step={1} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1:23</span>
            <span>3:45</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon">
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="w-[200px]"
          />
        </div>
      </div>
    </Card>
  );
} 