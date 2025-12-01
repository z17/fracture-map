import { useState } from 'react';
import type { InjuryFormData } from '../../types';
import styles from './InjuryForm.module.css';

interface InjuryFormProps {
  boneName: string;
  onSubmit: (data: InjuryFormData) => void;
}

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

export function InjuryForm({ boneName, onSubmit }: InjuryFormProps) {
  const [description, setDescription] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmit({
      description: description.trim(),
      month,
      year,
    });

    setDescription('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.title}>Добавить травму: {boneName}</h3>
      
      <div className={styles.field}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание травмы"
          rows={2}
          required
        />
      </div>

      <div className={styles.dateRow}>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {MONTHS.map((name, index) => (
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
        Добавить травму
      </button>
    </form>
  );
}

