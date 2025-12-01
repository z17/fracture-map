import type { Injury, BoneId } from '../../types';
import { getBoneName } from '../Skeleton/SkeletonSVG';
import styles from './InjuryList.module.css';

interface InjuryListProps {
  injuries: Injury[];
  selectedBoneId: BoneId | null;
  onRemove: (injuryId: string) => void;
}

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

function formatDate(month: number, year: number): string {
  return `${MONTHS[month - 1]} ${year}`;
}

export function InjuryList({ injuries, selectedBoneId, onRemove }: InjuryListProps) {
  if (injuries.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Травм пока нет</p>
        <p className={styles.hint}>Выберите кость и добавьте травму</p>
      </div>
    );
  }

  const sortedInjuries = [...injuries].sort((a, b) => {
    const aSelected = a.boneId === selectedBoneId;
    const bSelected = b.boneId === selectedBoneId;

    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;

    const dateA = a.year * 12 + a.month;
    const dateB = b.year * 12 + b.month;
    return dateB - dateA;
  });

  return (
    <div className={styles.list}>
      <h3 className={styles.title}>История травм ({injuries.length})</h3>
      
      {sortedInjuries.map((injury) => {
        const isHighlighted = injury.boneId === selectedBoneId;
        
        return (
          <div
            key={injury.id}
            className={`${styles.item} ${isHighlighted ? styles.highlighted : ''}`}
          >
            <div className={styles.header}>
              <span className={styles.boneName}>{getBoneName(injury.boneId)}</span>
              <span className={styles.date}>{formatDate(injury.month, injury.year)}</span>
            </div>
            <p className={styles.description}>{injury.description}</p>
            <button
              className={styles.removeButton}
              onClick={() => onRemove(injury.id)}
              aria-label="Удалить травму"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

