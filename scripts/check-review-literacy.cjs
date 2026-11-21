const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'public'),base='https://aetaxadvisorsreviews.com',hub='/review-literacy/';
const guides=JSON.parse(fs.readFileSync(path.join(root,'content/review-literacy.json'),'utf8'));assert.equal(guides.length,16);
const routes=[hub,...guides.map(g=>hub+g.slug+'/')],titles=new Set(),sitemap=fs.readFileSync(path.join(out,'sitemap.xml'),'utf8');
for(const route of routes){const s=fs.readFileSync(path.join(out,route,'index.html'),'utf8');assert.equal((s.match(/<h1\b/g)||[]).length,1);const title=s.match(/<title>(.*?)<\/title>/s)[1];assert(!titles.has(title));titles.add(title);assert(s.includes('href="'+base+route+'"'));assert(s.includes('AE-owned buyer education.'));assert(s.includes('id="ae-primary-nav"'));assert(s.includes('ae-ecosystem.css?v=20261120-mobile'));assert.equal((sitemap.match(new RegExp('<loc>'+base.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+route+'<\\/loc>','g'))||[]).length,1);
 for(const m of s.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)){const data=JSON.parse(m[1]);assert(!/"@type":"(?:Review|AggregateRating)"/.test(m[1]));assert(data['@graph'].length>=2);}
 for(const m of s.matchAll(/href="(\/[^"?#]*)/g)){if(m[1].startsWith('//'))continue;const file=path.join(out,m[1]);assert(fs.existsSync(file)||fs.existsSync(path.join(file,'index.html')),'Missing link '+m[1]);}
}
for(const g of guides){const words=[g.intro,...g.sections.map(x=>x[1]),...g.checklist].join(' ').split(/\s+/).length;assert(words>=400,g.slug+' needs substantive content');}
console.log('PASS:16 substantive review-literacy guides, disclosure, branding, metadata, links, schema and sitemap; navigation hub excluded from new-page count.');
