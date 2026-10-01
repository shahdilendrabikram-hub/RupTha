import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    openAuthModal,
    login,
    register
  } = useAuth();

  const { showToast } = useToast();

  const [email, setEmail] = useState('shahdilendrabikram@gmail.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Dilendra Shah');
  const [phone, setPhone] = useState('+1 (555) 839-2041');
  const [otpCode, setOtpCode] = useState(['4', '8', '2', '0']);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (authModalTab === 'login') {
        await login(email, 'customer');
      } else if (authModalTab === 'register') {
        await register(name, email);
      } else if (authModalTab === 'forgot') {
        setResetSent(true);
        showToast('Password reset link sent to ' + email, 'info');
      } else if (authModalTab === 'otp') {
        showToast('Mobile phone number verified successfully!', 'success');
        closeAuthModal();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (asRole: 'customer' | 'admin') => {
    setIsSubmitting(true);
    if (asRole === 'admin') {
      await login('admin@rupthabazzar.com', 'admin');
    } else {
      await login('shahdilendrabikram@gmail.com', 'customer');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-500 items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-3 font-extrabold text-2xl">
            R
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {authModalTab === 'login' && 'Welcome Back to Ruptha Bazzar'}
            {authModalTab === 'register' && 'Create Your Ruptha Bazzar Account'}
            {authModalTab === 'forgot' && 'Reset Your Password'}
            {authModalTab === 'otp' && 'Verify Mobile Phone'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {authModalTab === 'login' && 'Sign in to access orders, wishlist, and rewards.'}
            {authModalTab === 'register' && 'Join today and get 200 Reward Points immediately!'}
            {authModalTab === 'forgot' && 'Enter your email to receive recovery instructions.'}
            {authModalTab === 'otp' && 'Enter the 4-digit code sent via SMS.'}
          </p>
        </div>

        {/* Tab Switcher for Login / Register */}
        {(authModalTab === 'login' || authModalTab === 'register') && (
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-6">
            <button
              onClick={() => openAuthModal('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authModalTab === 'login'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authModalTab === 'register'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Register (+200 Pts)
            </button>
          </div>
        )}

        {/* Reset Confirmation Notice */}
        {authModalTab === 'forgot' && resetSent ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-center space-y-3 mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
              Reset Link Dispatched
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              We've dispatched recovery instructions to <strong>{email}</strong>. Check your inbox and spam folder.
            </p>
            <button
              onClick={() => openAuthModal('login')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 underline"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalTab === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Dilendra Shah"
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {(authModalTab === 'login' || authModalTab === 'register' || authModalTab === 'forgot') && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {(authModalTab === 'login' || authModalTab === 'register') && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Password
                  </label>
                  {authModalTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => openAuthModal('forgot')}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {authModalTab === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Mobile Number (for SMS Tracking Updates)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {authModalTab === 'otp' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 text-center">
                  Verification Code
                </label>
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map(idx => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={otpCode[idx] || ''}
                      onChange={e => {
                        const next = [...otpCode];
                        next[idx] = e.target.value;
                        setOtpCode(next);
                      }}
                      className="w-12 h-14 text-center text-xl font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none"
                    />
                  ))}
                </div>
              </div>
            )}

            {authModalTab === 'login' && (
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember me for 30 days</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <span>
                {authModalTab === 'login' && 'Sign In to Ruptha Bazzar'}
                {authModalTab === 'register' && 'Complete Registration'}
                {authModalTab === 'forgot' && 'Send Recovery Email'}
                {authModalTab === 'otp' && 'Verify Code'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Demo Fast Access Buttons & Google Login Simulation */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
            Instant Demo Sign-In
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('customer')}
              className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-indigo-500" />
              <span>Customer Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="py-2.5 px-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1.5 transition-colors border border-amber-200/50"
            >
              <span>Admin Suite Demo</span>
            </button>
          </div>

          {/* Social Google Login Button */}
          <button
            type="button"
            onClick={() => handleDemoLogin('customer')}
            className="w-full py-2.5 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.1-6.67-4.93H1.28v3.13C3.26 21.3 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.33 14.27A7.16 7.16 0 0 1 4.95 12c0-.79.14-1.56.38-2.27V6.6H1.28A11.97 11.97 0 0 0 0 12c0 1.92.45 3.74 1.28 5.4l4.05-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.7 1.28 6.6l4.05 3.13C6.27 6.87 8.9 4.77 12 4.77z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
