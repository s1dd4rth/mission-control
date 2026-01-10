const fs = require('fs');
const path = require('path');

const cmdDir = '/Users/siddarth/OS/learning-agent-os/packages/create-agent-os/src/template/design-system/.claude/commands/impeccable';

const files = fs.readdirSync(cmdDir);

files.forEach(file => {
    if (file.endsWith('.toml')) {
        const content = fs.readFileSync(path.join(cmdDir, file), 'utf8');

        // Extract prompt
        const promptMatch = content.match(/prompt\s*=\s*"""([\s\S]*?)"""/);
        const descMatch = content.match(/description\s*=\s*"([^"]*)"/); // Simple quote match

        if (promptMatch) {
            const prompt = promptMatch[1];
            const desc = descMatch ? descMatch[1] : `Run the ${file.replace('.toml', '')} command.`;
            const name = file.replace('.toml', '');
            const title = name.charAt(0).toUpperCase() + name.slice(1);

            const mdContent = `# COMMAND: ${title}\n**Description**: ${desc}\n\n${prompt}`;

            fs.writeFileSync(path.join(cmdDir, name + '.md'), mdContent);
            console.log(`Converted ${file} -> ${name}.md`);
        } else {
            console.log(`Skipping ${file} - no prompt found`);
        }
    }
});
