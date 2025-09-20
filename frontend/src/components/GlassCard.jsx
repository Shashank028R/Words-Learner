// src/components/GlassCard.jsx
const GlassCard = ({ children, className }) => (
  <div className={`bg-white/20 backdrop-blur-lg rounded-4xl shadow-[0_8px_24px_rgba(0,0,139,0.2)] ${className}`}>
    {children}
  </div>
);

export default GlassCard;
