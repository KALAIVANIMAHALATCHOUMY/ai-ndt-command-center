import { motion } from "framer-motion";
import AppSidebar from "@/components/AppSidebar";
import WaveformBackground from "@/components/WaveformBackground";
import { FileText, Eye } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const mockReports = [
  {
    id: 1,
    date: "2026-02-24 14:32",
    modality: "Ultrasonic",
    material: "Stainless Steel (MS950)",
    risk: "HIGH",
    confidence: 89,
    defects: [
      { label: "Surface Crack", confidence: 94, severity: "High", depth: "2.3mm" },
      { label: "Micro-Porosity", confidence: 78, severity: "Medium", depth: "0.8mm" },
      { label: "Inclusion", confidence: 67, severity: "Low", depth: "1.1mm" },
    ],
  },
  {
    id: 2,
    date: "2026-02-23 09:15",
    modality: "Infrared",
    material: "Aluminum Alloy (AL6061)",
    risk: "MEDIUM",
    confidence: 76,
    defects: [
      { label: "Delamination", confidence: 72, severity: "Medium", depth: "0.5mm" },
      { label: "Void", confidence: 54, severity: "Low", depth: "0.3mm" },
    ],
  },
  {
    id: 3,
    date: "2026-02-22 16:48",
    modality: "Visual",
    material: "Stainless Steel (MS1200)",
    risk: "LOW",
    confidence: 92,
    defects: [
      { label: "Surface Scratch", confidence: 88, severity: "Low", depth: "0.2mm" },
    ],
  },
];

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      <div className="flex-1 relative overflow-auto">
        <WaveformBackground modality="ultrasonic" />

        <div className="relative z-10 border-b border-border bg-background/80 backdrop-blur-sm px-6 py-3">
          <h2 className="font-display font-bold text-foreground">Inspection Reports</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">Previous inspection history</p>
        </div>

        <div className="relative z-10 p-6 space-y-4">
          {mockReports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm">
                      {report.modality} Inspection — {report.material}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-mono px-2 py-1 rounded ${
                    report.risk === "HIGH" ? "bg-ndt-danger/20 text-ndt-danger" :
                    report.risk === "MEDIUM" ? "bg-ndt-warning/20 text-ndt-warning" :
                    "bg-ndt-success/20 text-ndt-success"
                  }`}>
                    {report.risk} RISK
                  </span>
                  <span className="text-xs font-mono text-primary">{report.confidence}% conf.</span>
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Report Detail Dialog */}
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedReport && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-foreground">
                    {selectedReport.modality} Inspection Report
                  </DialogTitle>
                  <DialogDescription className="font-mono text-xs">
                    {selectedReport.date} • {selectedReport.material}
                  </DialogDescription>
                </DialogHeader>

                {/* Simulated annotated image */}
                <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden mt-2">
                  <div className="absolute inset-0" style={{
                    background: `
                      linear-gradient(135deg, hsl(214 29% 15%) 0%, hsl(210 30% 12%) 100%),
                      repeating-linear-gradient(0deg, transparent, transparent 20px, hsl(186 100% 50% / 0.03) 20px, hsl(186 100% 50% / 0.03) 21px),
                      repeating-linear-gradient(90deg, transparent, transparent 20px, hsl(186 100% 50% / 0.03) 20px, hsl(186 100% 50% / 0.03) 21px)
                    `
                  }} />
                  {selectedReport.defects.map((d, idx) => (
                    <div
                      key={idx}
                      className="absolute"
                      style={{ left: `${30 + idx * 20}%`, top: `${35 + idx * 12}%`, transform: "translate(-50%, -50%)" }}
                    >
                      <div className={`w-20 h-16 border-2 rounded-sm ${
                        d.severity === "High" ? "border-ndt-danger" : d.severity === "Medium" ? "border-ndt-warning" : "border-primary"
                      }`}>
                        <div className={`absolute -top-5 left-0 text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          d.severity === "High" ? "bg-ndt-danger text-foreground" : d.severity === "Medium" ? "bg-ndt-warning text-background" : "bg-primary text-primary-foreground"
                        }`}>
                          {d.label} ({d.confidence}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Risk & Confidence */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs font-mono text-muted-foreground uppercase">Risk Level</p>
                    <p className={`text-2xl font-display font-bold mt-1 ${
                      selectedReport.risk === "HIGH" ? "text-ndt-danger" :
                      selectedReport.risk === "MEDIUM" ? "text-ndt-warning" : "text-ndt-success"
                    }`}>{selectedReport.risk}</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-3">
                    <p className="text-xs font-mono text-muted-foreground uppercase">Confidence</p>
                    <p className="text-2xl font-display font-bold mt-1 text-primary">{selectedReport.confidence}%</p>
                  </div>
                </div>

                {/* Defect Table */}
                <div className="mt-4 bg-secondary rounded-lg overflow-hidden">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs font-mono text-muted-foreground uppercase">Detected Defects</p>
                  </div>
                  <div className="divide-y divide-border">
                    {selectedReport.defects.map((d, idx) => (
                      <div key={idx} className="px-4 py-3 flex items-center justify-between text-sm">
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
                          }`}>{d.severity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Reports;
