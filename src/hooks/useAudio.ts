import { useRef } from "react";

export function useAudio() {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = (
    src: string,
    volume = 0.5,
    priority = false
  ) => {
    if (priority && currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);
    audio.volume = volume;
    currentAudioRef.current = audio;

    audio.play().catch(() => {});
  };

  return { playSound };
}