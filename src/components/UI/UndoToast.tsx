import { FiRotateCcw, FiX } from "react-icons/fi";
import { useAppStore } from "../../store/appStore";

function UndoToast() {
  const undoMove = useAppStore(
    (state) => state.undoMove
  );

  const setUndoMove = useAppStore(
    (state) => state.setUndoMove
  );

  if (!undoMove) {
    return null;
  }

  const handleUndo = () => {
    undoMove();
    setUndoMove(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-[340px] max-w-[calc(100vw-32px)] rounded-xl border border-white/[0.08] bg-[#15181c] p-4 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
          <FiRotateCcw size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">
            Task moved
          </p>

          <p className="mt-1 text-xs text-gray-500">
            You can undo your last move.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setUndoMove(null)}
          aria-label="Close undo notification"
          className="text-gray-600 transition hover:text-white"
        >
          <FiX size={15} />
        </button>
      </div>

      <button
        type="button"
        onClick={handleUndo}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-600"
      >
        <FiRotateCcw size={14} />
        Undo
      </button>
    </div>
  );
}

export default UndoToast;