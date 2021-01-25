import type {ColorJson} from './colorJson';

const FALLBACK_COLOR = '#ccc';

export function getLanguageColor(targetLanguage: string, colorJson: ColorJson) {
  const languageInfo = Object.entries(colorJson).find(
    (language) => language[0] === targetLanguage
  );
  const color =
    languageInfo === undefined ? FALLBACK_COLOR : languageInfo[1].color;
  return color || FALLBACK_COLOR;
}
