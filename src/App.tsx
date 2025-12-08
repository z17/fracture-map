import { useState, useRef, useCallback, useEffect } from 'react';
import { Skeleton } from './components/Skeleton';
import { InjuryForm } from './components/InjuryForm';
import { InjuryList } from './components/InjuryList';
import { Stats } from './components/Stats';
import { Share } from './components/Share';
import { Footer } from './components/Footer';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Terms } from './pages/Terms';
import { useInjuries } from './hooks/useInjuries';
import { useLanguage } from './i18n';
import { getBoneName } from './components/Skeleton/SkeletonSVG';
import { fetchMapBySlug, fetchMapByEditKey, createMap, updateMap } from './api/maps';
import type { BoneId, InjuryFormData } from './types';
import './App.css';

interface RouteInfo {
  mode: 'create' | 'edit' | 'view' | 'terms' | 'notFound';
  slug?: string;
  editKey?: string;
}

function parseRoute(): RouteInfo {
  const path = window.location.pathname;

  if (path === '/create' || path === '/') {
    return { mode: 'create' };
  }

  if (path === '/terms') {
    return { mode: 'terms' };
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
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedDataRef = useRef<{ name: string; injuries: string } | null>(null);

  const { injuries, setInjuries, addInjury, removeInjury, updateInjury, bonesWithInjuries } = useInjuries();
  const { t } = useLanguage();
  const skeletonRef = useRef<HTMLDivElement>(null);

  const [route] = useState(() => parseRoute());
  const isEditMode = route.mode === 'create' || route.mode === 'edit';

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
          loadedDataRef.current = { name: data.name, injuries: JSON.stringify(data.injuries) };
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

    if (route.mode === 'create' || route.mode === 'terms') {
      setLoading(false);
    } else if (route.mode === 'notFound') {
      setError('Page not found');
      setLoading(false);
    } else {
      loadMap();
    }
  }, [route, setInjuries]);

  if (route.mode === 'terms') {
    return <Terms />;
  }

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

    if (route.mode === 'view' && mapName) {
      const title = `${mapName} | ${appTitle}`;
      const description = `${injuries.length} ${injuries.length === 1 ? 'injury' : 'injuries'} marked`;

      const updateMeta = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
        }
        if (meta) {
          meta.setAttribute('content', content);
        }
      };

      updateMeta('og:title', title);
      updateMeta('og:description', description);
      updateMeta('twitter:title', title);
      updateMeta('twitter:description', description);
    }
  }, [t, mapName, route.mode, isEditMode, editKey, injuries.length]);

  const doSave = useCallback(async (key: string, name: string, injuriesList: typeof injuries) => {
    setSaveStatus('saving');
    try {
      await updateMap(key, { name, injuries: injuriesList });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to save map');
    }
  }, []);

  const handleCreate = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const data = await createMap({ name: mapName, injuries });
      setSlug(data.slug);
      setEditKey(data.editKey || null);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      window.history.pushState({}, '', `/edit/${data.editKey}`);
    } catch (err) {
      setSaveStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to save map');
    }
  }, [mapName, injuries]);

  useEffect(() => {
    if (!editKey) return;

    const currentData = { name: mapName, injuries: JSON.stringify(injuries) };
    if (loadedDataRef.current &&
        loadedDataRef.current.name === currentData.name &&
        loadedDataRef.current.injuries === currentData.injuries) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      doSave(editKey, mapName, injuries);
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editKey, mapName, injuries, doSave]);

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
        <a href="/create" className="header-link">
          <img src="/icon.png" alt="" className="header-logo" />
          <h1>{t('title')}</h1>
        </a>
        <LanguageSwitcher />
      </div>
      <p className="subtitle">{t('subtitle')}</p>

      {route.mode === 'view' && (
        <button className="create-new-button" onClick={() => window.location.href = '/create'}>
          {t('createNew')}
        </button>
      )}

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

          <Stats
            totalInjuries={injuries.length}
            bonesWithInjuries={bonesWithInjuries}
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

      <Footer />
    </div>
  );
}

export default App;
