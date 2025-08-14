import React, { useState } from 'react';

const SUPERCAR_COLORS = {
  orange: '#FFA800',  // Lambo
  red: '#FC1A1A',     // Ferrari
  blue: '#007AFF',    // Bugatti
  yellow: '#FFD700',  // Supercar yellow accent
  green:'#1ba153ff', // McLaren
  gunmetal: '#16181F',
  white: '#FAFAFA',
  lightGray: '#b3b6bd',
  matteBlack: '#0A0D12', // Deep matte black like supercars
  carbonFiber: '#1A1D23', // Carbon fiber dark
  backgroundGray: '#0F1419', // Subtle gray background
};

const Code = () => {
  const [activeCategory, setActiveCategory] = useState('languages');

  const skillsData = {
    languages: {
      title: 'Programming Languages',
      skills: [
        { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
        { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
        { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { name: 'Kotlin', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },

      ]
    },
    frameworks: {
      title: 'Frameworks & Libraries',
      skills: [
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
        { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
        { name: 'Android Studio', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg' }
      ]
    },
    tools: {
      title: 'Development Tools',
      skills: [
        { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
        { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
        { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
        { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' }
      ]
    },
    databases: {
      title: 'Databases & Storage',
      skills: [
        { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
        { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
        { name: 'Oracle', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg' }
      ]
    }
  };

  const categories = Object.keys(skillsData);

  const getAccent = () => {
    // Active colors by category, cycle through car colors!
    if (activeCategory === 'languages') return SUPERCAR_COLORS.red;
    if (activeCategory === 'frameworks') return SUPERCAR_COLORS.blue;
    if (activeCategory === 'tools') return SUPERCAR_COLORS.orange;
    if (activeCategory === 'databases') return SUPERCAR_COLORS.green;
    return SUPERCAR_COLORS.red;
  };

  // --- COMPONENTS ---
  const renderSkillsGrid = () => {
    const skills = skillsData[activeCategory].skills;
    const rows = [];
    for (let i = 0; i < skills.length; i += 4) {
      rows.push(skills.slice(i, i + 4));
    }
    return (
      <div className="space-y-8">
        {rows.map((rowSkills, rowIdx) => (
          <div key={rowIdx} className="languages-row gap-8 justify-center">
            {rowSkills.map((skill) => (
              <div
                key={skill.name}
                className="card-skill group"
                tabIndex={0}

              >
                <div className="icon-bg flex items-center justify-center"
                  style={{
                    background: SUPERCAR_COLORS.gunmetal,
                  }}>
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="icon"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${skill.name}&background=${getAccent().slice(1)}&color=fff&size=48`;
                    }}
                  />
                </div>
                <h4
                  className="card-title"
                  style={{
                    color: getAccent(),
                  }}
                >
                  {skill.name}
                </h4>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // --- RENDER ---
  return (
    <div className="supercar-bg min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="main-head">
            DEVELOPMENT
          </h1>
          <h1 className="main-head accent">
            ARSENAL
          </h1>
          <div className="w-32 h-2 mx-auto mb-10 rounded-full"
            style={{
              background: getAccent(),
              boxShadow: `0 0 18px 0 ${getAccent()}70`
            }}
          />
          <p className="text-xl font-light tracking-wide" style={{color: SUPERCAR_COLORS.lightGray}}>
            Battle-tested tools and technologies for building exceptional software
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex justify-center mb-14">
          <div className="category-tabs border" style={{borderColor: SUPERCAR_COLORS.gunmetal}}>
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`btn-cat ${activeCategory === category ? 'active' : ''}`}
                  style={activeCategory === category ? {
                    background: getAccent(), color: SUPERCAR_COLORS.white, boxShadow: `0 3px 15px 0 ${getAccent()}50`
                  } : {
                    color: SUPERCAR_COLORS.lightGray,
                  }}
                >
                  <span style={{fontWeight: 600}}>{skillsData[category].title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <h3
            className="text-3xl font-bold text-center uppercase mb-12 tracking-wide"
            style={{
              color: getAccent(),
              letterSpacing: '.1em'
            }}>
            {skillsData[activeCategory].title}
          </h3>
          {renderSkillsGrid()}
        </div>

        {/* Bottom Line */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-3" style={{color: SUPERCAR_COLORS.lightGray}}>
            <div className="w-3 h-3 rounded-full animate-pulse" style={{background: getAccent()}}></div>
            <span className="text-lg font-light">Continuously evolving and growing</span>
            <div className="w-3 h-3 rounded-full animate-pulse" style={{background: getAccent(), animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .supercar-bg {
          background: ${SUPERCAR_COLORS.backgroundGray} !important;
          min-height: 100vh;
        }
        .main-head {
          font-family: 'Archivo Black', 'Helvetica Neue', Arial, sans-serif;
          font-size: 64px; font-weight: 900; letter-spacing: -2px; line-height: 1;
          color: ${SUPERCAR_COLORS.white};
        }
        .main-head.accent {
          letter-spacing: -.1em;
          color: ${SUPERCAR_COLORS.yellow};
          margin-top: -25px;
          text-shadow: 0 0 30px ${SUPERCAR_COLORS.yellow}40;
        }
        .category-tabs {
          background: ${SUPERCAR_COLORS.carbonFiber};
          border-radius: 9999px;
          padding: 8px;
          border-width: 1.5px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.17);
        }
        .btn-cat {
          border-radius: 9999px;
          padding: 14px 36px;
          font-size: 0.95rem;
          font-family: inherit;
          background: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          font-weight: 700;
          letter-spacing: 0.01em;
          transition: all 0.18s cubic-bezier(.4,0,.2,1);
        }
        .btn-cat.active, .btn-cat:focus {
          transform: scale(1.09);
        }
        .btn-cat:not(.active):hover {
          background: #23252c !important;
          color: ${SUPERCAR_COLORS.white} !important;
        }
        .languages-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          max-width: 900px;
          margin: 0 auto;
          gap: 2rem;
        }
        .card-skill {
          position: relative;
          background: ${SUPERCAR_COLORS.carbonFiber};
          border-radius: 1.2rem;
          padding: 2rem 1.25rem;
          border: 2.5px solid #272e3f;
          transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 0px 0px #0000;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }
        .card-skill::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, ${getAccent()}08, transparent);
          transition: left 0.6s ease-in-out;
        }
        .card-skill:hover::before {
          left: 100%;
        }
        .card-skill:hover, .card-skill:focus {
          box-shadow: 0 8px 40px 0 ${getAccent()}25, 0 0 0 1px ${getAccent()}20;
          transform: scale(1.08) translateY(-2px);
          z-index: 2;
        }
        .icon-bg {
          width: 72px; height: 72px;
          border-radius: 23%;
          background: ${SUPERCAR_COLORS.matteBlack};
          margin-bottom: 1.35rem;
          transition: all 0.3s ease;
          z-index: 1;
          position: relative;
        }
        .card-skill:hover .icon-bg {
          box-shadow: 0 0 20px 0 ${getAccent()}30;
          transform: scale(1.05);
        }
        .icon {
          width: 42px; height: 42px; object-fit: contain;
          filter: brightness(1.08);
        }
        .card-title {
          margin-top: 0.25em;
          font-weight: bold;
          font-size: 1.2em;
          text-align: center;
          letter-spacing: 0.02em;
          color: ${getAccent()};
        }
        @media (max-width: 1000px) {
          .main-head {font-size: 2.5em;}
          .languages-row { grid-template-columns: repeat(2, 1fr); }
          .card-skill { padding: 1.2rem .5rem;}
        }
        @media (max-width: 600px) {
          .main-head {font-size: 1.3em;}
          .languages-row { grid-template-columns: repeat(1, 1fr);}
        }
      `}</style>
    </div>
  );
};

export default Code;