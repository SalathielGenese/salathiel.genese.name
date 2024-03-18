import {InjectionToken, Signal} from "@angular/core";

export const IS_HOME = Symbol('IS_HOME') as unknown as InjectionToken<Signal<boolean>>;
export const LANGUAGE_TAG = Symbol('LANGUAGE_TAG') as unknown as InjectionToken<Signal<string>>;
