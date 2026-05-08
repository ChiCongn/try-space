type ClassValue = false | null | string | undefined | Record<string, boolean>;

export function cn(...values: ClassValue[]) {
  return values
    .flatMap((value) => {
      if (!value) return [];
      if (typeof value === "string") return [value];
      return Object.entries(value)
        .filter(([, active]) => active)
        .map(([className]) => className);
    })
    .join(" ")
    .trim();
}
