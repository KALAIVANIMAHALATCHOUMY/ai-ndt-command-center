import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

const materials = [
  {
    id: "stainless-steel",
    title: "Stainless Steel",
    grades: "MS950 / MS1200",
    description: "High-strength martensitic steel used in structural aerospace components, pressure vessels, and turbine blades. Optimized detection parameters for ferromagnetic microstructure.",
    properties: ["Density: 7.75–8.05 g/cm³", "Yield: 950–1200 MPa", "Hardness: 28–36 HRC"],
    pattern: "repeating-linear-gradient(45deg, hsl(214 29% 17%), hsl(214 29% 17%) 2px, hsl(214 25% 19%) 2px, hsl(214 25% 19%) 4px)",
  },
  {
    id: "aluminum",
    title: "Aluminum Alloy",
    grades: "AL6061",
    description: "Precipitation-hardened aluminum alloy for lightweight aircraft structures, fuselage panels, and heat exchangers. Tuned for non-ferromagnetic material response.",
    properties: ["Density: 2.70 g/cm³", "Yield: 276 MPa", "Hardness: 95 HB"],
    pattern: "repeating-linear-gradient(135deg, hsl(214 29% 17%), hsl(214 29% 17%) 3px, hsl(214 20% 20%) 3px, hsl(214 20% 20%) 6px)",
  },
];

const MaterialSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modality = searchParams.get("modality") || "ultrasonic";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-3">Step 2 of 3</p>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Select Material Type
          </h1>
          <p className="text-muted-foreground">
            Modality: <span className="text-primary font-mono text-sm">{modality.toUpperCase()}</span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {materials.map((mat, i) => (
            <motion.button
              key={mat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              onClick={() => navigate(`/upload?modality=${modality}&material=${mat.id}`)}
              className="group relative bg-card border border-border rounded-lg overflow-hidden text-left hover:border-primary/50 transition-all duration-300"
            >
              {/* Textured top bar */}
              <div className="h-24 relative" style={{ backgroundImage: mat.pattern }}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
                <div className="absolute bottom-3 left-5">
                  <span className="text-xs font-mono text-primary bg-background/80 px-2 py-1 rounded">
                    {mat.grades}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display font-semibold text-xl text-foreground mb-2">{mat.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{mat.description}</p>

                <div className="space-y-1 mb-5">
                  {mat.properties.map((prop) => (
                    <p key={prop} className="text-xs font-mono text-muted-foreground">▸ {prop}</p>
                  ))}
                </div>

                <div className="flex items-center text-primary text-sm font-semibold">
                  <span>Select Material</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 text-center">
          <button onClick={() => navigate("/modality")} className="text-muted-foreground text-sm hover:text-foreground transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Modality Selection
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default MaterialSelection;
