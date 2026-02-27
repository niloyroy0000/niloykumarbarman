"use client";
import { lazy, Suspense, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PERFORMANCE_VARIANTS } from "@/constants";
import { useState } from "react";
import FormSection from "@/components/FormSection";
import BackgroundElements from "@/components/BackgroundElements";
import { fetchPortfolioMetadata } from "@/lib/api-client";

// Import icons from centralized Iconify library
// Note: Iconify loads icons on-demand, so no need for React.lazy
import {
  FaEnvelope,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLinkedinIn,
  FaGithub,
  FaMedium,
  FaLock,
  FaCopy,
  FaCheck,
  FaClock,
  FaUser,
  FaAt,
  FaPhone,
  FaComment,
  FaCode,
  FaCloud,
  FaMagic,
  FaHandshake,
  BsMicrosoftTeams
} from "@/lib/icons";

// Loading fallback components
const IconFallback = ({ className }: { className?: string }) => (
  <div className={`w-4 h-4 bg-secondary-default/30 rounded animate-pulse ${className}`} />
);

// RATE_LIMIT constants (to avoid importing the entire constants file)
const RATE_LIMIT = {
  MAX_ATTEMPTS: 5,
  WINDOW_MS: 900000, // 15 minutes
  BLOCK_DURATION_MS: 3600000, // 1 hour
};

// LocalStorage key for form auto-save
const FORM_STORAGE_KEY = 'contact_form_draft';

// Message character limits
const MESSAGE_LIMITS = {
  MIN: 10,
  MAX: 2000,
};

// Form validation schema (simplified to avoid zod import overhead)
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  firstName?: { message: string };
  lastName?: { message: string };
  email?: { message: string };
  phone?: { message: string };
  message?: { message: string };
}

// Real-time field validators (return true if valid)
const fieldValidators = {
  firstName: (value: string) => value.trim().length >= 2,
  lastName: (value: string) => value.trim().length >= 2,
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value: string) => value.length === 0 || value.length >= 10, // Optional field
  message: (value: string) => value.trim().length >= 10,
};

