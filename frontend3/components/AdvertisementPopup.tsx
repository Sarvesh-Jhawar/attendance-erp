"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";

interface EventData {
  id: number;
  eventName: string;
  clubName: string;
  posterUrl: string;
  link: string;
  endDate: string;
}

interface AdvertisementPopupProps {
  event: EventData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdvertisementPopup({ event, isOpen, onClose }: AdvertisementPopupProps) {
  if (!isOpen || !event) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Make the dialog content itself the card, with a bit more width */}
      <DialogContent className="bg-slate-900/80 backdrop-blur-lg border-slate-700 text-slate-200 p-0 max-w-md w-[90vw] sm:w-full overflow-hidden rounded-2xl shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-5 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-transform active:scale-90"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Poster Image Container */}
        <div className="w-full max-h-[75vh] flex items-center justify-center bg-black/30">
          <img
            src={event.posterUrl}
            alt={event.eventName}
            className="w-full h-auto max-h-[75vh] object-contain"
          />
        </div>

        {/* Content */}
        <div className="p-6 pt-4 text-center">
          <DialogHeader className="sm:text-center">
            <DialogTitle className="text-2xl font-bold text-white">{event.eventName}</DialogTitle>
            <p className="text-md text-slate-400">{event.clubName}</p>
          </DialogHeader>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-center">
            <Link href={event.link} passHref legacyBehavior>
              <a target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold h-12 text-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                  Explore More
                </Button>
              </a>
            </Link>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full bg-transparent border-slate-600 hover:bg-slate-800/50 hover:text-white text-slate-300 font-semibold h-12 text-lg transition-all duration-300"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}