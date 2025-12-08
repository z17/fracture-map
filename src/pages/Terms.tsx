import { Footer } from '../components/Footer';
import styles from './Terms.module.css';

export function Terms() {
  return (
    <div className={styles.container}>
      <a href="/" className={styles.backLink}>← Back to Injury Map</a>
        <p className={styles.lastUpdated}>Last updated: December 2025</p>
      
      <section className={styles.section}>
        <h1>Terms of Service</h1>
        
        <h2>Service Description</h2>
        <p>
          Injury Map is a free tool that allows users to visually mark and track injuries 
          on an interactive skeleton diagram. This service is provided "as is" without any warranties.
        </p>
        
        <h2>Not Medical Advice</h2>
        <p>
          This is not a medical product. The information displayed is for personal tracking purposes only 
          and should not be used as a substitute for professional medical advice, diagnosis, or treatment. 
          Always consult a qualified healthcare provider for medical concerns.
        </p>
        
        <h2>User Content</h2>
        <p>
          All content (injury descriptions, map names) is created by users. You are responsible for 
          the content you create. Do not include sensitive personal information in your injury maps.
        </p>
        
        <h2>Link Sharing</h2>
        <ul>
          <li><strong>View links</strong> are public — anyone can see your injury map.</li>
          <li><strong>Edit links</strong> grant full editing access — anyone with the edit link can modify or delete your data.</li>
        </ul>
        <p>
          Keep your edit links private. We are not responsible for unauthorized access if you share your edit link.
        </p>
        
        <h2>No Guarantees</h2>
        <p>
          We do not guarantee data availability, uptime, or backup. Your data may be deleted at any time 
          without notice. For important records, keep your own backups.
        </p>
      </section>
      
      <section className={styles.section}>
        <h1>Privacy Policy</h1>

        <h2>Anonymous Usage</h2>
        <p>
          Injury Map does not require registration or accounts. We do not collect names, emails, 
          or any personal identifiers.
        </p>
        
        <h2>Data We Store</h2>
        <p>We store only the data you explicitly create:</p>
        <ul>
          <li>Map name (optional)</li>
          <li>Injury descriptions and dates</li>
        </ul>
        
        <h2>Analytics</h2>
        <p>
          We use Google Analytics to understand how visitors use the site.
          Google Analytics collects anonymous usage data such as page views and session duration.
          We do not sell or share your data with third parties beyond this analytics service.
        </p>
        
        <h2>Data Deletion</h2>
        <p>
          To request deletion of your injury map data, contact the author with your map's link.
        </p>
        
        <h2>Data Security</h2>
        <p>
          While we take reasonable measures to protect stored data, no internet transmission 
          is completely secure. Do not store sensitive medical or personal information.
        </p>
      </section>
      
      <Footer />
    </div>
  );
}

