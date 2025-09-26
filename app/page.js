"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Smartphone, Users, HeartPulse, Bot, Ear, Sparkles, RefreshCw, X, CheckCircle, AlertTriangle, Clock, Pill, Thermometer, Activity, MessageSquareText, Mic, User, Bell, Share2, FileText, Send, Wifi, Battery, Camera, Lock, Volume2, Power, PlusCircle, BrainCircuit, Mail, Signal, BatteryCharging } from 'lucide-react';

// --- IMPORTANT: ADD YOUR API KEY HERE ---
// Get your key from Google AI Studio: https://aistudio.google.com/app/apikey
const YOUR_API_KEY = "AIzaSyDOZ2jN2d51-O70E7PsAzaiUVYkP9g5F5s";
// -----------------------------------------

// Main App Component
export default function App() {
  const [page, setPageState] = useState('landing');

  // On initial load, check session storage to see if we should be on the dashboard
  useEffect(() => {
    const storedPage = sessionStorage.getItem('currentPage');
    if (storedPage === 'dashboard') {
      setPageState('dashboard');
    }
  }, []);

  // Create a wrapper for setPage that also updates session storage
  const setPage = (newPage) => {
    sessionStorage.setItem('currentPage', newPage);
    setPageState(newPage);
  };
  
  // A simple router
  if (page === 'dashboard') {
    return <DashboardPage setPage={setPage} />;
  }
  return <LandingPage setPage={setPage} />;
}


// --- LANDING PAGE COMPONENTS ---

const LandingPage = ({ setPage }) => {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const { toasts, addToast } = useToasts();

  const customScrollbarStyles = `
    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 8px 2px rgba(59, 130, 246, 0.4);
      }
      50% {
        box-shadow: 0 0 16px 4px rgba(59, 130, 246, 0.7);
      }
    }

    body::-webkit-scrollbar {
      width: 16px;
    }

    body::-webkit-scrollbar-track {
      background-color: #f1f5f9;
    }

    body::-webkit-scrollbar-thumb {
      background-color: #3b82f6;
      border-radius: 8px;
      border: 3px solid #f1f5f9;
      animation: pulse-glow 3s infinite ease-in-out;
    }
     body {
      color-scheme: light; /* Prevents browser default dark mode styles from interfering */
    }
  `;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans antialiased">
      <style>{customScrollbarStyles}</style>
      <ToastContainer toasts={toasts} />
      <Navbar onGetStarted={() => setShowCaptcha(true)} />
      <main>
        <HeroSection onGetStarted={() => setShowCaptcha(true)} />
        <AboutSection />
        <FeaturesSection />
        <BeneficiariesSection />
        <FlowchartSection />
        <AIDemoSection addToast={addToast} />
      </main>
      <Footer />
      <AnimatePresence>
        {showCaptcha && (
          <CaptchaModal 
            onClose={() => setShowCaptcha(false)} 
            onSuccess={() => {
              addToast('success', 'Captcha Verified!', 2000);
              setTimeout(() => {
                setShowCaptcha(false);
                setPage('dashboard');
              }, 500);
            }}
            addToast={addToast}
          />
        )}
      </AnimatePresence>
    </div>
  );
};


// Custom easing for a smoother, more premium feel
const premiumEase = [0.6, 0.01, 0.1, 0.95];

// Helper: Animated Section Wrapper
const AnimatedSection = ({ children, id, className = "" }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: premiumEase, staggerChildren: 0.2 }
    }
  };

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
      className={`py-20 md:py-28 px-6 md:px-8 lg:px-16 overflow-hidden ${className}`}
    >
      {children}
    </motion.section>
  );
};

