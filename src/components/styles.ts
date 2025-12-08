import type { CSSProperties } from "react"

/**
 * CSS-in-JS styles for the RPC Devtools components
 * Dark theme inspired by TanStack Devtools
 */
export const styles = {
	// Layout
	panel: {
		display: "flex",
		flexDirection: "column",
		height: "100%",
		backgroundColor: "#111827", // gray-900
		color: "#f3f4f6", // gray-100
		fontFamily:
			'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
		fontSize: "14px",
	} satisfies CSSProperties,

	// Header
	header: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		borderBottom: "1px solid #374151", // gray-700
		backgroundColor: "#1f2937", // gray-800
		padding: "8px 12px",
	} satisfies CSSProperties,

	headerLeft: {
		display: "flex",
		alignItems: "center",
		gap: "16px",
	} satisfies CSSProperties,

	headerTitle: {
		fontWeight: 600,
		fontSize: "14px",
		margin: 0,
	} satisfies CSSProperties,

	headerStats: {
		display: "flex",
		alignItems: "center",
		gap: "12px",
		color: "#9ca3af", // gray-400
		fontSize: "12px",
	} satisfies CSSProperties,

	// Filter
	filterContainer: {
		borderBottom: "1px solid #374151",
		padding: "8px 12px",
	} satisfies CSSProperties,

	filterInput: {
		width: "100%",
		borderRadius: "4px",
		border: "1px solid #4b5563", // gray-600
		backgroundColor: "#1f2937", // gray-800
		padding: "6px 8px",
		fontSize: "14px",
		color: "#f3f4f6",
		outline: "none",
	} satisfies CSSProperties,

	// Content area
	content: {
		display: "flex",
		flex: 1,
		overflow: "hidden",
	} satisfies CSSProperties,

	// Buttons
	clearButton: {
		borderRadius: "4px",
		backgroundColor: "#dc2626", // red-600
		padding: "4px 8px",
		fontWeight: 500,
		fontSize: "12px",
		color: "white",
		border: "none",
		cursor: "pointer",
	} satisfies CSSProperties,

	// Request List
	listContainer: {
		flex: 1,
		overflow: "auto",
	} satisfies CSSProperties,

	emptyState: {
		display: "flex",
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		color: "#6b7280", // gray-500
		fontSize: "14px",
	} satisfies CSSProperties,

	table: {
		width: "100%",
		fontSize: "13px",
		borderCollapse: "collapse",
	} satisfies CSSProperties,

	tableHeader: {
		position: "sticky",
		top: 0,
		backgroundColor: "#1f2937", // gray-800
		textAlign: "left",
		color: "#9ca3af", // gray-400
	} satisfies CSSProperties,

	tableHeaderCell: {
		padding: "8px 12px",
		fontWeight: 500,
	} satisfies CSSProperties,

	tableRow: (isSelected: boolean): CSSProperties => ({
		cursor: "pointer",
		borderBottom: "1px solid #374151", // gray-700
		backgroundColor: isSelected ? "#374151" : "transparent",
		transition: "background-color 0.15s",
	}),

	tableCell: {
		padding: "8px 12px",
	} satisfies CSSProperties,

	methodCode: {
		color: "#60a5fa", // blue-400
		fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
	} satisfies CSSProperties,

	// Status badges
	statusBadge: {
		base: {
			display: "inline-flex",
			alignItems: "center",
			gap: "4px",
			borderRadius: "4px",
			padding: "2px 8px",
			fontWeight: 500,
			fontSize: "11px",
		} satisfies CSSProperties,
		pending: {
			backgroundColor: "rgba(234, 179, 8, 0.2)", // yellow-500/20
			color: "#facc15", // yellow-400
		} satisfies CSSProperties,
		success: {
			backgroundColor: "rgba(34, 197, 94, 0.2)", // green-500/20
			color: "#4ade80", // green-400
		} satisfies CSSProperties,
		error: {
			backgroundColor: "rgba(239, 68, 68, 0.2)", // red-500/20
			color: "#f87171", // red-400
		} satisfies CSSProperties,
	},

	statusDot: (color: string, animate = false): CSSProperties => ({
		width: "6px",
		height: "6px",
		borderRadius: "50%",
		backgroundColor: color,
		animation: animate ? "pulse 2s infinite" : undefined,
	}),

	// Type badges
	typeBadge: {
		base: {
			marginLeft: "8px",
			borderRadius: "4px",
			padding: "2px 6px",
			fontWeight: 500,
			fontSize: "10px",
		} satisfies CSSProperties,
		mutation: {
			backgroundColor: "rgba(139, 92, 246, 0.2)", // purple-500/20
			color: "#a78bfa", // purple-400
		} satisfies CSSProperties,
		query: {
			backgroundColor: "rgba(6, 182, 212, 0.2)", // cyan-500/20
			color: "#22d3ee", // cyan-400
		} satisfies CSSProperties,
	},

	// Detail panel
	detailPanel: {
		display: "flex",
		flexDirection: "column",
		width: "400px",
		borderLeft: "1px solid #374151", // gray-700
		backgroundColor: "#111827", // gray-900
	} satisfies CSSProperties,

	// Tabs
	tabsContainer: {
		display: "flex",
		borderBottom: "1px solid #374151", // gray-700
	} satisfies CSSProperties,

	tab: (isActive: boolean): CSSProperties => ({
		padding: "8px 16px",
		fontWeight: 500,
		fontSize: "14px",
		textTransform: "capitalize",
		cursor: "pointer",
		border: "none",
		background: "transparent",
		color: isActive ? "#60a5fa" : "#9ca3af", // blue-400 or gray-400
		borderBottom: isActive ? "2px solid #60a5fa" : "2px solid transparent",
		marginBottom: isActive ? "-1px" : 0,
		transition: "color 0.15s",
	}),

	tabContent: {
		flex: 1,
		overflow: "auto",
		padding: "12px",
	} satisfies CSSProperties,

	// Detail sections
	section: {
		marginBottom: "12px",
	} satisfies CSSProperties,

	sectionHeader: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: "4px",
	} satisfies CSSProperties,

	sectionTitle: {
		fontWeight: 500,
		color: "#9ca3af", // gray-400
		fontSize: "10px",
		textTransform: "uppercase",
		letterSpacing: "0.05em",
	} satisfies CSSProperties,

	// JSON viewer
	jsonPre: (isError = false): CSSProperties => ({
		maxHeight: "300px",
		overflow: "auto",
		borderRadius: "4px",
		backgroundColor: "#111827", // gray-900
		padding: "8px",
		fontSize: "12px",
		fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
		color: isError ? "#fca5a5" : "#d1d5db", // red-300 or gray-300
		margin: 0,
		whiteSpace: "pre-wrap",
		wordBreak: "break-word",
	}),

	// Copy button
	copyButton: {
		color: "#9ca3af", // gray-400
		fontSize: "12px",
		background: "transparent",
		border: "none",
		cursor: "pointer",
		transition: "color 0.15s",
	} satisfies CSSProperties,

	// Misc text colors
	textGray200: { color: "#e5e7eb" } satisfies CSSProperties,
	textGray300: { color: "#d1d5db" } satisfies CSSProperties,
	textGray400: { color: "#9ca3af" } satisfies CSSProperties,
	textGray500: { color: "#6b7280" } satisfies CSSProperties,
	textYellow400: { color: "#facc15" } satisfies CSSProperties,
	textGreen400: { color: "#4ade80" } satisfies CSSProperties,
	textRed400: { color: "#f87171" } satisfies CSSProperties,
	textBlue400: { color: "#60a5fa" } satisfies CSSProperties,

	// Time display
	timeCell: {
		textAlign: "right",
		color: "#9ca3af",
		fontVariantNumeric: "tabular-nums",
	} satisfies CSSProperties,

	whenCell: {
		textAlign: "right",
		color: "#6b7280",
		fontSize: "12px",
	} satisfies CSSProperties,

	// Header cell alignment
	headerCellRight: {
		textAlign: "right",
	} satisfies CSSProperties,

	// Inline CSS for the pulsing animation
	pulseKeyframes: `
		@keyframes rpc-devtools-pulse {
			0%, 100% { opacity: 1; }
			50% { opacity: 0.5; }
		}
	`,
} as const

/**
 * Inject the pulse animation keyframes into the document
 * Call this once when the component mounts
 */
export function injectKeyframes() {
	if (typeof document === "undefined") return
	const id = "rpc-devtools-keyframes"
	if (document.getElementById(id)) return

	const style = document.createElement("style")
	style.id = id
	style.textContent = styles.pulseKeyframes
	document.head.appendChild(style)
}
