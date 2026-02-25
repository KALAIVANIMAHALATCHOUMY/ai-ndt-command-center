import { motion } from "framer-motion";
import { Download, RotateCcw, AlertTriangle, Gauge } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import type { AnalysisResult } from "@/lib/analyzeDefect";

interface Props {
  modality: string;
  material: string;
  analysisResult?: AnalysisResult | null;
}

const defaultDefects = [
  { label: "Surface Crack", confidence: 94, severity: "High" as const, depth: "2.3mm", x: 35, y: 40 },
  { label: "Micro-Porosity", confidence: 78, severity: "Medium" as const, depth: "0.8mm", x: 65, y: 55 },
  { label: "Inclusion", confidence: 67, severity: "Low" as const, depth: "1.1mm", x: 50, y: 70 },
];

const defaultBarData = [
  { label: "Crack", value: 94 },
  { label: "Porosity", value: 78 },
  { label: "Inclusion", value: 67 },
  { label: "Void", value: 23 },
  { label: "Delamination", value: 12 },
];

const ResultsDashboard = ({ modality, material, analysisResult }: Props) => {
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const navigate = useNavigate();

  const defects = analysisResult?.defects || defaultDefects;
  const barData = analysisResult?.defectProbabilities || defaultBarData;
  const overallRisk = analysisResult?.overallRisk || "HIGH";
  const overallConfidence = analysisResult?.overallConfidence || 89;
  const crackDepths = analysisResult?.crackDepths || [0.4, 0.8, 1.1, 1.8, 2.3, 1.5, 0.9];

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("NDT AI Inspection Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Modality: ${modality.toUpperCase()}`, 20, 35);
    doc.text(`Material: ${material.replace("-", " ").toUpperCase()}`, 20, 45);
    doc.text(`Risk Level: ${overallRisk}`, 20, 55);
    doc.text(`Overall Confidence: ${overallConfidence}%`, 20, 65);
    doc.text("Detected Defects:", 20, 80);
    defects.forEach((d, i) => {
      doc.text(`${i + 1}. ${d.label} — Confidence: ${d.confidence}%, Severity: ${d.severity}, Depth: ${d.depth}`, 25, 92 + i * 12);
    });
    doc.text("Defect Probability Distribution:", 20, 135);
    barData.forEach((b, i) => {
      doc.text(`${b.label}: ${b.value}%`, 25, 147 + i * 10);
    });
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
    doc.save(`NDT_Report_${modality}_${material}_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleDownloadPDF}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-display font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" /> Download Report (PDF)
        </button>
        <button
          onClick={() => navigate("/upload")}
          className="bg-secondary text-foreground px-4 py-2 rounded-md text-sm font-display font-semibold flex items-center gap-2 hover:bg-secondary/80 transition-colors border border-border"
        >
          <RotateCcw className="w-4 h-4" /> Re-run Analysis
        </button>
      </div>

      {/* Main two-panel layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Annotated Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-lg overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground text-sm">Annotated Output</h3>
            <span className="text-xs font-mono text-muted-foreground">Instance Segmentation + Depth Map</span>
          </div>
          <div className="relative aspect-[4/3] bg-muted">
            {/* Simulated image with defect overlays */}
            <div className="absolute inset-0" style={{
              background: `
                linear-gradient(135deg, hsl(214 29% 15%) 0%, hsl(210 30% 12%) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 20px, hsl(186 100% 50% / 0.03) 20px, hsl(186 100% 50% / 0.03) 21px),
                repeating-linear-gradient(90deg, transparent, transparent 20px, hsl(186 100% 50% / 0.03) 20px, hsl(186 100% 50% / 0.03) 21px)
              `
            }} />

            {/* Defect annotations */}
            {defects.map((d, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.2 }}
                className="absolute"
                style={{ left: `${d.x}%`, top: `${d.y}%`, transform: "translate(-50%, -50%)" }}
              >
                {/* Bounding box */}
                <div className={`w-20 h-16 border-2 rounded-sm ${
                  d.severity === "High" ? "border-ndt-danger" : d.severity === "Medium" ? "border-ndt-warning" : "border-primary"
                }`} style={{ boxShadow: `0 0 10px ${d.severity === "High" ? "hsl(0 85% 55% / 0.4)" : "hsl(186 100% 50% / 0.3)"}` }}>
                  <div className={`absolute -top-5 left-0 text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    d.severity === "High" ? "bg-ndt-danger text-foreground" : d.severity === "Medium" ? "bg-ndt-warning text-background" : "bg-primary text-primary-foreground"
                  }`}>
                    {d.label} ({d.confidence}%)
                  </div>
                </div>
                {/* Segmentation mask */}
                <div className="absolute inset-1 rounded-sm opacity-20" style={{
                  background: d.severity === "High" ? "hsl(0 85% 55%)" : d.severity === "Medium" ? "hsl(40 100% 55%)" : "hsl(186 100% 50%)"
                }} />
              </motion.div>
            ))}

            {/* Crack depth line overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.line
                x1="25%" y1="30%" x2="60%" y2="60%"
                stroke="hsl(0 85% 55%)"
                strokeWidth="2"
                strokeDasharray="5,3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Right: Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Risk + Confidence Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Risk Level */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-ndt-danger" />
                <span className="text-xs font-mono text-muted-foreground uppercase">Risk Level</span>
              </div>
              <p className="text-3xl font-display font-bold text-ndt-danger">{overallRisk}</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-ndt-warning to-ndt-danger rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
            </div>

            {/* Confidence Gauge */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-muted-foreground uppercase">Confidence</span>
              </div>
              <p className="text-3xl font-display font-bold text-primary">{overallConfidence}%</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallConfidence}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Defect Probability Bar Chart */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="text-xs font-mono text-muted-foreground uppercase mb-4">Defect Probability Distribution</h4>
            <div className="space-y-3">
              {barData.map((bar, i) => (
                <div key={bar.label} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-24">{bar.label}</span>
                  <div className="flex-1 h-5 bg-muted rounded-sm overflow-hidden">
                    <motion.div
                      className={`h-full rounded-sm ${bar.value > 80 ? "bg-ndt-danger" : bar.value > 50 ? "bg-ndt-warning" : bar.value > 30 ? "bg-primary" : "bg-muted-foreground"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.value}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-xs font-mono text-foreground w-10 text-right">{bar.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Crack Depth Scale */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="text-xs font-mono text-muted-foreground uppercase mb-3">Crack Depth Scale</h4>
            <div className="flex items-end gap-1 h-16">
              {crackDepths.map((depth, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-primary/80 rounded-t-sm"
                  initial={{ height: 0 }}
                  animate={{ height: `${(depth / 2.5) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground">
              <span>0mm</span>
              <span>1.25mm</span>
              <span>2.5mm</span>
            </div>
          </div>

          {/* Defect Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h4 className="text-xs font-mono text-muted-foreground uppercase">Detected Defects</h4>
            </div>
            <div className="divide-y divide-border">
              {defects.map((d, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      d.severity === "High" ? "bg-ndt-danger" : d.severity === "Medium" ? "bg-ndt-warning" : "bg-ndt-success"
                    }`} />
                    <span className="text-foreground font-medium">{d.label}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                    <span>{d.confidence}%</span>
                    <span>{d.depth}</span>
                    <span className={`px-2 py-0.5 rounded ${
                      d.severity === "High" ? "bg-ndt-danger/20 text-ndt-danger" : d.severity === "Medium" ? "bg-ndt-warning/20 text-ndt-warning" : "bg-ndt-success/20 text-ndt-success"
                    }`}>
                      {d.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
