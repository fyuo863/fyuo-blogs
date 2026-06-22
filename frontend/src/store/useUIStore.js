import { useState } from "react";

export function useUIStore() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [info, setInfo] = useState(null);

  const notify = (next) => {
    setInfo({
      variant: "info",
      title: "info.",
      message: "",
      ...next,
    });
  };

  return {
    showSignIn,
    setShowSignIn,
    showAdmin,
    setShowAdmin,
    info,
    setInfo,
    notify,
  };
}