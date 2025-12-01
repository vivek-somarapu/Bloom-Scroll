const fs = require('fs');
const path = require('path');

const categories = [
  'Animals',
  'Architecture', 
  'Chemistry',
  'Energy',
  'Environment',
  'Health',
  'Music',
  'Physics',
  'Space',
  'Technology'
];

function parseCSVLine(line) {
  // Remove quotes and split by URL pattern
  const cleaned = line.trim().replace(/^"|"$/g, '');
  
  // Find the URL (starts with http)
  const urlMatch = cleaned.match(/(https?:\/\/[^\s]+)$/);
  const url = urlMatch ? urlMatch[1] : '';
  const text = cleaned.replace(url, '').trim();
  
  // Extract source from URL
  let source = 'Research Paper';
  if (url.includes('ncbi.nlm.nih.gov') || url.includes('pmc.ncbi')) source = 'NIH/PubMed Central';
  else if (url.includes('nature.com')) source = 'Nature';
  else if (url.includes('science.org') || url.includes('sciencemag')) source = 'Science';
  else if (url.includes('nasa.gov')) source = 'NASA';
  else if (url.includes('ebscohost.com')) source = 'EBSCO Research';
  else if (url.includes('apa.org') || url.includes('psycnet')) source = 'American Psychological Association';
  else if (url.includes('wiley.com') || url.includes('onlinelibrary')) source = 'Wiley Online Library';
  else if (url.includes('.edu')) source = 'Academic Research';
  
  return { text, url, source };
}

function generateFactFile(category, facts) {
  const categoryLower = category.toLowerCase();
  const varName = `${categoryLower}Facts`;
  
  let content = `import { Fact } from "@/lib/types";\n\n`;
  content += `export const ${varName}: Fact[] = [\n`;
  
  facts.forEach((fact, index) => {
    content += `  {\n`;
    content += `    id: "${categoryLower}-${index + 1}",\n`;
    content += `    category: "${categoryLower}",\n`;
    content += `    text: ${JSON.stringify(fact.text)},\n`;
    content += `    source: "${fact.source}",\n`;
    if (fact.url) {
      content += `    sourceUrl: "${fact.url}",\n`;
    }
    content += `    factNumber: ${index + 1},\n`;
    content += `  },\n`;
  });
  
  content += `];\n`;
  
  return content;
}

// Main processing
categories.forEach(category => {
  const csvPath = path.join(__dirname, '..', 'data', `${category}.csv`);
  const outputPath = path.join(__dirname, '..', 'data', 'facts', `${category.toLowerCase()}.ts`);
  
  if (!fs.existsSync(csvPath)) {
    console.log(`⚠️  Skipping ${category} - CSV not found`);
    return;
  }
  
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    const facts = lines.map(line => parseCSVLine(line));
    const fileContent = generateFactFile(category, facts);
    
    fs.writeFileSync(outputPath, fileContent);
    console.log(`✅ Generated ${category} - ${facts.length} facts`);
  } catch (error) {
    console.error(`❌ Error processing ${category}:`, error.message);
  }
});

console.log('\n🎉 CSV parsing complete!');

