import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Volume2, Sparkles, ArrowRight } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (text: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose, onResult }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setTranscript('');
      setErrorMsg('');
      return;
    }

    // Initialize Web Speech API if supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access was denied. Please allow microphone permissions or type your search query.');
        } else {
          setErrorMsg('Could not detect audio clearly. Try speaking again or type below.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    } else {
      // Browser does not support speech recognition natively
      setIsListening(false);
      setErrorMsg('Voice input is not natively supported in this browser. Try a sample voice query below!');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (transcript.trim()) {
      onResult(transcript.trim());
      onClose();
    }
  };

  const sampleVoicePrompts = [
    'Nike Air Max sneakers',
    'Sony noise cancelling headphones',
    'Solid oak computer desk',
    'Apple Watch series 10'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Microphone Icon */}
        <div className="mt-4 mb-6 relative inline-block">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
              isListening
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/50 scale-110 ring-8 ring-indigo-500/20 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <Mic className={`w-10 h-10 ${isListening ? 'animate-bounce' : ''}`} />
          </div>

          {/* Sound wave rings */}
          {isListening && (
            <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-30 pointer-events-none" />
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          {isListening ? 'Listening to your voice...' : 'Voice Search'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Say a product name, brand, or category (e.g., "Sony wireless headphones")
        </p>

        {/* Live Transcript Box */}
        <div className="min-h-16 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-center mb-4">
          {transcript ? (
            <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400 italic">
              "{transcript}"
            </p>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>{isListening ? 'Speak now...' : 'Tap a prompt or speak'}</span>
            </div>
          )}
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-500 mb-4">{errorMsg}</p>
        )}

        {/* Quick Sample Prompts */}
        <div className="text-left mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Try speaking or clicking:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sampleVoicePrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => {
                  setTranscript(prompt);
                  onResult(prompt);
                  onClose();
                }}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 text-xs rounded-full text-slate-700 dark:text-slate-300 transition-colors"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (recognitionRef.current) {
                if (isListening) {
                  recognitionRef.current.stop();
                } else {
                  recognitionRef.current.start();
                }
              }
            }}
            className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-semibold transition-colors"
          >
            {isListening ? 'Stop Listening' : 'Restart Mic'}
          </button>

          <button
            disabled={!transcript.trim()}
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
