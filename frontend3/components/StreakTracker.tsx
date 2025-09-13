"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

interface StreakTrackerProps {
  streak: number;
}

const badges = [
  { days: 7, title: "The Starter", emoji: "🔰" },
  { days: 10, title: "Newbie Streaker", emoji: "🌱" },
  { days: 15, title: "Attendance Pro", emoji: "📘" },
  { days: 20, title: "Attendance Ninja", emoji: "🥷" },
  { days: 25, title: "Class Warrior", emoji: "⚔️" },
  { days: 28, title: "Legendary Streaker", emoji: "🏆" },
];

export default function StreakTracker({ streak }: StreakTrackerProps) {
  const highestUnlockedBadge = badges
    .slice()
    .reverse()
    .find(badge => streak >= badge.days);

  const nextBadgeToUnlock = badges.find(badge => streak < badge.days);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative border border-white/30 rounded-lg px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-base text-white bg-transparent hover:bg-white/10 font-semibold flex items-center transition whitespace-nowrap group">
          <Flame
            className={`w-4 h-4 mr-1 sm:mr-2 transition-colors ${
              streak > 0 ? "text-orange-400" : "text-slate-400"
            }`}
          />
          <span
            className={`font-bold transition-colors ${
              streak > 0 ? "text-orange-400" : "text-slate-400"
            }`}
          >
            {streak}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-slate-900/80 backdrop-blur-lg border-slate-700 text-slate-200">
        <div className="grid gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h4 className="font-medium leading-none text-white">Attendance Streak</h4>
              <Badge variant="outline" className="border-orange-400 text-orange-400">
                Under Testing
              </Badge>
            </div>
            <p className="text-sm text-slate-400">
              A 'perfect day' (all classes marked 'Present') contributes to the streak. Any absence breaks it. Holidays are skipped.
            </p>
          </div>
          <div className="text-center bg-slate-800/50 p-4 rounded-lg">
            <div className="text-5xl font-bold text-orange-400 flex items-center justify-center">
              <Flame className="w-12 h-12 mr-2" />
              {streak}
            </div>
            <p className="text-lg font-medium text-white mt-1">
              {streak === 1 ? "Day Streak" : "Day Streak"}
            </p>
            {highestUnlockedBadge && (
              <p className="text-sm text-cyan-300 mt-2">
                {highestUnlockedBadge.emoji} {highestUnlockedBadge.title}
              </p>
            )}
          </div>
          {nextBadgeToUnlock ? (
            <div className="space-y-2">
              <h5 className="font-medium text-white">Next Goal</h5>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/60 text-slate-300 border border-slate-700">
                <span className="flex items-center">
                  <span className="text-2xl mr-3">{nextBadgeToUnlock.emoji}</span>
                  <span className="font-medium">{nextBadgeToUnlock.title}</span>
                </span>
                <span className="text-sm font-bold px-2.5 py-1 rounded-full bg-slate-700">
                  Day {nextBadgeToUnlock.days}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h5 className="font-medium text-white">Congratulations!</h5>
              <div className="flex items-center justify-center p-3 rounded-lg bg-green-500/20 text-green-300 border border-green-400/30">
                <span className="font-semibold">
                  You've unlocked all the badges! 🎉
                </span>
              </div>
            </div>
          )}

        </div>
      </PopoverContent>
    </Popover>
  );
}