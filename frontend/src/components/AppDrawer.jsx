import { useState } from "react";

function AppDrawer({ user, label, items = [], onOpenSignIn }) {
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <div className="fixed bottom-0 left-0 z-[60] px-4 py-4 sm:px-6 lg:px-8">
        <button
          onClick={onOpenSignIn}
          className="text-lg font-bold tracking-tight text-zinc-500 hover:text-white transition-colors"
        >
          log-in.
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 z-[60] px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start">
        <div
          className={`flex flex-col items-start overflow-hidden transition-all duration-300 ease-out ${
            open ? "max-h-80 opacity-100 mb-2" : "max-h-0 opacity-0"
          }`}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setOpen(false);
                item.onClick?.();
              }}
              className="text-lg font-bold tracking-tight text-zinc-500 hover:text-white transition-colors py-0.5"
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="text-lg font-bold tracking-tight text-white hover:text-zinc-300 transition-colors"
        >
          {label}
        </button>
      </div>
    </div>
  );
}

export default AppDrawer;
