import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Radio, Eye, Thermometer, ArrowRight } from "lucide-react";

const modalities = [
  {
    id: "ultrasonic",
    title: "Ultrasonic Surface Analysis",
    icon: Radio,
    description: "Phased-array ultrasonic testing for subsurface flaw detection. Capable of detecting voids, inclusions, and delamination up to 300mm depth.",
    specs: ["Frequency: 1-10 MHz", "Depth: 0-300mm", "Resolution: 0.1mm"],
  },
  {
    id: "visual",
    title: "Visual / Surface Crack Detection",
    icon: Eye,
    description: "High-resolution visual inspection using CNN-based segmentation for surface-breaking cracks, porosity, and weld discontinuities.",
    specs: ["Resolution: 5μm/px", "FOV: 50x50mm", "Magnification: 20x"],
  },
  {
    id: "infrared",
    title: "Infrared Thermal Inspection",
    icon: Thermometer,
    description: "Active thermography for detecting near-surface defects through thermal contrast analysis and transient heat flow mapping.",
    specs: ["Range: -20°C to 650°C", "NETD: <20mK", "Frame Rate: 60Hz"],
  },
];

const ModalitySelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-3">
            Step 1 of 3
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Select Inspection Modality
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Choose the non-destructive testing method for your inspection workflow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {modalities.map((mod, i) => (
            <motion.button
              key={mod.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              onClick={() => navigate(`/material?modality=${mod.id}`)}
              className="group relative bg-card border border-border rounded-lg p-6 text-left hover:border-primary/50 transition-all duration-300 hover:glow-cyan"
            >
              {/* Hover glow overlay */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(186 100% 50% / 0.06), transparent 70%)" }}
              />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-secondary border border-border flex items-center justify-center mb-4 group-hover:border-primary/40 transition-colors">
                  <mod.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {mod.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {mod.description}
                </p>

                <div className="space-y-1 mb-5">
                  {mod.specs.map((spec) => (
                    <p key={spec} className="text-xs font-mono text-muted-foreground">
                      → {spec}
                    </p>
                  ))}
                </div>

                <div className="flex items-center text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                  <span>Select</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalitySelection;
