import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker';

import { registerHighlighter } from './highlight';

(self as any).MonacoEnvironment = {
  async getWorker(_: any) {
    return new EditorWorker();
  },
};

export async function createMonaco(
  dom: HTMLElement,
  options: any,
): Promise<monaco.editor.IStandaloneCodeEditor> {
  return registerHighlighter(monaco).then((theme) => {
    return monaco.editor.create(dom, {
      ...options,
      theme: theme.light,
    });
  });
}
