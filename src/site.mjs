import {
  profile as p,
  projects,
  websites,
  work,
  skills,
} from './data/profile.mjs';
export const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ],
  );
const paths = {
  home: 'm3 10 9-7 9 7v10H15v-7H9v7H3Z',
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  briefcase: 'M8 6V3h8v3 M3 7h18v14H3z M3 12a24 24 0 0 0 18 0 M10 13h4',
  globe:
    'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M3 12h18 M12 3a19 19 0 0 0 0 18 19 19 0 0 0 0-18',
  file: 'M14 2H5v20h14V7Z M14 2v6h5 M8 13h8 M8 17h6',
  arrow: 'M7 17 17 7 M7 7h10v10',
  right: 'M4 12h16 M14 6l6 6-6 6',
  download: 'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5',
  mail: 'M3 5h18v14H3z m0 0 9 8 9-8',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0 M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  linkedin: 'M4 9v12 M4 4v.1 M10 21V9h4v2c3-4 7-1 7 2v8',
  plane: 'm22 2-7 20-4-9-9-4Z M22 2 11 13',
  code: 'm8 5-7 7 7 7 M16 5l7 7-7 7 M14 3l-4 18',
  chevron: 'm9 5 7 7-7 7',
  panel: 'M3 3h18v18H3z M9 3v18 M5 8h2 M5 12h2',
  sun: 'M12 3V1 M12 23v-2 M3 12H1 M23 12h-2 M4 4l2 2 M18 18l2 2 M4 20l2-2 M18 6l2-2 M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
  plus: 'M12 5v14 M5 12h14',
  check: 'm5 12 4 4L19 6',
  search: 'M16 16l5 5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  book: 'M12 5C8 2 3 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-4-2-7-1-10 1v16',
  close: 'M6 6l12 12 M6 18 18 6',
  copy: 'M9 9h12v12H9z M15 5V2H2v13h3',
};
const icon = (name, size = 18) => /* HTML */ `
  <svg
    width="${size}"
    height="${size}"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="${paths[name] || paths.arrow}" />
  </svg>
`;
const sections = [
  ['overview', 'home', 'Overview'],
  ['experience', 'briefcase', 'Experience'],
  ['projects', 'grid', 'Projects'],
  ['websites', 'globe', 'Websites'],
  ['resume', 'file', 'Résumé'],
  ['contact', 'mail', 'Get in touch'],
];
const external = (url) => (/^https?:\/\//i.test(url) ? esc(url) : '');
const tags = (arr) =>
  arr
    .map(
      (t) => /* HTML */ `
        <span class="tag">${esc(t)}</span>
      `,
    )
    .join('');
const slots = (items, type) =>
  items
    .map((item, i) => {
      const href = external(item.url);
      const filled = !!(item.title && href);
      const content = /* HTML */ `
        <div class="card-top">
          <span class="square-icon">
            ${icon(type === 'project' ? 'code' : 'globe', 20)}
          </span>
          <span class="${filled ? '' : 'draft'}">
            ${filled ? icon('arrow') : 'UNFILLED'}
          </span>
        </div>
        <h3>
          ${esc(item.title || `${type === 'project' ? 'Project' : 'Website'} ${String(i + 1).padStart(2, '0')}`)}
        </h3>
        <p>
          ${esc(item.description || `A space for a ${type === 'project' ? 'personal project' : 'website'}. Details to come.`)}
        </p>
        <div class="card-bottom">
          ${filled ? (type === 'project' ? 'Explore project' : 'Visit website') : 'Coming soon'}
          ${filled ? icon('right', 16) : '<span class="slot-dot"></span>'}
        </div>
      `;
      return filled
        ? /* HTML */ `
            <a
              href="${href}"
              target="_blank"
              rel="noopener noreferrer"
              class="link-card"
            >
              ${content}
            </a>
          `
        : /* HTML */ `
            <div class="link-card empty">${content}</div>
          `;
    })
    .join('');
export function render() {
  return /* HTML */ `
    <!doctype html>
    <html lang="en" data-theme="dark">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Raymond Link — Engineer, Pilot & Builder</title>
        <meta
          name="description"
          content="Raymond Link is a turboprop design engineer, private pilot, and builder based in Wichita, Kansas. Explore engineering work, projects, and résumé."
        />
        <meta name="theme-color" content="#141414" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href="https://raymondlink.com/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Raymond Link — Engineer, Pilot & Builder"
        />
        <meta
          property="og:description"
          content="Aircraft systems. Thoughtful software. A home for the things I build."
        />
        <meta property="og:url" content="https://raymondlink.com/" />
        <link rel="stylesheet" href="/site.css" />
        <script>
          try {
            document.documentElement.dataset.theme =
              localStorage.getItem('rl-theme') || 'dark';
          } catch {}
        </script>
        <script src="/client.js" defer></script>
      </head>
      <body>
        <a class="skip" href="#main">Skip to content</a>
        <div class="backdrop" id="backdrop"></div>
        <aside class="sidebar" id="sidebar" aria-label="Main navigation">
          <a class="brand" href="#overview" aria-label="Raymond Link home">
            <span class="monogram">
              rl
              <span>.</span>
            </span>
            <span class="brand-name">
              Raymond Link
              <small>PERSONAL WORKSPACE</small>
            </span>
          </a>
          <button class="search-trigger" data-search>
            ${icon('search', 16)}
            <span>Find something…</span>
            <kbd>⌘ K</kbd>
          </button>
          <nav>
            <div class="nav-label">WORKSPACE</div>
            ${sections
              .map(
                ([id, ic, label]) => /* HTML */ `
                  <a
                    class="nav-link ${id === 'overview' ? 'active' : ''}"
                    href="#${id}"
                    ${id === 'overview' ? 'aria-current="location"' : ''}
                  >
                    ${icon(ic)}
                    <span>${label}</span>
                    ${
                      id === 'projects'
                        ? /* HTML */ `
                            <span class="nav-count">
                              ${String(projects.length).padStart(2, '0')}
                            </span>
                          `
                        : ''
                    }
                  </a>
                `,
              )
              .join('')}
            <div class="nav-label second">ELSEWHERE</div>
            <a
              class="nav-link"
              href="${external(p.linkedin)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${icon('linkedin')}
              <span>LinkedIn</span>
              ${icon('arrow', 14)}
            </a>
            <a class="nav-link" href="mailto:${esc(p.email)}">
              ${icon('mail')}
              <span>Email me</span>
              ${icon('arrow', 14)}
            </a>
          </nav>
          <div class="sidebar-bottom">
            <div class="location">
              ${icon('pin', 15)}
              <span>${esc(p.location)}</span>
            </div>
            <div class="sidebar-foot">
              <span>
                <i class="status-dot"></i>
                Always building
              </span>
              <button
                id="theme-toggle"
                class="icon-button"
                aria-label="Switch color theme"
                title="Switch color theme"
              >
                ${icon('sun', 17)}
              </button>
            </div>
          </div>
        </aside>
        <div class="app">
          <header class="topbar">
            <div class="breadcrumbs">
              <button
                id="sidebar-toggle"
                class="icon-button"
                aria-label="Toggle navigation"
                aria-controls="sidebar"
                aria-expanded="true"
              >
                ${icon('panel', 18)}
              </button>
              <span class="header-divider"></span>
              <span class="crumb-root">Personal workspace</span>
              ${icon('chevron', 13)}
              <span id="breadcrumb">Overview</span>
            </div>
            <a class="domain-link" href="#overview">
              <i class="status-dot"></i>
              raymondlink.com
            </a>
          </header>
          <div class="page-layout">
            <main id="main">
              <section
                id="overview"
                aria-labelledby="overview-title"
                class="overview section"
              >
                <div class="eyebrow">
                  <span class="mini-line"></span>
                  ENGINEERING / SOFTWARE / AVIATION
                </div>
                <div class="hero">
                  <div class="hero-copy">
                    <h1 id="overview-title">
                      Hi, I’m Raymond
                      <span class="green">.</span>
                      <br />
                      <span class="muted-heading">
                        I like building things
                        <br />
                        that work.
                      </span>
                    </h1>
                    <p class="hero-description">${esc(p.intro)}</p>
                    <div class="hero-actions">
                      <a class="button primary" href="#projects">
                        Explore my work ${icon('right', 16)}
                      </a>
                      <a
                        class="button"
                        href="${esc(p.resume)}"
                        target="_blank"
                        rel="noopener"
                      >
                        ${icon('file', 15)} View résumé
                      </a>
                    </div>
                  </div>
                  <div
                    class="flight-art"
                    role="img"
                    aria-label="Technical aircraft illustration, reflecting Raymond’s work in aviation"
                  >
                    <div class="art-coordinates">37.6872° N / 97.3301° W</div>
                    <svg viewBox="0 0 340 310" fill="none" aria-hidden="true">
                      <defs>
                        <pattern
                          id="grid"
                          width="25"
                          height="25"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M25 0H0V25"
                            stroke="currentColor"
                            stroke-width=".5"
                            opacity=".17"
                          />
                        </pattern>
                      </defs>
                      <rect width="340" height="310" fill="url(#grid)" />
                      <g stroke="currentColor">
                        <circle cx="170" cy="150" r="104" opacity=".15" />
                        <circle
                          cx="170"
                          cy="150"
                          r="75"
                          opacity=".25"
                          stroke-dasharray="2 7"
                        />
                        <path
                          d="M170 25V275 M40 150h260"
                          opacity=".17"
                          stroke-dasharray="4 5"
                        />
                        <path
                          d="M56 226C65 76 222 41 286 108"
                          opacity=".45"
                          stroke-dasharray="4 5"
                        />
                        <path d="m280 101 7 8-10 3" opacity=".45" />
                      </g>
                      <g
                        stroke="#3ecf8e"
                        stroke-width="1.35"
                        stroke-linejoin="round"
                        transform="rotate(28 170 150)"
                      >
                        <path
                          d="M170 51c-5 0-8 15-8 28v45l-78 52v12l78-24v55l-24 20v9l32-12 32 12v-9l-24-20v-55l78 24v-12l-78-52V79c0-13-3-28-8-28Z"
                          fill="#3ecf8e"
                          fill-opacity=".05"
                        />
                        <path
                          d="M170 64v170 M162 124l16 0 M162 164h16 M170 222l-24 21 M170 222l24 21 M118 157v-20h9v14 M213 157v-20h9v26"
                        />
                        <path d="M158 92h24" opacity=".6" />
                      </g>
                      <g
                        fill="currentColor"
                        font-family="monospace"
                        font-size="9"
                        opacity=".45"
                      >
                        <text x="40" y="43">N</text>
                        <text x="278" y="259">01 / RL</text>
                        <text x="42" y="270">DESIGN → BUILD</text>
                      </g>
                      <circle cx="286" cy="108" r="3" fill="#3ecf8e" />
                    </svg>
                    <div class="art-caption">
                      <span class="status-dot"></span>
                      A different perspective.
                    </div>
                  </div>
                </div>
                <div class="identity-strip">
                  <span>
                    ${icon('briefcase', 16)} Design Engineer
                    <span class="faint">@</span>
                    Textron Aviation
                  </span>
                  <span>${icon('plane', 16)} Private Pilot</span>
                  <span>
                    ${icon('book', 16)} M.S. Aerospace
                    <span class="faint">/ in progress</span>
                  </span>
                </div>
                <div class="section-title overview-about">
                  <h2>A little context</h2>
                  <span class="mono">01 / ABOUT</span>
                </div>
                <p class="about-text">${esc(p.about)}</p>
                <div class="focus-grid">
                  <div>
                    ${icon('plane', 21)}
                    <h3>Aircraft systems</h3>
                    <p>
                      From certification plans to the flight line. Turning
                      complex requirements into reliable aircraft.
                    </p>
                  </div>
                  <div>
                    ${icon('code', 21)}
                    <h3>Useful software</h3>
                    <p>
                      Tools that replace friction with clarity. Built around the
                      people who use them every day.
                    </p>
                  </div>
                  <div>
                    ${icon('book', 21)}
                    <h3>Always learning</h3>
                    <p>
                      Aerospace graduate studies, instrument training, and
                      sharing what I learn along the way.
                    </p>
                  </div>
                </div>
              </section>
              <section
                id="experience"
                class="section"
                aria-labelledby="experience-title"
              >
                <div class="section-title">
                  <div>
                    <div class="eyebrow">THE DAY JOB</div>
                    <h2 id="experience-title">Engineering, in practice.</h2>
                  </div>
                  <span class="mono">02 / EXPERIENCE</span>
                </div>
                <p class="section-intro">
                  Aircraft systems and digital engineering at Textron Aviation.
                </p>
                <div class="role-summary">
                  <span class="company-icon">${icon('plane', 23)}</span>
                  <div>
                    <h3>Design Engineer · Turboprops</h3>
                    <p>
                      Textron Aviation
                      <span class="faint">/ Wichita, Kansas</span>
                    </p>
                  </div>
                  <span class="role-dates">
                    2024 — Present
                    <small>Intern & Co-op · 2023–2024</small>
                  </span>
                </div>
                <div class="work-list">
                  ${work
                    .map(
                      (w, i) => /* HTML */ `
                        <article class="work-item">
                          <span class="work-number">0${i + 1}</span>
                          <div>
                            <span class="work-category">
                              ${esc(w.category)}
                            </span>
                            <h3>${esc(w.title)}</h3>
                            <p>${esc(w.description)}</p>
                            <div class="tags">${tags(w.tags)}</div>
                          </div>
                        </article>
                      `,
                    )
                    .join('')}
                </div>
                <div class="skills-area">
                  <h3>A few tools of the trade</h3>
                  <div class="skills-grid">
                    ${skills
                      .map(
                        (s) => /* HTML */ `
                          <div>
                            <h4>${esc(s.title)}</h4>
                            <ul>
                              ${s.items
                                .map(
                                  (t) => /* HTML */ `
                                    <li>${esc(t)}</li>
                                  `,
                                )
                                .join('')}
                            </ul>
                          </div>
                        `,
                      )
                      .join('')}
                  </div>
                </div>
              </section>
              <section
                id="projects"
                class="section"
                aria-labelledby="projects-title"
              >
                <div class="section-title">
                  <div>
                    <div class="eyebrow">OUTSIDE THE DAY JOB</div>
                    <h2 id="projects-title">Personal projects.</h2>
                  </div>
                  <span class="mono">03 / PROJECTS</span>
                </div>
                <p class="section-intro">
                  A home for experiments, side projects, and things built out of
                  curiosity.
                </p>
                <div class="cards-grid">${slots(projects, 'project')}</div>
                <p class="section-note">
                  This space will grow as I add projects.
                </p>
              </section>
              <section
                id="websites"
                class="section"
                aria-labelledby="websites-title"
              >
                <div class="section-title">
                  <div>
                    <div class="eyebrow">AROUND THE WEB</div>
                    <h2 id="websites-title">One home. Many links.</h2>
                  </div>
                  <span class="mono">04 / WEBSITES</span>
                </div>
                <p class="section-intro">
                  The other places and websites I’m working on, all connected
                  here.
                </p>
                <div class="cards-grid">${slots(websites, 'website')}</div>
              </section>
              <section
                id="resume"
                class="section"
                aria-labelledby="resume-title"
              >
                <div class="section-title">
                  <div>
                    <div class="eyebrow">THE FULL PICTURE</div>
                    <h2 id="resume-title">Background & résumé.</h2>
                  </div>
                  <span class="mono">05 / RÉSUMÉ</span>
                </div>
                <div class="resume-layout">
                  <div class="education">
                    <div class="education-item">
                      <span class="small-label">IN PROGRESS</span>
                      <h3>M.S. Aerospace Engineering</h3>
                      <p>Wichita State University</p>
                    </div>
                    <div class="education-item">
                      <span class="small-label">MAY 2024</span>
                      <h3>B.S. Mechanical Engineering</h3>
                      <p>LeTourneau University</p>
                      <p class="education-detail">
                        Aerospace focus · Minors in Mathematics and Applied
                        Sciences
                      </p>
                    </div>
                    <div class="education-item">
                      <span class="small-label">BEYOND THE CLASSROOM</span>
                      <h3>Private Pilot Certificate</h3>
                      <p>Instrument training in progress</p>
                    </div>
                  </div>
                  <div class="resume-card">
                    <span class="resume-document">${icon('file', 40)}</span>
                    <h3>The details, in one place.</h3>
                    <p>
                      Experience, technical skills, education, and leadership.
                    </p>
                    <a
                      class="button"
                      href="${esc(p.resume)}"
                      target="_blank"
                      rel="noopener"
                    >
                      Open résumé ${icon('arrow', 16)}
                    </a>
                    <a
                      class="download-link"
                      href="${esc(p.resume)}"
                      download="Raymond-Link-Resume.pdf"
                    >
                      ${icon('download', 15)} Download PDF
                    </a>
                    <span class="small-label">UPDATED OCTOBER 2026 · PDF</span>
                  </div>
                </div>
              </section>
              <section
                id="contact"
                class="section contact"
                aria-labelledby="contact-title"
              >
                <div class="eyebrow">LET’S CONNECT</div>
                <h2 id="contact-title">
                  Good things start
                  <br />
                  with a conversation
                  <span class="green">.</span>
                </h2>
                <p>
                  Engineering, aviation, something you’re building.
                  <br />
                  I’d be glad to hear about it.
                </p>
                <div class="hero-actions">
                  <a class="button primary" href="mailto:${esc(p.email)}">
                    ${icon('mail', 16)} Say hello ${icon('arrow', 16)}
                  </a>
                  <a
                    class="button"
                    href="${external(p.linkedin)}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ${icon('linkedin', 16)} Connect on LinkedIn
                    ${icon('arrow', 15)}
                  </a>
                </div>
                <button
                  class="copy-email"
                  id="copy-email"
                  data-email="${esc(p.email)}"
                >
                  ${esc(p.email)} ${icon('copy', 14)}
                </button>
                <span id="copy-status" role="status" class="copy-status"></span>
              </section>
              <footer>
                <span>© ${new Date().getFullYear()} Raymond Link</span>
                <span>Thoughtfully engineered. Always evolving.</span>
                <a href="#overview">Back to top ↑</a>
              </footer>
            </main>
            <aside class="page-toc" aria-label="On this page">
              <div class="nav-label">ON THIS PAGE</div>
              ${sections
                .map(
                  ([id, , label]) => /* HTML */ `
                    <a
                      href="#${id}"
                      ${id === 'overview' ? 'class="active"' : ''}
                    >
                      ${label}
                    </a>
                  `,
                )
                .join('')}
              <div class="toc-note">
                An engineer’s workspace.
                <br />
                A builder’s home base.
              </div>
            </aside>
          </div>
        </div>
        <dialog id="search-dialog" aria-labelledby="search-title">
          <div class="search-heading">
            <h2 id="search-title">Jump to a section</h2>
            <button
              class="icon-button"
              id="search-close"
              aria-label="Close search"
            >
              ${icon('close')}
            </button>
          </div>
          <div class="search-input-wrap">
            ${icon('search')}
            <input
              id="search-input"
              type="search"
              placeholder="Search this workspace…"
              autocomplete="off"
              aria-label="Search sections"
            />
          </div>
          <div id="search-results">
            ${sections
              .map(
                ([id, ic, label]) => /* HTML */ `
                  <a
                    href="#${id}"
                    data-keywords="${label.toLowerCase()} ${id === 'resume' ? 'education pdf download background' : id === 'experience' ? 'engineering skills turbolink textron' : ''}"
                  >
                    ${icon(ic)}
                    <span>${label}</span>
                    ${icon('right', 15)}
                  </a>
                `,
              )
              .join('')}
          </div>
          <p id="search-empty" hidden>
            No matching sections. Try “projects” or “résumé”.
          </p>
          <div class="search-footer">
            <kbd>esc</kbd>
            to close
            <span>Navigate your workspace</span>
          </div>
        </dialog>
      </body>
    </html>
  `;
}
