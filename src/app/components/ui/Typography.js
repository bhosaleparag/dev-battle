export default function Typography({
  as: Component = "p",
  variant = "body",
  className = "",
  children,
  ...props
}) {
  const variants = {
    h1: "text-4xl font-bold tracking-tight",
    h2: "text-3xl font-semibold tracking-tight",
    h3: "text-2xl font-semibold",
    h4: "text-xl font-medium",
    body: "text-base leading-relaxed",
    small: "text-sm leading-snug text-gray-300",
    caption: "text-xs uppercase tracking-wide text-gray-400",
  };

  return (
    <Component
      {...props}
      className={`${variants[variant] || variants.body} ${className}`}
    >
      {children}
    </Component>
  );
}
