'use strict'

// We specify all options to avoid them being overridden
// We use JavaScript instead of JSON or YAML so that this file can be exported
// as the package's main file. We need to do that so it can be a shareable
// configuration.
module.exports = {
  // Same as .editorconfig (and also default values)
  printWidth: 80,
  tabWidth: 4,
  useTabs: false,

  quoteProps: 'as-needed',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  htmlWhitespaceSensitivity: 'css',
  arrowParens: 'always',
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'es5',
  proseWrap: 'always',

  // Same as .editorconfig (but different from default values)
  // `.gitattributes` with `* text=auto eol=lf` is also needed to prevent
  // Git from using CRLF on Windows.
  endOfLine: 'lf',
}
