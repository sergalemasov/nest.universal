import { readFileSync } from 'fs';

import domino = require('domino');

export function applyDomino(global, templatePath) {
  const template = readFileSync(templatePath).toString();
  const win = domino.createWindow(template);

  /* tslint:disable-next-line:no-string-literal */
  global['window'] = win;
  Object.defineProperty(
    win.document.body.style,
    'transform',
    createTransformOptions(),
  );

  /* tslint:disable:no-string-literal */
  global['document'] = win.document;
  global['CSS'] = null;
  global['Prism'] = null;
  /* tslint:enable:no-string-literal */
}

export function createTransformOptions() {
  const value = () => ({
    enumerable: true,
    configurable: true,
  });
  return { value };
}
