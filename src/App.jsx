import { useEffect, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import Header from './components/Header';
import ComponentLibrary from './components/ComponentLibrary';
import BuilderCanvas from './components/BuilderCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import PreviewModal from './components/PreviewModal';
import CodeExporter from './components/CodeExporter';
import ToastContainer from './components/ToastContainer';
import ThemeEditorModal from './components/ThemeEditorModal';
import HelpCenter from './components/HelpCenter';
import LayersPanel from './components/LayersPanel';
import ScreensPanel from './components/ScreensPanel';
import { createDefaultElement, createTemplateElements, createTemplateScreens } from './utils/defaultComponents';
import { generateProjectFiles } from './utils/generateCode';
import { defaultThemeId, getThemeById, themes } from './utils/themes';

const STORAGE_KEY = 'nocode-forge-canvas';
const THEME_STORAGE_KEY = 'nocode-forge-theme';
const CUSTOM_THEMES_STORAGE_KEY = 'nocode-forge-custom-themes';
const VIEWPORT_STORAGE_KEY = 'nocode-forge-viewport';
const CANVAS_LAYOUT_STORAGE_KEY = 'nocode-forge-canvas-layout';
const PROJECTS_STORAGE_KEY = 'nocode-forge-projects';
const ACTIVE_PROJECT_STORAGE_KEY = 'nocode-forge-active-project';
const ACTIVE_SCREEN_STORAGE_KEY = 'nocode-forge-active-screen';
const HISTORY_LIMIT = 80;
const COALESCE_WINDOW_MS = 450;

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const moveItem = (arr, fromIndex, toIndex) => {
  const next = [...arr];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
};

const duplicateWithNewId = (el) => ({
  ...el,
  id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
});

const slugify = (text) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const normalizeProject = (project) => {
  if (!project) return { id: 'default', name: 'Mon projet', screens: [{ id: 'screen-home', name: 'Accueil', elements: [] }] };
  if (Array.isArray(project.screens) && project.screens.length > 0) {
    return {
      ...project,
      screens: project.screens.map((screen, index) => ({
        id: screen.id || `screen-${index + 1}`,
        name: screen.name || `Ecran ${index + 1}`,
        elements: Array.isArray(screen.elements) ? screen.elements : [],
      })),
    };
  }
  return {
    ...project,
    screens: [{ id: 'screen-home', name: 'Accueil', elements: Array.isArray(project.elements) ? project.elements : [] }],
  };
};

export default function App() {
  const [projects, setProjects] = useState(() => {
    const saved = readJson(PROJECTS_STORAGE_KEY, null);
    if (Array.isArray(saved) && saved.length > 0) return saved.map(normalizeProject);
    return [normalizeProject({ id: 'default', name: 'Mon projet', elements: readJson(STORAGE_KEY, []) })];
  });
  const [activeProjectId, setActiveProjectId] = useState(() => localStorage.getItem(ACTIVE_PROJECT_STORAGE_KEY) || 'default');
  const activeProject = useMemo(() => projects.find((project) => project.id === activeProjectId) || projects[0], [projects, activeProjectId]);
  const [activeScreenId, setActiveScreenId] = useState(() => localStorage.getItem(ACTIVE_SCREEN_STORAGE_KEY) || activeProject?.screens?.[0]?.id || 'screen-home');
  const activeScreen = useMemo(
    () => activeProject?.screens?.find((screen) => screen.id === activeScreenId) || activeProject?.screens?.[0],
    [activeProject, activeScreenId]
  );
  const screens = activeProject?.screens || [];
  const [elements, setElements] = useState(() => activeScreen?.elements || []);
  const [customThemes, setCustomThemes] = useState(() => readJson(CUSTOM_THEMES_STORAGE_KEY, []));
  const [themeId, setThemeId] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || defaultThemeId);
  const [viewport, setViewport] = useState(() => localStorage.getItem(VIEWPORT_STORAGE_KEY) || 'desktop');
  const [canvasLayout, setCanvasLayout] = useState(() => localStorage.getItem(CANVAS_LAYOUT_STORAGE_KEY) || 'column');
  const [selectedIds, setSelectedIds] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [draftThemeName, setDraftThemeName] = useState('Mon theme');
  const [draftThemeVars, setDraftThemeVars] = useState(getThemeById(defaultThemeId).vars);
  const [editingThemeId, setEditingThemeId] = useState(null);

  const lastChangeMetaRef = useRef({ key: null, at: 0 });

  const allThemes = useMemo(() => [...themes, ...customThemes], [customThemes]);
  const activeTheme = useMemo(() => allThemes.find((t) => t.id === themeId) || allThemes[0], [allThemes, themeId]);
  const selectedElement = useMemo(() => elements.find((el) => el.id === selectedIds[0]) || null, [elements, selectedIds]);

  const pushToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2000);
  };

  useEffect(() => {
    if (!activeProject) return;
    const nextScreenId = activeProject.screens?.some((screen) => screen.id === activeScreenId)
      ? activeScreenId
      : activeProject.screens?.[0]?.id;
    if (nextScreenId && nextScreenId !== activeScreenId) {
      setActiveScreenId(nextScreenId);
      return;
    }
    const screen = activeProject.screens?.find((item) => item.id === nextScreenId);
    setElements(screen?.elements || []);
    setSelectedIds([]);
  }, [activeProjectId, activeScreenId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(elements));
    setProjects((prev) =>
      prev.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              screens: (project.screens || []).map((screen) =>
                screen.id === activeScreenId ? { ...screen, elements } : screen
              ),
            }
          : project
      )
    );
  }, [elements]);

  useEffect(() => localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects)), [projects]);
  useEffect(() => localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, activeProjectId), [activeProjectId]);
  useEffect(() => localStorage.setItem(ACTIVE_SCREEN_STORAGE_KEY, activeScreenId), [activeScreenId]);
  useEffect(() => localStorage.setItem(THEME_STORAGE_KEY, themeId), [themeId]);
  useEffect(() => localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(customThemes)), [customThemes]);
  useEffect(() => localStorage.setItem(VIEWPORT_STORAGE_KEY, viewport), [viewport]);
  useEffect(() => localStorage.setItem(CANVAS_LAYOUT_STORAGE_KEY, canvasLayout), [canvasLayout]);

  const applyChange = (updater, options = {}) => {
    const { coalesceKey = null } = options;
    const now = Date.now();

    setElements((prev) => {
      const next = updater(prev);
      if (next === prev) return prev;

      setHistory((h) => {
        const lastMeta = lastChangeMetaRef.current;
        if (coalesceKey && lastMeta.key === coalesceKey && now - lastMeta.at < COALESCE_WINDOW_MS && h.length > 0) {
          const replaced = [...h];
          replaced[replaced.length - 1] = prev;
          return replaced.slice(-HISTORY_LIMIT);
        }
        return [...h, prev].slice(-HISTORY_LIMIT);
      });

      lastChangeMetaRef.current = { key: coalesceKey, at: now };
      setFuture([]);
      return next;
    });
  };

  const addElement = (type) => {
    const newElement = createDefaultElement(type);
    applyChange((prev) => [...prev, newElement]);
    setSelectedIds([newElement.id]);
    pushToast('Element ajoute', 'success');
  };

  const addTemplate = (templateId) => {
    const templateScreens = createTemplateScreens(templateId);
    if (templateScreens?.length) {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === activeProjectId
            ? { ...project, screens: [...(project.screens || []), ...templateScreens] }
            : project
        )
      );
      setActiveScreenId(templateScreens[0].id);
      setElements(templateScreens[0].elements || []);
      pushToast('App multi-ecrans ajoutee', 'success');
      return;
    }

    const newElements = createTemplateElements(templateId);
    if (newElements.length === 0) return;
    applyChange((prev) => [...prev, ...newElements]);
    setSelectedIds(newElements.length ? [newElements[0].id] : []);
    pushToast('Modele ajoute', 'success');
  };

  const onSelectElement = (id, additive = false) => {
    setSelectedIds((prev) => {
      if (!id) return [];
      if (!additive) return [id];
      return prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id];
    });
  };

  const updateElementById = (id, path, value, options = {}) => {
    if (!id) return;
    applyChange((prev) => prev.map((el) => {
      if (el.id !== id) return el;
      if (el.props?.locked && path !== 'props.locked' && path !== 'props.groupId') return el;
      if (path === 'content' || path === 'className') return { ...el, [path]: value };
      if (path.startsWith('props.')) {
        const key = path.split('.')[1];
        return { ...el, props: { ...el.props, [key]: value } };
      }
      return el;
    }), options);
  };

  const updateSelected = (path, value) => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => updateElementById(id, path, value, { coalesceKey: `${path}:${id}` }));
  };

  const deleteSelected = (askConfirm = true) => {
    if (selectedIds.length === 0) return;
    if (askConfirm && !window.confirm(`Supprimer ${selectedIds.length} element(s) selectionne(s) ?`)) return;
    applyChange((prev) => prev.filter((el) => !selectedIds.includes(el.id)));
    setSelectedIds([]);
    pushToast('Selection supprimee', 'success');
  };

  const duplicateSelected = () => {
    if (selectedIds.length === 0) return;
    let newIds = [];
    applyChange((prev) => {
      const next = [...prev];
      selectedIds.forEach((id) => {
        const index = next.findIndex((el) => el.id === id);
        if (index >= 0) {
          const clone = duplicateWithNewId(next[index]);
          newIds.push(clone.id);
          next.splice(index + 1, 0, clone);
        }
      });
      return next;
    });
    setSelectedIds(newIds);
    pushToast('Selection dupliquee', 'success');
  };

  const clearCanvas = () => {
    if (elements.length === 0) return;
    if (!window.confirm('Tout effacer ?')) return;
    applyChange(() => []);
    setSelectedIds([]);
    pushToast('Zone videe', 'success');
  };

  const newProject = () => {
    const name = window.prompt('Nom du nouveau projet ?', `Projet ${projects.length + 1}`);
    if (!name) return;
    const id = `project-${Date.now().toString(36)}`;
    const project = normalizeProject({ id, name: name.trim(), elements: [] });
    setProjects((prev) => [...prev, project]);
    setActiveProjectId(id);
    setActiveScreenId(project.screens[0].id);
    setElements([]);
    pushToast('Nouveau projet cree', 'success');
  };

  const saveProjectAs = () => {
    const name = window.prompt('Sauver sous quel nom ?', `${activeProject?.name || 'Projet'} copie`);
    if (!name) return;
    const id = `project-${Date.now().toString(36)}`;
    const project = normalizeProject({ ...activeProject, id, name: name.trim() });
    setProjects((prev) => [...prev, project]);
    setActiveProjectId(id);
    setActiveScreenId(project.screens?.[0]?.id || 'screen-home');
    pushToast('Projet copie', 'success');
  };

  const addScreen = () => {
    const name = window.prompt('Nom du nouvel ecran ?', `Ecran ${screens.length + 1}`);
    if (!name) return;
    const screen = { id: uid('screen'), name: name.trim(), elements: [] };
    setProjects((prev) =>
      prev.map((project) =>
        project.id === activeProjectId ? { ...project, screens: [...(project.screens || []), screen] } : project
      )
    );
    setActiveScreenId(screen.id);
    setElements([]);
    pushToast('Ecran ajoute', 'success');
  };

  const renameScreen = (screenId) => {
    const current = screens.find((screen) => screen.id === screenId);
    const name = window.prompt('Nouveau nom de l ecran ?', current?.name || 'Ecran');
    if (!name) return;
    setProjects((prev) =>
      prev.map((project) =>
        project.id === activeProjectId
          ? { ...project, screens: project.screens.map((screen) => (screen.id === screenId ? { ...screen, name: name.trim() } : screen)) }
          : project
      )
    );
    pushToast('Ecran renomme', 'success');
  };

  const duplicateScreen = (screenId) => {
    const source = screens.find((screen) => screen.id === screenId);
    if (!source) return;
    const clone = {
      id: uid('screen'),
      name: `${source.name} copie`,
      elements: source.elements.map(duplicateWithNewId),
    };
    setProjects((prev) =>
      prev.map((project) =>
        project.id === activeProjectId ? { ...project, screens: [...project.screens, clone] } : project
      )
    );
    setActiveScreenId(clone.id);
    setElements(clone.elements);
    pushToast('Ecran copie', 'success');
  };

  const deleteScreen = (screenId) => {
    if (screens.length <= 1) return pushToast('Il faut garder au moins un ecran', 'info');
    if (!window.confirm('Supprimer cet ecran ?')) return;
    const remaining = screens.filter((screen) => screen.id !== screenId);
    setProjects((prev) =>
      prev.map((project) =>
        project.id === activeProjectId ? { ...project, screens: remaining } : project
      )
    );
    if (activeScreenId === screenId) {
      setActiveScreenId(remaining[0].id);
      setElements(remaining[0].elements || []);
    }
    pushToast('Ecran supprime', 'success');
  };

  const exportJson = () => {
    const payload = {
      name: activeProject?.name || 'NoCode Forge',
      screens: activeProject?.screens || [{ id: activeScreenId, name: activeScreen?.name || 'Accueil', elements }],
      activeScreenId,
      themeId,
      viewport,
      canvasLayout,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${slugify(payload.name) || 'nocode-forge'}-projet.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    pushToast('JSON exporte', 'success');
  };

  const importJson = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        const importedScreens = parsed.screens || null;
        const importedElements = Array.isArray(parsed) ? parsed : parsed.elements;
        if (!Array.isArray(importedScreens) && !Array.isArray(importedElements)) throw new Error('Invalid project');
        const id = `project-${Date.now().toString(36)}`;
        const project = normalizeProject({ id, name: parsed.name || file.name.replace(/\.json$/i, ''), screens: importedScreens, elements: importedElements });
        setProjects((prev) => [...prev, project]);
        setActiveProjectId(id);
        setActiveScreenId(project.screens[0].id);
        setElements(project.screens[0].elements || []);
        pushToast('Projet importe', 'success');
      } catch {
        pushToast('Import impossible', 'error');
      }
    };
    input.click();
  };

  const reorderElements = (fromId, toId, placement = 'before', dragSelectionIds = []) => {
    if (!fromId) return;
    applyChange((prev) => {
      const draggedSelectionSet =
        dragSelectionIds.includes(fromId) && dragSelectionIds.length > 1
          ? new Set(dragSelectionIds)
          : new Set([fromId]);

      const movingItems = prev.filter((el) => draggedSelectionSet.has(el.id));
      if (movingItems.length === 0) return prev;

      const remaining = prev.filter((el) => !draggedSelectionSet.has(el.id));

      let insertIndex = remaining.length;
      if (toId) {
        const targetIndex = remaining.findIndex((el) => el.id === toId);
        if (targetIndex < 0) return prev;
        insertIndex = placement === 'after' ? targetIndex + 1 : targetIndex;
      }

      const next = [...remaining];
      next.splice(insertIndex, 0, ...movingItems);
      return next;
    });
  };

  const moveSelectedBy = (offset) => {
    if (selectedIds.length !== 1 || offset === 0) return;
    const selectedId = selectedIds[0];
    applyChange((prev) => {
      const current = prev.findIndex((el) => el.id === selectedId);
      if (current < 0) return prev;
      const target = Math.max(0, Math.min(prev.length - 1, current + offset));
      if (target === current) return prev;
      return moveItem(prev, current, target);
    });
  };

  const toggleLockSelected = () => {
    if (selectedIds.length === 0) return;
    const selected = elements.filter((el) => selectedIds.includes(el.id));
    const shouldLock = selected.some((el) => !el.props?.locked);
    applyChange((prev) =>
      prev.map((el) =>
        selectedIds.includes(el.id) ? { ...el, props: { ...el.props, locked: shouldLock } } : el
      )
    );
    pushToast(shouldLock ? 'Selection verrouillee' : 'Selection deverrouillee', 'success');
  };

  const groupSelected = () => {
    if (selectedIds.length < 2) return;
    const groupId = `group-${Date.now().toString(36)}`;
    applyChange((prev) =>
      prev.map((el) =>
        selectedIds.includes(el.id) ? { ...el, props: { ...el.props, groupId } } : el
      )
    );
    pushToast('Selection groupee', 'success');
  };

  const ungroupSelected = () => {
    if (selectedIds.length === 0) return;
    const selectedSet = new Set(selectedIds);
    const selectedGroupIds = new Set(
      elements
        .filter((el) => selectedSet.has(el.id))
        .map((el) => el.props?.groupId)
        .filter(Boolean)
    );
    applyChange((prev) =>
      prev.map((el) => {
        const inSelection = selectedSet.has(el.id);
        const inSelectedGroup =
          el.props?.groupId && selectedGroupIds.has(el.props.groupId);
        if (inSelection || inSelectedGroup) {
          return { ...el, props: { ...el.props, groupId: null } };
        }
        return el;
      })
    );
    pushToast('Selection degroupee', 'success');
  };

  const distributeSpacing = () => {
    if (canvasLayout !== 'free' || selectedIds.length < 3) {
      return pushToast('Il faut 3 elements selectionnes en mode Libre', 'info');
    }
    const selected = elements
      .filter((el) => selectedIds.includes(el.id))
      .filter((el) => !el.props?.locked)
      .map((el) => ({
        id: el.id,
        x: typeof el.props?.x === 'number' ? el.props.x : 0,
      }))
      .sort((a, b) => a.x - b.x);
    if (selected.length < 3) return pushToast('Pas assez d elements deverrouilles', 'info');
    const first = selected[0].x;
    const last = selected[selected.length - 1].x;
    const step = (last - first) / (selected.length - 1);
    const xMap = new Map(selected.map((item, i) => [item.id, Math.round(first + i * step)]));
    applyChange((prev) =>
      prev.map((el) =>
        xMap.has(el.id) ? { ...el, props: { ...el.props, x: xMap.get(el.id) } } : el
      )
    );
    pushToast('Espacement applique', 'success');
  };

  const selectedFreeElements = () =>
    elements
      .filter((el) => selectedIds.includes(el.id))
      .filter((el) => !el.props?.locked);

  const alignSelectedFree = (mode) => {
    if (canvasLayout !== 'free' || selectedIds.length === 0) return;
    const selected = selectedFreeElements();
    if (selected.length === 0) return pushToast('Aucun element deplacable', 'info');

    const positions = selected.map((el) => ({
      id: el.id,
      x: typeof el.props?.x === 'number' ? el.props.x : 0,
      y: typeof el.props?.y === 'number' ? el.props.y : 0,
      width: typeof el.props?.width === 'number' ? el.props.width : 120,
      height: typeof el.props?.height === 'number' ? el.props.height : 56,
    }));

    const minX = Math.min(...positions.map((item) => item.x));
    const maxRight = Math.max(...positions.map((item) => item.x + item.width));
    const centerX = Math.round((minX + maxRight) / 2);
    const minY = Math.min(...positions.map((item) => item.y));
    const maxBottom = Math.max(...positions.map((item) => item.y + item.height));
    const centerY = Math.round((minY + maxBottom) / 2);

    applyChange((prev) =>
      prev.map((el) => {
        const item = positions.find((pos) => pos.id === el.id);
        if (!item) return el;
        const nextProps = { ...el.props };
        if (mode === 'left') nextProps.x = minX;
        if (mode === 'center') nextProps.x = Math.max(0, Math.round(centerX - item.width / 2));
        if (mode === 'right') nextProps.x = Math.max(0, maxRight - item.width);
        if (mode === 'top') nextProps.y = minY;
        if (mode === 'middle') nextProps.y = Math.max(0, Math.round(centerY - item.height / 2));
        if (mode === 'bottom') nextProps.y = Math.max(0, maxBottom - item.height);
        return { ...el, props: nextProps };
      })
    );
    pushToast('Alignement applique', 'success');
  };

  const matchSelectedSize = (dimension) => {
    if (canvasLayout !== 'free' || selectedIds.length < 2) return;
    const selected = selectedFreeElements();
    if (selected.length < 2) return pushToast('Selectionne au moins 2 elements', 'info');
    const reference = selected[0];
    const fallback = dimension === 'width' ? 160 : 56;
    const value = typeof reference.props?.[dimension] === 'number' ? reference.props[dimension] : fallback;
    applyChange((prev) =>
      prev.map((el) =>
        selectedIds.includes(el.id) && !el.props?.locked
          ? { ...el, props: { ...el.props, [dimension]: value } }
          : el
      )
    );
    pushToast(dimension === 'width' ? 'Meme largeur appliquee' : 'Meme hauteur appliquee', 'success');
  };

  const changeSelectedLayer = (direction) => {
    if (selectedIds.length !== 1) return;
    const selectedId = selectedIds[0];
    applyChange((prev) => {
      const index = prev.findIndex((el) => el.id === selectedId);
      if (index < 0) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      if (direction === 'front') next.push(item);
      if (direction === 'back') next.unshift(item);
      return next;
    });
    pushToast(direction === 'front' ? 'Mis devant' : 'Mis derriere', 'success');
  };

  const nudgeSelectedFree = (deltaX, deltaY) => {
    if (canvasLayout !== 'free' || selectedIds.length === 0) return;

    const selectedSet = new Set(selectedIds);
    const groupIds = new Set(
      elements
        .filter((el) => selectedSet.has(el.id))
        .map((el) => el.props?.groupId)
        .filter(Boolean)
    );

    applyChange(
      (prev) =>
        prev.map((el) => {
          const shouldMove = selectedSet.has(el.id) || (el.props?.groupId && groupIds.has(el.props.groupId));
          if (!shouldMove || el.props?.locked) return el;
          const currentX = typeof el.props?.x === 'number' ? el.props.x : 0;
          const currentY = typeof el.props?.y === 'number' ? el.props.y : 0;
          return {
            ...el,
            props: {
              ...el.props,
              x: Math.max(0, currentX + deltaX),
              y: Math.max(0, currentY + deltaY),
            },
          };
        }),
      { coalesceKey: 'keyboard-move' }
    );
  };

  const applyFreeOrder = () => {
    applyChange((prev) =>
      [...prev].sort((a, b) => {
        const ay = typeof a.props?.y === 'number' ? a.props.y : 0;
        const by = typeof b.props?.y === 'number' ? b.props.y : 0;
        const ax = typeof a.props?.x === 'number' ? a.props.x : 0;
        const bx = typeof b.props?.x === 'number' ? b.props.x : 0;

        return ay === by ? ax - bx : ay - by;
      })
    );
    pushToast('Ordre visuel conserve', 'success');
  };

  const changeCanvasLayout = (nextLayout) => {
    if (canvasLayout === 'free' && nextLayout !== 'free') {
      applyFreeOrder();
    }
    setCanvasLayout(nextLayout);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [elements, ...f].slice(0, HISTORY_LIMIT));
    setElements(previous);
    setSelectedIds((prev) => prev.filter((id) => previous.some((el) => el.id === id)));
    pushToast('Annule', 'info');
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, elements].slice(-HISTORY_LIMIT));
    setElements(next);
    setSelectedIds((prev) => prev.filter((id) => next.some((el) => el.id === id)));
    pushToast('Retabli', 'info');
  };

  const openThemeEditor = () => {
    const editable = customThemes.find((t) => t.id === themeId);
    setEditingThemeId(editable?.id || null);
    setDraftThemeName(editable?.name || `Theme ${customThemes.length + 1}`);
    setDraftThemeVars(editable?.vars || activeTheme.vars);
    setThemeEditorOpen(true);
  };

  const saveCustomTheme = () => {
    const name = draftThemeName.trim();
    if (!name) return pushToast('Le nom du theme est obligatoire', 'error');

    if (editingThemeId) {
      setCustomThemes((prev) => prev.map((t) => (t.id === editingThemeId ? { ...t, name, vars: { ...draftThemeVars } } : t)));
      pushToast('Theme modifie', 'success');
    } else {
      const id = `custom-${slugify(name)}-${Date.now().toString(36).slice(-4)}`;
      const newTheme = { id, name, vars: { ...draftThemeVars } };
      setCustomThemes((prev) => [...prev, newTheme]);
      setThemeId(id);
      pushToast('Theme enregistre', 'success');
    }

    setThemeEditorOpen(false);
    setEditingThemeId(null);
  };

  const deleteCurrentCustomTheme = () => {
    const current = customThemes.find((t) => t.id === themeId);
    if (!current) return pushToast('Ce theme est integre', 'info');
    if (!window.confirm(`Supprimer le theme "${current.name}" ?`)) return;
    setCustomThemes((prev) => prev.filter((t) => t.id !== current.id));
    setThemeId(defaultThemeId);
    pushToast('Theme supprime', 'success');
  };

  useEffect(() => {
    const isTypingContext = (target) => {
      if (!target) return false;
      const tag = target.tagName?.toLowerCase();
      return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
    };

    const onKeyDown = (event) => {
      if (isTypingContext(event.target)) return;
      const key = event.key.toLowerCase();
      const cmd = event.ctrlKey || event.metaKey;

      if (key === '?') { event.preventDefault(); setHelpOpen(true); return; }
      if (key === 'delete' || key === 'backspace') { event.preventDefault(); deleteSelected(false); return; }
      if (canvasLayout === 'free' && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key) && selectedIds.length > 0) {
        event.preventDefault();
        const step = event.shiftKey ? 16 : 1;
        if (key === 'arrowup') nudgeSelectedFree(0, -step);
        if (key === 'arrowdown') nudgeSelectedFree(0, step);
        if (key === 'arrowleft') nudgeSelectedFree(-step, 0);
        if (key === 'arrowright') nudgeSelectedFree(step, 0);
        return;
      }
      if (!cmd) return;
      if (key === 'd') { event.preventDefault(); duplicateSelected(); return; }
      if (key === 'z' && event.shiftKey) { event.preventDefault(); redo(); return; }
      if (key === 'z') { event.preventDefault(); undo(); }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIds, history, future, elements, canvasLayout]);

  const exportScreens = useMemo(
    () => screens.length ? screens : [{ id: activeScreenId, name: activeScreen?.name || 'Accueil', elements }],
    [screens, activeScreenId, activeScreen, elements]
  );
  const projectFilesByTarget = useMemo(() => generateProjectFiles(exportScreens, activeTheme), [exportScreens, activeTheme]);

  const copyFile = async (target, fileName) => {
    const content = projectFilesByTarget?.[target]?.[fileName];
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      pushToast(`${fileName} copie (${target})`, 'success');
    } catch {
      pushToast('Copie impossible', 'error');
    }
  };

  const downloadZip = async (target) => {
    try {
      const zip = new JSZip();
      Object.entries(projectFilesByTarget?.[target] || {}).forEach(([path, content]) => zip.file(path, content));
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = target === 'mobile' ? 'nocode-forge-mobile-expo-export.zip' : 'nocode-forge-web-export.zip';
      anchor.click();
      URL.revokeObjectURL(url);
      pushToast(`ZIP telecharge (${target})`, 'success');
    } catch {
      pushToast('Export ZIP impossible', 'error');
    }
  };

  return (
    <div className="min-h-screen text-slate-900" style={{ backgroundColor: 'var(--ncf-app-bg)', ...activeTheme.vars }}>
      <Header
        onPreview={() => setPreviewOpen(true)}
        onExport={() => setExportOpen(true)}
        onClear={clearCanvas}
        onNewProject={newProject}
        onSaveProjectAs={saveProjectAs}
        onExportJson={exportJson}
        onImportJson={importJson}
        onOpenThemeEditor={openThemeEditor}
        onDeleteTheme={deleteCurrentCustomTheme}
        onOpenHelp={() => setHelpOpen(true)}
        previewMode={previewOpen}
        themeId={themeId}
        themes={allThemes}
        projects={projects}
        activeProjectId={activeProject?.id || activeProjectId}
        onChangeProject={setActiveProjectId}
        onChangeTheme={(id) => {
          setThemeId(id);
          const theme = allThemes.find((item) => item.id === id);
          pushToast(`Theme : ${theme?.name || id}`, 'info');
        }}
      />

      <main className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 p-4 md:p-6 xl:grid-cols-[280px_1fr_320px]">
        <ComponentLibrary onAdd={addElement} onAddTemplate={addTemplate} />

        <BuilderCanvas
          elements={elements}
          viewport={viewport}
          onViewportChange={setViewport}
          canvasLayout={canvasLayout}
          onCanvasLayoutChange={changeCanvasLayout}
          selectedIds={selectedIds}
          canUndo={history.length > 0}
          canRedo={future.length > 0}
          onUndo={undo}
          onRedo={redo}
          onDuplicateSelected={duplicateSelected}
          onSelect={onSelectElement}
          onDeleteSelected={() => deleteSelected(true)}
          onReorder={reorderElements}
          onMoveSelectedUp={() => moveSelectedBy(-1)}
          onMoveSelectedDown={() => moveSelectedBy(1)}
          onInlineEdit={updateElementById}
          onDistributeSpacing={distributeSpacing}
          onAlignSelected={alignSelectedFree}
          onMatchSize={matchSelectedSize}
          onLayerChange={changeSelectedLayer}
          onGroupSelected={groupSelected}
          onUngroupSelected={ungroupSelected}
          onToggleLockSelected={toggleLockSelected}
          onApplyFreeOrder={applyFreeOrder}
          previewMode={false}
        />

        <div className="space-y-4">
          <ScreensPanel
            screens={screens}
            activeScreenId={activeScreenId}
            onSelectScreen={setActiveScreenId}
            onAddScreen={addScreen}
            onRenameScreen={renameScreen}
            onDuplicateScreen={duplicateScreen}
            onDeleteScreen={deleteScreen}
          />
          <LayersPanel elements={elements} selectedIds={selectedIds} onSelect={onSelectElement} />
          <PropertiesPanel selectedElement={selectedElement} onUpdate={updateSelected} screens={screens} />
        </div>
      </main>

      <button onClick={() => setHelpOpen(true)} className="fixed bottom-4 right-4 z-40 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl hover:bg-slate-700">? Aide</button>

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} elements={elements} screens={screens} activeScreenId={activeScreenId} />
      <CodeExporter open={exportOpen} filesByTarget={projectFilesByTarget} onClose={() => setExportOpen(false)} onCopy={copyFile} onDownloadZip={downloadZip} />
      <ThemeEditorModal
        open={themeEditorOpen}
        draftName={draftThemeName}
        draftVars={draftThemeVars}
        onNameChange={setDraftThemeName}
        onVarChange={(key, value) => setDraftThemeVars((prev) => ({ ...prev, [key]: value }))}
        onClose={() => { setThemeEditorOpen(false); setEditingThemeId(null); }}
        onSave={saveCustomTheme}
      />
      <HelpCenter open={helpOpen} onClose={() => setHelpOpen(false)} />
      <ToastContainer toasts={toasts} />
    </div>
  );
}
