import React, { useState, useEffect, useRef } from 'react';
import { useMess } from '../../context/MessContext';
import { parseVoiceCommand, ParsedVoiceResult, VOICE_PRESET_EXAMPLES } from '../../utils/speechParser';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  X,
  Volume2,
  Receipt,
  Utensils,
  Wallet,
  Play,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';

interface VoiceEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceEntryModal: React.FC<VoiceEntryModalProps> = ({ isOpen, onClose }) => {
  const { members, addExpense, upsertMealRecord, addDeposit, currentPeriod } = useMess();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [parseResult, setParseResult] = useState<ParsedVoiceResult | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check SpeechRecognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US'; // Works well with English & Banglish

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let currentFinal = '';
          let currentInterim = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentFinal += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (currentFinal) {
            setTranscript((prev) => (prev ? prev + ' ' + currentFinal : currentFinal));
          }
          setInterimText(currentInterim);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition init failed:', err);
        setSpeechSupported(false);
      }
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Parse transcript whenever transcript changes
  useEffect(() => {
    const fullText = (transcript + ' ' + interimText).trim();
    if (fullText) {
      const parsed = parseVoiceCommand(fullText, members);
      setParseResult(parsed);
    } else {
      setParseResult(null);
    }
  }, [transcript, interimText, members]);

  const startListening = () => {
    setSubmitSuccess(null);
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Handle restart error
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  };

  const handleTestPreset = (preset: string) => {
    setSubmitSuccess(null);
    setTranscript(preset);
    setInterimText('');
    const parsed = parseVoiceCommand(preset, members);
    setParseResult(parsed);
  };

  const handleReset = () => {
    setTranscript('');
    setInterimText('');
    setParseResult(null);
    setSubmitSuccess(null);
  };

  const handleConfirmSubmit = () => {
    if (!parseResult || parseResult.intent === 'UNKNOWN') return;

    const todayStr = `${currentPeriod.year}-${
      currentPeriod.month < 10 ? '0' + currentPeriod.month : currentPeriod.month
    }-09`;

    if (parseResult.intent === 'EXPENSE' && parseResult.expense) {
      const exp = parseResult.expense;
      addExpense({
        date: todayStr,
        title: exp.title,
        category: exp.category,
        amount: exp.amount,
        paidByMemberId: exp.paidByMemberId || members[0]?.id || 'm1',
        notes: `Added via AI Voice Assistant: "${transcript}"`,
      });
      setSubmitSuccess(`Expense BDT ${exp.amount} ("${exp.title}") recorded!`);
    } else if (parseResult.intent === 'MEAL' && parseResult.meal) {
      const m = parseResult.meal;
      upsertMealRecord(todayStr, m.memberId || members[0]?.id || 'm1', m.breakfast, m.lunch, m.dinner);
      setSubmitSuccess(`Recorded ${m.totalCount} meals for ${m.memberName}!`);
    } else if (parseResult.intent === 'DEPOSIT' && parseResult.deposit) {
      const dep = parseResult.deposit;
      addDeposit({
        date: todayStr,
        memberId: dep.memberId || members[0]?.id || 'm1',
        amount: dep.amount,
        method: dep.method,
        notes: `Added via AI Voice Assistant: "${transcript}"`,
      });
      setSubmitSuccess(`Deposit BDT ${dep.amount} recorded for ${dep.memberName}!`);
    }

    setTimeout(() => {
      handleReset();
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white flex items-center justify-center shadow-md animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <span>AI Voice Assistant</span>
                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Voice Entry
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Speak or select natural language commands to add expenses, meals or deposits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {submitSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{submitSuccess}</span>
          </div>
        )}

        {/* Listening Orb & Mic Control */}
        <div className="flex flex-col items-center justify-center space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80 relative">
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 cursor-pointer shadow-lg ${
              isListening
                ? 'bg-rose-600 ring-8 ring-rose-500/30 animate-pulse shadow-rose-500/40'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30 hover-glow'
            }`}
          >
            {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>

          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5">
              {isListening ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-rose-600 dark:text-rose-400">Listening to your voice...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Tap Mic to Speak</span>
                </>
              )}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              e.g., &quot;Fish bazar 350 taka&quot; or &quot;Set Rahim 2 meals&quot;
            </p>
          </div>

          {!speechSupported && (
            <div className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800/80 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Browser Speech API not supported. Use quick voice preset buttons below!</span>
            </div>
          )}
        </div>

        {/* Live Transcript Display & Manual Text Fallback */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span>Recognized Text Input</span>
            {(transcript || interimText) && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </label>
          <textarea
            rows={2}
            value={transcript + (interimText ? ` (${interimText}...)` : '')}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Spoken words appear here, or type natural command manually..."
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-medium"
          />
        </div>

        {/* Quick Voice Presets */}
        <div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 block">
            Quick Preset Test Commands:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {VOICE_PRESET_EXAMPLES.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleTestPreset(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 text-[11px] font-medium transition cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center gap-1"
              >
                <Play className="w-2.5 h-2.5 text-emerald-500" />
                <span>&quot;{preset}&quot;</span>
              </button>
            ))}
          </div>
        </div>

        {/* Parsed Action Card Confirmation */}
        {parseResult && parseResult.intent !== 'UNKNOWN' && (
          <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                {parseResult.intent === 'EXPENSE' && <Receipt className="w-4 h-4 text-amber-500" />}
                {parseResult.intent === 'MEAL' && <Utensils className="w-4 h-4 text-emerald-500" />}
                {parseResult.intent === 'DEPOSIT' && <Wallet className="w-4 h-4 text-indigo-500" />}
                <span>Parsed Action: {parseResult.intent}</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded">
                {(parseResult.confidence * 100).toFixed(0)}% Match
              </span>
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-snug">
              {parseResult.summary}
            </p>

            <button
              type="button"
              onClick={handleConfirmSubmit}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Record Action</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
