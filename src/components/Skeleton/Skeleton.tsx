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

export function Skeleton({ selectedBoneId, onBoneClick, bonesWithInjuries }: SkeletonProps) {
  return (
    <div className={styles.container}>
      <SkeletonSVG
        selectedBoneId={selectedBoneId}
        onBoneClick={onBoneClick}
        bonesWithInjuries={bonesWithInjuries}
      />
    </div>
  );
}

