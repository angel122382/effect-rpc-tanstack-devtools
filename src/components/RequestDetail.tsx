import { useState } from "react"
import type { CapturedRequest } from "../types"
import { styles } from "./styles"

interface RequestDetailProps {
	request: CapturedRequest
}

type Tab = "request" | "response" | "headers" | "timing"

export function RequestDetail({ request }: RequestDetailProps) {
	const [activeTab, setActiveTab] = useState<Tab>("request")

	return (
		<div style={styles.detailPanel}>
			{/* Tabs */}
			<div style={styles.tabsContainer}>
				{(["request", "response", "headers", "timing"] as const).map((tab) => (
					<button
						key={tab}
						type="button"
						onClick={() => setActiveTab(tab)}
						style={styles.tab(activeTab === tab)}
					>
						{tab}
					</button>
				))}
			</div>

			{/* Content */}
			<div style={styles.tabContent}>
				{activeTab === "request" && <RequestTab request={request} />}
				{activeTab === "response" && <ResponseTab request={request} />}
				{activeTab === "headers" && <HeadersTab request={request} />}
				{activeTab === "timing" && <TimingTab request={request} />}
			</div>
		</div>
	)
}

function RequestTab({ request }: { request: CapturedRequest }) {
	return (
		<div>
			<div style={styles.section}>
				<h4 style={styles.sectionTitle}>Method</h4>
				<code style={styles.textBlue400}>{request.method}</code>
			</div>
			<div style={styles.section}>
				<div style={styles.sectionHeader}>
					<h4 style={styles.sectionTitle}>Payload</h4>
					<CopyButton text={JSON.stringify(request.payload, null, 2)} />
				</div>
				<JsonViewer data={request.payload} />
			</div>
		</div>
	)
}

function ResponseTab({ request }: { request: CapturedRequest }) {
	if (!request.response) {
		return <div style={styles.textGray500}>Response pending...</div>
	}

	const isError = request.response.status === "error"

	return (
		<div>
			<div style={styles.section}>
				<h4 style={styles.sectionTitle}>Status</h4>
				<span style={isError ? styles.textRed400 : styles.textGreen400}>
					{request.response.status}
				</span>
			</div>
			<div style={styles.section}>
				<div style={styles.sectionHeader}>
					<h4 style={styles.sectionTitle}>{isError ? "Error" : "Data"}</h4>
					<CopyButton text={JSON.stringify(request.response.data, null, 2)} />
				</div>
				<JsonViewer data={request.response.data} isError={isError} />
			</div>
		</div>
	)
}

function HeadersTab({ request }: { request: CapturedRequest }) {
	if (request.headers.length === 0) {
		return <div style={styles.textGray500}>No headers</div>
	}

	return (
		<div>
			{request.headers.map(([key, value], index) => (
				<div key={index} style={{ marginBottom: "8px", fontSize: "14px" }}>
					<span style={styles.textGray400}>{key}:</span>{" "}
					<span style={styles.textGray200}>{value}</span>
				</div>
			))}
		</div>
	)
}

function TimingTab({ request }: { request: CapturedRequest }) {
	const startTime = new Date(request.startTime)

	return (
		<div>
			<div style={styles.section}>
				<h4 style={styles.sectionTitle}>Request ID</h4>
				<code style={{ ...styles.textGray300, fontSize: "12px" }}>{request.id}</code>
			</div>
			<div style={styles.section}>
				<h4 style={styles.sectionTitle}>Started At</h4>
				<div style={styles.textGray200}>{startTime.toLocaleTimeString()}</div>
			</div>
			{request.response && (
				<>
					<div style={styles.section}>
						<h4 style={styles.sectionTitle}>Duration</h4>
						<div style={styles.textGray200}>{request.response.duration}ms</div>
					</div>
					<div style={styles.section}>
						<h4 style={styles.sectionTitle}>Completed At</h4>
						<div style={styles.textGray200}>
							{new Date(request.response.timestamp).toLocaleTimeString()}
						</div>
					</div>
				</>
			)}
			{!request.response && (
				<div style={styles.section}>
					<h4 style={styles.sectionTitle}>Status</h4>
					<div style={styles.textYellow400}>Pending...</div>
				</div>
			)}
		</div>
	)
}

function JsonViewer({ data, isError = false }: { data: unknown; isError?: boolean }) {
	const jsonString = JSON.stringify(data, null, 2)

	return <pre style={styles.jsonPre(isError)}>{jsonString}</pre>
}

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<button type="button" onClick={handleCopy} style={styles.copyButton} title="Copy to clipboard">
			{copied ? "Copied!" : "Copy"}
		</button>
	)
}
