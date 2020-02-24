import fs from 'fs-extra';

// Rhino throws if you try to access Proto, need to remap such attempts to a "type" field
// type isn't a Rhino-ism, it's just where SNOW expects the prototype info to appear
// HACK: I should probably try doing this within the Rollup API someday
const fixProto = (fileContents) =>
    fileContents.replace(/__proto__: /g, 'type: ');

export const postProcessOutput = async (outputFilePath) => {
    const originalContents = await fs.readFile(outputFilePath, 'utf8');
    return fs.writeFile(outputFilePath, fixProto(originalContents));
};
