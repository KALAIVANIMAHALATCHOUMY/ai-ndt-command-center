import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const steps = [
  "Image Preprocessing",
  "Noise Reduction",
  "Feature Extraction",
  "Multi-Modality Fusion",
  "Crack Localization",
  "Depth Estimation",
  "Confidence Scoring",
  "Annotation Rendering",
];

const ProcessingOverlay = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-20 flex items-center justify-center min-h-[60vh]"
    >
      <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full mx-6">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-full border-2 border-primary flex items-center justify-center mb-4 processing-glow">
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
          </div>
          <h3 className="font-display font-bold text-lg text-foreground">AI Processing Pipeline</h3>
          <p className="text-xs font-mono text-muted-foreground mt-1">Neural network inference in progress</p>
        </div>

        <div className="space-y-2">
          {steps.map((step, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-mono transition-all ${
                  isDone
                    ? "text-ndt-success"
                    : isActive
                    ? "text-primary bg-primary/5 border border-primary/20"
                    : "text-muted-foreground/40"
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {isDone ? (
                    <Check className="w-4 h-4" />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </div>
                <span>{step}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProcessingOverlay;
