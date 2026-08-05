import { useState } from "react";

function AppDrawer({ user, label, items = [], onOpenSignIn, placement = "page" }) {
  const [open, setOpen] = useState(false);
  const className = `app-drawer app-drawer--${placement}`;

  if (!user) {
    return <div className={className}><button className="drawer-toggle" type="button" onClick={onOpenSignIn}>log-in.</button></div>;
  }

  return (
    <div className={className}>
      {open && <div className="drawer-menu">{items.map((item) => <button className="drawer-item" type="button" key={item.label} onClick={() => { setOpen(false); item.onClick?.(); }}>{item.label}</button>)}</div>}
      <button className="drawer-toggle" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{label}</button>
    </div>
  );
}

export default AppDrawer;
