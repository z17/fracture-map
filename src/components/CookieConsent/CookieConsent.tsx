import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n';
import styles from './CookieConsent.module.css';

const CONSENT_KEY = 'cookie-consent';
const GA_ID = 'G-QD7CXYB634';

function loadGoogleAnalytics() {
  if (document.querySelector(`script[src*="googletagmanager"]`)) return;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_ID);
  };
}

declare global {
  interface Window {
    dataLayer: unknown[];
  }
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

