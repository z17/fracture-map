import { useState } from 'react';
import { useLanguage } from '../../i18n';
import type { Injury, BoneId, InjuryFormData } from '../../types';
import { getBoneName } from '../Skeleton/SkeletonSVG';
import styles from './InjuryList.module.css';

interface InjuryListProps {
  injuries: Injury[];
  selectedBoneId: BoneId | null;
  onRemove: (injuryId: string) => void;
  onUpdate: (injuryId: string, data: InjuryFormData) => void;
  onBoneSelect: (boneId: BoneId) => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

function parseISODate(isoDate: string): { month: number; year: number } {
  const [year, month] = isoDate.split('-');
  return { month: parseInt(month, 10), year: parseInt(year, 10) };
}

function toISODate(month: number, year: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function InjuryList({ injuries, selectedBoneId, onRemove, onUpdate, onBoneSelect }: InjuryListProps) {
  const { t, months } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editMonth, setEditMonth] = useState(1);
  const [editYear, setEditYear] = useState(currentYear);

  const formatDate = (isoDate: string): string => {
    const [year, month] = isoDate.split('-');
    return `${months[parseInt(month, 10) - 1]} ${year}`;
  };

  const startEditing = (injury: Injury) => {
    const { month, year } = parseISODate(injury.date);
    setEditingId(injury.id);
    setEditDescription(injury.description);
    setEditMonth(month);
    setEditYear(year);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = () => {
    if (editingId && editDescription.trim()) {
      onUpdate(editingId, {
        description: editDescription.trim(),
        date: toISODate(editMonth, editYear),
      });
      setEditingId(null);
    }
  };

  if (injuries.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{t('noInjuries')}</p>
        <p className={styles.hint}>{t('selectBoneAndAdd')}</p>
      </div>
    );
  }

  const sortedInjuries = [...injuries].sort((a, b) => {
    const aSelected = a.boneId === selectedBoneId;
    const bSelected = b.boneId === selectedBoneId;

    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;

    return b.date.localeCompare(a.date);
  });

  return (
    <div className={styles.list}>
      <h3 className={styles.title}>{t('injuryHistory')} ({injuries.length})</h3>

      {sortedInjuries.map((injury) => {
        const isHighlighted = injury.boneId === selectedBoneId;
        const isEditing = editingId === injury.id;

        return (
          <div
            key={injury.id}
            className={`${styles.item} ${isHighlighted ? styles.highlighted : ''} ${isEditing ? styles.editing : ''}`}
            onClick={() => !isEditing && onBoneSelect(injury.boneId)}
          >
            {isEditing ? (
              <div className={styles.editForm} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                  <span className={styles.boneName}>{getBoneName(injury.boneId)}</span>
                </div>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  autoFocus
                />
                <div className={styles.editDateRow}>
                  <select value={editMonth} onChange={(e) => setEditMonth(Number(e.target.value))}>
                    {months.map((name, index) => (
                      <option key={index} value={index + 1}>{name}</option>
                    ))}
                  </select>
                  <select value={editYear} onChange={(e) => setEditYear(Number(e.target.value))}>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.editActions}>
                  <button className={styles.saveButton} onClick={saveEditing}>{t('save')}</button>
                  <button className={styles.cancelButton} onClick={cancelEditing}>{t('cancel')}</button>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.header}>
                  <span className={styles.boneName}>{getBoneName(injury.boneId)}</span>
                  <span className={styles.date}> — {formatDate(injury.date)}</span>
                </div>
                {injury.description && <p className={styles.description}>{injury.description}</p>}
                <div className={styles.actions}>
                  <button
                    className={styles.editButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(injury);
                    }}
                    aria-label={t('editInjury')}
                  >
                    ✎
                  </button>
                  <button
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(injury.id);
                    }}
                    aria-label={t('deleteInjury')}
                  >
                    ✕
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

