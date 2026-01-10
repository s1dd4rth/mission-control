const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const app = express();
const PORT = process.env.PORT || 5403;
const DESIGN_PORT = process.env.DESIGN_PORT || 5400;
const APP_PORT = process.env.APP_PORT || 5402;

// Configuration
const PROJECT_ROOT = path.resolve(__dirname, '../..'); // learning-agent-os root
const APP_DIR = path.join(PROJECT_ROOT, 'app');
const AGENT_OS_DIR = path.join(PROJECT_ROOT, 'agent-os');

app.use(cors());
app.use(express.json());

// Helper to check file existence
const checkFile = (filePath) => {
    return fs.existsSync(path.join(AGENT_OS_DIR, filePath));
};

// Helper to parse markdown checkboxes
const parseStatus = (relativePath) => {
    const fullPath = path.join(AGENT_OS_DIR, relativePath);
    console.log(`Reading path: ${fullPath}`);
    if (!fs.existsSync(fullPath)) {
        console.log(`File not found: ${fullPath}`);
        return { exists: false, completed: 0, total: 0, nextItem: null, items: [] };
    }
    const content = fs.readFileSync(fullPath, 'utf-8');
    const total = (content.match(/- \[ \]/g) || []).length + (content.match(/- \[x\]/g) || []).length;
    const completed = (content.match(/- \[x\]/g) || []).length;

    // Find next incomplete item and all items
    let nextItem = null;
    const items = [];
    const lines = content.split('\n');

    for (const line of lines) {
        const match = line.match(/^\s*-\s*\[([ x])\]\s*(.+)$/);
        if (match) {
            const isCompleted = match[1] === 'x';
            const text = match[2].trim();
            // Clean up text (remove bolding, etc)
            const cleanText = text.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '');

            items.push({ name: cleanText, completed: isCompleted });

            if (!nextItem && !isCompleted) {
                nextItem = cleanText;
            }
        }
    }

    // Check for boilerplate indicators
    const boilerplateMarkers = [
        '[Your Product Name]',
        '[Database choice]',
        '[Role]',
        '[Feature 1]',
        '[Target Audience]',
        '[Unique Value Proposition',
        'MVP Launch',
        'First User',
        'Feature A'
    ];
    const isBoilerplate = boilerplateMarkers.some(marker => content.includes(marker));

    return { exists: true, isBoilerplate, completed, total, nextItem, items };
};

// Helper to check service health
const checkService = (port) => {
    return new Promise((resolve) => {
        const http = require('http');
        const req = http.get(`http://localhost:${port}/`, { timeout: 2000 }, (res) => {
            // If we get any response, the port is active and serving HTTP
            resolve(true);
            // conn.destroy(); // Not needed if we just consume/ignore. 
            // Actually, we should consume resume to avoid hanging? 
            // Or just destroy.
            res.resume();
        });

        req.on('error', (e) => {
            resolve(false);
        });

        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });
    });
};

