import { useState, useCallback, useRef, useEffect } from 'react';

// Sound files from Google's sound library
const SOUND_FILES = {
  move: 'https://actions.google.com/sounds/v1/steps/running_feet_on_grass.ogg',
  ping: 'https://actions.google.com/sounds/v1/science_fiction/radar_sweep.ogg',
  found: 'https://actions.google.com/sounds/v1/positive/success_bell.ogg',
  countdown: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
  gameOver: 'https://actions.google.com/sounds/v1/game_shows/game_show_reveal.ogg',
};

export type SoundName = keyof typeof SOUND_FILES;

const useSounds = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRefs = useRef<{ [key in SoundName]?: HTMLAudioElement }>({});

  // Effect to preload audio files
  useEffect(() => {
    Object.entries(SOUND_FILES).forEach(([name, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.4; // Lower volume to not be overwhelming
      audioRefs.current[name as SoundName] = audio;
    });

    return () => {
        // Cleanup audio elements on unmount
        Object.values(audioRefs.current).forEach(audio => {
            // FIX: The `audio` parameter was inferred as `unknown`, preventing property access.
            // Using `instanceof HTMLAudioElement` acts as a type guard to correctly narrow the type.
            if (audio instanceof HTMLAudioElement) {
                audio.src = '';
            }
        });
    }
  }, []);

  const playSound = useCallback((name: SoundName) => {
    if (isMuted) return;
    const audio = audioRefs.current[name];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error(`Failed to play sound: ${name}`, e));
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return { isMuted, toggleMute, playSound };
};

export default useSounds;
