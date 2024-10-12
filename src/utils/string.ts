export const plural = (list: any[] | number) => {
  const pluralRef = Array.isArray(list) ? list.length : list;
  const isPlural = pluralRef > 1;
  return {
    s: isPlural ? "s" : "",
    es: isPlural ? "es" : "",
  };
};
