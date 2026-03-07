const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const args = process.argv.slice(2);
const shouldObfuscate = args.includes('--obfuscate');
const shouldMinify = args.includes('--minify');

const SRC = __dirname;
const DIST = path.join(SRC, 'dist');

// JS files to obfuscate/minify
const JS_FILES_SECURE = ['config.js', 'utils.js', 'modal.js', 'app.js', 'translate.js'];
// JS files to just copy as-is
const JS_FILES_COPY = ['slide.js', 'feedback.js', 'faq.js', 'footer.js', 'disableDevtool.js'];

async function clean() {
    console.log('[CLEAN] Removing old dist folder...');
    await fs.remove(DIST);
}

async function prepare() {
    console.log('[CREATE] Creating dist folder structure...');
    await fs.ensureDir(path.join(DIST, 'public', 'js'));
    await fs.ensureDir(path.join(DIST, 'public', 'styles'));
    await fs.ensureDir(path.join(DIST, 'public', 'meta'));
    await fs.ensureDir(path.join(DIST, 'public', 'videos'));
}

async function processJS() {
    if (shouldObfuscate) {
        console.log('\n[STEP 1] Obfuscating JavaScript files...');
        for (const file of JS_FILES_SECURE) {
            const input = path.join(SRC, 'public', 'js', file);
            const output = path.join(DIST, 'public', 'js', file);
            if (!fs.existsSync(input)) {
                console.log(`  [SKIP] ${file} not found, skipping...`);
                continue;
            }
            try {
                console.log(`  [OBF] Obfuscating ${file}...`);
                execSync(
                    `npx javascript-obfuscator "${input}" --output "${output}" --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64 --unicode-escape-sequence true`,
                    { stdio: 'pipe' }
                );
            } catch (err) {
                console.error(`  [ERROR] Failed to obfuscate ${file}, copying as-is...`);
                await fs.copy(input, output);
            }
        }
    } else if (shouldMinify) {
        console.log('\n[STEP 1] Minifying JavaScript files...');
        for (const file of JS_FILES_SECURE) {
            const input = path.join(SRC, 'public', 'js', file);
            const output = path.join(DIST, 'public', 'js', file);
            if (!fs.existsSync(input)) continue;
            try {
                console.log(`  [MIN] Minifying ${file}...`);
                execSync(`npx terser "${input}" -o "${output}" -c -m`, { stdio: 'pipe' });
            } catch (err) {
                console.error(`  [ERROR] Failed to minify ${file}, copying as-is...`);
                await fs.copy(input, output);
            }
        }
    } else {
        console.log('\n[STEP 1] Copying JavaScript files (no obfuscation)...');
        for (const file of JS_FILES_SECURE) {
            const input = path.join(SRC, 'public', 'js', file);
            const output = path.join(DIST, 'public', 'js', file);
            if (fs.existsSync(input)) await fs.copy(input, output);
        }
    }

    // Always copy the remaining JS files as-is
    for (const file of JS_FILES_COPY) {
        const input = path.join(SRC, 'public', 'js', file);
        const output = path.join(DIST, 'public', 'js', file);
        if (fs.existsSync(input)) {
            console.log(`  [COPY] ${file}`);
            await fs.copy(input, output);
        }
    }
}

async function copyAssets() {
    console.log('\n[STEP 2] Copying CSS...');
    await fs.copy(path.join(SRC, 'public', 'styles'), path.join(DIST, 'public', 'styles'));

    console.log('[STEP 3] Copying images and SVGs...');
    const exts = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp'];
    const publicDir = path.join(SRC, 'public');
    const items = await fs.readdir(publicDir);
    for (const item of items) {
        const ext = path.extname(item).toLowerCase();
        if (exts.includes(ext)) {
            await fs.copy(path.join(publicDir, item), path.join(DIST, 'public', item));
        }
    }

    // Copy meta folder
    const metaSrc = path.join(SRC, 'public', 'meta');
    if (fs.existsSync(metaSrc)) {
        await fs.copy(metaSrc, path.join(DIST, 'public', 'meta'));
    }

    // Copy videos folder
    const videosSrc = path.join(SRC, 'public', 'videos');
    if (fs.existsSync(videosSrc)) {
        await fs.copy(videosSrc, path.join(DIST, 'public', 'videos'));
    }

    // Copy fonts folder
    const fontsSrc = path.join(SRC, 'public', 'fonts');
    if (fs.existsSync(fontsSrc)) {
        await fs.ensureDir(path.join(DIST, 'public', 'fonts'));
        await fs.copy(fontsSrc, path.join(DIST, 'public', 'fonts'));
    }

    // Copy robots.txt
    const robotsSrc = path.join(SRC, 'public', 'robots.txt');
    if (fs.existsSync(robotsSrc)) {
        await fs.copy(robotsSrc, path.join(DIST, 'public', 'robots.txt'));
    }

    // Copy favicon
    const faviconSrc = path.join(SRC, 'public', 'favicon-32x32.png');
    if (fs.existsSync(faviconSrc)) {
        await fs.copy(faviconSrc, path.join(DIST, 'public', 'favicon-32x32.png'));
    }
}

async function copyHTML() {
    console.log('\n[STEP 4] Copying HTML files...');
    await fs.copy(path.join(SRC, 'index.html'), path.join(DIST, 'index.html'));
    await fs.copy(path.join(SRC, 'required.html'), path.join(DIST, 'required.html'));
}

async function copyVercelConfig() {
    console.log('\n[STEP 5] Copying Vercel config...');
    const distVercel = path.join(SRC, 'dist-vercel.json');
    if (fs.existsSync(distVercel)) {
        await fs.copy(distVercel, path.join(DIST, 'vercel.json'));
    }
}

async function build() {
    console.log('========================================');
    console.log('   Building Production Version');
    if (shouldObfuscate) console.log('   Mode: Obfuscate');
    else if (shouldMinify) console.log('   Mode: Minify');
    else console.log('   Mode: Copy only');
    console.log('========================================\n');

    try {
        await clean();
        await prepare();
        await processJS();
        await copyAssets();
        await copyHTML();
        await copyVercelConfig();

        console.log('\n========================================');
        console.log('   Build Complete!');
        console.log('========================================');
        console.log('Production files are ready in: dist/');
    } catch (err) {
        console.error('\n[ERROR] Build failed:', err.message);
        process.exit(1);
    }
}

build();
