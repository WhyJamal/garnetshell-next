
export default function Loader() {
  return (
    <div className="loader" aria-label="Yuklanmoqda..." role="status">
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className={`bar bar${i + 1}`}
          style={{
            transform: `rotate(${i * 30}deg) translateY(-130%)`,
            animationDelay: `${-((12 - i) / 12)}s`,
          }}
        />
      ))}
    </div>
  );
}
