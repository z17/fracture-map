import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './Skeleton.module.css';

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
  const [svgContent, setSvgContent] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedElementRef = useRef<Element | null>(null);

  useEffect(() => {
    fetch('https://upload.wikimedia.org/wikipedia/commons/d/df/Human_skeleton_front_-_no_labels.svg')
      .then(response => response.text())
      .then(svg => {
        setSvgContent(svg);
      })
      .catch(err => console.error('Failed to load skeleton SVG:', err));
  }, []);

  const getElementId = useCallback((element: Element): string => {
    let current: Element | null = element;
    while (current) {
      if (current.id &&
          !current.id.startsWith('_') &&
          current.id !== 'Skeleton' &&
          current.id !== 'Layer_1' &&
          current.id !== 'layer1' &&
          current.id !== 'layer3' &&
          current.id !== 'layer4' &&
          current.tagName !== 'svg') {
        return current.id;
      }
      current = current.parentElement;
    }
    return `element-${Array.from(document.querySelectorAll('path, g')).indexOf(element)}`;
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
    return <div className={styles.loading}>Загрузка скелета...</div>;
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

