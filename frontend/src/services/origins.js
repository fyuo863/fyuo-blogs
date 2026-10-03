export const ADMIN_ORIGIN = 'https://www.fyuoblog.top';
export const isAdminOrigin = window.location.origin === ADMIN_ORIGIN;
// Local trusted development retains the v1 editor harness. Never enable it on
// an Internet-facing hostname. Production plugins have no authenticated user.
export const isLocalDevelopment = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
export const isPublicOrigin = !isAdminOrigin && !isLocalDevelopment;
export const openAdmin = () => window.location.assign(`${ADMIN_ORIGIN}/`);

// Clear legacy credentials before either a page or a preview imports a plugin.
if (isPublicOrigin) { try { localStorage.removeItem('user'); sessionStorage.removeItem('user'); } catch { /* unavailable storage */ } }
