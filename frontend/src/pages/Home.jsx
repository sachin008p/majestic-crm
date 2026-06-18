import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount1(Math.floor((500 * step) / steps));
      setCount2(Math.floor((1200 * step) / steps));
      setCount3(Math.floor((98 * step) / steps));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay:'1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay:'2s'}}></div>
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-3' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/30">
              M
            </div>
            <div>
              <span className="font-black text-xl tracking-tight">Majestic</span>
              <span className="text-indigo-400 font-black text-xl"> Realities</span>
            </div>
          </div>
          <Link
            to="/login"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:scale-105"
          >
            Login to CRM
          </Link>
        </div>
      </nav>

      <section className="relative z-10 min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 mb-8 text-sm text-indigo-300">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            India's #1 Real Estate CRM Platform
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Manage Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Real Estate Empire
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The most powerful CRM built exclusively for real estate professionals.
            Track leads, manage customers, close deals faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/login"
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
            >
              Get Started Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#features"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              See Features
            </a>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-4xl font-black text-white">{count1}+</div>
              <div className="text-slate-400 text-sm mt-1">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-white">{count2}+</div>
              <div className="text-slate-400 text-sm mt-1">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-white">{count3}%</div>
              <div className="text-slate-400 text-sm mt-1">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> Close More Deals</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Powerful features designed specifically for real estate professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '👥', title: 'Customer Management', desc: 'Complete customer profiles with contact history, preferences, and deal status all in one place.', color: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/20' },
              { icon: '🎯', title: 'Lead Tracking', desc: 'Never lose a lead again. Track every inquiry from first contact to final sale automatically.', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/20' },
              { icon: '✅', title: 'Task Management', desc: 'Stay on top of follow-ups, site visits, and paperwork with smart task reminders.', color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/20' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'Real-time insights into your sales pipeline, team performance, and revenue forecasts.', color: 'from-orange-500/20 to-yellow-500/20', border: 'border-orange-500/20' },
              { icon: '🔐', title: 'Secure & Reliable', desc: 'Bank-grade security with JWT authentication. Your data is always safe and private.', color: 'from-red-500/20 to-rose-500/20', border: 'border-red-500/20' },
              { icon: '⚡', title: 'Lightning Fast', desc: 'Built with cutting-edge technology for instant load times and smooth performance.', color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/20' }
            ].map((feature, i) => (
              <div key={i} className={`bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-default`}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to Grow Your
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> Business?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Join hundreds of real estate professionals already using Majestic CRM
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:scale-105"
            >
              Start Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-sm">M</div>
            <span className="text-slate-400 text-sm">© 2024 Majestic Realities. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-slate-400 text-sm">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Us</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;