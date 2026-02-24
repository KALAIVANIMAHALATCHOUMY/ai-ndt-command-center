import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, Zap } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate("/modality");
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background grid-bg">
      {/* Scan line animation */}
      <div className="scan-line" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 40%, hsl(186 100% 50% / 0.08), transparent 60%)"
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-xl border border-primary/30 bg-secondary mb-6 glow-cyan"
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Industrial NDT AI Inspection System
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            Multi-Modality Defect Detection Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                Operator ID / Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-4 py-3 text-foreground text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="operator@ndt-systems.com"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                Access Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-muted border border-border rounded-md px-4 py-3 text-foreground text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-display font-semibold py-3 rounded-md hover:bg-primary/90 transition-all glow-cyan disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 animate-pulse-glow" />
                  Authenticating...
                </span>
              ) : (
                "Access System"
              )}
            </button>
          </form>

          {/* Status indicators */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-ndt-success animate-pulse-glow" />
              System Online
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3 h-3" />
              v3.2.1
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-mono">
          Secured by AES-256 • ISO 9712 Compliant
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
