
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signIn, signUp } from '../services/supabaseClient';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        await signIn(email, password);
        onLoginSuccess();
      } else {
        await signUp(email, password);
        // Switch to login mode and show success message
        setIsLogin(true);
        setSuccessMessage("Account created successfully! Please sign in.");
        setPassword(''); // Clear password field for security
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-earth-200/50 border border-white p-8 sm:p-10 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2 
            }}
            className="w-16 h-16 bg-gradient-to-br from-leaf-400 to-leaf-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-leaf-200 mb-4"
          >
            <Sprout size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-earth-800 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join LeafLink'}
          </h1>
          <p className="text-earth-500 mt-2 text-center">
            {isLogin ? 'Sign in to access your garden' : 'Create your digital garden today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-earth-600 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400 group-focus-within:text-leaf-500 transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-earth-50 border border-earth-200 focus:border-leaf-400 focus:ring-2 focus:ring-leaf-200 outline-none transition-all placeholder-earth-300"
                  placeholder="hello@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-earth-600 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400 group-focus-within:text-leaf-500 transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-earth-50 border border-earth-200 focus:border-leaf-400 focus:ring-2 focus:ring-leaf-200 outline-none transition-all placeholder-earth-300"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-xl bg-rose-50 text-rose-600 text-sm flex items-center gap-2 overflow-hidden"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-xl bg-leaf-50 text-leaf-700 text-sm flex items-center gap-2 overflow-hidden"
              >
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-leaf-600 hover:bg-leaf-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-leaf-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccessMessage(null);
            }}
            className="text-sm text-earth-500 hover:text-leaf-600 transition-colors font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
