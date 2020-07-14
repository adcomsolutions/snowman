import { readFile, writeFile } from 'fs/promises';

// Scoped apps throw if you try to access __proto__, remap such attempts to the "type" field
// Rollup wants to clear out the prototype for spec compliance when doing namespace imports (by nulling out __proto__)
// Nulling out the type field instead is essentially a syntactic placeholder, not there for any particular effect
// HACK: I should probably try doing this within the Rollup API someday
const fixNsProto = (fileContents) =>
    fileContents.replace(/__proto__: null/g, 'type: null');

export const postProcessOutput = async (outputFilePath) => {
    const originalContents = await readFile(outputFilePath, 'utf8');
    return writeFile(outputFilePath, fixNsProto(originalContents));
};
