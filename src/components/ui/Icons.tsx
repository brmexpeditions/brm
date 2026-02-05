import React from "react";

export type IconProps = React.SVGProps<SVGSVGElement>;

function baseProps(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
  } satisfies React.SVGProps<SVGSVGElement>;
}

export function IconFleet(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M6 15.5V11.7c0-.6.33-1.15.86-1.43l4.5-2.36c.41-.22.88-.22 1.3 0l4.5 2.36c.53.28.86.83.86 1.43v3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 15.5v3.25c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V15.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 20v-5.2c0-.44.36-.8.8-.8h2.4c.44 0 .8.36.8.8V20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconWrench(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M21 7.2a5.2 5.2 0 0 1-7.34 4.73L7.1 18.5a2 2 0 0 1-2.83 0l-.77-.77a2 2 0 0 1 0-2.83l6.57-6.56A5.2 5.2 0 0 1 21 7.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.8 7.2 17 9.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconChart(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M4 19V5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20 19H4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 15l3-4 3 2 4-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 7h2v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSettings(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 15a7.9 7.9 0 0 0 .06-1l1.8-1.4-1.8-3.1-2.2.8a7.7 7.7 0 0 0-1.7-1l-.3-2.3h-3.6l-.3 2.3a7.7 7.7 0 0 0-1.7 1l-2.2-.8-1.8 3.1L4.6 14c0 .34.02.67.06 1L3 16.4l1.8 3.1 2.2-.8c.53.4 1.1.73 1.7 1l.3 2.3h3.6l.3-2.3c.6-.27 1.17-.6 1.7-1l2.2.8 1.8-3.1-1.6-1.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M20 20l-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconDocument(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M8 3h6l4 4v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13h6M9 17h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M12 2 20 6v6c0 5-3.2 9.4-8 10-4.8-.6-8-5-8-10V6l8-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12.2 11.2 14l3.6-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSmoke(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M5 18h11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 18v-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M19 18v-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 14c1.5-1 1.5-2 0-3s-1.5-2 0-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 14c1.5-1 1.5-2 0-3s-1.5-2 0-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconCheckBadge(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M12 2.5 14.4 4l2.8-.2 1.1 2.6 2.2 1.8-1.4 2.4.7 2.7-2.5 1.2-1.3 2.5-2.8-.5L12 21.5l-2.4-2-2.8.5-1.3-2.5-2.5-1.2.7-2.7L3.5 10l2.2-1.8 1.1-2.6 2.8.2L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 12.2 11 14l3.8-4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconRoad(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M8 2 5 22h4l1-5h4l1 5h4L16 2h-3l-1 5h-0l-1-5H8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 10v2M12 14v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconGauge(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M20 14a8 8 0 1 0-16 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 14l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 6v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 20h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconEdit(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M4 20h4l10.5-10.5a2.12 2.12 0 0 0 0-3L16.5 4.5a2.12 2.12 0 0 0-3 0L3 15v5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 5.5l6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M6 7h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 7V5.5c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5V7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 7l.8 13a2 2 0 0 0 2 2h3.4a2 2 0 0 0 2-2l.8-13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 11v7M14 11v7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconLogout(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M10 7V6a2 2 0 0 1 2-2h7v16h-7a2 2 0 0 1-2-2v-1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 12H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 9l-3 3 3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconHelp(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9.8 9.2a2.3 2.3 0 0 1 4.4.8c0 1.8-2.2 2-2.2 3.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17h.01"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconCar(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M6.5 16H5a2 2 0 0 1-2-2v-3.2c0-.5.19-.98.53-1.35l2.1-2.3c.38-.42.92-.65 1.48-.65h10.8c.56 0 1.1.23 1.48.65l2.1 2.3c.34.37.53.85.53 1.35V14a2 2 0 0 1-2 2h-1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M6 10h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconBike(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M7.5 17.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm9 0a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7.5 14h4l3.2-4H12l-1-2h2.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14l1.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
