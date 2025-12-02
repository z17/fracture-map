import { forwardRef } from 'react';
import type { BoneId } from '../../types';
import { SkeletonSVG } from './SkeletonSVG';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  /** Selected bone ID */
  selectedBoneId: BoneId | null;
  /** Callback when a bone is clicked */
  onBoneClick: (boneId: BoneId | null) => void;
  /** Set of bone IDs that have injuries */
  bonesWithInjuries: Set<BoneId>;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ selectedBoneId, onBoneClick, bonesWithInjuries }, ref) {
    const handleContainerClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onBoneClick(null);
      }
    };

    return (
      <div ref={ref} className={styles.container} onClick={handleContainerClick}>
        <SkeletonSVG
          selectedBoneId={selectedBoneId}
          onBoneClick={onBoneClick}
          bonesWithInjuries={bonesWithInjuries}
        />
      </div>
    );
  }
);

