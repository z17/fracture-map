import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n';
import { ANATOMICAL_BONES } from '../Skeleton/SkeletonSVG';
import styles from './Stats.module.css';

interface StatsProps {
  totalInjuries: number;
  bonesWithInjuries: Set<string>;
}

export function Stats({ totalInjuries, bonesWithInjuries }: StatsProps) {
  const { t } = useLanguage();
  const [showHint, setShowHint] = useState(false);
  const hintRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!showHint) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (hintRef.current && !hintRef.current.contains(e.target as Node)) {
        setShowHint(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showHint]);

  const totalBones = ANATOMICAL_BONES.size;
  const injuredBonesCount = bonesWithInjuries.size;
  const percentInjured = totalBones > 0
    ? Math.round((injuredBonesCount / totalBones) * 100)
    : 0;

  return (
    <div className={styles.stats}>
      <h3 className={styles.title}>{t('statsTitle')}</h3>
      <div className={styles.grid}>
        <div className={styles.stat}>
          <span className={styles.value}>{totalInjuries}</span>
          <span className={styles.label}>{t('totalInjuries')}</span>
        </div>
        <div className={styles.stat}>
          <span
            ref={hintRef}
            className={styles.hint}
            onClick={(e) => {
              e.stopPropagation();
              setShowHint(!showHint);
            }}
          >
            ?
            {showHint && <span className={styles.tooltip}>{t('bonesHint')}</span>}
          </span>
          <span className={styles.value}>
            {injuredBonesCount} <span className={styles.outOf}>{t('outOf')} {totalBones}</span>
          </span>
          <span className={styles.label}>{t('bonesInjured')}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.value}>{percentInjured}%</span>
          <span className={styles.label}>{t('percentInjured')}</span>
        </div>
      </div>
    </div>
  );
}