const validateForm = (data: FormData) => {
  const errors: FormErrors = {};

  if (!data.firstName || data.firstName.length < 2) {
    errors.firstName = { message: "First name must be at least 2 characters" };
  }
  if (!data.lastName || data.lastName.length < 2) {
    errors.lastName = { message: "Last name must be at least 2 characters" };
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = { message: "Please enter a valid email address" };
  }
  if (data.phone && data.phone.length > 0 && data.phone.length < 10) {
    errors.phone = { message: "Please enter a valid phone number" };
  }
  if (!data.message || data.message.length < 10) {
    errors.message = { message: "Message must be at least 10 characters" };
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

// Fallback default values (used if API fails or data is not available)
const DEFAULT_CONTACT_INFO = {
  phone: "+880 01766644823",
  email: "niloybarman829@gmail.com",
  teams: "niloybarman829@gmail.com",
  location: "Dhaka, Bangladesh",
};

const DEFAULT_SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/niloy-barman-552634339/",
  github: "https://github.com/niloyroy0000",
  medium: "https://github.com/niloyroy0000",
};

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [portfolioMetadata, setPortfolioMetadata] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Honeypot field for spam prevention (bots will fill this, humans won't see it)
  const [honeypot, setHoneypot] = useState('');

  // Copy feedback toast state
  const [copyToast, setCopyToast] = useState<{ show: boolean; text: string }>({ show: false, text: '' });

  // Copy to clipboard handler
  const handleCopy = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyToast({ show: true, text: `${label} copied!` });
      setTimeout(() => setCopyToast({ show: false, text: '' }), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyToast({ show: true, text: `${label} copied!` });
      setTimeout(() => setCopyToast({ show: false, text: '' }), 2000);
    }
  }, []);

  // Simple rate limiting (client-side only)
  const [attempts, setAttempts] = useState(0);
  const [lastAttempt, setLastAttempt] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  // Load saved form data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      }
    } catch {
      // Silently fail if localStorage is not available
    }
  }, []);

  // Save form data to localStorage (debounced via useCallback)
  const saveToLocalStorage = useCallback((data: FormData) => {
    try {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, []);

  // Clear localStorage on successful submission
  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
    } catch {
      // Silently fail
    }
  }, []);

  // Fetch portfolio metadata for contact info
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await fetchPortfolioMetadata();
        setPortfolioMetadata(data);
      } catch (error) {
        console.error('Failed to load portfolio metadata:', error);
        // Fallback to hardcoded values if API fails
      }
    };
    loadMetadata();
  }, []);

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (submitStatus === 'success') {
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  // Check if form has any data
  const hasFormData = Object.values(formData).some(value => value.trim() !== '');

  // Check if form is valid (all required fields pass validation)
  const isFormValid =
    fieldValidators.firstName(formData.firstName) &&
    fieldValidators.lastName(formData.lastName) &&
    fieldValidators.email(formData.email) &&
    fieldValidators.phone(formData.phone) &&
    fieldValidators.message(formData.message);

  // Calculate form completion progress (0-100%)
  const formProgress = (() => {
    let progress = 0;
    const requiredFields = ['firstName', 'lastName', 'email', 'message'];
    const weights = { firstName: 20, lastName: 20, email: 25, phone: 10, message: 25 };

    if (fieldValidators.firstName(formData.firstName)) progress += weights.firstName;
    if (fieldValidators.lastName(formData.lastName)) progress += weights.lastName;
    if (fieldValidators.email(formData.email)) progress += weights.email;
    if (formData.phone.length > 0 && fieldValidators.phone(formData.phone)) progress += weights.phone;
    if (fieldValidators.message(formData.message)) progress += weights.message;

    return Math.min(progress, 100);
  })();

  // Dynamic contact info (with fallback to defaults if API fails)
  const phone = portfolioMetadata?.contactInfo?.phone || DEFAULT_CONTACT_INFO.phone;
  const email = portfolioMetadata?.contactEmail || DEFAULT_CONTACT_INFO.email;
  const teams = portfolioMetadata?.contactInfo?.teams || DEFAULT_CONTACT_INFO.teams;
  const location = portfolioMetadata?.contactInfo?.location || DEFAULT_CONTACT_INFO.location;

  const info = [
    {
      icon: FaPhoneAlt,
      title: "Phone & WhatsApp",
      description: phone,
      color: "from-secondary-default/10 to-blue-500/10",
      borderColor: "border-secondary-default/30",
      textColor: "text-secondary-default",
      hoverColor: "hover:bg-secondary-default/20 hover:border-secondary-default/50",
      testId: "contact-info-phone",
      clickable: true,
      action: () => window.open(`tel:${phone}`, "_self"),
      actionLabel: "Call or WhatsApp",
      copyable: true,
      copyText: phone,
      copyLabel: "Phone"
    },
    {
      icon: FaEnvelope,
      title: "Email",
      description: email,
      color: "from-blue-500/10 to-purple-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      hoverColor: "hover:bg-blue-500/20 hover:border-blue-500/50",
      testId: "contact-info-email",
      clickable: true,
      action: () => window.open(`mailto:${email}`, "_self"),
      actionLabel: "Send Email",
      copyable: true,
      copyText: email,
      copyLabel: "Email"
    },
    {
      icon: BsMicrosoftTeams,
      title: "Microsoft Teams",
      description: teams,
      color: "from-purple-500/10 to-secondary-default/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      hoverColor: "hover:bg-purple-500/20 hover:border-purple-500/50",
      testId: "contact-info-teams",
      clickable: true,
      action: () => {
        // Try to open Teams app first, fallback to web version
        const teamsAppUrl = `msteams://l/chat/0/0?users=${teams}`;
        const teamsWebUrl = `https://teams.microsoft.com/l/chat/0/0?users=${teams}`;

        // Attempt to open Teams app
        window.location.href = teamsAppUrl;

        // Fallback to web version after a brief delay if app doesn't open
        setTimeout(() => {
          window.open(teamsWebUrl, "_blank");
        }, 1000);
      },
      actionLabel: "Start Teams Chat",
      copyable: true,
      copyText: teams,
      copyLabel: "Teams ID"
    },
    {
      icon: FaMapMarkedAlt,
      title: "Address",
      description: location,
      color: "from-emerald-500/10 to-blue-500/10",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      hoverColor: "hover:bg-emerald-500/20 hover:border-emerald-500/50",
      testId: "contact-info-address",
      clickable: true,
      action: () => window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`, "_blank"),
      actionLabel: "View on Map",
      copyable: false
    },
  ];

  // Dynamic social links (with fallback to defaults if API fails)
  const linkedinUrl = portfolioMetadata?.socialLinks?.linkedin || DEFAULT_SOCIAL_LINKS.linkedin;
  const githubUrl = portfolioMetadata?.socialLinks?.github || DEFAULT_SOCIAL_LINKS.github;
  const mediumUrl = portfolioMetadata?.socialLinks?.medium || DEFAULT_SOCIAL_LINKS.medium;

  const socialLinks = [
    {
      icon: FaLinkedinIn,
      title: "LinkedIn",
      url: linkedinUrl,
      color: "bg-[#0077B5]/20 hover:bg-[#0077B5]/30",
      textColor: "text-[#0077B5]",
      borderColor: "border-[#0077B5]/30 hover:border-[#0077B5]/50"
    },
    {
      icon: FaGithub,
      title: "GitHub",
      url: githubUrl,
      color: "bg-white/10 hover:bg-white/20",
      textColor: "text-white",
      borderColor: "border-white/30 hover:border-white/50"
    },
    {
      icon: FaMedium,
      title: "Medium",
      url: mediumUrl,
      color: "bg-[#00AB6C]/20 hover:bg-[#00AB6C]/30",
      textColor: "text-[#00AB6C]",
      borderColor: "border-[#00AB6C]/30 hover:border-[#00AB6C]/50"
    },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Auto-save to localStorage
    saveToLocalStorage(newData);

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Reset form handler
  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    });
    setFormErrors({});
    clearLocalStorage();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, silently "succeed" (bots won't know they failed)
    if (honeypot) {
      setSubmitStatus('success');
      setSubmitMessage('Thank you! Your message has been sent successfully. I will get back to you soon.');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      clearLocalStorage();
      return;
    }

    // Client-side rate limiting
    const now = Date.now();
    if (now - lastAttempt < RATE_LIMIT.WINDOW_MS && attempts >= RATE_LIMIT.MAX_ATTEMPTS) {
      setIsBlocked(true);
      setSubmitStatus('error');
      setSubmitMessage('Too many attempts. Please try again later.');
      return;
    }

    // Validate form
    const { errors, isValid } = validateForm(formData);
    setFormErrors(errors);

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Record attempt
      setAttempts(prev => prev + 1);
      setLastAttempt(now);

      // PageClip form submission
      const PAGECLIP_API_KEY = process.env.NEXT_PUBLIC_PAGECLIP_API_KEY;
      
      if (!PAGECLIP_API_KEY) {
        throw new Error('PageClip API key not found. Please check your environment variables.');
      }

      const response = await fetch(`https://send.pageclip.co/${PAGECLIP_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone || 'Not provided',
          message: formData.message,
          subject: `New contact form submission from ${formData.firstName} ${formData.lastName}`,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your message has been sent successfully. I will get back to you soon.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
        clearLocalStorage(); // Clear saved draft on success
        setAttempts(0); // Reset on success
        setIsBlocked(false);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Something went wrong. Please try again or contact me directly via email (biswajitmailid@gmail.com).');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      data-testid="contact-page"
      className="min-h-[calc(100vh-136px)] flex flex-col relative overflow-hidden py-6 pb-12 xl:pb-16"
    >
      {/* Background Elements - Using shared component for consistency */}
      <BackgroundElements
        floatingDots={[
          {
            size: "md",
            color: "secondary",
            animation: "ping",
            position: { top: "20%", right: "10%" },
            opacity: 60
          },
          {
            size: "sm",
            color: "blue",
            animation: "pulse",
            position: { bottom: "25%", left: "15%" },
            opacity: 40
          },
          {
            size: "sm",
            color: "secondary",
            animation: "bounce",
            position: { top: "35%", left: "8%" },
            opacity: 50
          }
        ]}
      />

      {/* Floating gradient orbs */}
      <div className="absolute top-40 left-20 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-secondary-default/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section - Left Aligned like Projects/Certifications */}
        <motion.div
          data-testid="contact-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex-1">
            <h1 className="text-3xl xl:text-4xl font-bold mb-2 leading-tight bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-sm font-medium leading-relaxed">
              <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Let&apos;s collaborate and bring your{" "}
              </span>
              <span className="text-lg font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                vision to life
              </span>
              <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}together
              </span>
            </p>
          </div>
        </motion.div>

        {/* What I Can Help With - Services Section */}
        <motion.div
          variants={PERFORMANCE_VARIANTS.containerSync}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <div className="bg-gray-900/50 border border-secondary-default/20 rounded-lg p-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: FaCode, label: "Full-Stack Development", desc: ".NET, React, Node.js", color: "from-[#00BFFF] to-[#0080FF]", bgColor: "bg-[#00BFFF]/10", borderColor: "border-[#00BFFF]/20", iconBg: "bg-[#00BFFF]/20", iconColor: "text-[#00BFFF]" },
                { icon: FaCloud, label: "Cloud Architecture", desc: "Azure, AWS, DevOps", color: "from-purple-400 to-pink-500", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/20", iconBg: "bg-purple-500/20", iconColor: "text-purple-400" },
                { icon: FaMagic, label: "AI Integration", desc: "LLMs, Automation", color: "from-emerald-400 to-cyan-500", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20", iconBg: "bg-emerald-500/20", iconColor: "text-emerald-400" },
                { icon: FaHandshake, label: "Technical Consulting", desc: "Architecture, Mentoring", color: "from-amber-400 to-orange-500", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/20", iconBg: "bg-amber-500/20", iconColor: "text-amber-400" },
              ].map((service, index) => (
                <motion.div
                  key={service.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  className={`group flex items-center gap-3 p-4 ${service.bgColor} border ${service.borderColor} rounded-lg hover:scale-[1.02] transition-all duration-300 cursor-default`}
                >
                  <div className={`p-2 ${service.iconBg} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Suspense fallback={<IconFallback />}>
                      <service.icon className={`text-lg ${service.iconColor}`} aria-hidden="true" />
                    </Suspense>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold bg-gradient-to-r ${service.color} bg-clip-text text-transparent truncate`}>{service.label}</p>
                    <p className="text-xs text-white/50 truncate">{service.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={PERFORMANCE_VARIANTS.containerSync}
          initial="hidden"
          animate="visible"
          className="flex flex-col xl:flex-row gap-8"
        >
          {/* Contact Form - Now appears FIRST on mobile (order-1) */}
          <motion.div
            variants={PERFORMANCE_VARIANTS.cardSync}
            className="xl:w-[54%] order-1 xl:order-none"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-secondary-default/20">
              <motion.div
                variants={PERFORMANCE_VARIANTS.fadeInFast}
                className="mb-6"
              >
                <h1 className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent mb-4">
                  Let&apos;s work together
                </h1>
                <p className="text-white/70 leading-relaxed">
                  Ready to bring your vision to life? Tell me about your project and let&apos;s create something extraordinary together.
                </p>
              </motion.div>

              {/* Progress Indicator */}
              {hasFormData && submitStatus !== 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-white/60">Form Completion</span>
                    <span className={`text-xs font-medium ${
                      formProgress === 100 ? 'text-emerald-400' : formProgress >= 50 ? 'text-[#00BFFF]' : 'text-white/60'
                    }`}>
                      {formProgress}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${formProgress}%` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`h-full rounded-full transition-colors duration-300 ${
                        formProgress === 100
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                          : formProgress >= 50
                          ? 'bg-gradient-to-r from-[#00BFFF] to-purple-500'
                          : 'bg-gradient-to-r from-white/40 to-white/60'
                      }`}
                    />
                  </div>
                  {formProgress === 100 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-emerald-400 mt-1"
                    >
                      ✓ Ready to submit!
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* Rate Limit Warning */}
              {isBlocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 rounded border bg-red-500/10 border-red-500/30 text-red-300 flex items-center gap-3"
                >
                  <Suspense fallback={<IconFallback />}>
                    <FaExclamationTriangle className="text-red-400 flex-shrink-0" />
                  </Suspense>
                  <div>
                    <p className="text-sm font-medium">Rate limit exceeded</p>
                    <p className="text-xs text-red-400">
                      Please try again later.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Submit Status Messages */}
              {submitStatus !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
                    submitStatus === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  <Suspense fallback={<IconFallback />}>
                    {submitStatus === 'success' ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.1
                        }}
                      >
                        <FaCheckCircle className="text-emerald-400 text-xl flex-shrink-0" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <FaExclamationTriangle className="text-red-400 text-xl flex-shrink-0" />
                      </motion.div>
                    )}
                  </Suspense>
                  <div className="flex-1">
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm font-medium"
                    >
                      {submitStatus === 'success' ? 'Message Sent!' : 'Error'}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-xs opacity-80"
                    >
                      {submitMessage}
                    </motion.p>
                    {/* Send another message CTA */}
                    {submitStatus === 'success' && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => {
                          setSubmitStatus('idle');
                          setSubmitMessage('');
                        }}
                        className="text-xs text-emerald-300 hover:text-emerald-200 underline underline-offset-2 mt-2 transition-colors"
                      >
                        Send another message →
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field - hidden from users, bots will fill it */}
                <div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <FormSection
                  layout="grid"
                  fields={[
                    {
                      name: "firstName",
                      label: "First Name",
                      type: "text",
                      placeholder: "Enter your first name",
                      required: true,
                      value: formData.firstName,
                      error: formErrors.firstName?.message,
                      icon: FaUser,
                      isValid: fieldValidators.firstName(formData.firstName),
                      hint: "Min 2 characters"
                    },
                    {
                      name: "lastName",
                      label: "Last Name",
                      type: "text",
                      placeholder: "Enter your last name",
                      required: true,
                      value: formData.lastName,
                      error: formErrors.lastName?.message,
                      icon: FaUser,
                      isValid: fieldValidators.lastName(formData.lastName),
                      hint: "Min 2 characters"
                    },
                    {
                      name: "email",
                      label: "Email Address",
                      type: "email",
                      placeholder: "your.email@example.com",
                      required: true,
                      value: formData.email,
                      error: formErrors.email?.message,
                      icon: FaAt,
                      isValid: fieldValidators.email(formData.email),
                      hint: "Valid email required"
                    },
                    {
                      name: "phone",
                      label: "Phone Number",
                      type: "tel",
                      placeholder: "Enter your phone number",
                      required: false,
                      value: formData.phone,
                      error: formErrors.phone?.message,
                      icon: FaPhone,
                      isValid: fieldValidators.phone(formData.phone),
                      hint: "Optional - min 10 digits if provided"
                    },
                    {
                      name: "message",
                      label: "Message",
                      type: "textarea",
                      placeholder: "Tell me about your project, goals, and how I can help you achieve them...",
                      required: true,
                      value: formData.message,
                      error: formErrors.message?.message,
                      rows: 6,
                      maxLength: MESSAGE_LIMITS.MAX,
                      icon: FaComment,
                      isValid: fieldValidators.message(formData.message),
                      hint: "Min 10 characters"
                    }
                  ]}
                  onFieldChange={(fieldName, value) => handleInputChange(fieldName as keyof FormData, value)}
                >
                  {/* Character counter for message */}
                  <div className="flex justify-between items-center text-xs mb-4 -mt-4">
                    <span className={`${
                      formData.message.length < MESSAGE_LIMITS.MIN
                        ? 'text-white/40'
                        : 'text-emerald-400'
                    }`}>
                      {formData.message.length < MESSAGE_LIMITS.MIN
                        ? `${MESSAGE_LIMITS.MIN - formData.message.length} more characters needed`
                        : 'Minimum reached'
                      }
                    </span>
                    <span className={`${
                      formData.message.length > MESSAGE_LIMITS.MAX * 0.9
                        ? 'text-amber-400'
                        : 'text-white/40'
                    }`}>
                      {formData.message.length}/{MESSAGE_LIMITS.MAX}
                    </span>
                  </div>
                  {/* Form Actions */}
                  <div className="flex items-center gap-3">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || isBlocked || !isFormValid}
                      className="bg-gradient-to-r from-secondary-default to-blue-500 hover:from-blue-500 hover:to-secondary-default text-primary font-semibold px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Suspense fallback={<IconFallback />}>
                            <FaPaperPlane className="mr-2" />
                          </Suspense>
                          Send Message
                        </>
                      )}
                    </Button>

                    {/* Conditional Reset Button - only shows when form has data */}
                    {hasFormData && (
                      <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        onClick={handleReset}
                        className="border-white/20 hover:border-white/40 hover:bg-white/5 text-white/70 hover:text-white px-6 py-3 rounded-lg transition-all duration-300"
                      >
                        Reset
                      </Button>
                    )}
                  </div>

                  {/* Trust Indicator */}
                  <div className="flex items-center gap-2 text-white/50 text-xs mt-2">
                    <Suspense fallback={<IconFallback />}>
                      <FaLock className="text-emerald-400/70" />
                    </Suspense>
                    <span>Your information is secure and will never be shared</span>
                  </div>
                </FormSection>
              </form>
            </div>
          </motion.div>

          {/* Contact Information - Appears SECOND on mobile (order-2) */}
          <motion.div
            variants={PERFORMANCE_VARIANTS.cardSync}
            className="flex-1 flex items-start xl:justify-end order-2 xl:order-none"
          >
            <div className="w-full xl:max-w-md">
              <motion.h3
                variants={PERFORMANCE_VARIANTS.slideUpSync}
                className="text-2xl xl:text-3xl font-bold mb-6 text-left bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent"
              >
                Contact Information
              </motion.h3>

              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                {info.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    className={`group relative bg-gradient-to-r ${item.color} backdrop-blur-sm border ${item.borderColor} p-4 rounded ${item.hoverColor} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                      item.clickable ? 'cursor-pointer' : ''
                    }`}
                    onClick={item.clickable ? item.action : undefined}
                    role={item.clickable ? 'button' : undefined}
                    tabIndex={item.clickable ? 0 : undefined}
                    onKeyDown={item.clickable ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.action();
                      }
                    } : undefined}
                    aria-label={item.clickable ? item.actionLabel : undefined}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 ${item.textColor} rounded flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-xl">
                          <Suspense fallback={<IconFallback />}>
                            <item.icon />
                          </Suspense>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/60 text-sm font-medium mb-1">{item.title}</p>
                        <h4 className="text-white font-semibold text-sm truncate">{item.description}</h4>
                        {item.clickable && (
                          <p className="text-white/50 text-xs mt-1 group-hover:text-white/70 transition-colors duration-300">
                            Click to {item.actionLabel?.toLowerCase()}
                          </p>
                        )}
                      </div>
                      {/* Action buttons container */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Copy button */}
                        {item.copyable && (
                          <div className="relative group/copy">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(item.copyText!, item.copyLabel!);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-white/10 rounded-lg"
                              aria-label={`Copy ${item.copyLabel}`}
                            >
                              <Suspense fallback={<IconFallback />}>
                                <FaCopy className="w-3.5 h-3.5 text-white/60 hover:text-white transition-colors" />
                              </Suspense>
                            </button>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover/copy:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                              Copy {item.copyLabel}
                            </div>
                          </div>
                        )}
                        {/* Action indicator */}
                        {item.clickable && (
                          <div className="relative group/action">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center hover:border-white/50 hover:bg-white/5 transition-all">
                                <div className="w-2 h-2 rounded-full bg-white/50"></div>
                              </div>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover/action:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                              {item.actionLabel}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Media Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <h4 className="text-lg font-semibold mb-4 text-white/80">Connect on Social</h4>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.title}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                      className={`w-12 h-12 ${social.color} border ${social.borderColor} rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110`}
                      aria-label={`Visit ${social.title} profile`}
                    >
                      <Suspense fallback={<IconFallback />}>
                        <social.icon className={`text-xl ${social.textColor}`} />
                      </Suspense>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Availability & Response Time */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.4 }}
                className="mt-8 pt-6 border-t border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-emerald-400 text-sm font-medium">Available for Projects</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Suspense fallback={<IconFallback />}>
                    <FaClock className="text-secondary-default/70" />
                  </Suspense>
                  <span>Usually responds within 24 hours</span>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Copy Toast Notification */}
      {copyToast.show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-2.5 rounded-lg shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
            <Suspense fallback={<IconFallback />}>
              <FaCheck className="w-4 h-4" />
            </Suspense>
            <span className="text-sm font-medium">{copyToast.text}</span>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default Contact;
