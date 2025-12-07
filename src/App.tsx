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
import { fetchMapBySlug, fetchMapByEditKey, createMap, updateMap } from './api/maps';
import type { BoneId, InjuryFormData } from './types';
import './App.css';

interface RouteInfo {
  mode: 'create' | 'edit' | 'view' | 'notFound';
  slug?: string;
  editKey?: string;
}

function parseRoute(): RouteInfo {
  const path = window.location.pathname;

  if (path === '/create' || path === '/') {
    return { mode: 'create' };
  }

  const editMatch = path.match(/^\/edit\/(.+)$/);
  if (editMatch) {
    return { mode: 'edit', editKey: editMatch[1] };
  }

  const viewMatch = path.match(/^\/view\/(.+)$/);
  if (viewMatch) {
    return { mode: 'view', slug: viewMatch[1] };
  }

  return { mode: 'notFound' };
}

function App() {
  const [selectedBoneId, setSelectedBoneId] = useState<BoneId | null>(null);
  const [mapName, setMapName] = useState('');
  const [slug, setSlug] = useState<string | null>(null);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { injuries, setInjuries, addInjury, removeInjury, updateInjury, bonesWithInjuries } = useInjuries();
  const { t } = useLanguage();
  const skeletonRef = useRef<HTMLDivElement>(null);

  const [route] = useState(() => parseRoute());
  const isEditMode = route.mode === 'create' || route.mode === 'edit';

  // Load map data on mount
  useEffect(() => {
    async function loadMap() {
      try {
        if (route.mode === 'view' && route.slug) {
          const data = await fetchMapBySlug(route.slug);
          setMapName(data.name);
          setInjuries(data.injuries);
          setSlug(data.slug);
        } else if (route.mode === 'edit' && route.editKey) {
          const data = await fetchMapByEditKey(route.editKey);
          setMapName(data.name);
          setInjuries(data.injuries);
          setSlug(data.slug);
          setEditKey(data.editKey || route.editKey);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map');
      } finally {
        setLoading(false);
      }
    }

    if (route.mode === 'create') {
      setLoading(false);
      setIsInitialLoad(false);
    } else if (route.mode === 'notFound') {
      setError('Page not found');
      setLoading(false);
    } else {
      loadMap().then(() => setIsInitialLoad(false));
    }
  }, [route, setInjuries]);

  useEffect(() => {
    const appTitle = t('title');
    if (route.mode === 'create' && !editKey) {
      document.title = `${t('createNew')} | ${appTitle}`;
    } else if (isEditMode && mapName) {
      document.title = `${t('edit')} ${mapName} | ${appTitle}`;
    } else if (mapName) {
      document.title = `${mapName} | ${appTitle}`;
    } else {
      document.title = appTitle;
    }
  }, [t, mapName, route.mode, isEditMode, editKey]);

  // Save map (debounced for auto-save)
  const doSave = useCallback(async (key: string, name: string, injuriesList: typeof injuries) => {
    setSaveStatus('saving');
    try {
      await updateMap(key, { name, injuries: injuriesList });
      setSaveStatus('saved');
      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to save map');
    }
  }, []);

  // Create new map (first save)
  const handleCreate = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const data = await createMap({ name: mapName, injuries });
      setSlug(data.slug);
      setEditKey(data.editKey || null);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      // Update URL to edit mode
      window.history.pushState({}, '', `/edit/${data.editKey}`);
    } catch (err) {
      setSaveStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to save map');
    }
  }, [mapName, injuries]);

  // Auto-save when injuries or mapName change (only if we have editKey)
  useEffect(() => {
    if (!editKey || isInitialLoad) return;

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save by 500ms
    saveTimeoutRef.current = setTimeout(() => {
      doSave(editKey, mapName, injuries);
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editKey, mapName, injuries, isInitialLoad, doSave]);

  const handleBoneClick = useCallback((boneId: BoneId | null) => {
    setSelectedBoneId(boneId);
  }, []);

  const handleAddInjury = (data: InjuryFormData) => {
    if (selectedBoneId) {
      addInjury(selectedBoneId, data);
    }
  };

  const selectedBoneName = selectedBoneId ? getBoneName(selectedBoneId) : null;

  if (loading) {
    return (
      <div className="app">
        <div className="loading">{t('loading') || 'Loading...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">{error}</div>
        <button className="create-new-button" onClick={() => window.location.href = '/create'}>
          {t('createNew')}
        </button>
      </div>
    );
  }

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
            slug={slug}
            editKey={editKey}
            onCreate={handleCreate}
            saveStatus={saveStatus}
            skeletonContainerRef={skeletonRef}
            isEditMode={isEditMode}
          />

          <InjuryList
            injuries={injuries}
            selectedBoneId={selectedBoneId}
            onRemove={isEditMode ? removeInjury : undefined}
            onUpdate={isEditMode ? updateInjury : undefined}
            onBoneSelect={handleBoneClick}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
