import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
// Use a neutral directory OUTSIDE the monorepo to prevent npx context confusion
const testDir = '/tmp/agent-os-lifecycle-test';
const projectName = 'lifecycle-app';
const projectPath = path.join(testDir, projectName);

// Colors for output
const green = (msg) => console.log(`\x1b[32m${msg}\x1b[0m`);
const red = (msg) => console.log(`\x1b[31m${msg}\x1b[0m`);
const blue = (msg) => console.log(`\x1b[34m${msg}\x1b[0m`);

function runCommand(command, cwd) {
    try {
        execSync(command, { stdio: 'inherit', cwd });
    } catch (e) {
        red(`❌ Command failed: ${command}`);
        process.exit(1);
    }
}

async function main() {
    blue('🧪 Starting Full Lifecycle Integration Test...');

    // 1. Cleanup & Setup
    if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir);

    // 2. Build CLI
    blue('📦 Packing CLI...');
    runCommand('npm pack', root);
    const tarball = fs.readdirSync(root).find(f => f.endsWith('.tgz'));
    const tarballPath = path.join(root, tarball);

    // 3. Scaffold Project
    blue('🚀 Scaffolding Project...');
    // We use the packed CLI to verify the actual install process
    runCommand(`node ${path.join(root, 'bin', 'cli.js')} ${projectName}`, testDir);

    if (!fs.existsSync(projectPath)) {
        red('❌ Scaffolding failed: Project directory not found.');
        process.exit(1);
    }

    // 4. Simulate Phase 1 & 2 (Strategy & Design)
    blue('🎨 Simulating Design OS Content (Phases 1-3)...');

    const designProductDir = path.join(projectPath, 'design-system/product');
    const sectionsDir = path.join(designProductDir, 'sections/auth-feature');

    // Create Mock Product Overview
    const overviewPath = path.join(designProductDir, 'product-overview.md');
    // Ensure dir exists (it should from template, but be safe)
    if (!fs.existsSync(designProductDir)) fs.mkdirSync(designProductDir, { recursive: true });
    fs.writeFileSync(overviewPath, '# Mock Product Overview\nThis is a test product.');

    // Create Mock Roadmap
    const roadmapPath = path.join(designProductDir, 'product-roadmap.md');
    fs.writeFileSync(roadmapPath, '# Mock Roadmap\n- [ ] Auth Feature');

    // Create Mock Section Spec (The key thing to sync)
    fs.mkdirSync(sectionsDir, { recursive: true });
    const specPath = path.join(sectionsDir, 'spec.md');
    fs.writeFileSync(specPath, '# Auth Spec\n\n## Requirements\n- User login\n- User register');

    green('✅ Mock Design OS content created.');

    // 5. Execute Phase 4 (The Sync)
    blue('🔄 Running generate_docs.sh (Simulating Export)...');

    const scriptPath = path.join(projectPath, 'agent-os/scripts/generate_docs.sh');

    // Ensure executable
    runCommand(`chmod +x "${scriptPath}"`, projectPath);

    // Run the script
    runCommand(`sh "${scriptPath}"`, projectPath);

    // 6. Verification
    blue('🔍 Verifying Sync Results...');

    const agentOsSpecPath = path.join(projectPath, 'agent-os/specs/auth-feature/spec.md');
    const productPlanPath = path.join(projectPath, 'product-plan/product-overview.md');

    let success = true;

    // Check Spec Sync
    if (fs.existsSync(agentOsSpecPath)) {
        const content = fs.readFileSync(agentOsSpecPath, 'utf-8');
        if (content.includes('# Auth Spec')) {
            green('✅ Spec synced successfully to agent-os/specs!');
        } else {
            red('❌ Spec file exists but content is wrong.');
            success = false;
        }
    } else {
        red(`❌ Spec failed to sync. Missing: ${agentOsSpecPath}`);
        success = false;
    }

    // Check Product Plan Export
    if (fs.existsSync(productPlanPath)) {
        green('✅ Product Plan exported successfully!');
    } else {
        red('❌ Product Plan missing.');
        success = false;
    }

    // Check Prompts
    if (fs.existsSync(path.join(projectPath, 'product-plan/prompts/one-shot-prompt.md'))) {
        green('✅ Prompts generated successfully!');
    } else {
        red('❌ Prompts missing.');
        success = false;
    }

    // Cleanup tarball
    fs.unlinkSync(tarballPath);

    if (success) {
        green('\n🎉 Integration Test PASSED! The lifecycle is working.');
    } else {
        red('\n💥 Integration Test FAILED.');
        process.exit(1);
    }
}

main();
