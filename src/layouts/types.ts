import type { ResumeConfig } from '../types/content';

export interface NavLink {
  id: string;
  label: string;
}

/** Resume settings after defaults are applied (see `getResume`). */
export type ResumeLink = Required<ResumeConfig>;
