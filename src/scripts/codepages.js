/*
 * Translates numbers to characters and vice versa for the requested codepage
 */

 /*
  * Convert a code to the character
  *
  * @param integer   c      code to be converted to a character
  * @param integer   idx    index in the array of codepages, identifies codepage to be used
  *
  * @return string   the character at the specified position in the codepage
  */
export function codeToChar (c, idx = 0) {
  return listofcodepages[idx].chars [c - listofcodepages[idx].offset];
}

/*
 * Convert a character to a code
 *
 * @param string    char   the character to be converted
 * @param integer   idx    index in the array of codepages, identifies codepage to be used
 *
 * @return integer  the position in the codepage or -1 if not found
 */

export function charToCode (char, idx = 0) {
  let pos = listofcodepages[idx].chars.findIndex( (e) => e === char);
  return (pos >= 0) ? pos + listofcodepages[idx].offset : pos;
}

/*
 * Find the codepage given the name
 *
 * @param string      name      name of the codepage
 *
 * @return integer   index of the codepage or -1 if not found
 */
export function findCodepage(name) {
  return listofcodepages.findIndex ( (cp) => cp.name === name);
}


const listofcodepages = [
  {
    // ASCII original code (1967) - only uses 32 (space) to 126
    // ASCII 1963: ↑ instead of ^, ← instead of _, ACK instead of | and ESC instead of ~
    // ASCII 1965: ` instead of @, ~ instead of \, @ instead of `, ¬ instead of | and | instead of ~
    name: "ASCII",
    description: "ASCII - 1967, original 7 bit version no extensions",
    offset: 0x20,
    chars:  [
      " ", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
      "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
      "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
      "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
      "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~"
    ]
  },

  // MS DOS codepages, * is supported

  // *437 Original IBM PC hardware code page
  // 737 Greek, more popular than 869 (and 851?)
  // *850 Western European
  // 851 Greek
  // *852 Central European very different from ISO/IEC 8859-2
  // 853 Turkish, Maltese, and Esperanto.[1] It includes all characters from ISO 8859-3. Unpopular.
  // 855 Cyrillic, replaced by 866
  // 856 is a code page used under DOS for Hebrew in Israel
  // *857 is a code page used under DOS in Turkey to write Turkish.
  // 858 Western European languages, same as 850 except dotless i is euro sign
  // 859 Western European languages.[2] It contains all of the characters in ISO 8859-15.
  // 860 Portugal to write Portuguese
  // 861 used in Iceland to write the Icelandic language (as well as other Nordic languages)
  // 862 Hebrew replaced by 1255
  // 863 used in Canada to write French
  // 864 used to write Arabic in Egypt, Iraq, Jordan, Saudi Arabia, and Syria
  // 865 used in Denmark and Norway to write Nordic languages
  // *866 Cyrillic used in Russia

  {
    // Codepage 437 original IBM PC coded in BIOS hardware
    // 8 bit extended ASCII also used 1-31 and codes of 127 to 255
    // First half equals CP850 see Wikipedia https://en.wikipedia.org/wiki/Code_page_437
    // 000 is NUL, 255 is NBSP
    name: "CP437",
    description: "Codepage 437 Original IBM PC hardware code page",
    offset: 0x01,
    chars:  [
           "☺", "☻", "♥", "♦", "♣", "♠", "•", "◘", "○", "◙", "♂", "♀", "♪", "♫", "☼",
      "►", "◄", "↕", "‼", "¶", "§", "▬", "↨", "↑", "↓", "→", "←", "∟", "↔", "▲", "▼",
      " ", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
      "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
      "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
      "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
      "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "⌂",
      "Ç", "ü", "é", "â", "ä", "à", "å", "ç", "ê", "ë", "è", "ï", "î", "ì", "Ä", "Å",
      "É", "æ", "Æ", "ô", "ö", "ò", "û", "ù", "ÿ", "Ö", "Ü", "¢", "£", "¥", "₧", "ƒ",
      "á", "í", "ó", "ú", "ñ", "Ñ", "ª", "º", "¿", "⌐", "¬", "½", "¼", "¡", "«", "»",
      "░", "▒", "▓", "│", "┤", "╡", "╢", "╖", "╕", "╣", "║", "╗", "╝", "╜", "╛", "┐",
      "└", "┴", "┬", "├", "─", "┼", "╞", "╟", "╚", "╔", "╩", "╦", "╠", "═", "╬", "╧",
      "╨", "╤", "╥", "╙", "╘", "╒", "╓", "╫", "╪", "┘", "┌", "█", "▄", "▌", "▐", "▀",
      "α", "ß", "Γ", "π", "Σ", "σ", "µ", "τ", "Φ", "Θ", "Ω", "δ", "∞", "φ", "ε", "∩",
      "≡", "±", "≥", "≤", "⌠", "⌡", "÷", "≈", "°", "∙", "·", "√", "ⁿ", "²", "■"
    ]
  },

  {
    // Codepage 850 default OEM page in Western European, updated version of CP437
    // 8 bit extended ASCII also used 1-31 and codes of 127 to 255
    // https://en.wikipedia.org/wiki/Code_page_850
    // 000 is NUL, 255 is NBSP
    name: "CP850",
    description: "Codepage 850 MS DOS used in Western Europe",
    offset: 0x01,
    chars:  [
           "☺", "☻", "♥", "♦", "♣", "♠", "•", "◘", "○", "◙", "♂", "♀", "♪", "♫", "☼",
      "►", "◄", "↕", "‼", "¶", "§", "▬", "↨", "↑", "↓", "→", "←", "∟", "↔", "▲", "▼",
      " ", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
      "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
      "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
      "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
      "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "⌂",
      "Ç", "ü", "é", "â", "ä", "à", "å", "ç", "ê", "ë", "è", "ï", "î", "ì", "Ä", "Å",
      "É", "æ", "Æ", "ô", "ö", "ò", "û", "ù", "ÿ", "Ö", "Ü", "ø", "£", "Ø", "×", "ƒ",
      "á", "í", "ó", "ú", "ñ", "Ñ", "ª", "º", "¿", "®", "¬", "½", "¼", "¡", "«", "»",
      "░", "▒", "▓", "│", "┤", "Á", "Â", "À", "©", "╣", "║", "╗", "╝", "¢", "¥", "┐",
      "└", "┴", "┬", "├", "─", "┼", "ã", "Ã", "╚", "╔", "╩", "╦", "╠", "═", "╬", "¤",
      "ð", "Ð", "Ê", "Ë", "È", "ı", "Í", "Î", "Ï", "┘", "┌", "█", "▄", "¦", "Ì", "▀",
      "Ó", "ß", "Ô", "Ò", "õ", "Õ", "µ", "þ", "Þ", "Ú", "Û", "Ù", "ý", "Ý", "¯", "´",
      "-", "±", "‗", "¾", "¶", "§", "÷", "¸", "°", "¨", "∙", "¹", "³", "²", "■"
    ]
  },

  {
    // Codepage 852 default OEM page in Western European, updated version of CP437
    // 1-127 same as CP437, 127 to 255 differs
    // https://en.wikipedia.org/wiki/Code_page_852
    // 000 is NUL, 255 is NBSP
    name: "CP852",
    description: "Codepage 852 MS DOS to write Central European languages that use Latin script",
    offset: 0x01,
    chars:  [
           "☺", "☻", "♥", "♦", "♣", "♠", "•", "◘", "○", "◙", "♂", "♀", "♪", "♫", "☼",
      "►", "◄", "↕", "‼", "¶", "§", "▬", "↨", "↑", "↓", "→", "←", "∟", "↔", "▲", "▼",
      " ", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
      "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
      "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
      "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
      "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "⌂",
      "Ç", "ü", "é", "â", "ä", "ů", "ć", "ç", "ł", "ë", "Ő", "ő", "î", "Ź", "Ä", "Ć",
      "É", "Ĺ", "ĺ", "ô", "ö", "Ľ", "ľ", "Ś", "ś", "Ö", "Ü", "Ť", "ť", "Ł", "×", "č",
      "á", "í", "ó", "ú", "Ą", "ą", "Ž", "ž", "Ę", "ę", "¬", "ź", "Č", "ş", "«", "»",
      "░", "▒", "▓", "│", "┤", "Á", "Â", "Ě", "Ş", "╣", "║", "╗", "╝", "Ż", "ż", "┐",
      "└", "┴", "┬", "├", "─", "┼", "Ă", "ă", "╚", "╔", "╩", "╦", "╠", "═", "╬", "¤",
      "đ", "Ð", "Ď", "Ë", "ď", "Ň", "Í", "Î", "ě", "┘", "┌", "█", "▄", "Ţ", "Ů", "▀",
      "Ó", "ß", "Ô", "Ń", "ń", "ň", "Š", "š", "Ŕ", "Ú", "ŕ", "Ű", "ý", "Ý", "ţ", "´",
      "-", '˝', "˛", "ˇ", "˘", "§", "÷", "¸", "°", "¨", "˙", "ű", "Ř", "ř", "■"
    ]
  },

  {
    // Codepage 857 MS DOS codepage to write Turkish
    // Code page 857 is based on code page 850, but with many changes. It includes all characters from ISO 8859-9.
    // https://en.wikipedia.org/wiki/Code_page_857
    // 000 is NUL, 255 is NBSP
    name: "CP857",
    description: "Codepage 857 MS Dos Turkish includes all characters from ISO 8859-9",
    offset: 0x01,
    chars:  [
           "☺", "☻", "♥", "♦", "♣", "♠", "•", "◘", "○", "◙", "♂", "♀", "♪", "♫", "☼",
      "►", "◄", "↕", "‼", "¶", "§", "▬", "↨", "↑", "↓", "→", "←", "∟", "↔", "▲", "▼",
      " ", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
      "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
      "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
      "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
      "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "⌂",
      "Ç", "ü", "é", "â", "ä", "à", "å", "ç", "ê", "ë", "è", "ï", "î", "ı", "Ä", "Å",
      "É", "æ", "Æ", "ô", "ö", "ò", "û", "ù", "İ", "Ö", "Ü", "ø", "£", "Ø", "Ş", "ş",
      "á", "í", "ó", "ú", "ñ", "Ñ", "Ğ", "ğ", "¿", "®", "¬", "½", "¼", "¡", "«", "»",
      "░", "▒", "▓", "│", "┤", "Á", "Â", "À", "©", "╣", "║", "╗", "╝", "¢", "¥", "┐",
      "└", "┴", "┬", "├", "─", "┼", "ã", "Ã", "╚", "╔", "╩", "╦", "╠", "═", "╬", "¤",
      "º", "ª", "Ê", "Ë", "È", "€", "Í", "Î", "Ï", "┘", "┌", "█", "▄", "¦", "Ì", "▀",
      "Ó", "ß", "Ô", "Ò", "õ", "Õ", "µ", "UDF", "×", "Ú", "Û", "Ù", "ì", "ÿ", "¯", "´",
      "-", "±", "UDF", "¾", "¶", "§", "÷", "¸", "°", "¨", "∙", "¹", "³", "²", "■"
    ]
  },

  {
    // Codepage 866 is a code page used under DOS in Russia to write Cyrillic script.
    // It is based on the "alternative code page", codes 0xF242 - 0xF24B are different
    // Not be confused with 855, which was once popular outside Russia but rarely used
    // Code page 866 is based on code page 437 (0-127)
    // https://en.wikipedia.org/wiki/Code_page_866
    // 000 is NUL, 255 is NBSP
    name: "CP866",
    description: "Codepage 866 MS DOS Cyrillic includes all characters from ISO 8859-9",
    offset: 0x01,
    chars:  [
           "☺", "☻", "♥", "♦", "♣", "♠", "•", "◘", "○", "◙", "♂", "♀", "♪", "♫", "☼",
      "►", "◄", "↕", "‼", "¶", "§", "▬", "↨", "↑", "↓", "→", "←", "∟", "↔", "▲", "▼",
      " ", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
      "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
      "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
      "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
      "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "⌂",
      "А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П",
      "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь", "Э", "Ю", "Я",
      "а", "б", "в", "г", "д", "е", "ж", "з", "и", "й", "к", "л", "м", "н", "о", "п",
      "░", "▒", "▓", "│", "┤", "╡", "╢", "╖", "╕", "╣", "║", "╗", "╝", "╜", "╛", "┐",
      "└", "┴", "┬", "├", "─", "┼", "╞", "╟", "╚", "╔", "╩", "╦", "╠", "═", "╬", "╧",
      "╨", "╤", "╥", "╙", "╘", "╒", "╓", "╫", "╪", "┘", "┌", "█", "▄", "▌", "▐", "▀",
      "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я",
      "Ё", "ё", "Є", "є", "Ї", "ї", "Ў", "ў", "°", "∙", "·", "√", "№", "¤", "■"
    ]
  },

  // MS Windows codepages, * is supported

  // Codepage 1250 Central European and Eastern European languages that use Latin script, similar to ISO-8859-2
  // Codepage 1251 languages that use the Cyrillic script, not similar to ISO-8859-5 and more popular
  // *Codepage 1252 Western european languages
  // Codepage 1253 s a Microsoft Windows code page used to write modern Greek, It is not fully compatible with ISO 8859-7
  // Codepage 1254 used under Microsoft Windows to write Turkish, similar to ISO-8859-9
  // Codepage 1255 used under Microsoft Windows to write Hebrew. It is an almost compatible superset of ISO 8859-8
  // Codepage 1256 used under Microsoft Windows to write Arabic. This code page is not compatible with ISO 8859-6
  // Codepage 1257 used to support the Baltic languages under Microsoft Windows. not compatible with ISO 8859-4 and ISO 8859-10
  // Codepage 1258 used in Microsoft Windows to represent Vietnamese texts

  {
    // Codepage 1252 used in Windows, this is the final version as of Windows 98
    // Superset of ISO 8859-1
    // https://en.wikipedia.org/wiki/Windows-1252
    // 000 is NUL, 127 is DEL, 160 is NBSP, 173 is SHY
    name: "CP1252",
    description: "Codepage 1252 MS Windows for the Latin Alphabet",
    offset: 0x01,
    chars:  [
           "☺", "☻", "♥", "♦", "♣", "♠", "•", "◘", "○", "◙", "♂", "♀", "♪", "♫", "☼",
      "►", "◄", "↕", "‼", "¶", "§", "▬", "↨", "↑", "↓", "→", "←", "∟", "↔", "▲", "▼",
      " ", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
      "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
      "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
      "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
      "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "⌂",
      "€", "", "‚", "ƒ", "„", "…", "†", "‡", "ˆ", "‰", "Š", "‹", "Œ", "", "Ž", "",
      "", "‘", "’", "“", "”", "•", "–", "—", "˜", "™", "š", "›", "œ", "", "ž", "Ÿ",
      "", "¡", "¢", "£", "¤", "¥", "¦", "§", "¨", "©", "ª", "«", "¬", "-", "®", "¯",
      "°", "±", "²", "³", "´", "µ", "¶", "·", "¸", "¹", "º", "»", "¼", "½", "¾", "¿",
      "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï",
      "Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "×", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ß",
      "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï",
      "ð", "ñ", "ò", "ó", "ô", "õ", "ö", "÷", "ø", "ù", "ú", "û", "ü", "ý", "þ", "ÿ"
    ]
  },

  {
    // The ATASCII character set, from ATARI Standard Code for Information Interchange, alternatively ATARI ASCII,
    // is the variation on ASCII used in the Atari 8-bit family of home computers.
    // Superset of ISO 8859-1
    // https://en.wikipedia.org/wiki/ATASCII
    // Characters 128-255 are the black/white versions of 0-127
    name: "ATASCII",
    description: "Atari variant of ASCII, characters 128-255 are the inverse of 0-127",
    offset: 0x00,
    chars:  [
      "♥", "├", "🮇", "┘", "┤", "┐", "╱", "╲", "◢", "▗", "◣", "▝", "▘", "🮂", "▂", "▖",
      "♣", "┌", "─", "┼", "•", "▄", "▎", "┬", "┴", "▌", "└", "🮂", "↑", "↓", "←", "→",
      " ", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
      "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
      "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
      "♦", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
      "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "♠", "|", "🢰", "◀", "▶",
      "♥", "├", "▊", "┘", "┤", "┐", "╱", "╲", "◤", "▛", "◥", "▙", "▟", "▆", "▂", "▜",
      "♣", "┌", "─", "┼", "◘", "▀", "▎", "┬", "┴", "▐", "└", "🮂", "↑", "↓", "←", "→",
      "█", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?",
      "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
      "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_",
      "♦", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
      "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "♠", "|", "🢰", "◀", "▶"
    ]
  },

  {
    // 1963 - EBCDIC 8 bit
    name: "EBCDIC",
    description: "IBM Extended Binary Code - United Kingdom 285-1/697-1",
    offset: 0x40,
    chars:  [
      " ", " ", "â", "ä", "à", "á", "ã", "å", "ç", "ñ", "$", ".", "<", "(", "+", "|",
      "&", "é", "ê", "ë", "è", "í", "î", "ï", "ì", "ß", "!", "£", "*", ")", ";", "¬",
      "-", "/", "Â", "Ä", "À", "Á", "Ã", "Å", "Ç", "Ñ", "¦", ",", "%", "_", ">", "?",
      "ø", "É", "Ê", "Ë", "È", "Í", "Î", "Ï", "Ì", "`", ":", "#", "@", "'", "=", '"',
      "Ø", "a", "b", "c", "d", "e", "f", "g", "h", "i", "«", "»", "ð", "ý", "þ", "±",
      "°", "j", "k", "l", "m", "n", "o", "p", "q", "r", "ª", "º", "æ", "¸", "Æ", "¤",
      "µ", " ", "s", "t", "u", "v", "w", "x", "y", "z", "¡", "¿", "Ð", "Ý", "Þ", "®",
      "¢", "[", "¥", "·", "©", "§", "¶", "¼", "½", "¾", "^", "]", "~", "¨", "'", "×",
      "{", "A", "B", "C", "D", "E", "F", "G", "H", "I", "-", "ô", "ö", "ò", "ó", "õ",
      "}", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "¹", "û", "ü", "ù", "ú", "ÿ",
     "\\", "÷", "S", "T", "U", "V", "W", "X", "Y", "Z", "²", "Ô", "Ö", "Ò", "Ó", "Õ",
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "³", "Û", "Ü", "Ù", "Ú", "EOF"
    ]
  },
]

 // 198? - CP850, Western European version of CP437 (Extended ASCII) MS-DOS
 // 1998 - CP858, same as 850 except but 214 is the € instead of the ı
 // 1987 - ISO8859 8 bit, there are 15 different versions
 // 1991 - Unicode (16 bit, later extended to 21 bits)

 // ISO8859-1 similar to CP1252, same as UTF16-plane 1
 // 1-31 undefined, 31 to 126 is  !"#$%&'()*+,-./01256789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}
 // 127 - 159 undefined
 // 160 - 255 same as CP1252

 // Full list of code pages see https://en.wikipedia.org/wiki/Code_page
