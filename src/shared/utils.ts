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

/**
 * Converts the Turkish characters to English characters.
 * @param input
 * @returns
 */
export const turkishToEnglish = (input: string) => {
  if (!input) {
    return '';
  }
  var letters = {
    İ: 'I',
    ı: 'i',
    Ş: 'Ş',
    ş: 's',
    Ğ: 'G',
    ğ: 'g',
    Ü: 'U',
    ü: 'u',
    Ö: 'O',
    ö: 'o',
    Ç: 'C',
    ç: 'c',
  };
  input = input.replace(/(([İıŞşĞğÜüÇçÖö]))/g, letter => {
    return letters[letter];
  });
  return input;
};
