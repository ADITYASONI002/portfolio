import type { HTMLAttributes } from 'react';
import { cardClasses } from './styles';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds hover elevation for interactive cards. */
  interactive?: boolean;
}

export function Card({ interactive, className, ...props }: CardProps) {
  return <div className={cardClasses(interactive, className)} {...props} />;
}
