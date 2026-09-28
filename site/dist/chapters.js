// The initial semantic HTML is the canonical career content for both views.
// Load this deferred script before the game script, after HTML parsing.
(() => {
  const text = (element) => {
    if (!element) return '';
    const copy = element.cloneNode(true);
    copy.querySelectorAll('br').forEach((br) => br.replaceWith(' · '));
    return copy.textContent.replace(/\s+/g, ' ').trim();
  };
  const texts = (root, selector) => Array.from(root.querySelectorAll(selector), text).filter(Boolean);
  const experience = (anchor, heading, sectionHeadings) => {
    const article = document.getElementById(anchor);
    const root = article.querySelector('.cafe-story') || article;
    const title = text(root.querySelector('h3'));
    return {
      title,
      label: text(root.querySelector('.role')),
      heading,
      filename: `${anchor}.md`,
      anchor,
      summary: texts(root, '.role ~ p').join(' '),
      skills: texts(root, '.tags span'),
      memories: [],
      sections: texts(root, 'li').map((body, index) => ({
        heading: sectionHeadings[index] || 'Experience',
        body
      }))
    };
  };

  const education = document.getElementById('education');
  const schools = Array.from(education.querySelectorAll('.education-facts > p, div > p'));
  const projects = document.getElementById('projects');
  const projectCards = Array.from(projects.querySelectorAll('.project-info'));

  window.portfolioChapters = {
    college: {
      title: 'MDC & FIU',
      label: text(education.querySelector('h2')),
      heading: 'College',
      filename: 'college.md',
      anchor: 'education',
      summary: text(education.querySelector('h2')),
      skills: [],
      memories: [],
      sections: schools.map((school) => {
        const body = school.cloneNode(true);
        body.querySelector('strong')?.remove();
        body.querySelector('br')?.remove();
        return { heading: text(school.querySelector('strong')), body: text(body) };
      })
    },
    fortress: experience('fortress', 'Fortress', ['Shared frontend foundations']),
    cafe: experience('cafe', 'Banh Miow Cafe', ['Initial menu training']),
    gamedev: {
      title: 'Game development',
      label: 'Independent projects',
      heading: text(projects.querySelector('h2')),
      filename: 'gamedev.md',
      anchor: 'projects',
      summary: text(projects.querySelector('h2')),
      skills: [...new Set(texts(projects, '.tags span'))],
      memories: [],
      sections: projectCards.map((card) => ({
        heading: text(card.querySelector('h3')),
        body: Array.from(card.querySelectorAll('p:not(.eyebrow)')).filter(p=>!p.querySelector('a')).map(text).join(' '),
        links: Array.from(card.querySelectorAll('a[href]'), link=>({label:text(link),href:link.href,launch:link.closest('.project-launch')?.cloneNode(true)}))
      }))
    }
  };
})();
