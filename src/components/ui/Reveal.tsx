import { m } from 'motion/react';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating, for gentle staggering in lists. */
  delay?: number;
  as?: 'div' | 'li' | 'article';
}

/**
 * Fades content up as it scrolls into view, once. Motion's `reducedMotion="user"`
 * (set in App) removes the movement for visitors who prefer reduced motion.
 */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const Component = m[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Component>
  );
}
