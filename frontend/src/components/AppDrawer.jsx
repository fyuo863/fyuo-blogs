import { useState } from "react";

function AppDrawer({ user, label, items = [], onOpenSignIn }) {
  const [open, setOpen] = useState(false);

  if (!user) {
    return <div className="app-drawer"><button className="drawer-toggle" type="button" onClick={onOpenSignIn}>log-in.</button></div>;
  }

  return (
    <div className="app-drawer">
      {open && <div className="drawer-menu">{items.map((item) => <button className="drawer-item" type="button" key={item.label} onClick={() => { setOpen(false); item.onClick?.(); }}>{item.label}</button>)}</div>}
      <button className="drawer-toggle" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{label}</button>
    </div>
  );
}

export default AppDrawer;
