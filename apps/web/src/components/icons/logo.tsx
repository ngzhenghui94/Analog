export function Logo(props: React.HTMLAttributes<SVGElement>) {
  return (
    <svg
      viewBox="0 0 200 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="0"
        y="18"
        fill="currentColor"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="18"
        letterSpacing="-0.5"
      >
        Questfully - Calendar
      </text>
    </svg>
  );
}
