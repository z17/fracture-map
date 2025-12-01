import { useState } from 'react';
import { useLanguage } from '../../i18n';
import type { InjuryFormData } from '../../types';
import styles from './InjuryForm.module.css';

interface InjuryFormProps {
  boneName: string;
  onSubmit: (data: InjuryFormData) => void;
}

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

function toISODate(month: number, year: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function InjuryForm({ boneName, onSubmit }: InjuryFormProps) {
  const { t, months } = useLanguage();
  const [description, setDescription] = useState('');
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmit({
      description: description.trim(),
      date: toISODate(month, year),
    });

    setDescription('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.title}>{t('addInjury')}: {boneName}</h3>

      <div className={styles.field}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('injuryDescription')}
          rows={2}
          required
        />
      </div>

      <div className={styles.dateRow}>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {months.map((name, index) => (
            <option key={index} value={index + 1}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className={styles.submitButton}>
        {t('addInjuryButton')}
      </button>
    </form>
  );
}

