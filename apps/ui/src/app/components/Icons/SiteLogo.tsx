const SiteLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="250"
    height="300"
    viewBox="60 35 180 210"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="150"
      cy="120"
      r="80"
      fill="none"
      stroke="#0B3422"
      strokeWidth="8"
    />
    <path
      d="M150 60 L150 160"
      stroke="#0B3422"
      strokeWidth="10"
      strokeLinecap="round"
    />
    <path
      d="M150 100 C150 70,120 80,120 110"
      stroke="#0B3422"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M150 100 C150 70,180 80,180 110"
      stroke="#0B3422"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M150 130 C150 100,110 120,110 150"
      stroke="#0B3422"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M150 130 C150 100,190 120,190 150"
      stroke="#0B3422"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M150 140 C150 120,130 140,130 170"
      stroke="#0B3422"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M150 140 C150 120,170 140,170 170"
      stroke="#0B3422"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <text
      x="150"
      y="240"
      fontFamily="Montserrat, sans-serif"
      fontSize="28"
      fill="#0B3422"
      fontWeight="600"
      textAnchor="middle"
    >
      RentToCraft
    </text>
  </svg>
);
export default SiteLogo;
