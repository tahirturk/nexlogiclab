'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Cpu, 
  Globe, 
  Code2, 
  Sparkles, 
  Mail, 
  Check, 
  Copy, 
  Github, 
  Linkedin, 
  ArrowRight, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Clock,
  Brain,
  Network,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

const getTimeUntilLaunch = () => {
  const launchTime = new Date(2026, 8, 25).getTime();
  const remainingSeconds = Math.max(0, Math.floor((launchTime - Date.now()) / 1000));

  return {
    days: Math.floor(remainingSeconds / 86400),
    hours: Math.floor((remainingSeconds % 86400) / 3600),
    minutes: Math.floor((remainingSeconds % 3600) / 60),
    seconds: remainingSeconds % 60
  };
};

export default function App() {
  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState('light');

  // Track if theme is manually overridden by user
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  // Email subscription state
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Copy email status
  const [copied, setCopied] = useState(false);

  // Live countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('nexlogic_theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setTheme(savedTheme || (systemDark ? 'dark' : 'light'));
    setIsSystemTheme(!savedTheme);
  }, []);

  // Listen for system theme changes if user hasn't explicitly set a preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (isSystemTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, [isSystemTheme]);

  // Toggle theme manually
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    setIsSystemTheme(false);
    localStorage.setItem('nexlogic_theme', nextTheme);
  };

  // Reset to system theme preference
  const resetToSystemTheme = () => {
    localStorage.removeItem('nexlogic_theme');
    setIsSystemTheme(true);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(systemDark ? 'dark' : 'light');
  };

  useEffect(() => {
    setTimeLeft(getTimeUntilLaunch());

    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilLaunch());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for neural connection simulation
    const nodeCount = Math.floor(Math.min(width, height) / 14);
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulse: number;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.5 + 1.5,
        pulse: Math.random() * Math.PI * 2
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';

      // Render faint background grid adapted to theme
      const gridGap = 55;
      ctx.strokeStyle = isDark ? 'rgba(0, 194, 224, 0.05)' : 'rgba(184, 218, 242, 0.25)';
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += gridGap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridGap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & render neural nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.pulse += 0.025;
        const currentRadius = node.radius + Math.sin(node.pulse) * 0.6;

        // Draw soft node
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(0.8, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = '#00C2E0';
        ctx.shadowBlur = isDark ? 10 : 6;
        ctx.shadowColor = isDark ? 'rgba(0, 194, 224, 0.7)' : 'rgba(0, 194, 224, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw network connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            const alpha = (1 - dist / 140) * (isDark ? 0.35 : 0.25);
            ctx.strokeStyle = isDark 
              ? `rgba(0, 194, 224, ${alpha})` 
              : `rgba(33, 67, 214, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Mouse interaction link
        const mdx = mouseX - node.x;
        const mdy = mouseY - node.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 150) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouseX, mouseY);
          const alpha = (1 - mdist / 150) * (isDark ? 0.5 : 0.35);
          ctx.strokeStyle = `rgba(0, 194, 224, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubscribed(true);
    }, 700);
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('info@nexlogiclab.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const techStack = [
    { name: 'Python', icon: Terminal },
    { name: 'AWS', icon: Zap },
    { name: 'JavaScript', icon: Code2 },
    { name: 'AI / ML', icon: Cpu },
    { name: 'React', icon: Globe },
    { name: 'Next.js', icon: Layers },
    { name: 'TensorFlow', icon: Sparkles },
    { name: 'Git', icon: ShieldCheck }
  ];

  const featureCards = [
    {
      title: 'Next-Gen Software Architecture',
      desc: 'Architecting ultra-performant, modular full-stack applications with state-of-the-art frameworks.',
      icon: Code2,
      tag: 'Core Engineering'
    },
    {
      title: 'AI & Neural Intelligence',
      desc: 'Building customized deep learning pipelines, smart predictive engines, and intelligent logic workflows.',
      icon: Brain,
      tag: 'Neural AI'
    },
    {
      title: 'Scalable Web Systems',
      desc: 'Engineering low-latency, cloud-native enterprise systems with robust infrastructure.',
      icon: Network,
      tag: 'Enterprise'
    }
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen relative font-sans transition-colors duration-500 selection:bg-[#00C2E0] selection:text-white overflow-hidden ${
      isDark 
        ? 'bg-[#050B18] text-slate-100' 
        : 'bg-[#F4F9FD] text-[#0B132B]'
    }`}>
      
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Decorative Gradient Orbs */}
      <div className={`fixed top-[-10%] right-[-5%] w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${
        isDark 
          ? 'bg-gradient-to-br from-[#00C2E0]/20 via-[#1B45D2]/20 to-transparent' 
          : 'bg-gradient-to-br from-[#00C2E0]/15 via-[#1B45D2]/10 to-transparent'
      }`} />
      <div className={`fixed bottom-[-10%] left-[-5%] w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none transition-all duration-700 ${
        isDark 
          ? 'bg-gradient-to-tr from-[#131969]/30 via-[#00C2E0]/15 to-transparent' 
          : 'bg-gradient-to-tr from-[#B8DAF2]/40 via-[#00C2E0]/10 to-transparent'
      }`} />

      {/* Background IDE Code Watermark */}
      <div className={`absolute top-12 right-6 md:right-24 font-mono text-[11px] leading-relaxed pointer-events-none select-none z-0 hidden sm:block max-w-sm transition-opacity duration-500 ${
        isDark ? 'opacity-[0.12] text-[#00C2E0]' : 'opacity-[0.06] text-[#0B132B]'
      }`}>
        <pre>{`if (mache-sip-tong == true) {
  cocho-sip-toxc = false;
} else {
  '16.oon.con. ' &deolcont':
  coche-sip-toxc = false;
  coche-sip-toxc = true;
}
set_teromuit -27-sar: alcot1Rent
player = 8:loger();
stast1((me-coner.LeetArteliEat33)
ub3 an "Sotrax:LeeckZflgf SofSorReve[""]
hobouthere .ucer ptuna.ua()`}</pre>
      </div>

      {}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-4 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 group">
          <div className={`relative w-12 h-12 flex items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-105 ${
            isDark 
              ? 'bg-[#0B132B] border-[#00C2E0]/40 shadow-[0_4px_20px_rgba(0,194,224,0.25)]' 
              : 'bg-white border-[#B8DAF2]/80 shadow-[0_4px_20px_rgba(0,194,224,0.15)]'
          }`}>
            <img src="/nexlogiclab-logo.svg" alt="NexLogicLab" className="w-11 h-11 object-contain" />
          </div>
          <div>
            <div className={`flex items-center gap-0.5 font-extrabold text-xl tracking-tight ${
              isDark ? 'text-white' : 'text-[#0B132B]'
            }`}>
              <span>NEXLOGIC</span>
              <span className="text-[#00C2E0]">LAB</span>
            </div>
            <div className={`text-[8.5px] tracking-[0.2em] font-bold uppercase ${
              isDark ? 'text-[#00C2E0]/90' : 'text-[#1B45D2]/80'
            }`}>
              INNOVATION | INTELLIGENCE | INSIGHT
            </div>
          </div>
        </div>

        {/* Right Header Actions: Theme Toggle & Email Action */}
        <div className="flex items-center gap-3">
          
          {/* Theme Control Box */}
          <div className={`flex items-center p-1 rounded-xl border transition-colors duration-300 ${
            isDark ? 'bg-[#0B132B]/80 border-[#1B45D2]/50' : 'bg-white border-[#B8DAF2]'
          }`}>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 flex items-center gap-1.5 text-xs font-semibold ${
                isDark 
                  ? 'bg-[#1B45D2] text-white shadow-sm' 
                  : 'bg-[#F4F9FD] text-[#0B132B] hover:text-[#00C2E0]'
              }`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#1B45D2]" />}
              <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
            </button>

            {!isSystemTheme && (
              <button
                onClick={resetToSystemTheme}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-[#0B132B]'
                }`}
                title="Reset to System Preference"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Copy Email Button */}
          <button
            onClick={copyEmailToClipboard}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border shadow-sm hover:shadow transition-all duration-300 ${
              isDark 
                ? 'bg-[#0B132B] border-[#1B45D2]/60 text-slate-200 hover:border-[#00C2E0]' 
                : 'bg-white border-[#B8DAF2] text-[#0B132B] hover:border-[#00C2E0]'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#00C2E0]" />}
            <span className="font-mono text-[11px]">{copied ? 'Copied Email!' : 'info@nexlogiclab.com'}</span>
          </button>
        </div>
      </header>

      {}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-16 text-center">
        
        {/* Status Pill Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border mb-8 shadow-sm backdrop-blur-md transition-colors duration-300 ${
          isDark 
            ? 'bg-[#0B132B]/80 border-[#00C2E0]/30 text-slate-200' 
            : 'bg-white/80 border-[#B8DAF2] text-[#0B132B]'
        }`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2E0] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C2E0]"></span>
          </span>
          <span className="text-[#00C2E0] font-bold tracking-wider uppercase text-[10px]">Official Platform Launch In Progress</span>
        </div>

        {/* Headline */}
        <h1 className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 transition-colors duration-500 ${
          isDark ? 'text-white' : 'text-[#0B132B]'
        }`}>
          Pioneering{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2E0] via-[#38BDF8] to-[#1B45D2]">
            Next-Gen
          </span>{' '}
          <br />
          Intelligent Solutions
        </h1>

        {/* Subtitle */}
        <p className={`max-w-2xl mx-auto text-base sm:text-lg mb-10 font-semibold tracking-wide transition-colors duration-500 ${
          isDark ? 'text-slate-300' : 'text-[#1B45D2]/90'
        }`}>
          Software Engineering <span className="text-[#00C2E0] font-bold">•</span> Neural Networks <span className="text-[#00C2E0] font-bold">•</span> Advanced R&D <span className="text-[#00C2E0] font-bold">•</span> Tech Solutions
        </p>

        {/* Tech Stack Chip Grid */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto mb-14">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  isDark 
                    ? 'bg-[#0B132B]/80 border-[#1B45D2]/40 text-slate-200 hover:border-[#00C2E0] shadow-[0_2px_12px_rgba(0,194,224,0.1)]' 
                    : 'bg-white border-[#B8DAF2]/80 text-[#0B132B] hover:border-[#00C2E0] shadow-[0_2px_8px_rgba(0,194,224,0.06)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#00C2E0]" />
                <span className="text-xs font-bold">{tech.name}</span>
              </div>
            );
          })}
        </div>

        {}
        <div className={`max-w-xl mx-auto mb-16 p-6 sm:p-8 rounded-3xl border shadow-xl backdrop-blur-md transition-all duration-500 ${
          isDark 
            ? 'bg-[#0B132B]/90 border-[#1B45D2]/50 shadow-[0_12px_40px_rgba(0,194,224,0.2)]' 
            : 'bg-white/90 border-[#B8DAF2] shadow-[0_12px_40px_rgba(0,194,224,0.12)]'
        }`}>
          
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-[#00C2E0] mb-4">
            <Clock className="w-4 h-4 text-[#1B45D2]" /> Estimated Launch Ticker
          </div>

          {/* Countdown Clock */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 text-center mb-8">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds }
            ].map((item, idx) => (
              <div key={idx} className={`p-3 sm:p-4 rounded-2xl border transition-colors ${
                isDark 
                  ? 'bg-[#050B18] border-[#1B45D2]/40' 
                  : 'bg-[#F4F9FD] border-[#B8DAF2]/60'
              }`}>
                <div className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#00C2E0] to-[#1B45D2]">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className={`text-[10px] sm:text-xs font-bold uppercase mt-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Subscription Form */}
          {subscribed ? (
            <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center justify-center gap-3">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold">You're subscribed! We will notify you at launch.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:border-[#00C2E0] transition-all duration-300 ${
                    isDark 
                      ? 'bg-[#050B18] border-[#1B45D2]/50 text-white placeholder-slate-500 focus:bg-[#0B132B]' 
                      : 'bg-[#F4F9FD] border-[#B8DAF2] text-[#0B132B] placeholder-slate-400 focus:bg-white'
                  }`}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00C2E0] to-[#1B45D2] hover:opacity-95 shadow-[0_4px_20px_rgba(0,194,224,0.35)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {submitting ? 'Sending...' : 'Notify Me'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {}
        <section className="text-left">
          <div className="text-center mb-10">
            <h2 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
              Core Engineering Focus
            </h2>
            <p className={`text-xs font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Key innovation domains being developed at NexLogicLab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureCards.map((card, i) => {
              const IconComp = card.icon;
              return (
                <div 
                  key={i} 
                  className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                    isDark 
                      ? 'bg-[#0B132B]/80 border-[#1B45D2]/40 hover:border-[#00C2E0] shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_30px_rgba(0,194,224,0.2)]' 
                      : 'bg-white border-[#B8DAF2]/80 hover:border-[#00C2E0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,194,224,0.15)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl border text-[#00C2E0] group-hover:bg-[#00C2E0] group-hover:text-white transition-colors duration-300 ${
                      isDark 
                        ? 'bg-[#050B18] border-[#1B45D2]/40' 
                        : 'bg-[#F4F9FD] border-[#B8DAF2]'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      isDark 
                        ? 'bg-[#050B18] text-[#00C2E0] border-[#00C2E0]/30' 
                        : 'bg-[#F4F9FD] text-[#1B45D2] border-[#B8DAF2]/60'
                    }`}>
                      {card.tag}
                    </span>
                  </div>
                  <h3 className={`text-base font-bold mb-2 group-hover:text-[#00C2E0] transition-colors ${
                    isDark ? 'text-white' : 'text-[#0B132B]'
                  }`}>
                    {card.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {}
      <footer className={`relative z-10 border-t py-10 px-6 backdrop-blur-md transition-colors duration-500 ${
        isDark 
          ? 'bg-[#0B132B]/80 border-[#1B45D2]/40' 
          : 'bg-white/80 border-[#B8DAF2]/60'
      }`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Info */}
          <div className="text-center md:text-left">
            <img src="/nexlogiclab-logo.svg" alt="NexLogicLab" className="mx-auto md:mx-0 w-44 h-auto" />
            <p className={`text-xs font-medium mt-0.5 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              © 2026 NexLogicLab. All rights reserved.
            </p>
          </div>

          {/* Quick Copy Contact Bar */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
            isDark 
              ? 'bg-[#050B18] border-[#1B45D2]/40' 
              : 'bg-[#F4F9FD] border-[#B8DAF2]'
          }`}>
            <Mail className="w-4 h-4 text-[#00C2E0]" />
            <a 
              href="mailto:info@nexlogiclab.com" 
              className={`text-xs font-bold transition-colors ${
                isDark ? 'text-slate-200 hover:text-[#00C2E0]' : 'text-[#0B132B] hover:text-[#00C2E0]'
              }`}
            >
              info@nexlogiclab.com
            </a>
            <button 
              onClick={copyEmailToClipboard}
              className="ml-2 text-slate-400 hover:text-[#00C2E0] transition-colors"
              title="Copy Email"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {[
              { label: 'GitHub', icon: Github, href: 'https://github.com/nexlogiclab' },
              { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/nexlogiclab' },
              { label: 'Web', icon: Globe, href: 'https://www.nexlogiclab.com' }
            ].map((link, idx) => {
              const Icon = link.icon;
              return (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold shadow-sm transition-all hover:border-[#00C2E0] hover:text-[#00C2E0] ${
                    isDark 
                      ? 'bg-[#050B18] border-[#1B45D2]/40 text-slate-200' 
                      : 'bg-white border-[#B8DAF2] text-[#0B132B]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

        </div>
      </footer>
    </div>
  );
}