export default {
    // Resolve imports normally, but inject syntheticNamedExports into the options if not external
    resolveId(id, importer) {
        const normalResolutionP = this.resolve(id, importer, {
            skipSelf: true,
        });

        return normalResolutionP.then((normalResolution) => {
            const result = normalResolution || { id: id };
            if (result.external) {
                return null;
            }
            result.syntheticNamedExports = true;
            return result;
        });
    },
};
