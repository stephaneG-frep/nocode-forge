import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import ComponentLibrary from './components/ComponentLibrary';
import BuilderCanvas from './components/BuilderCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import PreviewModal from './components/PreviewModal';
import CodeExporter from './components/CodeExporter';
import { createDefaultElement } from './utils/defaultComponents';
import { generateCode } from './utils/generateCode';

const STORAGE_KEY = 'nocode-forge-canvas';

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

const moveItem = (arr, fromIndex, toIndex) => {
  const next = [...arr];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
};

export default function App() {
  const [elements, setElements] = useState(readStoredElements);
  const [selectedId, setSelectedId] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(elements));
  }, [elements]);

  const selectedElement = useMemo(
    () => elements.find((el) => el.id === selectedId) || null,
    [elements, selectedId]
  );

  const addElement = (type) => {
    const newElement = createDefaultElement(type);
    setElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
  };

  const updateElementById = (id, path, value) => {
    if (!id) return;

    setElements((prev) =>
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

  const deleteSelected = () => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  };

  const clearCanvas = () => {
    setElements([]);
    setSelectedId(null);
  };

  const reorderElements = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;

    setElements((prev) => {
      const fromIndex = prev.findIndex((el) => el.id === fromId);
      const toIndex = prev.findIndex((el) => el.id === toId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      return moveItem(prev, fromIndex, toIndex);
    });
  };

  const moveSelectedBy = (offset) => {
    if (!selectedId || offset === 0) return;

    setElements((prev) => {
      const currentIndex = prev.findIndex((el) => el.id === selectedId);
      if (currentIndex < 0) return prev;
      const targetIndex = Math.max(0, Math.min(prev.length - 1, currentIndex + offset));
      if (targetIndex === currentIndex) return prev;
      return moveItem(prev, currentIndex, targetIndex);
    });
  };

  const generatedCode = useMemo(() => generateCode(elements), [elements]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      window.alert('Code copied to clipboard.');
    } catch {
      window.alert('Copy failed. Please copy manually.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200 text-slate-900">
      <Header
        onPreview={() => setPreviewOpen(true)}
        onExport={() => setExportOpen(true)}
        onClear={clearCanvas}
        previewMode={previewOpen}
      />

      <main className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 p-4 md:p-6 xl:grid-cols-[280px_1fr_320px]">
        <ComponentLibrary onAdd={addElement} />

        <BuilderCanvas
          elements={elements}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDeleteSelected={deleteSelected}
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
        code={generatedCode}
        onClose={() => setExportOpen(false)}
        onCopy={copyCode}
      />
    </div>
  );
}