// Navigation Component
const Navbar = ({ onGetStarted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Demo', href: '#demo' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center space-x-2">
          <HeartPulse className="text-blue-600 h-8 w-8" />
          <span className="font-bold text-xl text-gray-900 dark:text-gray-100">CareCompanion AI</span>
        </a>
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map(link => (
            <motion.a 
              key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link.href)}
              className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
              whileHover="hover" initial="initial"
            >
              {link.name}
              <motion.div className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-blue-600"
                variants={{ hover: { scaleX: 1, originX: 0 }, initial: { scaleX: 0 } }}
                transition={{ duration: 0.4, ease: premiumEase }} />
            </motion.a>
          ))}
          <motion.button onClick={onGetStarted}
            className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px -10px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            Get Started
          </motion.button>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 dark:text-gray-200 focus:outline-none">
             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />}
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
          <div className="flex flex-col items-center py-4 space-y-4">
            {navLinks.map(link => <a key={link.name} href={link.href} onClick={(e) => { handleNavClick(e, link.href); setIsOpen(false);}} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2">{link.name}</a>)}
            <button onClick={onGetStarted} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md">Get Started</button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Hero Section
const HeroSection = ({ onGetStarted }) => (
    <section id="home" className="relative h-screen flex items-center justify-center text-center bg-cover bg-center overflow-hidden" style={{backgroundImage: "linear-gradient(to right, rgba(239, 246, 255, 0.95), rgba(219, 234, 254, 0.95)), url('https://images.unsplash.com/photo-1576091160550-217dba9996a?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3')"}}>
        <motion.div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full opacity-30 filter blur-xl"
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}/>
        <motion.div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-400 rounded-xl opacity-30 filter blur-xl transform rotate-45"
            animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [45, 55, 45] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}/>
        <div className="container mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: premiumEase }}>
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tighter">
                    Proactive Recovery, <br /> <span className="text-blue-600">Delivered Through WhatsApp.</span>
                </h1>
            </motion.div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: premiumEase }} className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                CareCompanion AI is your intelligent recovery assistant, simplifying post-hospital care through the app you already trust.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: premiumEase }}>
                <motion.button onClick={onGetStarted} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg"
                    whileHover={{ scale: 1.05, y: -3, boxShadow: "0 10px 20px -10px rgba(59, 130, 246, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                    Get Started
                </motion.button>
            </motion.div>
        </div>
    </section>
);


// About Section
const AboutSection = () => (
    <AnimatedSection id="about" className="bg-white dark:bg-gray-800">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
                <motion.div variants={{hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: premiumEase } }}}>
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">The Problem</h3>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900 dark:text-gray-100">The Silent Gap in Post-Hospital Care</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">For millions, especially elders, managing complex post-treatment plans is a major challenge, leading to missed medications, preventable complications, and stressful hospital readmissions.</p>
                </motion.div>
                <motion.div variants={{hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: premiumEase } }}} className="mt-10 bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-blue-900">
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">Our Solution</h3>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900 dark:text-gray-100">CareCompanion AI</h2>
                    <p className="text-gray-600 dark:text-gray-400">We provide an intelligent recovery assistant via WhatsApp. It's more than a reminder; it's a two-way conversation that makes care effortless.</p>
                </motion.div>
            </div>
            <motion.div variants={{hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: premiumEase, delay: 0.2 } }}} className="relative">
                <img src="https://images.unsplash.com/photo-1584515933487-779824d27929?q=80&w=1974&auto=format&fit=crop&ixlib-rb-4.0.3" alt="Doctor with patient" className="rounded-2xl shadow-2xl w-full h-auto object-cover"/>
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-blue-200 rounded-2xl -z-10 transform translate-x-4 translate-y-4"></div>
            </motion.div>
        </div>
    </AnimatedSection>
);

