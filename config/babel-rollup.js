export default {
    exclude: 'node_modules/**',
    plugins: [
        ['@babel/plugin-transform-for-of', { loose: true }],
        ['@babel/proposal-nullish-coalescing-operator', { loose: true }],
        ['@babel/proposal-optional-catch-binding'],
        ['@babel/proposal-optional-chaining', { loose: true }],
        ['@babel/transform-member-expression-literals'],
        ['@babel/transform-property-literals'],
        ['@babel/transform-arrow-functions'],
        ['@babel/transform-block-scoped-functions'],
        ['@babel/transform-block-scoping'],
        ['@babel/transform-computed-properties', { loose: true }],
        ['@babel/transform-destructuring', { loose: true, useBuiltIns: true }],
        ['@babel/transform-literals'],
        ['@babel/transform-parameters', { loose: true }],
        ['@babel/transform-shorthand-properties'],
        ['@babel/transform-spread', { loose: true }],
        [
            '@babel/plugin-proposal-object-rest-spread',
            { loose: true, useBuiltIns: true },
        ],
        ['@babel/transform-template-literals', { loose: true }],
        ['@babel/transform-exponentiation-operator'],
    ],
};
