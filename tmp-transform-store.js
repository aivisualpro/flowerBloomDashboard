const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'views', 'ui-elements');

const mapModels = {
    'Categories': 'categories',
    'Brands': 'brands',
    'Colors': 'colors',
    'Customers': 'customers',
    'Occasions': 'occasions',
    'Orders': 'orders',
    'Packaging': 'packaging',
    'Products': 'products',
    'Recipes': 'recipes',
    'Recipients': 'recipients',
    'SubCategories': 'subCategories',
    'CategoryTypes': 'categoryTypes'
};

function processDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') && file.startsWith('View')) {
            processFile(fullPath);
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Auto-detect the primary entity from filename, e.g., ViewRecipients.tsx > Recipients
    const matchName = path.basename(filePath).replace('View', '').replace('.tsx', '');
    const modelKey = mapModels[matchName];

    if (!modelKey) return; // Unknown file map, skip 

    // Inject useDashboardStore import if missing
    if (!content.includes('useDashboardStore')) {
        content = content.replace(/(import .*? from 'lucide-react';\nimport { useRouter } from 'next\/navigation';)/s, "$1\nimport { useDashboardStore } from '../../../store/useDashboardStore';");
    }

    // Replace: const { data: categories, isLoading } = useCategories({ ... });
    // with:  const categories = useDashboardStore(s => s.categories);
    const regexUseHook = new RegExp(`const\\s+\\{\\s*data\\s*:\\s*(\\w+)\\s*,\\s*isLoading\\s*\\}\\s*=\\s*use\\w+\\(\\{[^}]+\\}\\);`, 's');
    content = content.replace(regexUseHook, `const $1 = useDashboardStore(s => s.${modelKey});`);

    // Replace map loop arrays:  categories?.rows?.map  ->  categories.map
    // And empty check: categories?.rows?.length === 0 -> categories.length === 0
    content = content.replace(/(\w+)\?\.rows\?\.length/g, '$1.length');
    content = content.replace(/(\w+)\?\.rows\?\.map/g, '$1.map');

    // Remove the skeleton loader logic `{isLoading ? ( ... ) : ...}` map. This is complex across diverse tables, 
    // but the pattern usually is `{isLoading \? \([\s\S]*?\) : (\w+\.length === 0)/
    content = content.replace(/\{isLoading\s*\?\s*\([\s\S]+?\s*\)\s*:\s*(\w+\.?\w*\s*===\s*0)/g, '{$1');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Integrated Global Dashboard Store & removed loaders for: ${path.basename(filePath)}`);
}

processDirectory(directoryPath);
