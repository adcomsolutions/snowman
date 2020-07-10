export default {
    resolveId(id, importer) {
        // Ignore top level module
        if (importer === undefined) return null;
        // Resolve imports normally, but inject syntheticNamedExports into the options
        return this.resolve(id, importer, { skipSelf: true }).then(
            (resolved) => {
                const result = resolved || { id: id };
                result.syntheticNamedExports = true;
                return result;
            }
        );
    },
};
