import type { MDXComponents } from "mdx/types";

// This file is required by @next/mdx
// Custom MDX components will be added in Phase 3
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
