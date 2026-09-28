import './style.css';

export default function LoadingSpinner() {
  return <section className="loading-spinner-demo" role="status" aria-label="加载中">
    <span className="loading-spinner-demo__ring" aria-hidden="true" />
    <p className="loading-spinner-demo__label">加载中…</p>
  </section>;
}
