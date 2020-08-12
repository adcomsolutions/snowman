import yargs from 'yargs/yargs.js';

const newYargs = () => {
    const myYargs = yargs(process.argv.slice(2));
    return myYargs.parserConfiguration({
        'strip-aliased': true,
        'unknown-options-as-args': true,
    });
};

const getYargsData = (myYargs) => {
    const argv = { ...myYargs.argv };
    delete argv.$0;
    delete argv._;
    return argv;
};

export const getConfigYargs = () => {
    const myYargs = newYargs();

    // Set up watch mode flag
    myYargs.boolean('watch');
    myYargs.default('watch', false);
    myYargs.alias('watch', 'w');

    // Set up sync mode flag
    myYargs.boolean('sync');
    myYargs.default('sync', true);
    myYargs.alias('sync', 's');

    // Set up verbose logging flag
    myYargs.boolean('verbose');
    myYargs.default('verbose', false);
    myYargs.alias('verbose', 'v');

    // Set up debugging flag
    myYargs.boolean('debug');
    myYargs.default('debug', false);

    return getYargsData(myYargs);
};

export const getFileYargs = () => {
    const myYargs = newYargs();

    const addInputType = (name, shortName) => {
        myYargs.array(name);
        myYargs.default(name, []);
        myYargs.alias(name, shortName);
    };

    // Set up input parameters
    addInputType('background', 'bg');
    addInputType('includes', 'inc');

    return getYargsData(myYargs);
};
