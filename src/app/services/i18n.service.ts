import {
  DestroyRef,
  effect,
  Inject,
  Injectable,
  Injector,
  PLATFORM_ID,
  signal,
  Signal,
  WritableSignal
} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, debounceTime, filter, map, mergeMap, tap} from "rxjs";
import {fromArrayLike} from "rxjs/internal/observable/innerFrom";
import {jsonFlatten} from "../../util";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {LANGUAGE_TAG} from "../token";
import {isPlatformBrowser} from "@angular/common";
import {LANGUAGES} from "../../constant";

@Injectable()
export class I18nService {
  #syncedClientCache = false;
  readonly #pending: BehaviorSubject<Record<string, Set<string>>> = new BehaviorSubject(Object.create(null));
  readonly #cache = {} as Record<string, Record<string, WritableSignal<string | undefined>>>;

  constructor(http: HttpClient,
              destroyRef: DestroyRef,
              private readonly injector: Injector,
              @Inject(PLATFORM_ID) private readonly platformId: object,
              @Inject(LANGUAGE_TAG) private readonly languageTag: Signal<string>) {
    this.#pending
        .pipe(filter(pending => !!Object.keys(pending).length))
        .pipe(debounceTime(50))
        .pipe(tap(() => this.#pending.next(Object.create(null))))
        .pipe(mergeMap(pending => fromArrayLike(Object.entries(pending))))
        .pipe(map(([languageTag, keys]) => [languageTag, [...keys].sort()] as const))
        .pipe(mergeMap(([languageTag, keys]) => {
          return http.get<{ content: object }>(`@api/${languageTag}/i18n/${encodeURIComponent(keys.join(','))}`)
              .pipe(map(({content}) => jsonFlatten(content as Record<string, string>)))
              .pipe(map(content => [languageTag, keys, content] as const));
        }))
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(([languageTag, keys, content]) => {
          // NOTE: Update #pending with missing keys
          const missingKeys = keys.filter(key => !(key in content));
          missingKeys.length && this.#pending.next({
            ...this.#pending.value,
            [languageTag]: new Set([
              ...this.#pending.value[languageTag] ?? new Set(),
              ...missingKeys,
            ]),
          });
          // NOTE: Update translation to target signals
          this.#updateCacheWithTranslation(content, languageTag);
        });
  }

  #updateCacheWithTranslation(content: Record<string, string>, languageTag: string) {
    const localizedCache = this.#cache[languageTag];
    Object.entries(content).forEach(([key, value]) => localizedCache[key].set(value));
  }

  fetch(key: string, languageTag?: string): Signal<string | undefined> {
    if (!languageTag) {
      const translation = signal(this.fetch(key, this.languageTag())());
      effect(onCleanup => {
        translation.set(this.fetch(key, this.languageTag())());
      }, {injector: this.injector, allowSignalWrites: true});
      return translation;
    } else {
      this.#syncedClientCache || isPlatformBrowser(this.platformId) && this.#syncClientCache();
      const localizedCache = this.#cache[languageTag] ??= {};
      this.#syncedClientCache = true;

      return localizedCache[key] ??= (() => {
        this.#pending.next({
          ...this.#pending.value,
          [languageTag]: new Set([...this.#pending.value[languageTag] ?? new Set(), key]),
        });
        return signal(undefined);
      })();
    }
  }

  #syncClientCache() {
    const script = document.querySelector('script#ng-state[type="application/json"]');
    const content = JSON.parse(script?.textContent!);

    Object.entries(content ?? {})
        .filter(([key]) => key == `${+key}`)
        .map(([, value]) => value)
        .filter((_: any) => LANGUAGES.some(({tag}) => _.url.startsWith(`${location.origin}/~/${tag}/`)))
        .forEach(({url, body: {content}}: any) => {
          const languageTag = LANGUAGES.find(({tag}) => url.startsWith(`${location.origin}/~/${tag}/`))?.tag!;
          const localizedCache = this.#cache[languageTag] ??= {};
          Object.entries(jsonFlatten(content ?? {}))
              .forEach(([key, value]) => localizedCache[key] = signal(value as string));
        });
  }
}
