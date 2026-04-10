import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Shield, Lock } from "lucide-react";

interface Message {
  id: string;
  type: 'text' | 'media' | 'system';
  content: string;
  sender: 'left' | 'system';
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [headerStatus, setHeaderStatus] = useState('Schreibt...');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sequence = async () => {
      setIsTyping(true);
      setHeaderStatus('Schreibt...');

      // Delay 1.5s for first message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsTyping(false);
      setHeaderStatus('Online');
      setMessages(prev => [...prev, {
        id: '1',
        type: 'text',
        content: "Hey! Ich habe gesehen, dass du dich hier umsiehst 😉",
        sender: 'left'
      }]);

      // Delay 1s before next typing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsTyping(true);
      setHeaderStatus('Schreibt...');

      // Delay 2s for media message
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsTyping(false);
      setHeaderStatus('Online');
      setMessages(prev => [...prev, {
        id: '2',
        type: 'media',
        content: "Medien ausgeblendet",
        sender: 'left'
      }]);

      // Delay 0.8s for system warning
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => [...prev, {
        id: '3',
        type: 'system',
        content: "Empfänger hat 18+ Medien gesendet. Bestätige dein Alter unten, um den Chat freizuschalten.",
        sender: 'system'
      }]);
    };

    sequence();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-[#ff4b2b]/30">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-900/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] z-10"
      >
        {/* Chat Widget */}
        <div className="bg-[#161616] border border-white/10 rounded-2xl shadow-2xl overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-[#1f1f1f] p-4 flex items-center border-b border-white/5">
            <div className="relative mr-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff416c] to-[#ff4b2b] flex items-center justify-center font-bold text-lg">
                S
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00c853] border-2 border-[#1f1f1f] rounded-full" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Sarah_99 (In deiner Nähe)</h3>
              <p className={`text-[11px] transition-colors ${headerStatus === 'Online' ? 'text-[#00c853]' : 'text-white/40'}`}>
                {headerStatus}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 min-h-[250px] max-h-[400px] overflow-y-auto flex flex-col gap-4 scrollbar-hide">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`max-w-[85%] p-3 px-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'left' 
                      ? 'bg-[#262626] text-white/90 self-start rounded-bl-none' 
                      : 'bg-red-500/10 border border-red-500/20 text-red-400 self-center text-center w-full rounded-lg'
                  }`}
                >
                  {msg.type === 'media' ? (
                    <div className="relative py-4 px-2 bg-[#3a1c22] border border-[#ff4b2b]/30 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 blur-md bg-white/5" />
                      <div className="relative flex items-center justify-center gap-2 text-[#ff4b2b] font-bold text-xs uppercase tracking-wider">
                        <Lock size={14} />
                        Medien ausgeblendet
                      </div>
                    </div>
                  ) : msg.type === 'system' ? (
                    <div className="flex flex-col items-center gap-2">
                      <Shield size={16} className="text-red-500" />
                      <p className="text-[12px]">
                        <span className="font-bold uppercase mr-1">Systemnachricht:</span>
                        {msg.content}
                      </p>
                    </div>
                  ) : (
                    msg.content
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#262626] p-3 px-4 rounded-2xl rounded-bl-none w-fit flex gap-1"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ 
                      duration: 0.6, 
                      repeat: Infinity, 
                      delay: i * 0.15 
                    }}
                    className="w-1.5 h-1.5 bg-white/30 rounded-full"
                  />
                ))}
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* CTA Button */}
        <motion.a
          id="enterBtn"
          href="https://t.crdtg2.com/408842/9953/37712?aff_sub5=SF_006OG000004lmDN"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="block w-full py-6 bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white text-center font-black uppercase rounded-2xl shadow-[0_0_50px_rgba(255,75,43,0.7)] relative overflow-hidden group"
        >
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
          <span className="relative flex flex-col leading-none gap-2">
            <span className="text-[15px] tracking-wide">Alter bestätigen zum</span>
            <span className="text-[34px] tracking-tight">Antworten</span>
          </span>
        </motion.a>

        <p className="mt-6 text-[11px] text-white/30 text-center uppercase tracking-widest font-medium">
          Sichere & anonyme 18+ Verifizierung. Keine Abrechnung erforderlich.
        </p>
      </motion.div>

      {/* Footer Disclaimer */}
      <div className="mt-12 text-[10px] text-white/20 text-center max-w-[300px]">
        Diese Seite ist nur für Erwachsene. Durch Klicken auf Bestätigen bestätigen Sie, dass Sie mindestens 18 Jahre alt sind.
      </div>
    </div>
  );
}
