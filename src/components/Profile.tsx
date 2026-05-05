import { motion } from 'framer-motion'

const skills = [
  'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3',
  'Python', 'Node.js', 'Git', 'Vite', 'Framer Motion',
  'REST APIs', 'Responsive Design',
]

const experiences = [
  {
    date: '2024 — Present',
    title: 'Computer Science Student',
    desc: 'Studying software engineering, algorithms, and web development at university.',
  },
  {
    date: '2023',
    title: 'Web Development Projects',
    desc: 'Built multiple full-stack web applications using React, Node.js, and modern frameworks.',
  },
  {
    date: '2022',
    title: 'Started Programming',
    desc: 'Began learning Python and JavaScript, built first personal projects and mini-games.',
  },
]

const interests = [
  { icon: '💻', label: 'Coding' },
  { icon: '🎮', label: 'Gaming' },
  { icon: '📚', label: 'Reading' },
  { icon: '🎵', label: 'Music' },
  { icon: '🏋️', label: 'Fitness' },
  { icon: '✈️', label: 'Travel' },
]

export default function Profile() {
  return (
    <section className="section" id="profile">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-tag">👤 Personal Profile</div>
        <h2 className="section-title">
          Get to Know{' '}
          <span className="gradient-text">Me</span>
        </h2>
        <p className="section-subtitle">
          A passionate developer with a love for creating beautiful, 
          interactive web experiences.
        </p>
      </motion.div>

      <motion.div
        className="profile-layout"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Left: Profile Card */}
        <div className="card profile-card">
          <div className="profile-avatar">
            <div className="profile-avatar-inner">👨‍💻</div>
          </div>
          <h3 className="profile-name">Alex Chen</h3>
          <p className="profile-role">Full-Stack Developer</p>
          <p className="profile-bio">
            Computer Science student passionate about building modern web apps, 
            exploring new technologies, and solving complex problems with elegant code.
          </p>
          <div className="profile-social">
            <a
              className="social-btn"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              🐙
            </a>
            <a
              className="social-btn"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              💼
            </a>
            <a
              className="social-btn"
              href="mailto:alex@example.com"
              title="Email"
            >
              ✉️
            </a>
          </div>
        </div>

        {/* Right: Details */}
        <div className="profile-details">
          {/* Skills */}
          <div className="card">
            <h4 className="detail-section-title">🛠️ Skills & Technologies</h4>
            <div className="skills-grid">
              {skills.map((skill) => (
                <motion.span
                  className="skill-tag"
                  key={skill}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="card">
            <h4 className="detail-section-title">📋 Experience</h4>
            <div className="timeline">
              {experiences.map((exp, i) => (
                <div className="timeline-item" key={i}>
                  <span className="timeline-date">{exp.date}</span>
                  <h5 className="timeline-title">{exp.title}</h5>
                  <p className="timeline-desc">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="card">
            <h4 className="detail-section-title">🎯 Interests</h4>
            <div className="skills-grid">
              {interests.map((item) => (
                <motion.span
                  className="skill-tag"
                  key={item.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon} {item.label}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
