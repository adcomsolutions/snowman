export default {
    clientIncludesImport:
        '(global.AbstractAjaxProcessor || AbstractAjaxProcessor)',
    rhinoPolyfillPath: 'src/rhino-polyfills.js',
    snowGlobalsFile: 'config/snow-globals.js',
    babelExt: 'mjs',
    jsExt: 'js',
    fieldFileTopLevel: 'sn',
    scriptIncludeDirName: 'Script Include',
    scriptIncludeActiveSubdir: 'active_true',
    includesPattern: '$TOPLEVEL/**/$SCRIPTINCLUDE/$SCRIPTINCLUDEACTIVE',
    libDir: '../x_admso_lib',
    libName: 'x_admso_lib',
    libPath: 'sn/Shared Library/Script Include/active_true',
    libAlias: 'lib',
    selfAlias: 'me',
};
