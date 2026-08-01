export default function PhysicsItem({
  children,
  className = "",
  strength = 1,
}) {
  return (
    <div
      className={className}
      data-physics-item="true"
      data-physics-strength={strength}
    >
      {children}
    </div>
  );
}