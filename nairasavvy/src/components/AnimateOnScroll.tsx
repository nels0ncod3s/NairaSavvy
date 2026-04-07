"use client";

import { useEffect, useRef, CSSProperties, ReactNode, ElementType } from "react";

type AnimVariant = "fadeUp" | "scale" | "fadeIn";

interface AnimateOnScrollProps {
  children: ReactNode;
  delay?: number; // ms
  variant?: AnimVariant;
  threshold?: number;
  className?: string;
  style?: CSSProperties;
  tag?: ElementType;
}

const VARIANT_CLASSES: Record<AnimVariant, string> = {
  fadeUp: "reveal",
  scale: "reveal-scale",
  fadeIn: "reveal",
};

export default function AnimateOnScroll({
  children,
  delay = 0,
  variant = "fadeUp",
  threshold = 0.12,
  className = "",
  style,
  tag: Tag = "div",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => {
            el.classList.add("is-visible");
          }, delay);
          observer.unobserve(el);
          return () => clearTimeout(timer);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const baseClass = VARIANT_CLASSES[variant];

  const Component = Tag as "div";

  return (
    <Component
      ref={ref}
      className={`${baseClass} ${className}`.trim()}
      style={style}
    >
      {children}
    </Component>
  );
}
