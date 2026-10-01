import type { SVGProps } from 'react'

const paths = {
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  down: (
    <>
      <path d="M12 4v16M6 14l6 6 6-6" />
    </>
  ),
  pin: (
    <>
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  rings: (
    <>
      <circle cx="8.5" cy="14" r="6" />
      <circle cx="15.5" cy="14" r="6" />
      <path d="m6 4 2.5-2L11 4 8.5 7 6 4Zm8-1h3" />
    </>
  ),
  church: (
    <>
      <path d="M3 21h18M5 21V11l7-6 7 6v10M10 21v-6h4v6M12 5V1M10 3h4M2 13l3-2m14 0 3 2" />
      <circle cx="12" cy="10" r="1" />
    </>
  ),
  garden: (
    <>
      <path d="M4 21V10a8 8 0 0 1 16 0v11M8 21V10a4 4 0 0 1 8 0v11M2 21h20M3 15h5m8 0h5" />
      <path d="M5 8c-4 0-4-5-1-4 2 0 2 2 1 4Zm14 0c4 0 4-5 1-4-2 0-2 2-1 4Z" />
    </>
  ),
  dining: (
    <>
      <path d="M4 2v7c0 3 4 3 4 0V2M6 2v20M17 2c-4 5-4 10 0 10h2M19 2v20" />
    </>
  ),
  glasses: (
    <>
      <path d="m4 3 6 2-1 5a3 3 0 0 1-6-2l1-5Zm16 0-6 2 1 5a3 3 0 0 0 6-2l-1-5ZM6 12l-2 8m-2-1 5 2m11-9 2 8m2-1-5 2M11 1l1 2 1-2" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5l11-2v13M9 8l11-2" />
      <ellipse cx="6" cy="18" rx="3" ry="3" />
      <ellipse cx="17" cy="16" rx="3" ry="3" />
    </>
  ),
  moon: (
    <>
      <path d="M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12Z" />
      <path d="M17 3v4m-2-2h4" />
    </>
  ),
  suit: (
    <>
      <path d="m8 3-5 4v14h18V7l-5-4M8 3l4 5 4-5M8 3l-1 8 5 8 5-8-1-8M12 8v11M12 8l-2 3 2 3 2-3-2-3" />
    </>
  ),
  dress: (
    <>
      <path d="M8 2v4l4 4 4-4V2M8 6l1 7-6 9h18l-6-9 1-7M9 13h6" />
    </>
  ),
  gift: (
    <>
      <path d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13" />
      <path d="M12 8C5 8 4 2 8 2c3 0 4 6 4 6Zm0 0c7 0 8-6 4-6-3 0-4 6-4 6Z" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="13" rx="2" />
      <path d="M16 8V3H3v13h5" />
    </>
  ),
  check: (
    <>
      <path d="m5 12 4 4L20 5" />
    </>
  ),
  play: (
    <>
      <path d="m8 4 12 8-12 8V4Z" />
    </>
  ),
  pause: (
    <>
      <path d="M8 4v16M16 4v16" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M6 18 18 6" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20.5 11.5a9 9 0 0 1-13.3 7.9L3 21l1.5-4.3a9 9 0 1 1 16-5.2Z" />
      <path d="m8 7 2 3-1.2 1.2a8 8 0 0 0 4 4L14 14l3 2c-1 2-3 2-5 1a12 12 0 0 1-5-5c-1-2-1-4 1-5Z" />
    </>
  ),
  message: (
    <>
      <path d="M21 11.5A9.5 9.5 0 0 1 7 20l-5 2 2-5a9.5 9.5 0 1 1 17-5.5Z" />
      <path d="M8 9h8m-8 4h5" />
    </>
  ),
} as const

export type IconName = keyof typeof paths
export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
