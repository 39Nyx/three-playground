import { shikiToMonaco } from '@shikijs/monaco';
import { createHighlighter } from 'shiki';
import { createJavaScriptRegexEngine } from 'shiki/engine-javascript.mjs';
import langJsx from 'shiki/langs/jsx.mjs';
import langTsx from 'shiki/langs/tsx.mjs';
import langVue from 'shiki/langs/vue.mjs';
import themeDark from 'shiki/themes/andromeeda.mjs';
import themeLight from 'shiki/themes/catppuccin-latte.mjs';

let registered = false;

export async function registerHighlighter(monaco: any) {
  if (!registered) {
    const highlighter = await createHighlighter({
      themes: [themeLight, themeDark],
      langs: [langVue, langTsx, langJsx],
      engine: createJavaScriptRegexEngine(),
    });
    monaco.languages.register({ id: 'vue' });
    shikiToMonaco(highlighter, monaco);
    registered = true;
  }

  return {
    light: themeLight.name!,
    dark: themeDark.name!,
  };
}
