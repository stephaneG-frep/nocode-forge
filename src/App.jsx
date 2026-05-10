import { useEffect, useMemo, useState } from 'react';
import JSZip from 'jszip';
import Header from './components/Header';
import ComponentLibrary from './components/ComponentLibrary';
import BuilderCanvas from './components/BuilderCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import PreviewModal from './components/PreviewModal';
import CodeExporter from './components/CodeExporter';
import ToastContainer from './components/ToastContainer';
import { createDefaultElement } from './utils/defaultComponents';
import { generateProjectFiles } from './utils/generateCode';
import { defaultThemeId, getThemeById, themes } from './utils/themes';

const STORAGE_KEY = 'nocode-forge-canvas';
const THEME_STORAGE_KEY = 'nocode-forge-theme';

const readStoredElements = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const readStoredThemeId = () => {
  try {
    const id = localStorage.getItem(THEME_STORAGE_KEY);
    return id || defaultThemeId;
  } catch {
    return defaultThemeId;
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

export default function App() {
  const [elements, setElements] = useState(readStoredElements);
  const [themeId, setThemeId] = useState(readStoredThemeId);
  const [selectedId, setSelectedId] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [toasts, setToasts] = useState([]);

  const activeTheme = useMemo(() => getThemeById(themeId), [themeId]);

  const pushToast = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2200);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(elements));
  }, [elements]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  }, [themeId]);

  const selectedElement = useMemo(
    () => elements.find((el) => el.id === selectedId) || null,
    [elements, selectedId]
  );

  const applyChange = (updater) => {
    setElements((prev) => {
      const next = updater(prev);
      if (next === prev) return prev;
      setHistory((h) => [...h, prev]);
      setFuture([]);
      return next;
    });
  };

  const addElement = (type) => {
    const newElement = createDefaultElement(type);
    applyChange((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
    pushToast(`${type} added`, 'success');
  };

  const updateElementById = (id, path, value) => {
    if (!id) return;

    applyChange((prev) =>
      prev.map((el) => {
        if (el.id !== id) return el;

        if (path === 'content' || path === 'className') {
          return { ...el, [path]: value };
        }

        if (path.startsWith('props.')) {
          const key = path.split('.')[1];
          return { ...el, props: { ...el.props, [key]: value } };
        }

        return el;
      })
    );
  };

  const updateElement = (path, value) => {
    if (!selectedId) return;
    updateElementById(selectedId, path, value);
  };

  const deleteSelected = (askConfirm = true) => {
    if (!selectedId) return;
    if (askConfirm && !window.confirm('Delete selected component?')) return;
    applyChange((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
    pushToast('Component deleted', 'success');
  };

  const duplicateSelected = () => {
    if (!selectedId) return;

    let createdId = null;
    applyChange((prev) => {
      const index = prev.findIndex((el) => el.id === selectedId);
      if (index < 0) return prev;
      const clone = duplicateWithNewId(prev[index]);
      createdId = clone.id;
      const next = [...prev];
      next.splice(index + 1, 0, clone);
      return next;
    });
    if (createdId) {
      setSelectedId(createdId);
      pushToast('Component duplicated', 'success');
    }
  };

  const clearCanvas = () => {
    if (elements.length === 0) return;
    if (!window.confirm('Clear the whole canvas?')) return;
    applyChange(() => []);
    setSelectedId(null);
    pushToast('Canvas cleared', 'success');
  };

  const reorderElements = (fromId, toId, placement = 'before') => {
    if (!fromId || !toId || fromId === toId) return;

    applyChange((prev) => {
      const fromIndex = prev.findIndex((el) => el.id === fromId);
      const rawToIndex = prev.findIndex((el) => el.id === toId);
      if (fromIndex < 0 || rawToIndex < 0) return prev;

      let toIndex = rawToIndex;
      if (placement === 'after') toIndex = rawToIndex + 1;
      if (fromIndex < toIndex) toIndex -= 1;

      toIndex = Math.max(0, Math.min(prev.length - 1, toIndex));
      if (toIndex === fromIndex) return prev;
      return moveItem(prev, fromIndex, toIndex);
    });
  };

  const moveSelectedBy = (offset) => {
    if (!selectedId || offset === 0) return;

    applyChange((prev) => {
      const currentIndex = prev.findIndex((el) => el.id === selectedId);
      if (currentIndex < 0) return prev;
      const targetIndex = Math.max(0, Math.min(prev.length - 1, currentIndex + offset));
      if (targetIndex === currentIndex) return prev;
      return moveItem(prev, currentIndex, targetIndex);
    });
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [elements, ...f]);
    setElements(previous);
    if (selectedId && !previous.some((el) => el.id === selectedId)) {
      setSelectedId(null);
    }
    pushToast('Undo', 'info');
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, elements]);
    setElements(next);
    if (selectedId && !next.some((el) => el.id === selectedId)) {
      setSelectedId(null);
    }
    pushToast('Redo', 'info');
  };

  useEffect(() => {
    const isTypingContext = (target) => {
      if (!target) return false;
      const tag = target.tagName?.toLowerCase();
      return (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        target.isContentEditable
      );
    };

    const onKeyDown = (event) => {
      if (isTypingContext(event.target)) return;

      const key = event.key.toLowerCase();
      const ctrlOrCmd = event.ctrlKey || event.metaKey;

      if (key === 'delete' || key === 'backspace') {
        event.preventDefault();
        deleteSelected(false);
        return;
      }

      if (!ctrlOrCmd) return;

      if (key === 'd') {
        event.preventDefault();
        duplicateSelected();
        return;
      }

      if (key === 'z' && event.shiftKey) {
        event.preventDefault();
        redo();
        return;
      }

      if (key === 'z') {
        event.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedId, history, future, elements]);

  const projectFiles = useMemo(
    () => generateProjectFiles(elements, activeTheme),
    [elements, activeTheme]
  );

  const copyFile = async (fileName) => {
    const content = projectFiles[fileName];
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      pushToast(`${fileName} copied`, 'success');
    } catch {
      pushToast('Copy failed', 'error');
    }
  };

  const downloadZip = async () => {
    try {
      const zip = new JSZip();
      Object.entries(projectFiles).forEach(([path, content]) => zip.file(path, content));
      const blob = await zip.generateAsync({ type: 'blob' });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'nocode-forge-export.zip';
      anchor.click();
      URL.revokeObjectURL(url);
      pushToast('ZIP downloaded', 'success');
    } catch {
      pushToast('ZIP export failed', 'error');
    }
  };

  return (
    <div className="min-h-screen text-slate-900" style={{ backgroundColor: 'var(--ncf-app-bg)', ...activeTheme.vars }}>
      <Header
        onPreview={() => setPreviewOpen(true)}
        onExport={() => setExportOpen(true)}
        onClear={clearCanvas}
        previewMode={previewOpen}
        themeId={themeId}
        themes={themes}
        onChangeTheme={(id) => {
          setThemeId(id);
          pushToast(`Theme: ${getThemeById(id).name}`, 'info');
        }}
      />

      <main className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 p-4 md:p-6 xl:grid-cols-[280px_1fr_320px]">
        <ComponentLibrary onAdd={addElement} />

        <BuilderCanvas
          elements={elements}
          selectedId={selectedId}
          canUndo={history.length > 0}
          canRedo={future.length > 0}
          onUndo={undo}
          onRedo={redo}
          onDuplicateSelected={duplicateSelected}
          onSelect={setSelectedId}
          onDeleteSelected={() => deleteSelected(true)}
          onReorder={reorderElements}
          onMoveSelectedUp={() => moveSelectedBy(-1)}
          onMoveSelectedDown={() => moveSelectedBy(1)}
          onInlineEdit={updateElementById}
          previewMode={false}
        />

        <PropertiesPanel selectedElement={selectedElement} onUpdate={updateElement} />
      </main>

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} elements={elements} />
      <CodeExporter
        open={exportOpen}
        files={projectFiles}
        onClose={() => setExportOpen(false)}
        onCopy={copyFile}
        onDownloadZip={downloadZip}
      />
      <ToastContainer toasts={toasts} />
    </div>
  );
}
