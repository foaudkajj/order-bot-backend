export const removeHtmlTags = (input: string) => {
  return input?.replace(/<[^>]*>/g, '');
};

export const safeJsonParse = <T = any>(input: string): T => {
  if (!input) {
    return undefined;
  }

  try {
    return JSON.parse(input) as T;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};
