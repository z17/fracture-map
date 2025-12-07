import { useState, useRef, useCallback, useEffect } from 'react';
import { Skeleton } from './components/Skeleton';
import { InjuryForm } from './components/InjuryForm';
import { InjuryList } from './components/InjuryList';
import { Stats } from './components/Stats';
import { Share } from './components/Share';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useInjuries } from './hooks/useInjuries';
import { useLanguage } from './i18n';
import { getBoneName } from './components/Skeleton/SkeletonSVG';
import type { BoneId, InjuryFormData } from './types';
import './App.css';

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function getEditModeFromUrl(): boolean {
  const path = window.location.pathname;
  if (path.startsWith('/edit/') || path.startsWith('/create')) {
    return true;
  }
  return false;
}

function App() {
  const [selectedBoneId, setSelectedBoneId] = useState<BoneId | null>(null);
  const [mapName, setMapName] = useState('');
  const { injuries, addInjury, removeInjury, updateInjury, bonesWithInjuries } = useInjuries();
  const { t } = useLanguage();
  const skeletonRef = useRef<HTMLDivElement>(null);
  const isEditMode = getEditModeFromUrl();

  const [viewId] = useState(() => generateId());
  const [editId] = useState(() => generateId());

  useEffect(() => {
    document.title = t('title');
  }, [t]);

  const handleBoneClick = useCallback((boneId: BoneId | null) => {
    setSelectedBoneId(boneId);
  }, []);

  const handleAddInjury = (data: InjuryFormData) => {
    if (selectedBoneId) {
      addInjury(selectedBoneId, data);
    }
  };

  const selectedBoneName = selectedBoneId ? getBoneName(selectedBoneId) : null;

  return (
    <div className="app">
      <div className="header">
        <h1>{t('title')}</h1>
        <LanguageSwitcher />
      </div>
      <p className="subtitle">{t('subtitle')}</p>

      <button className="create-new-button" onClick={() => window.location.href = '/create'}>
        {t('createNew')}
      </button>

      <div className="selected-bone-info">
        {selectedBoneName
          ? <>{t('selected')}: <strong>{selectedBoneName}</strong></>
          : <span className="hint">{t('selectBoneHint')}</span>
        }
      </div>

      <div className="app-content">
        <div className="skeleton-section">
          <Skeleton
            ref={skeletonRef}
            selectedBoneId={selectedBoneId}
            onBoneClick={handleBoneClick}
            bonesWithInjuries={bonesWithInjuries}
          />
        </div>

        <div className="sidebar">
          {isEditMode && selectedBoneId && selectedBoneName && (
            <InjuryForm
              boneName={selectedBoneName}
              onSubmit={handleAddInjury}
            />
          )}

          <Stats
            totalInjuries={injuries.length}
            bonesWithInjuries={bonesWithInjuries}
          />

          <Share
            mapName={mapName}
            onMapNameChange={setMapName}
            viewId={viewId}
            editId={editId}
            skeletonContainerRef={skeletonRef}
            isEditMode={isEditMode}
          />

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
