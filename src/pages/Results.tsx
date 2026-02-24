import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppSidebar from "@/components/AppSidebar";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import ResultsDashboard from "@/components/ResultsDashboard";
import PipelineFlow from "@/components/PipelineFlow";
import WaveformBackground from "@/components/WaveformBackground";

const Results = () => {
  const [searchParams] = useSearchParams();
  const modality = searchParams.get("modality") || "ultrasonic";
  const material = searchParams.get("material") || "stainless-steel";
  const [processing, setProcessing] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProcessing(false);
      setTimeout(() => setShowResults(true), 300);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      <div className="flex-1 relative overflow-auto">
        <WaveformBackground modality={modality} />

        {/* Top bar */}
        <div className="relative z-10 border-b border-border bg-background/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-display font-bold text-foreground">Inspection Results</h2>
            <div className="flex gap-2 text-xs font-mono">
              <span className="bg-secondary px-2 py-1 rounded text-primary">{modality.toUpperCase()}</span>
              <span className="bg-secondary px-2 py-1 rounded text-accent">{material.replace("-", " ").toUpperCase()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-ndt-success animate-pulse-glow" />
            {processing ? "Processing..." : "Analysis Complete"}
          </div>
        </div>

        {/* Processing overlay */}
        <AnimatePresence>
          {processing && <ProcessingOverlay />}
        </AnimatePresence>

        {/* Results */}
        {showResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 p-6 space-y-6">
            <ResultsDashboard modality={modality} material={material} />
            <PipelineFlow />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Results;
