'use strict';

/*
 * Build script (replaces the previous Gulp pipeline).
 *
 * Reproduces the exact behavior of GulpFile.js:
 *
 *   `es5` task:
 *     - reads  src/*.es6.js
 *     - transpiles with Babel
 *     - writes dist/<basename without ".es6">.js
 *     - writes dist/<basename without ".es6">.min.js (uglified + banner)
 *
 *   `default` task (depends on `es5`):
 *     - reads  src/*.js  (excluding *.es6.js)
 *     - writes dist/<basename>.js
 *     - writes dist/<basename>.min.js (uglified + banner)
 *     - reads  src/*.es6.js
 *     - writes dist/<basename>.es6.js (untouched copy)
 */

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const { minify } = require('terser');

const pkg = require('./package.json');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

const banner = [
    '/**',
    ` * ${pkg.name} - ${pkg.description}`,
    ` * @version v${pkg.version}`,
    ` * @link ${pkg.homepage}`,
    ` * @license ${pkg.license} : https://github.com/nico3333fr/van11y-accessible-accordion-aria/blob/master/LICENSE`,
    ' */',
    ''
].join('\n');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function listSrcFiles() {
    return fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.js'));
}

async function writeMinified(destPath, code) {
    const result = await minify(code);
    if (result.error) {
        throw result.error;
    }
    fs.writeFileSync(destPath, banner + result.code);
}

async function buildEs5() {
    ensureDir(DIST_DIR);

    const es6Files = listSrcFiles().filter((f) => f.endsWith('.es6.js'));

    for (const file of es6Files) {
        const srcPath = path.join(SRC_DIR, file);
        const baseName = file.replace(/\.es6\.js$/, '');

        const transpiled = babel.transformFileSync(srcPath, {
            babelrc: true,
            configFile: true
        });

        const distJsPath = path.join(DIST_DIR, `${baseName}.js`);
        const distMinPath = path.join(DIST_DIR, `${baseName}.min.js`);

        fs.writeFileSync(distJsPath, transpiled.code);
        await writeMinified(distMinPath, transpiled.code);
    }
}

async function buildDefault() {
    await buildEs5();

    ensureDir(DIST_DIR);

    const allFiles = listSrcFiles();
    const plainJsFiles = allFiles.filter((f) => !f.endsWith('.es6.js'));
    const es6Files = allFiles.filter((f) => f.endsWith('.es6.js'));

    for (const file of plainJsFiles) {
        const srcPath = path.join(SRC_DIR, file);
        const code = fs.readFileSync(srcPath, 'utf8');
        const baseName = file.replace(/\.js$/, '');

        const distJsPath = path.join(DIST_DIR, `${baseName}.js`);
        const distMinPath = path.join(DIST_DIR, `${baseName}.min.js`);

        fs.writeFileSync(distJsPath, code);
        await writeMinified(distMinPath, code);
    }

    for (const file of es6Files) {
        const srcPath = path.join(SRC_DIR, file);
        const distPath = path.join(DIST_DIR, file);
        fs.copyFileSync(srcPath, distPath);
    }
}

const task = process.argv[2] || 'default';

const tasks = {
    default: buildDefault,
    es5: buildEs5
};

if (!tasks[task]) {
    console.error(`Unknown task: ${task}. Available tasks: ${Object.keys(tasks).join(', ')}`);
    process.exit(1);
}

tasks[task]()
    .then(() => {
        console.log(`Build task "${task}" completed.`);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
