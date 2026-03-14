/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Gift, ChevronRight, Sparkles } from 'lucide-react';

interface AgeResult {
  years: number;
  months: number;
  days: number;
}

interface CountdownResult {
  months: number;
  days: number;
}

export default function App() {
  const [dob, setDob] = useState<string>('');
  const [age, setAge] = useState<AgeResult | null>(null);
  const [countdown, setCountdown] = useState<CountdownResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateAge = () => {
    if (!dob) return;

    setIsCalculating(true);
    
    // Simulate a premium "calculating" feel
    setTimeout(() => {
      const birthDate = new Date(dob);
      const today = new Date();

      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      let days = today.getDate() - birthDate.getDate();

      if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
      }

      if (days < 0) {
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
        months--;
      }

      setAge({ years, months, days });

      // Calculate next birthday countdown
      const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
      }

      const diffTime = nextBirthday.getTime() - today.getTime();
      const diffDaysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const nextMonths = Math.floor(diffDaysTotal / 30.44);
      const nextDays = Math.floor(diffDaysTotal % 30.44);

      setCountdown({ months: nextMonths, days: nextDays });
      setIsCalculating(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full animate-pulse delay-700" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-4"
          >
            <Sparkles className="w-6 h-6 text-blue-400" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Aura Age
          </h1>
          <p className="text-white/40 mt-2 font-medium">Precision Chronology</p>
        </div>

        {/* Main Glass Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-white/30 mb-3 ml-1">
                Date of Birth
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-lg appearance-none"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            <button 
              onClick={calculateAge}
              disabled={!dob || isCalculating}
              className="w-full relative group overflow-hidden py-4 rounded-2xl bg-blue-600 font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="flex items-center justify-center gap-2">
                {isCalculating ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Calculate Age
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {age && !isCalculating && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Years', value: age.years, icon: Clock },
                  { label: 'Months', value: age.months, icon: Calendar },
                  { label: 'Days', value: age.days, icon: Sparkles },
                ].map((item, idx) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-4 text-center group hover:bg-white/10 transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-blue-400/50 mx-auto mb-2 group-hover:text-blue-400 transition-colors" />
                    <div className="text-2xl font-bold text-blue-400">{item.value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-white/30 font-bold mt-1">{item.label}</div>
                  </motion.div>
                ))}
              </div>

              {countdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 flex items-center gap-5"
                >
                  <div className="p-3 bg-blue-500/20 rounded-2xl">
                    <Gift className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-blue-400/60 mb-1">Next Birthday In</div>
                    <div className="text-lg font-medium">
                      {countdown.months > 0 && `${countdown.months} month${countdown.months > 1 ? 's' : ''} `}
                      {countdown.days} day{countdown.days !== 1 ? 's' : ''}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <p className="text-center text-white/20 text-[10px] uppercase tracking-[0.2em] mt-12 font-bold">
          &copy; 2026 Aura Chrono Labs
        </p>
      </motion.div>
    </div>
  );
}
