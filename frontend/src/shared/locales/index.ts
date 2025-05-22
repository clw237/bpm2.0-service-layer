import { KF1Types } from 'kfone-component-library';
import translationDE from './de/translation.json';
import translationEN from './en/translation.json';

const appLanguageResources: KF1Types.LanguageOptionsType = {
  en: { translation: translationEN },
  de: { translation: translationDE },
};

export default appLanguageResources;
