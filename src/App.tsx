import { useState } from 'react';
import { Skeleton } from './components/Skeleton';
import { InjuryForm } from './components/InjuryForm';
import { InjuryList } from './components/InjuryList';
import { useInjuries } from './hooks/useInjuries';
import { getBoneName } from './components/Skeleton/SkeletonSVG';
import type { BoneId, InjuryFormData } from './types';
import './App.css';

function App() {
  const [selectedBoneId, setSelectedBoneId] = useState<BoneId | null>(null);
  const { injuries, addInjury, removeInjury, updateInjury, bonesWithInjuries } = useInjuries();

  const handleBoneClick = (boneId: BoneId | null) => {
    setSelectedBoneId(boneId);
  };

  const handleAddInjury = (data: InjuryFormData) => {
    if (selectedBoneId) {
      addInjury(selectedBoneId, data);
    }
  };

  const selectedBoneName = selectedBoneId ? getBoneName(selectedBoneId) : null;

  return (
    <div className="app">
      <h1>Карта переломов</h1>

      <div className="selected-bone-info">
        {selectedBoneName
          ? <>Выбрано: <strong>{selectedBoneName}</strong></>
          : <span className="hint">Кликните на кость для выбора</span>
        }
      </div>

      <div className="app-content">
        <div className="skeleton-section">
          <Skeleton
            selectedBoneId={selectedBoneId}
            onBoneClick={handleBoneClick}
            bonesWithInjuries={bonesWithInjuries}
          />
        </div>

        <div className="sidebar">
          {selectedBoneId && selectedBoneName && (
            <InjuryForm
              boneName={selectedBoneName}
              onSubmit={handleAddInjury}
            />
          )}

          <InjuryList
            injuries={injuries}
            selectedBoneId={selectedBoneId}
            onRemove={removeInjury}
            onUpdate={updateInjury}
            onBoneSelect={handleBoneClick}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
