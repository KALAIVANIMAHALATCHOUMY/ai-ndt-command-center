import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Image, ArrowLeft, Zap, FileImage } from "lucide-react";

const ImageUpload = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modality = searchParams.get("modality") || "ultrasonic";
  const material = searchParams.get("material") || "stainless-steel";
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleRunInspection = () => {
    // Store image in sessionStorage so Results page can access it
    if (preview) {
      sessionStorage.setItem("ndt-image", preview);
    }
    navigate(`/results?modality=${modality}&material=${material}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-3">Step 3 of 3</p>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">Upload NDT Image</h1>
          <div className="flex items-center justify-center gap-4 text-xs font-mono text-muted-foreground">
            <span>Modality: <span className="text-primary">{modality.toUpperCase()}</span></span>
            <span className="text-border">|</span>
            <span>Material: <span className="text-accent">{material.replace("-", " ").toUpperCase()}</span></span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {/* Upload area */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-all duration-300 cursor-pointer ${
              dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {preview ? (
              <div className="space-y-4">
                <img src={preview} alt="NDT Preview" className="max-h-64 mx-auto rounded-md border border-border" />
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono">
                  <FileImage className="w-4 h-4" />
                  {fileName}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-secondary border border-border flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-foreground font-semibold mb-1">Drop NDT image here or click to browse</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    Supports PNG, JPEG, TIFF, DICOM • Max 50MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Run button */}
          <button
            onClick={handleRunInspection}
            disabled={!preview}
            className="w-full mt-6 bg-primary text-primary-foreground font-display font-bold py-4 rounded-lg hover:bg-primary/90 transition-all glow-cyan disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            <Zap className="w-5 h-5" />
            Run AI Inspection
          </button>

          <button
            onClick={() => navigate(`/material?modality=${modality}`)}
            className="w-full mt-3 text-muted-foreground text-sm hover:text-foreground transition-colors inline-flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Material Selection
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageUpload;
