export const removeHtmlTags = (input: string) => {
  return input?.replace(/<[^>]*>/g, '');
};
