import { useState } from 'react';
import { useLanguage } from '../../i18n';
import styles from './Share.module.css';

interface ShareProps {
  mapName: string;
  onMapNameChange: (name: string) => void;
  viewId: string;
  editId: string;
  skeletonContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function Share({ mapName, onMapNameChange, viewId, editId, skeletonContainerRef }: ShareProps) {
  const { t } = useLanguage();
  const [linksGenerated, setLinksGenerated] = useState(false);
  const [copiedView, setCopiedView] = useState(false);
  const [copiedEdit, setCopiedEdit] = useState(false);

  const baseUrl = window.location.origin;
  const viewLink = `${baseUrl}/view/${viewId}`;
  const editLink = `${baseUrl}/edit/${editId}`;

  const copyToClipboard = async (text: string, type: 'view' | 'edit') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'view') {
        setCopiedView(true);
        setTimeout(() => setCopiedView(false), 2000);
      } else {
        setCopiedEdit(true);
        setTimeout(() => setCopiedEdit(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadImage = () => {
    const container = skeletonContainerRef.current;
    if (!container) return;

    const svg = container.querySelector('svg');
    if (!svg) return;

    const scale = 3; // High resolution multiplier
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);

      const link = document.createElement('a');
      link.download = mapName ? `${mapName}.png` : 'fracture-map.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className={styles.share}>
      <h3 className={styles.title}>{t('shareTitle')}</h3>

      <div className={styles.field}>
        <label className={styles.label}>{t('mapName')}</label>
        <div className={styles.nameRow}>
          <input
            type="text"
            className={styles.input}
            value={mapName}
            onChange={(e) => onMapNameChange(e.target.value)}
            placeholder={t('mapNamePlaceholder')}
          />
          <button
            className={styles.generateButton}
            onClick={() => setLinksGenerated(true)}
          >
            {linksGenerated ? t('saveMap') : t('generateLink')}
          </button>
        </div>
      </div>

      {linksGenerated && (
        <>
          <div className={styles.field}>
            <label className={styles.label}>{t('viewLink')}</label>
            <div className={styles.linkRow}>
              <input
                type="text"
                className={styles.linkInput}
                value={viewLink}
                readOnly
              />
              <button
                className={styles.copyButton}
                onClick={() => copyToClipboard(viewLink, 'view')}
              >
                {copiedView ? t('copied') : t('copy')}
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{t('editLink')}</label>
            <div className={styles.linkRow}>
              <input
                type="text"
                className={styles.linkInput}
                value={editLink}
                readOnly
              />
              <button
                className={styles.copyButton}
                onClick={() => copyToClipboard(editLink, 'edit')}
              >
                {copiedEdit ? t('copied') : t('copy')}
              </button>
            </div>
          </div>

          <button
            className={styles.downloadButton}
            onClick={downloadImage}
          >
            {t('downloadImage')}
          </button>
        </>
      )}
    </div>
  );
}

