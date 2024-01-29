import { SVGProps } from "react";

export const NotificationBellIcon = ({
	size = 24,
	width,
	height,
	...props
}: SVGProps<SVGSVGElement> & { size?: number }) => (
	<svg
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		focusable="false"
		height={size || height}
		role="presentation"
		viewBox="0 0 24 24"
		width={size || width}
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
		<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
	</svg>
);
