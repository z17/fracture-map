import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n';
import styles from './CookieConsent.module.css';

const CONSENT_KEY = 'cookie-consent';
const GA_ID = 'G-QD7CXYB634';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
  }
}

function loadGoogleAnalytics() {
  if (document.querySelector(`script[src*="googletagmanager"]`)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

export function CookieConsent() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      loadGoogleAnalytics();
    } else if (consent === null) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
    loadGoogleAnalytics();
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.banner}>
        <p className={styles.text}>{t('cookieText')}</p>
        <div className={styles.buttons}>
          <button className={styles.accept} onClick={handleAccept}>
            {t('cookieAccept')}
          </button>
          <button className={styles.decline} onClick={handleDecline}>
            {t('cookieDecline')}
          </button>
        </div>
      </div>
    </div>
  );
}

