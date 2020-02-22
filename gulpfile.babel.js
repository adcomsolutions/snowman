/* eslint-disable */

const _ = require('highland')
const gulp = require('gulp')
const Vinyl = require('vinyl')
const clipboard = require('gulp-clipboard')
const cheerio = require('gulp-cheerio')
const rollup = require('gulp-better-rollup')
const rollupAlias = require('@rollup/plugin-alias')
const rollupBabel = require('rollup-plugin-babel')
const prettier = require('gulp-prettier')
const eslint = require('gulp-eslint')
const watcher = require('gulp-watch')
const pkg = require('./package.json')
const process = require('process')
const childProcess = require('child_process')
const fs = require('fs-extra')
const klaw = require('klaw')

const filesToStream = _.compose(_, gulp.src)
const globToWatcherStream = _.compose(_, watcher)

const xmlScriptSelector = 'script, g\\:evaluate, g2\\:evaluate'
const hackyDelimiter = '!!!DELIMITER!!!THISISANOGOODVERYBAD!!!DELIMITER!!!'

const cheerioOptions = {
  xmlMode: true,
  decodeEntities: false,
}

//Change to the dir being executed from once dependencies are imported
const basePath = process.cwd()
process.chdir(process.env.INIT_CWD)

//Paths
const artifactDirName = 'artifacts'
const buildPath = `${basePath}/${artifactDirName}`
const tempBuildPath = `${basePath}/temp`
const jsSourceBase = `${basePath}/src`
const jsLibs = `${jsSourceBase}/shared`
const jsSourceFiles = `${jsSourceBase}/**/*.js`
const xmlSourceFiles = `${jsSourceBase}/**/*.xml`
const packageScripts = [
  `${basePath}/gulpfile.babel.js`,
  `${basePath}/.prettierrc.js`,
]
const packageJson = `${basePath}/package.json`

//Prevent external programs (like xclip) from hanging tasks
gulp.on('stop', () => {
  process.exit(0)
})

const mehRandom = () =>
  Math.random()
    .toString(16)
    .substr(2, 8)

const bundleBanner = `/*
Rollup file built on ${new Date().toGMTString()} using build environment version ${
  pkg.version
}
*/`

const rollupFn = rollup(
  {
    plugins: [
      rollupAlias({
        entries: {
          lib: jsLibs
        }
      }),
      rollupBabel({
        exclude: 'node_modules/**',
        plugins: [
          ['@babel/proposal-nullish-coalescing-operator'],
          ['@babel/proposal-optional-catch-binding'],
          ['@babel/proposal-optional-chaining'],
          ['@babel/transform-member-expression-literals'],
          ['@babel/transform-property-literals'],
          ['@babel/transform-arrow-functions'],
          ['@babel/transform-block-scoped-functions'],
          ['@babel/transform-block-scoping'],
          ['@babel/transform-classes', { loose: true }],
          ['@babel/transform-computed-properties', { loose: true }],
          ['@babel/transform-destructuring', { loose: true }],
          ['@babel/transform-literals'],
          ['@babel/transform-parameters'],
          ['@babel/transform-shorthand-properties'],
          ['@babel/transform-spread', { loose: true }],
          ['@babel/transform-template-literals', { loose: true, spec: true }],
          ['@babel/transform-exponentiation-operator'],
          ['transform-for-of-as-array']
        ],
        presets: ["@babel/env"]
      }),
    ],
  },
  {
    banner: bundleBanner,
    format: 'iife',
    strict: false,
  },
)

//now-sync shell stuff
const redirectTask = _.curry((cmd, targetDir, cb) => {
  const child = childProcess.spawn(cmd[0], cmd.slice(1), {
    stdio: 'inherit',
    cwd: targetDir,
  })
  child.on('close', cb)
})
const nowTask = (nowArgs) =>
  redirectTask(['npx', 'now'].concat(nowArgs), basePath)

const pullFile = (vinyl) => {
  childProcess.spawnSync('npx', ['now', 'pull', vinyl.path], {stdio: 'inherit'})
  return vinyl
}

const pushFile = (vinyl) => {
  childProcess.spawnSync('npx', ['now', 'push', vinyl.path], {stdio: 'inherit'})
  return vinyl
}

const addFile = (cb) => {
  const child = childProcess.spawn('npx', ['now', 'add'], { stdio: 'inherit' })
  child.on('close', () =>
    _(klaw(buildPath))
      .filter((item) => item.stats.isDirectory())
      .pluck('path')
      .map((path) =>
        fs.copy(path, path.replace(buildPath, jsSourceBase), {
          overwrite: false,
        }),
      )
      .collect()
      .toCallback(cb),
  )
}

const argFilter = (arg) => {
  const blacklist = [...tasks.keys()]
    .map((item) => new RegExp(`(^|\\\\|\/)${item}(:\\S+)?$`))
    .concat([/(^|\\|\/)gulp$/, /^-/])
  return blacklist.reduce((memo, x) => !arg.match(x) && memo, true)
}

const fileArgumentStream = _(process.argv)
  .slice(1)
  .filter(argFilter)
  .flatMap(filesToStream)

const formatterStream = _([jsSourceFiles, packageScripts, packageJson]).flatMap(
  filesToStream,
)

const linterStream = _([jsSourceFiles, xmlSourceFiles]).flatMap(filesToStream)

