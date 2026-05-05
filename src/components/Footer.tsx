export default function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Midterm Web Project — Built with{' '}
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          React
        </a>{' '}
        +{' '}
        <a href="https://www.typescriptlang.org" target="_blank" rel="noopener noreferrer">
          TypeScript
        </a>{' '}
        +{' '}
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          Vite
        </a>
      </p>
    </footer>
  )
}
