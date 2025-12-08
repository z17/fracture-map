import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.authorLinks}>
        <span>Created by</span>
        <a 
          href="https://www.linkedin.com/in/maksim-iliukovich/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Maksim Iliukovich
        </a>
        <span className={styles.separator}>•</span>
        <a 
          href="https://github.com/z17/fracture-map" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
      <div className={styles.legalLink}>
        <a href="/terms">Terms of Service & Privacy Policy</a>
      </div>
    </footer>
  );
}

