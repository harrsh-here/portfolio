const fs = require('fs');

const files = [
  { path: 'src/pages/SPPProjectPage.jsx', prefix: '../' },
  { path: 'src/pages/ProjectsPage.jsx', prefix: '../' },
  { path: 'src/components/ExperienceTimeline.jsx', prefix: './' },
  { path: 'src/components/SkillsSection.jsx', prefix: './' },
  { path: 'src/components/FeaturedProjects.jsx', prefix: './' },
  { path: 'src/components/ContactStrip.jsx', prefix: './' },
  { path: 'src/components/AboutSection.jsx', prefix: './' },
  { path: 'src/components/AchievementsSection.jsx', prefix: './' }
];

files.forEach(({ path: file, prefix }) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('glitch-hover')) return;

  // Insert import if not exists
  if (!content.includes('MatrixText')) {
    const importStr = `import MatrixText from '${prefix}components/MatrixText'\n`;
    content = importStr + content;
  }

  // Replace class, remove data-text, and replace inner text with <MatrixText text="Inner Text" />
  // E.g. <h2 className="section-title glitch-hover" data-text="Skills">Skills</h2>
  content = content.replace(/(<h[1-6][^>]*?)(\s?glitch-hover)([^>]*?)data-text="([^"]+)"([^>]*>)([^<]*)<\/h[1-6]>/g, (match, pt1, pt2, pt3, dtText, pt4, innerText) => {
    // Reconstruct without glitch-hover and data-text
    const newTag = `${pt1}${pt3}${pt4}`.replace(/\s+>/, '>');
    return `${newTag}<MatrixText text="${dtText}" />${match.slice(-5)}`;
  });

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
});

// Remove CSS rules from index.css
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/\.glitch-hover[\s\S]*?(?=\/\*|\.glitch-intro|@keyframes)/, '');
fs.writeFileSync('src/index.css', css);
console.log('Updated index.css');
