import Typography from "./components/ui/Typography";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-08">
      <div className="grid grid-cols-3 gap-1">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 bg-purple-600 animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <Typography variant="h4" className="mt-3">Loading...</Typography>
    </div>
  )
}
