const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'views', 'ui-elements');
const useDashboardStorePath = '../../../store/useDashboardStore';

function processDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') && path.basename(fullPath).startsWith('View')) {
            processFile(fullPath);
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it has ParticleTextEffect
    if (content.includes('ParticleTextEffect')) {
        // Remove ParticleTextEffect import
        content = content.replace(/import\s+\{\s*ParticleTextEffect\s*\}\s+from\s+["']@\/components\/ParticleTextEffect["'];\n?/, '');
        
        // Remove the animate-in class from the outer container
        content = content.replace(/<div className="space-y-6 animate-in fade-in duration-500">/, '<div className="space-y-6">');
        
        // Replace the ParticleTextEffect component with basic h1 title. 
        // Example: <ParticleTextEffect words={["Orders"]} /> -> <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-500 bg-clip-text text-transparent px-2">Orders</h1>
        content = content.replace(
            /<div className="w-full flex justify-center mb-\[-20px\]">\s*<ParticleTextEffect words=\{\["([^"]+)"\]\} \/>\s*<\/div>/g,
            '<div className="w-full mb-[-20px] pt-4">\n         <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-500 bg-clip-text text-transparent px-2">$1</h1>\n      </div>'
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Processed basic visual cleanup for: ${path.basename(filePath)}`);
    }
}

processDirectory(directoryPath);
