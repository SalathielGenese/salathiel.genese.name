import {InjectionToken, Signal} from "@angular/core";

export type TableOfContentEntry = {
  children?: TableOfContentEntry[];
  parent?: TableOfContentEntry;
  content: string;
  anchor: string;
  level: number;
};

export const PATH = new InjectionToken<() => string>('PATH');
export const ORIGIN = new InjectionToken<() => string>('ORIGIN');
export const IS_HOME = new InjectionToken<Signal<boolean>>('IS_HOME');
export const LANGUAGE_TAG = new InjectionToken<Signal<string>>('LANGUAGE_TAG');
export const TO_ANCHOR = new InjectionToken<(text: string) => string>('TO_ANCHOR');
export const ALTERNATES = new InjectionToken<Record<string, string>[]>('ALTERNATES');
export const TOC = new InjectionToken<(ref: HTMLDivElement) => TableOfContentEntry[]>('TOC');
