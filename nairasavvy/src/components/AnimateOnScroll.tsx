"use client";
import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type ElementType,
} from "react";
export default function AnimateOnScroll({
  children,
  delay = 0,
  variant = "fadeUp",
  className = "",
  style,
  tag: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  variant?: "fadeUp" | "scale" | "fadeIn";
  threshold?: number;
  className?: string;
  style?: CSSProperties;
  tag?: ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      !("IntersectionObserver" in window) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.animate(
            [
              {
                opacity: 0,
                transform:
                  variant === "scale" ? "scale(.98)" : "translateY(12px)",
              },
              { opacity: 1, transform: "none" },
            ],
            { duration: 450, delay: Math.min(delay, 300), easing: "ease-out" },
          );
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, variant]);
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
