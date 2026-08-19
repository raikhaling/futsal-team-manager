export default function FutsalLogo({ size = 36, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
    >
      <rect x="24" y="24" width="464" height="464" rx="100" fill="#0F172A" />
      <circle cx="256" cy="256" r="180" fill="#2563EB" />
      <circle cx="256" cy="256" r="148" fill="#0F172A" />
      <polygon
        points="256,150 185,202 212,285 300,285 327,202"
        fill="#38BDF8"
      />
      <polygon points="256,56 220,110 292,110" fill="#38BDF8" />
      <polygon points="256,456 220,402 292,402" fill="#38BDF8" />
      <polygon
        points="256,200 264,222 288,222 268,236 276,258 256,244 236,258 244,236 224,222 248,222"
        fill="#FFFFFF"
      />
    </svg>
  );
}
