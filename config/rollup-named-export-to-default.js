const warnMixedExport = (id) =>
    console.error(
        `ERROR: Default exports are not supported unless there are no other named exports. Please fix this or else the script WILL NOT work! (${id})`
    );

// Default class exports become named exports with empty declaration properties in AST (maybe because of babel transpilation?)
const isFakeNamedExport = (astNode) =>
    astNode.type === 'ExportNamedDeclaration' && astNode.declaration === null;

export default {
    transform(code, id) {
        if (id.startsWith('\0')) return;
        const ast = this.parse(code);
        const myCode = code.split('');
        const myExports = [];
        let hasDefault = false;
        let offset = 0;
        // Strip export statements from named exports
        ast.body
            .filter((_) => _.type.startsWith('Export'))
            .forEach((_) => {
                if (
                    _.type === 'ExportDefaultDeclaration' ||
                    isFakeNamedExport(_)
                ) {
                    // Warn about default exports if mixed with named exports
                    hasDefault = true;
                    if (myExports.length) warnMixedExport(id);
                } else if (_.type === 'ExportNamedDeclaration') {
                    const start = _.start - offset;
                    const end = _.declaration.start - offset;
                    const length = end - start;

                    // Warn about default exports if mixed with named exports
                    if (hasDefault) warnMixedExport(id);

                    // Strip export keyword from named exports
                    myCode.splice(start, length);
                    offset += length;

                    // Save named exports to list
                    _.declaration.declarations.forEach((declaration) =>
                        myExports.push(declaration.id.name)
                    );
                } else {
                    // TODO: Figure out how to handle namespace imports and re-exports...
                    console.error(
                        `ERROR: Currently only named or default exports are supported! This script will not work until any re-exports/namespace exports are removed (${id})`
                    );
                }
            });

        // Don't create a new default export if we have no named exports or there was already a default export
        if (!myExports || hasDefault) return;

        // Insert a new default export statement that repackages the removed exports
        const outroStart = '\n\nexport default {';
        const outroEnd = '};';
        const outroParts = myExports.map(
            (exportName) => `${exportName}: ${exportName}`
        );
        return myCode.join('') + outroStart + outroParts.join(', ') + outroEnd;
    },
};