// API: Get Project Status
app.get('/api/status', async (req, res) => {
    try {
        const productFiles = {
            mission: parseStatus('product/mission.md').exists ? parseStatus('product/mission.md') : parseStatus('product/product-overview.md'),
            roadmap: parseStatus('product/roadmap.md').exists ? parseStatus('product/roadmap.md') : parseStatus('product/product-roadmap.md'),
            techStack: parseStatus('product/tech-stack.md'),
        };

        // Get Specs
        const specDirs = glob.sync('specs/*/', { cwd: AGENT_OS_DIR });
        const specs = specDirs.map(dir => {
            const name = path.basename(dir);
            return {
                name,
                spec: parseStatus(`specs/${name}/spec.md`),
                tasks: parseStatus(`specs/${name}/tasks.md`),
            };
        });

        // Check Services
        const services = {
            api: true, // We are responding, so we are alive
            design: await checkService(DESIGN_PORT),
            app: await checkService(APP_PORT)
        };

        // Check for Design OS export and steps
        const designDir = path.join(PROJECT_ROOT, 'design-system');

        // QA Check
        const qaDir = path.join(designDir, 'QA');
        const auditReport = path.join(qaDir, 'audit-report.md');
        const polishReport = path.join(qaDir, 'polish-report.md');

        const hasDesignExport = fs.existsSync(path.join(PROJECT_ROOT, 'product-plan'));
        const hasDesignInit = fs.existsSync(path.join(designDir, 'product/product-overview.md'));
        const hasTokens = fs.existsSync(path.join(designDir, 'product/design-system/colors.json'));
        const hasShell = fs.existsSync(path.join(designDir, 'product/shell/spec.md'));

        res.json({
            product: productFiles,
            services,
            design: {
                exists: hasTokens,
                initialized: hasDesignInit || fs.existsSync(path.join(designDir, 'product/mission.md')) || fs.existsSync(path.join(designDir, 'product/product-overview.md')),
                tokens: hasTokens,
                shell: hasShell,
                exported: hasDesignExport,
                exportPrompts: {
                    oneShot: fs.existsSync(path.join(PROJECT_ROOT, 'product-plan/prompts/one-shot-prompt.md')),
                    section: fs.existsSync(path.join(PROJECT_ROOT, 'product-plan/prompts/section-prompt.md'))
                },
                qa: {
                    audit: fs.existsSync(auditReport),
                    polish: fs.existsSync(polishReport)
                }
            },
            implementation: {
                scaffolded: fs.existsSync(path.join(APP_DIR, 'src/lib/utils.ts'))
            },
            specs,
            projectRoot: PROJECT_ROOT
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// API: Scaffold New Spec
app.post('/api/scaffold/spec', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Spec name required' });

    const specDir = path.join(AGENT_OS_DIR, 'specs', name);
    if (fs.existsSync(specDir)) return res.status(400).json({ error: 'Spec already exists' });

    fs.mkdirSync(specDir, { recursive: true });
    // Create empty placeholders
    fs.writeFileSync(path.join(specDir, 'spec.md'), '# Spec: ' + name);
    fs.writeFileSync(path.join(specDir, 'tasks.md'), '# Tasks\n\n- [ ] Initial task');

    res.json({ success: true, path: specDir });
});

// API: Delete Spec
app.delete('/api/scaffold/spec/:name', (req, res) => {
    const { name } = req.params;
    if (!name) return res.status(400).json({ error: 'Spec name required' });

    // Validate name to prevent directory traversal or deleting non-spec files
    // Allow alphanumeric, hyphens, underscores
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
        return res.status(400).json({ error: 'Invalid spec name' });
    }

    const specDir = path.join(AGENT_OS_DIR, 'specs', name);
    if (!fs.existsSync(specDir)) {
        return res.status(404).json({ error: 'Spec not found' });
    }

    try {
        fs.rmSync(specDir, { recursive: true, force: true });
        res.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete spec' });
    }
});

// API: Get File Content
app.get('/api/files', (req, res) => {
    const { path: filePath } = req.query;
    if (!filePath) return res.status(400).json({ error: 'File path required' });

    // Prevent directory traversal
    const safePath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const absolutePath = path.join(AGENT_OS_DIR, safePath);

    if (!absolutePath.startsWith(AGENT_OS_DIR)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    try {
        const content = fs.readFileSync(absolutePath, 'utf-8');
        res.json({ content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Save File Content
app.post('/api/files', (req, res) => {
    const { path: filePath, content } = req.body;
    if (!filePath || content === undefined) return res.status(400).json({ error: 'File path and content required' });

    // Prevent directory traversal
    const safePath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const absolutePath = path.join(AGENT_OS_DIR, safePath);

    if (!absolutePath.startsWith(AGENT_OS_DIR)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        fs.writeFileSync(absolutePath, content, 'utf-8');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Control Center Backend running on http://localhost:${PORT}`);
    console.log(`Monitoring Agent OS at: ${AGENT_OS_DIR}`);
});
