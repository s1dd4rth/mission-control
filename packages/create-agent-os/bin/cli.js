#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import prompts from 'prompts';
import { red, green, bold, cyan } from 'kolorist';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cwd = process.cwd();

async function init() {
    const program = new Command();

    program
        .name('create-agent-os')
        .description('Scaffold a new Agent OS application')
        .argument('[project-directory]', 'Directory to create the application in')
        .action(async (targetDir) => {
            let result = { projectName: targetDir };

            if (!targetDir) {
                result = await prompts({
                    type: 'text',
                    name: 'projectName',
                    message: 'Project name:',
                    initial: 'my-agent-app'
                });
            }

            if (!result.projectName) return;

            const root = path.resolve(cwd, result.projectName);
            console.log(`\n${bold('Creating Agent OS workspace in:')} ${green(root)}\n`);

            if (fs.existsSync(root)) {
                console.log(red(`Error: Directory ${result.projectName} already exists.`));
                process.exit(1);
            }

            fs.mkdirSync(root, { recursive: true });

            // 1. Scaffold App (Client)
            console.log(cyan('1. Scaffolding Client App...'));

            // Force change directory to the project root
            // This is the most reliable way to ensure npx runs in the correct context
            try {
                process.chdir(root);
                console.log(`Changed CWD to: ${process.cwd()}`);
            } catch (err) {
                console.error(red(`Failed to change directory to ${root}: ${err.message}`));
                process.exit(1);
            }

            const appDir = path.join(root, 'app');

            // Use npm create vite to scaffold the app inside the 'app' folder
            // Debugging CI/CD path issues
            console.log(`[DEBUG] Root: ${root}`);
            console.log(`[DEBUG] CWD before spawn: ${process.cwd()}`);
            console.log(`[DEBUG] Spawning in: ${root}`);

            // Use npm create vite to scaffold the app inside the 'app' folder
            // Pin version to avoid experimental prompts
            // Use npm create vite to scaffold the app inside the 'app' folder
            // Pin version to avoid experimental prompts
            const isWin = process.platform === 'win32';
            const cmd = isWin ? 'npx.cmd' : 'npx'; // explicitly use .cmd on windows for clarity, though shell:true might find it
            const viteProcess = spawn(cmd, ['-y', 'create-vite@5.2.0', 'app', '--template', 'react-ts'], {
                stdio: 'inherit',
                shell: isWin, // Windows needs shell:true for .cmd execution
                cwd: root,
                env: { ...process.env, PWD: root }
            });

            viteProcess.on('close', async (code) => {
                if (code !== 0) {
                    console.error(red('Vite scaffolding failed.'));
                    process.exit(code);
                }

                // 2. Copy Templates
                console.log(cyan('\n2. Installing Control Center & Design OS...'));
                const templateDir = path.resolve(__dirname, '../src/template');

                // Copy Control Center
                // Copy helper to exclude node_modules
                const copyOptions = {
                    recursive: true
                    // filter: (src) => !src.includes('node_modules') // ERROR: This filters out everything if CLI is installed in node_modules!
                };

                // Copy Control Center
                fs.cpSync(path.join(templateDir, 'control-center'), path.join(root, 'control-center'), copyOptions);

                // Copy Design System
                fs.cpSync(path.join(templateDir, 'design-system'), path.join(root, 'design-system'), copyOptions);

                // Copy Agent OS Docs
                fs.cpSync(path.join(templateDir, 'agent-os'), path.join(root, 'agent-os'), copyOptions);

                // Copy Agent OS UI Package (for local workspace support)
                const uiSrc = path.join(templateDir, 'agent-os-ui');
                // console.log('[DEBUG] Agent OS UI Src Files:', fs.readdirSync(uiSrc)); // Debugging missing file
                fs.cpSync(uiSrc, path.join(root, 'agent-os-ui'), copyOptions);
                fs.renameSync(path.join(root, 'agent-os-ui', 'package.json.manifest'), path.join(root, 'agent-os-ui', 'package.json'));

                // 3. Configure Workspace
                console.log(cyan('\n3. Configuring Workspace...'));

                // Root package.json
                const rootPkg = JSON.parse(fs.readFileSync(path.join(templateDir, 'package.json'), 'utf-8'));
                rootPkg.name = result.projectName;
                fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(rootPkg, null, 2));

                // App Package.json (Add dependencies)
                const appPkgPath = path.join(appDir, 'package.json');
                const appPkg = JSON.parse(fs.readFileSync(appPkgPath, 'utf-8'));

                appPkg.dependencies = {
                    ...appPkg.dependencies,
                    "@theproductguy/agent-os-ui": "file:../agent-os-ui", // Force local resolution
                    "lucide-react": "^0.469.0",
                    "clsx": "^2.1.0",
                    "tailwind-merge": "^2.2.0",
                    "autoprefixer": "^10.4.20",
                    "postcss": "^8.4.49",
                    "tailwindcss": "^3.4.17",
                    "react": "^18.3.1",
                    "react-dom": "^18.3.1"
                };

                // Inject App Template (App.tsx, vite.config.ts) - we need to make sure these exist in template dir or just write them
                // Re-using the logic from before, assuming App.tsx and vite.config.ts are in src/template top level?
                // Wait, I updated template structure. I should check where App.tsx is.
                // It was in src/template/App.tsx. I should move it to src/template/app-template? 
                // Or just leave it at top level and selective copy.

                // Let's assume they are still at src/template root for the app
                const appTemplateDir = templateDir;
                if (fs.existsSync(path.join(appTemplateDir, 'App.tsx'))) {
                    fs.copyFileSync(path.join(appTemplateDir, 'App.tsx'), path.join(appDir, 'src/App.tsx'));
                }
                if (fs.existsSync(path.join(appTemplateDir, 'vite.config.ts'))) {
                    fs.copyFileSync(path.join(appTemplateDir, 'vite.config.ts'), path.join(appDir, 'vite.config.ts'));
                }
                // Copy Tailwind config
                if (fs.existsSync(path.join(appTemplateDir, 'postcss.config.js'))) {
                    fs.copyFileSync(path.join(appTemplateDir, 'postcss.config.js'), path.join(appDir, 'postcss.config.js'));
                }
                if (fs.existsSync(path.join(appTemplateDir, 'tailwind.config.js'))) {
                    fs.copyFileSync(path.join(appTemplateDir, 'tailwind.config.js'), path.join(appDir, 'tailwind.config.js'));
                }
                // Copy CSS
                if (fs.existsSync(path.join(appTemplateDir, 'index.css'))) {
                    fs.copyFileSync(path.join(appTemplateDir, 'index.css'), path.join(appDir, 'src/index.css'));
                }


                fs.writeFileSync(appPkgPath, JSON.stringify(appPkg, null, 2));

                // 4. Copy root config files
                console.log(cyan('\n4. Setting up quality tooling...'));

                const rootConfigFiles = [
                    '.gitignore',
                    '.prettierrc',
                    '.env.example',
                    'eslint.config.js',
                    'commitlint.config.js',
                    'lint-staged.config.js',
                    'vitest.config.ts',
                    'README.md'
                ];

                for (const file of rootConfigFiles) {
                    const src = path.join(templateDir, file);
                    if (fs.existsSync(src)) {
                        fs.copyFileSync(src, path.join(root, file));
                    }
                }

                // Copy directories
                const rootDirs = ['.github', '.husky', '.vscode', 'src/__tests__'];
                for (const dir of rootDirs) {
                    const src = path.join(templateDir, dir);
                    if (fs.existsSync(src)) {
                        fs.cpSync(src, path.join(root, dir), copyOptions);
                    }
                }

                // 5. Initialize git repository
                console.log(cyan('\n5. Initializing git repository...'));
                try {
                    const { execSync } = await import('node:child_process');
                    execSync('git init', { cwd: root, stdio: 'inherit' });
                    execSync('git add .', { cwd: root, stdio: 'ignore' });
                } catch (e) {
                    console.log('  (Git initialization skipped - git may not be available)');
                }

                console.log(green(`\n\n✅ Agent OS Workspace created successfully! 🚀\n`));
                console.log(bold('What\'s included:'));
                console.log('  ✓ ESLint + Prettier + Husky pre-commit hooks');
                console.log('  ✓ Vitest for testing');
                console.log('  ✓ GitHub Actions CI workflow');
                console.log('  ✓ Impeccable design commands');
                console.log('  ✓ AI Slop Guard hook');
                console.log(`\n${bold('Next steps:')}\n`);
                console.log(`  cd ${result.projectName}`);
                console.log(`  npm install`);
                console.log(`  npm run dev\n`);
                console.log(`${bold('Recommended workflow:')}`);
                console.log(`  1. /plan-product     — Define your product`);
                console.log(`  2. /create-constitution — Set project principles`);
                console.log(`  3. /research-tech    — Research your stack`);
                console.log(`  4. /design-tokens    — Start designing`);
            });
        });

    program.parse();
}

init().catch((e) => {
    console.error(e);
});
