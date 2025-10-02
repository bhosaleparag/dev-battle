import Typography from "./components/ui/Typography";

export default function Loader({ 
  text = "Loading...", 
  size = "md", 
  fullScreen = true,
  className = "" 
}) {
  const sizeClasses = {
    sm: "w-2 h-2 gap-0.5",
    md: "w-4 h-4 gap-1",
    lg: "w-6 h-6 gap-2"
  };

  const textSizes = {
    sm: "h6",
    md: "h4",
    lg: "h3"
  };

  const containerClass = fullScreen 
    ? "flex flex-col items-center justify-center min-h-full bg-gray-08" 
    : "flex flex-col items-center justify-center";

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="grid grid-cols-3 gap-1">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`${sizeClasses[size]} bg-purple-600 animate-bounce`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      {text && (
        <Typography variant={textSizes[size]} className="mt-3">
          {text}
        </Typography>
      )}
    </div>
  );
}
