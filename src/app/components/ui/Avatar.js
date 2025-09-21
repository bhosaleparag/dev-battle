import Image from "next/image";

export default function Avatar({ src, alt, size = "md" }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <Image
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full border border-[var(--gray-15)] object-cover`}
    />
  );
}
