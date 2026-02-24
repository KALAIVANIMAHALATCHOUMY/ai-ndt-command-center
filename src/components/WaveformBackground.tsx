import { useMemo } from "react";

interface Props {
  modality: string;
}

const WaveformBackground = ({ modality }: Props) => {
  const style = useMemo(() => {
    switch (modality) {
      case "ultrasonic":
        return {
          background: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 18px,
              hsl(186 100% 50% / 0.03) 18px,
              hsl(186 100% 50% / 0.03) 20px
            )
          `,
        };
      case "infrared":
        return {
          background: `
            radial-gradient(ellipse at 30% 50%, hsl(25 100% 50% / 0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 30%, hsl(0 80% 50% / 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, hsl(40 100% 55% / 0.03) 0%, transparent 50%)
          `,
        };
      case "visual":
        return {
          backgroundImage: `
            linear-gradient(0deg, hsl(186 100% 50% / 0.02) 1px, transparent 1px),
            linear-gradient(90deg, hsl(186 100% 50% / 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "12px 12px",
        };
      default:
        return {};
    }
  }, [modality]);

  return <div className="absolute inset-0 pointer-events-none" style={style} />;
};

export default WaveformBackground;
