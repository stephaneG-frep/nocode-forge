import { useMemo, useState } from 'react';
import RenderElement from './RenderElement';

const frameMap = {
  desktop: { width: '100%', minHeight: 500, shell: '' },
  iphone: { width: 390, minHeight: 740, shell: 'rounded-[2.2rem] border-8 border-slate-900 bg-white' },
  android: { width: 412, minHeight: 820, shell: 'rounded-[1.8rem] border-8 border-slate-800 bg-white' },
  tablet: { width: 768, minHeight: 700, shell: 'rounded-[1.2rem] border-8 border-slate-700 bg-white' },
};

const canStartMoveFrom = (target) => {
  if (!target) return true;
  if (target.closest?.('[data-ncf-control]')) return false;
  const tag = target.tagName?.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return false;
  if (target.isContentEditable) return false;
  return true;
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
  onAlignSelected,
  onMatchSize,
  onLayerChange,
  onGroupSelected,
  onUngroupSelected,
  onToggleLockSelected,
  onApplyFreeOrder,
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

  const startFreeMove = (element, event, force = false) => {
    if (previewMode || element.props?.locked) return;
    if (!force && !canStartMoveFrom(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
    onSelect(element.id, event.shiftKey);

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
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      setGuide(null);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  return (
    <section className="rounded-2xl border border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface)] p-4 shadow-sm md:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--ncf-muted)]">Ecran de l'application</h2>
          <p className="text-xs text-[color:var(--ncf-muted)]">Assemble les ecrans, les actions et la navigation de ton app.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={viewport}
            onChange={(e) => onViewportChange?.(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="android">Android</option>
            <option value="iphone">iPhone</option>
            <option value="tablet">Tablet</option>
            <option value="desktop">Ordinateur</option>
          </select>

          <select
            value={canvasLayout}
            onChange={(e) => onCanvasLayoutChange?.(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="column">Vertical</option>
            <option value="row">Grille</option>
            <option value="free">Libre</option>
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
              Grille {snapEnabled ? 'ON' : 'OFF'}
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
              Aimant {magnetEnabled ? 'ON' : 'OFF'}
            </button>
          ) : null}
          {isFreeLayout ? (
            <button
              type="button"
              onClick={onApplyFreeOrder}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              Garder l'ordre
            </button>
          ) : null}

          <button onClick={onUndo} disabled={!canUndo || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Annuler</button>
          <button onClick={onRedo} disabled={!canRedo || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Retablir</button>
          <button onClick={onDuplicateSelected} disabled={selectedIds.length === 0 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Dupliquer</button>
          <button onClick={onGroupSelected} disabled={selectedIds.length < 2 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Grouper</button>
          <button onClick={onUngroupSelected} disabled={selectedIds.length === 0 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Degrouper</button>
          <button onClick={onToggleLockSelected} disabled={selectedIds.length === 0 || previewMode} className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 disabled:cursor-not-allowed disabled:opacity-40">Verrouiller</button>
          <button onClick={onDistributeSpacing} disabled={!isFreeLayout || selectedIds.length < 3 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Espacer</button>
          <button onClick={() => onAlignSelected?.('left')} disabled={!isFreeLayout || selectedIds.length < 2 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Gauche</button>
          <button onClick={() => onAlignSelected?.('center')} disabled={!isFreeLayout || selectedIds.length < 2 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Centrer</button>
          <button onClick={() => onAlignSelected?.('right')} disabled={!isFreeLayout || selectedIds.length < 2 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Droite</button>
          <button onClick={() => onAlignSelected?.('top')} disabled={!isFreeLayout || selectedIds.length < 2 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Haut</button>
          <button onClick={() => onMatchSize?.('width')} disabled={!isFreeLayout || selectedIds.length < 2 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Meme largeur</button>
          <button onClick={() => onMatchSize?.('height')} disabled={!isFreeLayout || selectedIds.length < 2 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Meme hauteur</button>
          <button onClick={() => onLayerChange?.('front')} disabled={selectedIds.length !== 1 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Devant</button>
          <button onClick={() => onLayerChange?.('back')} disabled={selectedIds.length !== 1 || previewMode} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Derriere</button>
          <button onClick={onMoveSelectedUp} disabled={selectedIds.length !== 1 || previewMode || isFreeLayout} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Monter</button>
          <button onClick={onMoveSelectedDown} disabled={selectedIds.length !== 1 || previewMode || isFreeLayout} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Descendre</button>
          <button onClick={onDeleteSelected} disabled={selectedIds.length === 0 || previewMode} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-40">Supprimer</button>
        </div>
      </div>

      {!isFreeLayout && dropHintLabel ? (
        <div className="mb-3 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">
          {dropHintLabel}
        </div>
      ) : null}

      <div className="grid place-items-center rounded-2xl border border-dashed border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface-soft)] p-4 md:p-6">
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
            <div className="grid min-h-[430px] place-items-center rounded-xl border border-dashed border-[color:var(--ncf-muted)] bg-[color:var(--ncf-surface)]/60 px-6 text-center text-[color:var(--ncf-muted)]">Ajoute un modele d'app ou des composants pour construire ton premier ecran</div>
          ) : isFreeLayout ? (
            <div
              className="relative min-h-[430px] rounded-xl border border-dashed border-[color:var(--ncf-surface-soft)] bg-[color:var(--ncf-surface)]/70"
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
                <div
                  key={element.id}
                  onPointerDown={(e) => startFreeMove(element, e)}
                  className={`absolute touch-none ${element.props?.locked ? 'cursor-not-allowed' : 'cursor-move'}`}
                  style={{ left: element._x, top: element._y }}
                  title={element.props?.locked ? 'Element verrouille' : 'Clique et glisse pour deplacer'}
                >
                  {!previewMode ? (
                    <div className="mb-2 flex items-center gap-2" data-ncf-control>
                      <button
                        type="button"
                        disabled={element.props?.locked}
                        onPointerDown={(e) => startFreeMove(element, e, true)}
                        className="touch-none cursor-move rounded-md border border-slate-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                        title="Attraper et deplacer"
                      >
                        Attraper
                      </button>
                      {element.props?.locked ? (
                        <span className="rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                          Verrouille
                        </span>
                      ) : null}
                      {element.props?.groupId ? (
                        <span className="rounded-md border border-brand-200 bg-brand-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
                          Groupe
                        </span>
                      ) : null}
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
                        className={`${canvasLayout === 'row' ? 'min-w-0 w-full' : 'min-w-0'} ${draggedId === element.id ? 'opacity-60' : ''}`.trim()}
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
                              title="Glisser"
                            >
                              Glisser
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
                  Deposer ici pour mettre a la fin
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
