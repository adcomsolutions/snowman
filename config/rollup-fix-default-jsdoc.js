import MagicString from 'magic-string';

export default {
    renderChunk(code, chunk, options) {
        if (chunk.exports[0] !== 'default') return;

        const iifeName = options.name;
        const magicString = new MagicString(code);
        const declarationPattern = new RegExp(`\\n.*var ${iifeName} = `);
        const docPattern = new RegExp(
            '(\\n.*\\/\\*\\*(\\n\\s*\\*.*)*\\n.*\\*\\/)' +
                `\\n.*var ${iifeName}_script =`
        );
        const paramPattern = /\n\s*\*\s*@param/;

        const regResult = docPattern.exec(code);
        if (regResult?.[1] === undefined) return;

        const declarationIndex = declarationPattern.exec(code)?.index;
        if (declarationIndex === undefined) return;

        const startIndex = regResult.index;
        const endIndex = startIndex + regResult[1].length;

        magicString.move(startIndex, endIndex, declarationIndex);

        const firstParamOffset = paramPattern.exec(regResult[1])?.index;
        if (firstParamOffset !== undefined) {
            const firstParamIndex = startIndex + firstParamOffset;
            magicString
                .appendLeft(firstParamIndex, `\n* @callback ${iifeName}`)
                .appendRight(endIndex, `\n/** @type ${iifeName} */`);
        }

        return magicString.toString();
    },
};
