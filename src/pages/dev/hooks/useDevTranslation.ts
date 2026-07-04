import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { devTranslations, type DevLang } from '../data/translations';

export function useDevTranslation() {
  const { i18n } = useTranslation();
  const lang: DevLang = i18n.language?.startsWith('en') ? 'en' : 'ar';

  const t = useCallback((key: string): string => {
    if (!key) return '';
    
    // 1. Direct lookup in current language dictionary
    if (devTranslations[lang][key]) {
      return devTranslations[lang][key];
    }

    // 2. Bidirectional translation: find key by value in other language
    if (lang === 'en') {
      const entry = Object.entries(devTranslations.ar).find(([_, val]) => val === key);
      if (entry && devTranslations.en[entry[0]]) {
        return devTranslations.en[entry[0]];
      }
    } else {
      const entry = Object.entries(devTranslations.en).find(([_, val]) => val === key);
      if (entry && devTranslations.ar[entry[0]]) {
        return devTranslations.ar[entry[0]];
      }
    }

    // 3. Fallback to compound substring translation
    let result = key;
    const dictSource = lang === 'en' ? devTranslations.ar : devTranslations.en;
    const dictTarget = lang === 'en' ? devTranslations.en : devTranslations.ar;

    const items = Object.entries(dictSource)
      .filter(([_, val]) => typeof val === 'string' && val.length > 0)
      .sort((a, b) => b[1].length - a[1].length);

    for (const [k, val] of items) {
      if (result.includes(val)) {
        result = result.replace(val, dictTarget[k]);
      }
    }

    return result;
  }, [lang]);

  return { t, lang, isRTL: lang === 'ar' };
}