const xmlFilter = (item) => item.extname === '.xml'
const bundler = _.curry((fileStream, outFn) => {
  const xmlStream = fileStream
    .fork()
    .filter(xmlFilter)
    .through(xmlRollupFn)
  const mainStream = fileStream
    .fork()
    .reject(xmlFilter)
    .through(rollupFn)
  return _([mainStream, xmlStream])
    .merge()
    .through(outFn)
})

const formatter = _.curry((fileStream, outFn) =>
  fileStream.through(prettier()).through(outFn),
)

const linter = _.curry((fileStream, outFn) => {
  const xmlStream = fileStream.fork().filter(xmlFilter)
  const mainStream = fileStream
    .fork()
    .reject(xmlFilter)
    .through(prettier())
  return _([mainStream, xmlStream])
    .merge()
    .through(
      eslint({
        cache: true,
        fix: true,
      }),
    )
    .through(eslint.format())
    .through(outFn)
})

const argBundler = bundler(fileArgumentStream)
const jsWatchBundler = bundler(globToWatcherStream(jsSourceFiles))

const taskWrapper = _.curry((outFn, bundlerFn, cb) =>
  bundlerFn(outFn)
    .collect()
    .toCallback(cb),
)

//Output wrappers
const artifactWrapper = taskWrapper(
  gulp.dest((vinyl) => vinyl.base.replace(jsSourceBase, buildPath)),
)
const writeWrapper = taskWrapper(gulp.dest(({ base }) => base))
const clipWrapper = taskWrapper(clipboard())

const lintWrapper = _.compose(writeWrapper, linter)
const formatWrapper = _.compose(writeWrapper, formatter)

const syncWrapper = taskWrapper(
  _.pipeline(
    _.tap((vinyl) => fs.removeSync(buildPath)),
    _.tap((vinyl) => fs.ensureDirSync(buildPath)),
    _.through(
      gulp.dest((vinyl) => vinyl.base.replace(jsSourceBase, buildPath)),
    ),
    _.tap((vinyl) => fs.writeFileSync(vinyl.path, vinyl.contents)),
    _.map(pushFile)
  ),
)

// Very hacky wrapper that lets functions made for JS files work on script tags within xml documents
// Assumes the wrapped function returns a Vinyl object pointing to an artifact we can safely delete
const xmlFn = _.curry((fn, fileStream) => {
  const extractXmlScripts = cheerio({
    parserOptions: cheerioOptions,
    run: (selector) => {
      const scriptTexts = selector(xmlScriptSelector)
        .toArray()
        .map((script) => selector(script).text())
      // HACK: No real extract method, so we instead swap it with the output html
      // HACK: This is obviously not the right way to delimit script data, but JSON is slower
      selector.root().html(scriptTexts.join(hackyDelimiter))
    },
  })

  const originalStream = fileStream.fork()
  const scriptStream = fileStream
    .fork()
    .through(extractXmlScripts)
    .flatMap((vinyl) =>
      _(vinyl.contents.toString().split(hackyDelimiter))
        .map((scriptString) => {
          const res = new Vinyl({
            cwd: vinyl.cwd,
            base: vinyl.base,
            path: vinyl.path,
            contents: Buffer.from(scriptString),
          })
          // HACK: Scramble the name a bit so it doesn't overwrite anything when we temporarily create it
          // HACK: This only *probably* doesn't collide with itself
          res.stem += mehRandom()
          res.extname = '.js'
          // HACK: We sneak in the path of the original source file here, since the function is liable to modify the original path.
          // HACK: This means the wrapper breaks if the function returns a new Vinyl object instead of modifying the existing one
          res.tempPath = res.path
          fs.writeFileSync(res.path, res.contents)
          return res
        })
        .through(fn)
        .map((file) => {
          const res = file.contents.toString()
          // HACK: These temporary files need to be cleaned up once the function is done with them
          file.contents = null
          if (fs.existsSync(file.tempPath)) {
            fs.removeSync(file.tempPath)
          }
          if (fs.existsSync(file.path)) {
            fs.removeSync(file.path)
          }
          return res
        })
        .collect(),
    )

  return originalStream.zip(scriptStream).flatMap(([originalFile, scripts]) =>
    _([originalFile])
      .map((file) => {
        file.contents = fs.readFileSync(file.path)
        file.cheerio = undefined
        return file
      })
      .through(
        cheerio({
          parserOptions: cheerioOptions,
          run: (selector) =>
            selector(xmlScriptSelector).each((index, element) => {
              selector(element).text(scripts[index])
            }),
        }),
      ),
  )
})

const xmlRollupFn = xmlFn(rollupFn)

const tasks = new Map([
  ['now:import', addFile],
  ['now:config', nowTask(['config', `--filePath=./${artifactDirName}`])],
  ['now:check', nowTask(['check'])],
  ['lint', lintWrapper(fileArgumentStream)],
  ['lint:all', lintWrapper(linterStream)],
  ['build', artifactWrapper(argBundler)],
  ['build:clip', clipWrapper(argBundler)],
  ['build:sync', syncWrapper(argBundler)],
  ['watch', artifactWrapper(jsWatchBundler)],
  ['watch:clip', clipWrapper(jsWatchBundler)],
  ['watch:sync', syncWrapper(jsWatchBundler)],
  ['format', formatWrapper(fileArgumentStream)],
  ['format:all', formatWrapper(formatterStream)],
])

tasks.forEach((fn, name) => gulp.task(name, fn))

module.exports.default = gulp.task('watch:clip')
