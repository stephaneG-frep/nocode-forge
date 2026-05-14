import { useMemo, useState } from 'react';
import RenderElement from './RenderElement';

const frameMap = {
  desktop: { width: '100%', minHeight: 500, shell: '' },
  iphone: { width: 390, minHeight: 740, shell: 'rounded-[2.2rem] border-8 border-slate-900 bg-white' },
  android: { width: 412, minHeight: 820, shell: 'rounded-[1.8rem] border-8 border-slate-800 bg-white' },
  tablet: { width: 768, minHeight: 700, shell: 'rounded-[1.2rem] border-8 border-slate-700 bg-white' },
};

export default function BuilderCanvas({
  elements,
  selectedIds,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onDuplicateSelected,
  onSelect,
  onDeleteSelected,
  onReorder,
  onMoveSelectedUp,
  onMoveSelectedDown,
  onInlineEdit,
  onDistributeSpacing,
  onGroupSelected,
  onUngroupSelected,
  onToggleLockSelected,
  previewMode,
  viewport,
  onViewportChange,
  canvasLayout,
  onCanvasLayoutChange,
}) {
  const [draggedId, setDraggedId] = useState(null);
  const [dropHint, setDropHint] = useState(null);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [magnetEnabled, setMagnetEnabled] = useState(true);
  const [guide, setGuide] = useState(null);
  const frame = frameMap[viewport] || frameMap.desktop;
  const GRID_SIZE = 16;
  const MAGNET_THRESHOLD = 10;

  const isFreeLayout = canvasLayout === 'free';

  const dropHintLabel = dropHint
    ? `Drop ${dropHint.placement === 'before' ? 'before' : 'after'} selected block`
    : draggedId
      ? 'Drag to choose a drop position'
      : '';

  const clearDragState = () => {
    setDraggedId(null);
    setDropHint(null);
  };

  const positionedElements = useMemo(
    () =>
      elements.map((element, index) => ({
        ...element,
        _x: typeof element.props?.x === 'number' ? element.props.x : 16 + (index % 4) * 40,
        _y: typeof element.props?.y === 'number' ? element.props.y : 16 + index * 70,
      })),
    [elements]
  );

  const startFreeMove = (element, event) => {
    if (previewMode) return;
    event.preventDefault();
    event.stopPropagation();

    const startClientX = event.clientX;
    const startClientY = event.clientY;
    const originX = element._x;
    const originY = element._y;
    const groupId = element.props?.groupId || null;
    const groupedElements =
      groupId
        ? positionedElements.filter((item) => item.props?.groupId === groupId)
        : [element];
    const groupedOrigins = groupedElements.map((item) => ({
      id: item.id,
      x: item._x,
      y: item._y,
    }));
    const peers = positionedElements.filter((item) => item.id !== element.id);

    const onMove = (moveEvent) => {
      const rawX = Math.max(0, Math.round(originX + (moveEvent.clientX - startClientX)));
      const rawY = Math.max(0, Math.round(originY + (moveEvent.clientY - startClientY)));
      let nextX = snapEnabled ? Math.round(rawX / GRID_SIZE) * GRID_SIZE : rawX;
      let nextY = snapEnabled ? Math.round(rawY / GRID_SIZE) * GRID_SIZE : rawY;
      let guideX = nextX;
      let guideY = nextY;

      if (magnetEnabled) {
        const myWidth = typeof element.props?.width === 'number' ? element.props.width : 120;
        const myHeight = typeof element.props?.height === 'number' ? element.props.height : 56;
        const myLeft = nextX;
        const myCenterX = nextX + myWidth / 2;
        const myRight = nextX + myWidth;
        const myTop = nextY;
        const myCenterY = nextY + myHeight / 2;
        const myBottom = nextY + myHeight;

        let bestDx = MAGNET_THRESHOLD + 1;
        let bestDy = MAGNET_THRESHOLD + 1;
        let snapToX = null;
        let snapToY = null;

        peers.forEach((peer) => {
          const px = typeof peer.props?.x === 'number' ? peer.props.x : 0;
          const py = typeof peer.props?.y === 'number' ? peer.props.y : 0;
          const pw = typeof peer.props?.width === 'number' ? peer.props.width : 120;
          const ph = typeof peer.props?.height === 'number' ? peer.props.height : 56;
          const pLeft = px;
          const pCenterX = px + pw / 2;
          const pRight = px + pw;
          const pTop = py;
          const pCenterY = py + ph / 2;
          const pBottom = py + ph;

          const xPairs = [
            [myLeft, pLeft, 0],
            [myLeft, pCenterX, 0],
            [myLeft, pRight, 0],
            [myCenterX, pLeft, myWidth / 2],
            [myCenterX, pCenterX, myWidth / 2],
            [myCenterX, pRight, myWidth / 2],
            [myRight, pLeft, myWidth],
            [myRight, pCenterX, myWidth],
            [myRight, pRight, myWidth],
          ];

          xPairs.forEach(([mine, target, offset]) => {
            const d = Math.abs(mine - target);
            if (d < bestDx && d <= MAGNET_THRESHOLD) {
              bestDx = d;
              snapToX = Math.round(target - offset);
              guideX = target;
            }
          });

          const yPairs = [
            [myTop, pTop, 0],
            [myTop, pCenterY, 0],
            [myTop, pBottom, 0],
            [myCenterY, pTop, myHeight / 2],
            [myCenterY, pCenterY, myHeight / 2],
            [myCenterY, pBottom, myHeight / 2],
            [myBottom, pTop, myHeight],
            [myBottom, pCenterY, myHeight],
            [myBottom, pBottom, myHeight],
          ];

          yPairs.forEach(([mine, target, offset]) => {
            const d = Math.abs(mine - target);
            if (d < bestDy && d <= MAGNET_THRESHOLD) {
              bestDy = d;
              snapToY = Math.round(target - offset);
              guideY = target;
            }
          });
        });

        if (snapToX !== null) nextX = Math.max(0, snapToX);
        if (snapToY !== null) nextY = Math.max(0, snapToY);
      }

      setGuide({ x: guideX, y: guideY });
      const deltaX = nextX - originX;
      const deltaY = nextY - originY;
      groupedOrigins.forEach((origin) => {
        const gx = Math.max(0, origin.x + deltaX);
        const gy = Math.max(0, origin.y + deltaY);
        onInlineEdit?.(origin.id, 'props.x', gx, { coalesceKey: `move:${groupId || element.id}` });
        onInlineEdit?.(origin.id, 'props.y', gy, { coalesceKey: `move:${groupId || element.id}` });
      });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setGuide(null);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Canvas</h2>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={viewport}
            onChange={(e) => onViewportChange?.(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="desktop">Desktop</option>
            <option value="iphone">iPhone</option>
            <option value="android">Android</option>
            <option value="tablet">Tablet</option>
          </select>

          <select
            value={canvasLayout}
            onChange={(e) => onCanvasLayoutChange?.(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="column">Stacked</option>
            <option value="row">Row grid</option>
            <option value="free">Free</option>
          </select>
          {isFreeLayout ? (
            <button
              type="button"
              onClick={() => setSnapEnabled((v) => !v)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                snapEnabled
                  ? 'border border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border border-slate-300 bg-white text-slate-700'
              }`}
            >
              Snap {snapEnabled ? 'ON' : 'OFF'}
            </button>
          ) : null}
          {isFreeLayout ? (
            <button
              type="button"
              onClick={() => setMagnetEnabled((v) => !v)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                magnetEnabled
                  ? 'border border-brand-300 bg-brand-50 text-brand-700'
                  : 'border border-slate-300 bg-white text-slate-700'
              }`}
            >
              Magnet {magnetEnabled ? 'ON' : 'OFF'}
            </button>
          ) : null}

          <button onClick={onUndo} disabled={!canUndo || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Undo</button>
          <button onClick={onRedo} disabled={!canRedo || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Redo</button>
          <button onClick={onDuplicateSelected} disabled={selectedIds.length === 0 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Duplicate</button>
          <button onClick={onGroupSelected} disabled={selectedIds.length < 2 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Group</button>
          <button onClick={onUngroupSelected} disabled={selectedIds.length === 0 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Ungroup</button>
          <button onClick={onToggleLockSelected} disabled={selectedIds.length === 0 || previewMode} className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 disabled:cursor-not-allowed disabled:opacity-40">Lock/Unlock</button>
          <button onClick={onDistributeSpacing} disabled={!isFreeLayout || selectedIds.length < 3 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Distribute X</button>
          <button onClick={onMoveSelectedUp} disabled={selectedIds.length !== 1 || previewMode || isFreeLayout} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Move up</button>
          <button onClick={onMoveSelectedDown} disabled={selectedIds.length !== 1 || previewMode || isFreeLayout} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Move down</button>
          <button onClick={onDeleteSelected} disabled={selectedIds.length === 0 || previewMode} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-40">Delete selected</button>
        </div>
      </div>

      {!isFreeLayout && dropHintLabel ? (
        <div className="mb-3 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">
          {dropHintLabel}
        </div>
      ) : null}

      <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 md:p-6">
        <div
          onClick={() => !previewMode && onSelect(null, false)}
          onDragOver={(e) => !previewMode && !isFreeLayout && e.preventDefault()}
          onDrop={(e) => {
            if (isFreeLayout) return;
            e.preventDefault();
            clearDragState();
          }}
          className={`w-full p-4 md:p-6 ${frame.shell}`}
          style={{ width: frame.width, minHeight: frame.minHeight }}
        >
          {elements.length === 0 ? (
            <div className="grid min-h-[430px] place-items-center rounded-xl border border-dashed border-slate-300 bg-white/60 text-center text-slate-500">Add components to start building</div>
          ) : isFreeLayout ? (
            <div
              className="relative min-h-[430px] rounded-xl border border-dashed border-slate-200 bg-white/70"
              style={
                snapEnabled
                  ? {
                      backgroundImage:
                        'linear-gradient(to right, rgba(148,163,184,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.18) 1px, transparent 1px)',
                      backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                    }
                  : undefined
              }
            >
              {guide ? (
                <>
                  <div className="pointer-events-none absolute top-0 bottom-0 w-px bg-brand-500/70" style={{ left: guide.x }} />
                  <div className="pointer-events-none absolute left-0 right-0 h-px bg-brand-500/70" style={{ top: guide.y }} />
                </>
              ) : null}
              {positionedElements.map((element) => (
                <div key={element.id} className="absolute" style={{ left: element._x, top: element._y }}>
                  {!previewMode ? (
                    <div className="mb-2 flex justify-start">
                      <button
                        type="button"
                        disabled={element.props?.locked}
                        onMouseDown={(e) => startFreeMove(element, e)}
                        className="cursor-move rounded-md border border-slate-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Move"
                      >
                        Move
                      </button>
                    </div>
                  ) : null}
                  <RenderElement
                    element={element}
                    selected={selectedIds.includes(element.id)}
                    onSelect={onSelect}
                    onInlineEdit={onInlineEdit}
                    previewMode={previewMode}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className={canvasLayout === 'row' ? 'grid grid-cols-2 gap-4 md:grid-cols-3' : 'flex flex-col gap-4'}>
                {elements.map((element) => {
                  const showBefore = dropHint?.targetId === element.id && dropHint?.placement === 'before';
                  const showAfter = dropHint?.targetId === element.id && dropHint?.placement === 'after';

                  return (
                    <div key={element.id} className={canvasLayout === 'row' ? 'relative min-w-0' : 'relative'}>
                      {showBefore ? <div className={canvasLayout === 'row' ? 'absolute -top-2 left-0 right-0 h-1 rounded-full bg-brand-500' : 'mb-2 h-1 rounded-full bg-brand-500'} /> : null}

                      <div
                        className={`${canvasLayout === 'row' ? 'w-full' : ''} ${draggedId === element.id ? 'opacity-60' : ''}`.trim()}
                        onDragOver={(e) => {
                          if (previewMode) return;
                          e.preventDefault();
                          const rect = e.currentTarget.getBoundingClientRect();
                          const midpoint = rect.top + rect.height / 2;
                          const placement = e.clientY < midpoint ? 'before' : 'after';
                          setDropHint({ targetId: element.id, placement });
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (!previewMode && draggedId && dropHint) {
                            onReorder(draggedId, dropHint.targetId, dropHint.placement, selectedIds);
                          }
                          clearDragState();
                        }}
                        onDragEnd={clearDragState}
                      >
                        {!previewMode ? (
                          <div className="mb-2 flex justify-end">
                            <button
                              type="button"
                              draggable
                              disabled={element.props?.locked}
                              onDragStart={(e) => {
                                setDraggedId(element.id);
                                e.dataTransfer.effectAllowed = 'move';
                                e.dataTransfer.setData('text/plain', element.id);
                              }}
                              onDragEnd={clearDragState}
                              className="cursor-grab rounded-md border border-slate-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                              title="Drag"
                            >
                              Drag
                            </button>
                          </div>
                        ) : null}
                        <RenderElement element={element} selected={selectedIds.includes(element.id)} onSelect={onSelect} onInlineEdit={onInlineEdit} previewMode={previewMode} />
                      </div>

                      {showAfter ? <div className={canvasLayout === 'row' ? 'absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-brand-500' : 'mt-2 h-1 rounded-full bg-brand-500'} /> : null}
                    </div>
                  );
                })}
              </div>

              {elements.length > 0 ? (
                <div
                  onDragOver={(e) => {
                    if (!previewMode) e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!previewMode && draggedId) {
                      onReorder(draggedId, null, 'after', selectedIds);
                    }
                    clearDragState();
                  }}
                  className="mt-3 grid h-10 place-items-center rounded-lg border border-dashed border-slate-300 text-xs font-medium text-slate-400"
                >
                  Drop here to move at the end
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
