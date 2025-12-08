import { useEffect, useMemo, useState } from "react"
import { clearRequests, useRpcRequests, useRpcStats } from "../store"
import { RequestDetail } from "./RequestDetail"
import { RequestList } from "./RequestList"
import { injectKeyframes, styles } from "./styles"

export function RpcDevtoolsPanel() {
	const requests = useRpcRequests()
	const stats = useRpcStats()
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [filter, setFilter] = useState("")

	// Inject keyframes for pulse animation
	useEffect(() => {
		injectKeyframes()
	}, [])

	const filteredRequests = useMemo(() => {
		if (!filter) return requests
		const lowerFilter = filter.toLowerCase()
		return requests.filter((req) => req.method.toLowerCase().includes(lowerFilter))
	}, [requests, filter])

	const selectedRequest = useMemo(() => {
		if (!selectedId) return null
		return requests.find((r) => r.captureId === selectedId) ?? null
	}, [requests, selectedId])

	return (
		<div style={styles.panel}>
			{/* Header */}
			<div style={styles.header}>
				<div style={styles.headerLeft}>
					<h2 style={styles.headerTitle}>Effect RPC</h2>
					<div style={styles.headerStats}>
						<span>
							<span style={styles.textGray200}>{stats.total}</span> total
						</span>
						{stats.pending > 0 && (
							<span>
								<span style={styles.textYellow400}>{stats.pending}</span> pending
							</span>
						)}
						<span>
							<span style={styles.textGreen400}>{stats.success}</span> success
						</span>
						{stats.error > 0 && (
							<span>
								<span style={styles.textRed400}>{stats.error}</span> errors
							</span>
						)}
						{stats.avgDuration > 0 && (
							<span>
								<span style={styles.textGray200}>{stats.avgDuration}ms</span> avg
							</span>
						)}
					</div>
				</div>
				<button type="button" onClick={clearRequests} style={styles.clearButton}>
					Clear
				</button>
			</div>

			{/* Filter */}
			<div style={styles.filterContainer}>
				<input
					type="text"
					placeholder="Filter by method name..."
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					style={styles.filterInput}
				/>
			</div>

			{/* Content */}
			<div style={styles.content}>
				<RequestList requests={filteredRequests} selectedId={selectedId} onSelect={setSelectedId} />
				{selectedRequest && <RequestDetail request={selectedRequest} />}
			</div>
		</div>
	)
}
