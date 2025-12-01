import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLanguage } from '../../i18n';
import styles from './Skeleton.module.css';

// Whitelist of anatomical bones/groups that can be selected
const ANATOMICAL_BONES = new Set([
  // Head
  'Skull', 'Cranium', 'Mandible',
  // Spine
  'CervicalVertebrae', 'ThoracicVertebrae', 'LumbarVertebrae', 'Sacrum', 'Coccyx',
  // Chest
  'Sternum', 'Manubrium', 'Scapula', 'ClavicleLeft', 'ClavicleRight',
  // Arms
  'HumerusLeft', 'HumerusRight',
  'RadiusLeft', 'RadiusRight',
  'UlnaLeft', 'UlnaRight',
  // Hands
  'HandLeft', 'HandRight',
  'CarpalsLeft', 'CarpalsRight',
  'MetacarpalsLeft', 'MetacarpalsRight',
  'PhalangesLeft', 'PhalangesRight',
  // Pelvis
  'PelvicGirdle',
  // Legs
  'FemurLeft', 'FemurRight',
  'PatellaLeft', 'PatellaRight',
  'TibiaLeft', 'TibiaRight',
  'FibulaLeft', 'FibulaRight',
  // Feet
  'FootLeft', 'FootRight',
  'TarsalsLeft', 'TarsalsRight',
  'MetatarsalsLeft', 'MetatarsalsRight',
  'PhalangesFootLeft', 'PhalangesFootRight',
  // Ribs
  'Rib1',
  'RibLeft2', 'RibLeft3', 'RibLeft4', 'RibLeft5', 'RibLeft6', 'RibLeft7', 'RibLeft8', 'RibLeft9', 'RibLeft10', 'RibLeft11', 'RibLeft12',
  'RibRight2', 'RibRight3', 'RibRight4', 'RibRight5', 'RibRight6', 'RibRight7', 'RibRight8', 'RibRight9', 'RibRight10', 'RibRight11', 'RibRight12',
]);

export function getBoneName(id: string): string {
  return id;
}

interface SkeletonSVGProps {
  selectedBoneId: string | null;
  onBoneClick: (boneId: string | null) => void;
  bonesWithInjuries: Set<string>;
}

export const SkeletonSVG: React.FC<SkeletonSVGProps> = ({
  selectedBoneId,
  onBoneClick,
}) => {
  const { t } = useLanguage();
  const [svgContent, setSvgContent] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedElementRef = useRef<Element | null>(null);

  useEffect(() => {
    fetch('/skeleton.svg')
      .then(response => response.text())
      .then(svg => {
        setSvgContent(svg);
      })
      .catch(err => console.error('Failed to load skeleton SVG:', err));
  }, []);

  const getElementId = useCallback((element: Element): string | null => {
    let current: Element | null = element;
    while (current && current.tagName !== 'svg') {
      if (current.id && ANATOMICAL_BONES.has(current.id)) {
        return current.id;
      }
      current = current.parentElement;
    }
    return null;
  }, []);

  const getElementGroup = useCallback((id: string): Element | null => {
    if (!containerRef.current) return null;
    return containerRef.current.querySelector(`#${CSS.escape(id)}`);
  }, []);

  const applySelectionStyles = useCallback((element: Element | null, selected: boolean) => {
    if (!element) return;

    const shapes = element.tagName === 'path' || element.tagName === 'g'
      ? (element.tagName === 'g' ? element.querySelectorAll('path') : [element])
      : element.querySelectorAll('path');

    shapes.forEach(shape => {
      const shapeEl = shape as SVGElement;
      if (selected) {
        shapeEl.style.fill = '#60a5fa';
        shapeEl.style.stroke = '#1d4ed8';
        shapeEl.style.strokeWidth = '2';
        shapeEl.style.filter = 'drop-shadow(0 0 8px rgba(37,99,235,0.6))';
      } else {
        shapeEl.style.fill = '';
        shapeEl.style.stroke = '';
        shapeEl.style.strokeWidth = '';
        shapeEl.style.filter = '';
      }
    });
  }, []);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    if (selectedElementRef.current) {
      applySelectionStyles(selectedElementRef.current, false);
    }

    if (selectedBoneId) {
      const element = getElementGroup(selectedBoneId);
      if (element) {
        applySelectionStyles(element, true);
        selectedElementRef.current = element;
      }
    } else {
      selectedElementRef.current = null;
    }
  }, [svgContent, selectedBoneId, applySelectionStyles, getElementGroup]);

  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const container = containerRef.current;
    const allPaths = container.querySelectorAll('path');

    allPaths.forEach(path => {
      (path as SVGElement).style.cursor = 'pointer';
    });
  }, [svgContent]);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as Element;

    if (target.tagName === 'rect' || target.tagName === 'svg') {
      onBoneClick(null);
      return;
    }

    const id = getElementId(target);
    if (id) {
      e.stopPropagation();
      onBoneClick(id);
    }
  };

  if (!svgContent) {
    return <div className={styles.loading}>{t('loadingSkeleton')}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={styles.svgContainer}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default SkeletonSVG;

