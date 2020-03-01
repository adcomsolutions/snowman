// Babel's resolver gets finnicky when the using it as a dependency of a package (possibly only an ES6 module issue?)
// We work around this by resolving plugin paths ourselves using node require scoped to this package
// HACK: This means you can't use the shorter babel import syntax that omits "plugin-"
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default {
    exclude: 'node_modules/**',
    babelrc: false,
    plugins: [
        ['@babel/plugin-transform-for-of', { loose: true }],
        ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: true }],
        ['@babel/plugin-proposal-optional-catch-binding'],
        ['@babel/plugin-proposal-optional-chaining', { loose: true }],
        ['@babel/plugin-transform-member-expression-literals'],
        ['@babel/plugin-transform-property-literals'],
        ['@babel/plugin-transform-arrow-functions'],
        ['@babel/plugin-transform-block-scoped-functions'],
        ['@babel/plugin-transform-block-scoping'],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-transform-classes', { loose: true }],
        ['@babel/plugin-transform-computed-properties', { loose: true }],
        [
            '@babel/plugin-transform-destructuring',
            { loose: true, useBuiltIns: true },
        ],
        ['@babel/plugin-transform-literals'],
        ['@babel/plugin-transform-parameters', { loose: true }],
        ['@babel/plugin-transform-shorthand-properties'],
        ['@babel/plugin-transform-spread', { loose: true }],
        [
            '@babel/plugin-proposal-object-rest-spread',
            { loose: true, useBuiltIns: true },
        ],
        ['@babel/plugin-transform-template-literals', { loose: true }],
        ['@babel/plugin-transform-exponentiation-operator'],
    ].map(([pluginPath, options]) => [require.resolve(pluginPath), options]),
};
