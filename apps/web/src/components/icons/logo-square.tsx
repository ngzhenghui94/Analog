export function LogoSquare(props: React.HTMLAttributes<SVGElement>) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="45" fill="black" />
      <text
        x="50"
        y="65"
        fill="white"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="50"
        textAnchor="middle"
      >
        Q
      </text>
    </svg>
  );
}
