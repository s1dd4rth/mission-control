import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '../');
const CWD = process.cwd();

// Temp directory for smoke test
const TEST_DIR = path.join(CWD, 'smoke_test_temp');

try {
    console.log('🚬 Starting Smoke Test...');

    // 1. Cleanup previous runs
    if (fs.existsSync(TEST_DIR)) {
        console.log('Cleaning up previous test dir...');
        fs.rmSync(TEST_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(TEST_DIR);

    // 2. Build/Pack (Optional, mostly we just run the bin directly)
    // But let's verify we can run the bin.
    const cliPath = path.join(PACKAGE_ROOT, 'bin', 'cli.js');

    if (!fs.existsSync(cliPath)) {
        throw new Error(`CLI not found at ${cliPath}`);
    }

    // 3. Run Scaffold Command
    const projectName = 'my-smoke-app';
    const projectPath = path.join(TEST_DIR, projectName);

    console.log(`🚀 Scaffolding test project: ${projectName}...`);
    // We mock the process.argv or just spawn node
    // Using execSync to run it as a meaningful child process
    execSync(`node "${cliPath}" "${projectPath}"`, {
        stdio: 'inherit',
        cwd: TEST_DIR // Run from temp dir
    });

    // 4. Verify Files
    console.log('🔍 Verifying scaffolded files...');

    const expectedFiles = [
        path.join(projectPath, 'package.json'),
        path.join(projectPath, 'app/package.json'),
        path.join(projectPath, 'app/src/App.tsx'),
        path.join(projectPath, 'control-center/frontend/package.json'),
        path.join(projectPath, 'control-center/backend/package.json'),
        path.join(projectPath, 'design-system/package.json'),
        path.join(projectPath, 'agent-os/commands')
    ];

    expectedFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            throw new Error(`MISSING FILE: ${file}`);
        }
        console.log(`  ✅ Found ${path.relative(TEST_DIR, file)}`);
    });

    // 5. Verify Clean App Content (Junk Check)
    const appTsx = fs.readFileSync(path.join(projectPath, 'app/src/App.tsx'), 'utf-8');
    if (appTsx.includes('Follow these steps to build your product')) {
        throw new Error('❌ Junk data found in App.tsx (Old dashboard detected)');
    }
    if (!appTsx.includes('Your Agent OS App')) {
        throw new Error('❌ Check failed: App.tsx does not contain expected clean state');
    }
    console.log('  ✅ App.tsx is clean');

    console.log('\n🎉 Smoke Test Passed!');

    // Cleanup
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
    process.exit(0);

} catch (error) {
    console.error('\n💥 Smoke Test Failed!');
    console.error(error);
    if (fs.existsSync(TEST_DIR)) {
        // fs.rmSync(TEST_DIR, { recursive: true, force: true });
        console.log(`Test artifacts left in ${TEST_DIR} for inspection.`);
    }
    process.exit(1);
}
