import fs from 'fs-extra';

// Scoped apps throw if you try to access __proto__, remap such attempts to the "type" field
// Rollup wants to clear out the prototype for spec compliance when doing namespace imports (by nulling out __proto__)
// Nulling out the type field instead is essentially a syntactic placeholder, not there for any particular effect
// HACK: I should probably try doing this within the Rollup API someday
const fixNsProto = (fileContents) =>
    fileContents.replace(/__proto__: null/g, 'type: null');

// Yet more workarounds for __proto__
// Babel wants to use __proto__ for class inheritence, which obviously doesn't fly
// We replace the functionality with a sham based on the SNOW Object.extend function
// The extendObject function is avoided, because the original prototype would be discarded
// HACK: Maybe I should fork plugin-transform-classes with this change so it's less brittle?
const fixBabelInherit = (fileContents) =>
    fileContents.replace(
        /function _inheritsLoose\(subClass, superClass\) \{[\s\S]+?\}/,
        `function _inheritsLoose(subClass, superClass) { subClass = Object.extend(subClass, superClass); subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.initialize = subClass }`
    );

export const postProcessOutput = async (outputFilePath) => {
    const originalContents = await fs.readFile(outputFilePath, 'utf8');
    return fs.writeFile(
        outputFilePath,
        fixNsProto(fixBabelInherit(originalContents))
    );
};
