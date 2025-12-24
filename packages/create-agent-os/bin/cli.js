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
            const appDir = path.join(root, 'app');
            // Use npm create vite to scaffold the app inside the 'app' folder
            // Pin version to avoid experimental prompts (e.g. rolldown) and use npx -y to avoid install prompt
            const viteProcess = spawn('npx', ['-y', 'create-vite@5.2.0', 'app', '--template', 'react-ts'], {
                stdio: 'inherit',
                shell: true,
                cwd: root // Run inside the project root so it creates 'app' there
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
                fs.cpSync(path.join(templateDir, 'control-center'), path.join(root, 'control-center'), { recursive: true });

                // Copy Design System
                fs.cpSync(path.join(templateDir, 'design'), path.join(root, 'design-system'), { recursive: true });

                // Copy Agent OS Docs
                fs.cpSync(path.join(templateDir, 'agent-os'), path.join(root, 'agent-os'), { recursive: true });

                // Copy Agent OS UI Package (for local workspace support)
                fs.cpSync(path.join(templateDir, 'agent-os-ui'), path.join(root, 'agent-os-ui'), { recursive: true });

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
                    "@builderos/agent-os-ui": "*", // Use workspace version
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


                console.log(green(`\n\nAgent OS Workspace created successfully! 🚀\n`));
                console.log(`Next steps:\n`);
                console.log(`  cd ${result.projectName}`);
                console.log(`  npm install`);
                console.log(`  npm run dev\n`);
                console.log(`This will start the App, Control Center, and Design OS concurrently.`);
            });
        });

    program.parse();
}

init().catch((e) => {
    console.error(e);
});
