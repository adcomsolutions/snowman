import { getWorkspaceDir } from '../src/vs-helper.js';

export default (inputPath) => ({
    include: {},
    paths: [getWorkspaceDir(inputPath)],
    external: [],
    extensions: ['.js', '.script.js'],
});
