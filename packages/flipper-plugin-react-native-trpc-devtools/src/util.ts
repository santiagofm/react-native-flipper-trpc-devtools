import { HighlightManager } from "flipper-plugin";

export const TimestampFormatter = (
  value?: number,
  highlighter?: HighlightManager
) => {
  if (!value) return "-";

  const formattedValue = new Date(value).toLocaleTimeString(undefined, {
    hour12: false,
  });
  return highlighter?.render(formattedValue) ?? value;
};

export const DurationFormatter = (
  value?: number,
  highlighter?: HighlightManager
) => {
  if (!value) return "";

  const formattedValue = `${value}ms`;
  return highlighter?.render(formattedValue) ?? value;
};

export const toUpperCaseFirstChar = (word: string) => {
  const lowerCasedWord = word.toLowerCase();
  return lowerCasedWord.charAt(0).toUpperCase() + lowerCasedWord.slice(1);
};
