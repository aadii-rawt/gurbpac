import { useEffect } from "react";
import {
  FiRotateCcw,
  FiX,
} from "react-icons/fi";

import { useAppStore } from "../../store/appStore";

function UndoToast() {
  const undoMove = useAppStore(
    (state) => state.undoMove
  );

  const setUndoMove = useAppStore(
    (state) => state.setUndoMove
  );

  useEffect(() => {
    if (!undoMove) return;

    const timer = setTimeout(() => {
      setUndoMove(null);
    }, 6000);

    return () => clearTimeout(timer);
  }, [undoMove, setUndoMove]);

  if (!undoMove) {
    return null;
  }

  const handleUndo = () => {
    if (!undoMove) return;

    undoMove();
    setUndoMove(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-[340px] rounded-xl border border-white/10 bg-[#15181c] p-4 text-white shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
          <FiRotateCcw size={17} />
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium">
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
        >
          <FiX size={16} />
        </button>
      </div>

      <button
        type="button"
        onClick={handleUndo}
        className="mt-3 w-full rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium hover:bg-blue-600"
      >
        Undo
      </button>
    </div>
  );
}

export default UndoToast;