export function jsonNest(input: Record<string, string>): Record<string, any> {
  return Object.keys(input)
      .reduce((result, namespace) => {
        namespace.split('.')
            .reduce((next, key, i, keys) =>
                next[key] ??= ((1 + i === keys.length) ? input[namespace] : {}), result as any);
        return result;
      }, {} as Record<string, any>);
}

export function jsonFlatten(input: Record<string, any>, parent?: string): Record<string, string> {
  return Object.keys(input)
      .reduce((result, key) => {
        const next = [parent, key].filter(_ => _).join('.');
        return {
          ...result,
          ...'object' === typeof input[key]
              ? jsonFlatten(input[key], next)
              : {[next]: input[key]},
        };
      }, {} as Record<string, string>)
}
