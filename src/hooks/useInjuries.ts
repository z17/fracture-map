import { useState, useCallback, useMemo } from 'react';
import type { Injury, InjuryFormData, BoneId } from '../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useInjuries() {
  const [injuries, setInjuries] = useState<Injury[]>([]);

  const addInjury = useCallback((boneId: BoneId, data: InjuryFormData) => {
    const newInjury: Injury = {
      id: generateId(),
      boneId,
      description: data.description,
      month: data.month,
      year: data.year,
    };
    setInjuries(prev => [...prev, newInjury]);
  }, []);

  const removeInjury = useCallback((injuryId: string) => {
    setInjuries(prev => prev.filter(injury => injury.id !== injuryId));
  }, []);

  const getInjuriesByBone = useCallback(
    (boneId: BoneId): Injury[] => {
      return injuries.filter(injury => injury.boneId === boneId);
    },
    [injuries]
  );

  const bonesWithInjuries = useMemo(() => {
    return new Set(injuries.map(injury => injury.boneId));
  }, [injuries]);

  const hasBoneInjury = useCallback(
    (boneId: BoneId): boolean => {
      return bonesWithInjuries.has(boneId);
    },
    [bonesWithInjuries]
  );

  return {
    injuries,
    addInjury,
    removeInjury,
    getInjuriesByBone,
    bonesWithInjuries,
    hasBoneInjury,
  };
}

