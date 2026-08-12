export default function ConstructionNotice() {
  return (
    <aside className="construction-notice" role="status" aria-label="施工中：此页面正在建设。">
      <div className="construction-notice__band" aria-hidden="true">
        <span className="construction-notice__clearance" />
        <strong>施工中</strong>
      </div>
    </aside>
  );
}
