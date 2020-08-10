import fs from 'fs';
import path from 'path';

export default {
    // Resolve imports normally, but inject syntheticNamedExports into the options if not external
    resolveId(id, importer) {
        // Catching bad file names is broken with syntheticNamedImports
        // We manually handle these situations to ensure we fail with a descriptive error message
        const idPath = importer ? path.resolve(path.dirname(importer), id) : id;
        // Manually resolve relative imports based on the importer before verifying the filepath
        if (!fs.existsSync(idPath))
            this.error(
                `${importer} attempted to import nonexistent file: ${id}`
            );

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