// Features Section
const FeaturesSection = () => {
    const features = [
        { icon: <Smartphone className="h-10 w-10 text-blue-600 dark:text-blue-400" />, title: 'Familiar Interface', description: 'Using WhatsApp eliminates the learning curve, ensuring high adoption rates among all age groups.' },
        { icon: <Bot className="h-10 w-10 text-blue-600 dark:text-blue-400" />, title: 'Conversational AI', description: 'Our AI understands context and provides empathetic, intelligent responses, making it a true companion.' },
        { icon: <Ear className="h-10 w-10 text-blue-600 dark:text-blue-400" />, title: 'Voice-First Design', description: 'Patients can interact using voice notes, ensuring accessibility for everyone, regardless of technical skill.' },
    ];
    const cardVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 }, hover: { y: -10, scale: 1.03, boxShadow: "0px 20px 40px -10px rgba(0,0,0,0.1)" } };

    return (
        <AnimatedSection id="features" className="bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-16 tracking-tight text-gray-900 dark:text-gray-100">Our Unfair Advantage</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={cardVariants} whileHover="hover" transition={{ type: 'spring', stiffness: 300 }} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg dark:shadow-2xl">
                            <motion.div whileHover={{ scale: 1.2, rotate: 15 }} className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto mb-6">{feature.icon}</motion.div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};

// Beneficiaries Section
const BeneficiariesSection = () => (
    <AnimatedSection id="beneficiaries" className="bg-white dark:bg-gray-800">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Who Benefits?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto mb-16">Our solution empowers everyone involved in the patient's recovery journey.</p>
            <div className="grid md:grid-cols-3 gap-8">
                <motion.div variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-xl border border-blue-100 dark:border-blue-900">
                    <Users className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Patients & Families</h3>
                    <p className="text-gray-600 dark:text-gray-400">Simplifies recovery plans and provides peace of mind through a reliable, automated system.</p>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} className="bg-green-50 dark:bg-green-900/20 p-8 rounded-xl border border-green-100 dark:border-green-900">
                    <HeartPulse className="h-10 w-10 text-green-600 dark:text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Doctors & Hospitals</h3>
                    <p className="text-gray-600 dark:text-gray-400">Enables early intervention with real-time data, drastically reducing costly readmissions.</p>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-xl border border-yellow-100 dark:border-yellow-900">
                    <Users className="h-10 w-10 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Caregivers</h3>
                    <p className="text-gray-600 dark:text-gray-400">Reduces the burden of care management by keeping them informed and connected automatically.</p>
                </motion.div>
            </div>
        </div>
    </AnimatedSection>
);

// Flowchart Section
const FlowchartSection = () => (
    <AnimatedSection id="flowchart" className="bg-blue-50 dark:bg-gray-900">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight text-gray-900 dark:text-gray-100">How It Works</h2>
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 }}} className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-2xl">
                <img src="https://i.imgur.com/r6pG2Z4.png" alt="Flowchart" className="rounded-lg w-full h-auto"/>
            </motion.div>
        </div>
    </AnimatedSection>
);

