import type { BoneId } from '../../types';
import { SkeletonSVG } from './SkeletonSVG';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  /** ID выбранной кости */
  selectedBoneId: BoneId | null;
  /** Callback при клике на кость */
  onBoneClick: (boneId: BoneId) => void;
  /** Set с ID костей, у которых есть травмы */
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

