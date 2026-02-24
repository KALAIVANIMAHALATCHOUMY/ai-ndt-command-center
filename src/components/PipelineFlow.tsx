import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Upload, Cpu, Brain, Target, BarChart3, Layers, Eye } from "lucide-react";

const pipelineSteps = [
  { icon: Upload, label: "Upload" },
  { icon: Cpu, label: "Preprocessing" },
  { icon: Brain, label: "CNN Feature Extraction" },
  { icon: Layers, label: "Instance Segmentation" },
  { icon: Target, label: "Depth Estimation" },
  { icon: BarChart3, label: "Prediction" },
  { icon: Eye, label: "Visualization" },
];

const PipelineFlow = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        <h3 className="font-display font-semibold text-foreground text-sm">AI Processing Pipeline</h3>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="px-5 pb-6"
        >
          <div className="flex items-center justify-between overflow-x-auto gap-0">
            {pipelineSteps.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center min-w-[90px]"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-2 processing-glow">
                    <step.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground text-center leading-tight">
                    {step.label}
                  </span>
                </motion.div>
                {i < pipelineSteps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.1 + 0.05 }}
                    className="w-8 h-px bg-primary/40 mx-1 flex-shrink-0"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PipelineFlow;
