import { motion } from 'framer-motion'

const features = [
  {
    icon: '⚛️',
    title: 'React + TypeScript',
    description:
      'Built with React 19 and TypeScript for type-safe, component-based architecture with modern hooks and patterns.',
  },
  {
    icon: '🎨',
    title: 'Modern Design',
    description:
      'Features a dark cyberpunk-inspired theme with glassmorphism effects, smooth animations, and responsive layouts.',
  },
  {
    icon: '🎮',
    title: 'Interactive Game',
    description:
      'Includes a fully playable Snake game built with HTML5 Canvas, featuring score tracking and progressive difficulty.',
  },
  {
    icon: '📱',
    title: 'Fully Responsive',
    description:
      'Perfectly adapts to all screen sizes — from mobile phones to ultra-wide monitors — with touch-friendly controls.',
  },
  {
    icon: '🚀',
    title: 'Blazing Fast',
    description:
      'Powered by Vite for lightning-fast HMR in development and optimized production builds with tree-shaking.',
  },
  {
    icon: '✨',
    title: 'Smooth Animations',
    description:
      'Leverages Framer Motion for fluid page transitions, scroll-triggered reveals, and micro-interactions.',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
}

export default function About() {
  return (
    <section className="section" id="about">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-tag">📖 About This Site</div>
        <h2 className="section-title">
          What Makes This{' '}
          <span className="gradient-text">Website Special</span>
        </h2>
        <p className="section-subtitle">
          This midterm project demonstrates modern web development skills using
          React, TypeScript, and cutting-edge frontend technologies.
        </p>
      </motion.div>

      <motion.div
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {features.map((feature, i) => (
          <motion.div className="card" key={i} variants={cardVariants}>
            <div className="card-icon">{feature.icon}</div>
            <h3 className="card-title">{feature.title}</h3>
            <p className="card-text">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