// AI Demo Section
const AIDemoSection = ({ addToast }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [activeQuestion, setActiveQuestion] = useState("");

    const questions = [
        "What is CareCompanion AI?",
        "How do I use voice notes?",
        "Is my data secure?",
        "Can my family see my progress?",
        "What if I forget a dose?",
    ];

    const FloatingIcon = ({ icon: Icon, className, duration, delay }) => (
      <motion.div
        className={`absolute text-blue-200/50 dark:text-blue-500/20 ${className}`}
        animate={{ y: [0, -10, 0], x: [0, 5, 0], rotate: [0, 10, 0] }}
        transition={{ duration: duration, repeat: Infinity, ease: "easeInOut", delay: delay }}
      >
        <Icon/>
      </motion.div>
    );

    const handleQuestionClick = async (question) => {
        if (isLoading) return;
        setIsLoading(true);
        setResponse("");
        setActiveQuestion(question);

        try {
            const systemPrompt = "You are CareCompanion AI, a friendly AI assistant. Answer the user's question about the CareCompanion AI service concisely and reassuringly. You are not a doctor. Do not give medical advice.";
            const apiKey = YOUR_API_KEY;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            
            const payload = { contents: [{ parts: [{ text: `Regarding CareCompanion AI, a user asks: "${question}"` }] }], systemInstruction: { parts: [{ text: systemPrompt }] } };

            const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error("API request failed");

            const result = await res.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                setResponse(text);
                addToast('success', 'AI response received!', 3000);
            } else {
                throw new Error("No response text found.");
            }
        } catch (error) {
            console.error(error);
            setResponse("Sorry, I couldn't get a response. Please try again. Make sure you have added your API key.");
            addToast('error', 'AI request failed.', 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatedSection id="demo" className="bg-white dark:bg-gray-800">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-gray-100"><Sparkles className="inline-block text-blue-500 mr-2 h-8 w-8" />AI Demo</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">Click a question to see how our AI responds.</p>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                        {questions.map((q) => (
                            <motion.button key={q} onClick={() => handleQuestionClick(q)}
                                disabled={isLoading}
                                className={`p-4 rounded-lg text-left transition-colors duration-200 w-full disabled:cursor-not-allowed font-medium text-gray-800 dark:text-gray-200 ${activeQuestion === q ? 'bg-blue-600 text-white dark:text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            >
                                {q}
                            </motion.button>
                        ))}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg min-h-[200px] flex items-center justify-center border dark:border-gray-700 relative overflow-hidden">
                        <FloatingIcon icon={Bot} className="top-4 left-4" duration={8} delay={0} />
                        <FloatingIcon icon={PlusCircle} className="bottom-8 right-12" duration={10} delay={1} />
                        <FloatingIcon icon={BrainCircuit} className="top-12 right-8" duration={9} delay={0.5} />
                        <FloatingIcon icon={HeartPulse} className="bottom-4 left-8" duration={11} delay={1.5} />
                        
                        {isLoading ? (
                             <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 z-10"><div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" /><span>AI is thinking...</span></div>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans z-10">{response || "Select a question to see the AI's answer here."}</p>
                        )}
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
};


// Footer
const Footer = () => (
    <footer className="bg-gray-900 text-white">
        <div className="container mx-auto py-12 px-6 text-center">
            <a href="#home" className="flex items-center justify-center space-x-2 mb-4">
                <HeartPulse className="text-blue-500 h-8 w-8" />
                <span className="font-bold text-xl">CareCompanion AI</span>
            </a>
            <p className="mb-4">Transforming recovery into a simple, guided conversation.</p>
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Team Zero. All rights reserved.</p>
        </div>
    </footer>
);


// --- CAPTCHA MODAL ---
const CaptchaModal = ({ onClose, onSuccess, addToast }) => {
    const [captcha, setCaptcha] = useState('');
    const [userInput, setUserInput] = useState('');

    const generateCaptcha = useCallback(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(result);
    }, []);

    useEffect(() => {
        generateCaptcha();
    }, [generateCaptcha]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userInput === captcha) {
            onSuccess();
        } else {
            addToast('error', 'Invalid CAPTCHA. Please try again.', 3000);
            generateCaptcha();
            setUserInput('');
        }
    };
    
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-sm relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X /></button>
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">Verification Required</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Please enter the text below to continue.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex items-center justify-center gap-4">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 text-center">
                            <span className="text-3xl font-bold tracking-widest select-none font-mono italic text-gray-900 dark:text-gray-100">{captcha}</span>
                        </div>
                        <button type="button" onClick={generateCaptcha} className="p-3 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"><RefreshCw /></button>
                    </div>
                    <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-center text-xl tracking-widest focus:border-blue-500 outline-none"
                        placeholder="Enter CAPTCHA" required
                    />
                    <motion.button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        Verify
                    </motion.button>
                </form>
                <div className="mt-6 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg flex items-center justify-center gap-3">
                    <Mail size={18} className="text-gray-400 dark:text-gray-500" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email & Google Sign-In Coming Soon!</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- TOAST COMPONENTS ---

const useToasts = () => {
    const [toasts, setToasts] = useState([]);
    const addToast = (type, message, duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message, duration }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    };
    return { toasts, addToast };
};

const ToastContainer = ({ toasts }) => (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-xs space-y-3">
        <AnimatePresence>
            {toasts.map(toast => <Toast key={toast.id} {...toast} />)}
        </AnimatePresence>
    </div>
);

const Toast = ({ type, message, duration }) => {
    const icons = {
        success: <CheckCircle className="text-green-500" />,
        error: <AlertTriangle className="text-red-500" />,
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-start space-x-4 relative overflow-hidden border border-gray-200 dark:border-gray-700"
        >
            <div>{icons[type]}</div>
            <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-100">{type === 'success' ? 'Success' : 'Error'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
            </div>
            <motion.div
                className="absolute bottom-0 left-0 h-1"
                style={{ background: type === 'success' ? '#22c55e' : '#ef4444' }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
            />
        </motion.div>
    );
};


// --- DASHBOARD PAGE ---

const DashboardPage = ({ setPage }) => {
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [demoKey, setDemoKey] = useState(0); // Add key to force re-render

    const restartDemo = () => {
      setDemoKey(prevKey => prevKey + 1);
    }

    return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-blue-900/50 font-sans antialiased flex items-center justify-center py-8 px-4"
    >
      <div className="w-full max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 text-center sm:text-left">
          <div>
            <h1 className="font-bold text-3xl md:text-4xl text-gray-900 dark:text-gray-100">Interactive WhatsApp Demo</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">Experience our AI in a simulated chat.</p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 sm:mt-0">
            <motion.button onClick={restartDemo}
                className="font-semibold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
                <RefreshCw size={16} /> Restart Demo
            </motion.button>
            <motion.button onClick={() => setPage('landing')} 
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-2"
                whileHover={{ x: -5 }}>
                <motion.span>←</motion.span> Back
            </motion.button>
          </div>
        </header>

        <main className="relative">
            <WhatsAppDemo key={demoKey} onLaunch={() => setShowComingSoon(true)} />
        </main>
      </div>

       <AnimatePresence>
        {showComingSoon && <ComingSoonModal onClose={() => setShowComingSoon(false)} />}
      </AnimatePresence>
    </motion.div>
  );
};

const useDeviceStatus = () => {
    const [status, setStatus] = useState({
        batteryLevel: 100,
        isCharging: false,
        networkType: 'wifi'
    });

    useEffect(() => {
        // Battery Status
        let battery;
        const updateBatteryStatus = () => {
            setStatus(prev => ({
                ...prev,
                batteryLevel: Math.round(battery.level * 100),
                isCharging: battery.charging
            }));
        };
        if ('getBattery' in navigator) {
            navigator.getBattery().then(bat => {
                battery = bat;
                updateBatteryStatus();
                battery.addEventListener('chargingchange', updateBatteryStatus);
                battery.addEventListener('levelchange', updateBatteryStatus);
            });
        }

        // Network Status
        const updateNetworkStatus = () => {
             if ('connection' in navigator) {
                setStatus(prev => ({ ...prev, networkType: navigator.connection.type }));
            }
        };
        if ('connection' in navigator) {
            updateNetworkStatus();
            navigator.connection.addEventListener('change', updateNetworkStatus);
        }

        return () => {
            if (battery) {
                battery.removeEventListener('chargingchange', updateBatteryStatus);
                battery.removeEventListener('levelchange', updateBatteryStatus);
            }
            if ('connection' in navigator) {
                navigator.connection.removeEventListener('change', updateNetworkStatus);
            }
        };
    }, []);

    return status;
}

const initialMessages = [
    { from: 'bot', type: 'text', content: "Hi there! I'm your CareCompanion AI. How are you feeling today?", timestamp: new Date() },
    { from: 'bot', type: 'text', content: "You can tell me about any symptoms you're experiencing.", timestamp: new Date() },
];

const LockedButton = ({ isFirst }) => {
    const [isHovered, setIsHovered] = useState(false);
    const tooltipPosition = isFirst ? 'left-0' : 'left-1/2 -translate-x-1/2';
    const Icon = isFirst ? PlusCircle : Mic;
    const featureName = isFirst ? "Attachments" : "Voice Note";
    
    return (
        <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <button className="text-gray-400 p-2 relative" disabled>
                <Icon size={24}/>
                <Lock size={12} className="absolute bottom-1 right-1 bg-gray-400 text-white rounded-full p-0.5" />
            </button>
            <AnimatePresence>
                {isHovered &&
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className={`absolute bottom-full mb-2 ${tooltipPosition} bg-black text-white text-xs rounded-md px-2 py-1 whitespace-nowrap z-10`}>
                        {featureName} (Coming Soon)
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}


const TypingIndicator = () => (
    <motion.div className="flex gap-1.5 items-center px-2">
        {[0, 1, 2].map(i => (
            <motion.span
                key={i}
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            />
        ))}
    </motion.div>
);

const WhatsAppDemo = ({ onLaunch }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState("");
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [currentTime, setCurrentTime] = useState('9:41 AM');
    const { batteryLevel, isCharging, networkType } = useDeviceStatus();
    
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isBotTyping) return;

        const userMessage = { from: 'user', type: 'text', content: inputValue, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsBotTyping(true);

        try {
            const systemPrompt = "You are CareCompanion AI. If the user mentions symptoms, acknowledge them and provide reassurance. If they just say hi, greet them back warmly. Keep responses concise. Do not give medical advice.";
            const apiKey = YOUR_API_KEY;
            const conversationalApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            
            const conversationalPayload = { contents: [{ parts: [{ text: inputValue }] }], systemInstruction: { parts: [{ text: systemPrompt }] } };

            const res = await fetch(conversationalApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(conversationalPayload) });
            if (!res.ok) throw new Error("Conversational API failed");

            const result = await res.json();
            const botReply = result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond, but I'm here to help!";
            
            setMessages(prev => [...prev, { from: 'bot', type: 'text', content: botReply, timestamp: new Date() }]);

            const symptomAnalysisPrompt = `Analyze: "${inputValue}". If symptoms are mentioned, list them as a JSON array. If not, return an empty array.`;
            const analysisApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
            const analysisPayload = {
                contents: [{ parts: [{ text: symptomAnalysisPrompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: { type: "OBJECT", properties: { symptoms: { type: "ARRAY", items: { type: "STRING" } } } },
                },
            };

            const analysisRes = await fetch(analysisApiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(analysisPayload) });
            if(analysisRes.ok) {
                const analysisResult = await analysisRes.json();
                const jsonText = analysisResult.candidates?.[0]?.content?.parts?.[0]?.text;
                if(jsonText) {
                    const parsed = JSON.parse(jsonText);
                    if(parsed.symptoms && parsed.symptoms.length > 0) {
                        await new Promise(res => setTimeout(res, 1500));
                        setMessages(prev => [...prev, { from: 'bot', type: 'analysis', content: `For my records, I've noted these symptoms and flagged them for your doctor.`, keywords: parsed.symptoms, timestamp: new Date() }]);
                    }
                }
            }
             
            await new Promise(res => setTimeout(res, 1500));
            setMessages(prev => [...prev, { from: 'bot', type: 'cta', timestamp: new Date() }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { from: 'bot', type: 'text', content: 'Sorry, an error occurred. Please ensure your API key is correct.', timestamp: new Date() }]);
        } finally {
            setIsBotTyping(false);
        }
    };
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const chatContainerRef = React.useRef(null);
    useEffect(() => {
        if(chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="relative max-w-sm mx-auto">
            <div className="bg-gray-800 p-2 sm:p-3 rounded-[40px] shadow-2xl border-4 border-gray-900">
                <div className="bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden flex flex-col h-[700px]">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 flex-shrink-0 relative">
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-900 dark:bg-gray-700"></div>
                        <div className="flex justify-between items-center text-xs font-bold text-gray-800 dark:text-gray-200">
                            <span>{currentTime}</span>
                            <div className="flex items-center gap-2">
                               {networkType === 'wifi' ? <Wifi size={14} /> : <Signal size={14} />}
                               <span className="font-medium">{batteryLevel}%</span>
                               {isCharging ? <BatteryCharging size={14} /> : <Battery size={14} />}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full p-2"><HeartPulse size={24} /></div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-gray-100">CareCompanion AI</h3>
                                <p className="text-xs text-green-600 dark:text-green-400">online</p>
                            </div>
                        </div>
                    </div>

                    <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 bg-cover custom-scrollbar relative" style={{ backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')" }}>
                        <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
                        <AnimatePresence>
                        {messages.map((msg, index) => {
                            if (msg.type === 'cta') {
                                return <motion.div key="cta" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center my-4"><motion.button onClick={onLaunch} whileHover={{ scale: 1.05 }} className="bg-green-500 text-white font-semibold py-2 px-5 rounded-full shadow-lg">Launch on WhatsApp (Coming Soon)</motion.button></motion.div>
                            }
                            const isBot = msg.from === 'bot';
                            return (
                                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-xs rounded-xl shadow-sm text-sm text-gray-800 dark:text-gray-200 ${isBot ? 'bg-white dark:bg-gray-700' : 'bg-green-100 dark:bg-green-800/50'}`}>
                                      <div className="p-2 pb-5 relative">
                                        {msg.type === 'analysis' ? (
                                            <div>
                                                <p className="break-words">{msg.content}</p>
                                                <div className="mt-2 text-xs border-t dark:border-gray-600 pt-2 flex flex-wrap gap-1">
                                                    <strong className="dark:text-gray-300">Keywords:</strong>
                                                    {msg.keywords.map(kw => ( <span key={kw} className="bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded-md font-medium capitalize">{kw}</span>))}
                                                </div>
                                            </div>
                                        ) : ( <p className="break-words">{msg.content}</p> )}
                                        <span className="absolute bottom-1.5 right-2 text-[10px] text-gray-500 dark:text-gray-400">{msg.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                                       </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                        {isBotTyping && <motion.div key="typing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start mb-3"><div className="bg-white dark:bg-gray-700 rounded-full py-3 px-4 shadow-sm"><TypingIndicator /></div></motion.div>}
                        </AnimatePresence>
                    </div>

                    <form onSubmit={handleSendMessage} className="bg-gray-100 dark:bg-gray-800 p-2 flex items-center gap-2 flex-shrink-0">
                        <LockedButton icon={PlusCircle} featureName="Attachments" isFirst={true} />
                        <LockedButton icon={Mic} featureName="Voice Note" />
                        <input type="text" placeholder="Type your symptoms..." 
                            value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                            className="flex-grow bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full py-2 px-4 text-sm outline-none disabled:bg-gray-700 dark:disabled:bg-gray-600 transition-all" 
                            disabled={isBotTyping} />
                        <button type="submit" className="bg-green-500 text-white rounded-full p-2 disabled:bg-gray-400 transition-all" disabled={!inputValue.trim() || isBotTyping}><Send size={20}/></button>
                    </form>
                </div>
            </div>
            <div className="absolute top-24 -left-1.5 flex-col gap-y-2 hidden md:flex">
              <div className="h-12 w-1.5 bg-gray-600 rounded-l-md"></div>
              <div className="h-12 w-1.5 bg-gray-600 rounded-l-md"></div>
            </div>
            <div className="absolute top-32 -right-1.5 h-20 w-1.5 bg-gray-600 rounded-r-md hidden md:flex"></div>
        </div>
    )
};

const ComingSoonModal = ({ onClose }) => {
    return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <motion.div 
            initial={{ scale: 0.7, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.7, opacity: 0 }} 
            transition={{ type: 'spring', stiffness: 400, damping: 25 }} 
            className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md relative text-center overflow-hidden"
        >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-20"><X /></button>
            <div className="relative z-10 flex flex-col items-center justify-center h-full py-8">
                 <motion.div 
                    className="relative w-24 h-24"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
                 >
                    <motion.div 
                        className="absolute inset-0 bg-blue-500 rounded-full"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3]}} 
                        transition={{duration: 2.5, repeat: Infinity, ease: 'easeInOut'}}
                    />
                    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <motion.path 
                            d="M22 12H18L15 21L9 3L6 12H2" 
                            stroke="#3B82F6" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </svg>
                </motion.div>
                
                <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="text-4xl font-bold text-gray-800 mt-6 mb-4"
                >
                    Launching Soon
                </motion.h2>

                <motion.p 
                    className="text-gray-600 max-w-sm mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                >
                    Our AI-powered WhatsApp integration is in the final stages of development. Stay tuned for the future of proactive healthcare!
                </motion.p>
            </div>
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-200 rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>
        </motion.div>
    </motion.div>
);
};

