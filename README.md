# @hazel/rpc-devtools

Developer tools for [Effect RPC](https://effect.website/docs/rpc/introduction/) that integrate with [TanStack Devtools](https://tanstack.com/devtools).

![Dark themed devtools panel showing RPC requests](https://via.placeholder.com/800x400?text=RPC+Devtools+Panel)

## Features

- Real-time RPC request/response monitoring
- Request timing and duration tracking
- Payload and response inspection with JSON viewer
- Mutation/query classification with visual badges
- Filter requests by method name
- Copy payloads to clipboard
- Dark theme UI (CSS-in-JS, no external dependencies)

## Installation

```bash
npm install @hazel/rpc-devtools
# or
bun add @hazel/rpc-devtools
```

### Peer Dependencies

```json
{
  "@effect/rpc": ">=0.70.0",
  "@tanstack/devtools-event-client": ">=0.3.0",
  "effect": ">=3.0.0",
  "react": ">=18.0.0"
}
```

## Quick Start

### 1. Add the Protocol Layer

Wrap your RPC client's protocol layer with `DevtoolsProtocolLayer` to capture all RPC traffic:

```typescript
import { RpcClient, RpcSerialization } from "@effect/rpc"
import { BrowserSocket } from "@effect/platform-browser"
import { DevtoolsProtocolLayer } from "@hazel/rpc-devtools"
import { Layer } from "effect"

// Your base protocol layer
const BaseProtocolLive = RpcClient.layerProtocolSocket({
  retryTransientErrors: true,
}).pipe(
  Layer.provide(BrowserSocket.layerWebSocket("wss://api.example.com/rpc")),
  Layer.provide(RpcSerialization.layerNdjson)
)

// Add devtools in development only
export const RpcProtocolLive = import.meta.env.DEV
  ? Layer.provideMerge(DevtoolsProtocolLayer, BaseProtocolLive)
  : BaseProtocolLive
```

### 2. Add the Devtools Panel

Add the React component to your app, typically integrated with TanStack Devtools:

```tsx
import { TanStackDevtools } from "@tanstack/react-devtools"
import { RpcDevtoolsPanel } from "@hazel/rpc-devtools/components"

function App() {
  return (
    <>
      {import.meta.env.DEV && (
        <TanStackDevtools
          plugins={[
            {
              name: "Effect RPC",
              render: <RpcDevtoolsPanel />,
            },
          ]}
        />
      )}
      {/* Your app */}
    </>
  )
}
```

That's it! You'll now see all RPC requests in the devtools panel.

## Optional: Mutation/Query Classification

By default, the devtools uses heuristics to classify methods as mutations or queries based on naming patterns (e.g., `create`, `update`, `delete` = mutation; `get`, `list`, `find` = query).

For accurate classification, you have two options:

### Option A: Use the RPC Builders (Recommended)

The package provides `Rpc.mutation()` and `Rpc.query()` builder functions that automatically annotate your RPCs:

```typescript
import { Rpc } from "@hazel/rpc-devtools"
import { RpcGroup } from "@effect/rpc"
import { Schema } from "effect"

// Define RPCs with explicit type annotations
const createChannel = Rpc.mutation("channel.create", {
  payload: { name: Schema.String },
  success: Channel,
  error: ChannelError,
})

const listChannels = Rpc.query("channel.list", {
  payload: { organizationId: Schema.String },
  success: Schema.Array(Channel),
})

export const ChannelRpcs = RpcGroup.make("channels").add(createChannel).add(listChannels)
```

Then configure the resolver with your RPC groups:

```typescript
import { createRpcTypeResolver, setRpcTypeResolver } from "@hazel/rpc-devtools"

// Call this once at app initialization
if (import.meta.env.DEV) {
  setRpcTypeResolver(createRpcTypeResolver([ChannelRpcs, UserRpcs, /* ... */]))
}
```

### Option B: Use Standard Effect RPC

You can continue using standard Effect RPC definitions. The devtools will use heuristic classification:

```typescript
import { Rpc, RpcGroup } from "@effect/rpc"
import { Schema } from "effect"

// Standard Effect RPC - works fine, uses heuristic classification
const createChannel = Rpc.make("channel.create", {
  payload: { name: Schema.String },
  success: Channel,
})

export const ChannelRpcs = RpcGroup.make("channels").add(createChannel)
```

Heuristic patterns detected:
- **Mutations:** `create`, `update`, `delete`, `add`, `remove`, `set`, `mark`, `regenerate`
- **Queries:** `list`, `get`, `me`, `search`, `find`

### Option C: Custom Resolver

Provide your own classification logic:

```typescript
import { setRpcTypeResolver } from "@hazel/rpc-devtools"

setRpcTypeResolver((method) => {
  if (method.startsWith("admin.")) return "mutation"
  if (method.endsWith(".fetch")) return "query"
  return undefined // Fall back to heuristics
})
```

## API Reference

### Main Exports (`@hazel/rpc-devtools`)

```typescript
// Protocol layer for capturing RPC traffic
export { DevtoolsProtocolLayer, clearRequestTracking } from "./protocol-interceptor"

// React hooks for accessing captured data
export { useRpcRequests, useRpcStats, clearRequests } from "./store"

// Type resolution
export { createRpcTypeResolver, setRpcTypeResolver, heuristicResolver, getRpcType } from "./rpc-type-resolver"

// Optional RPC builders with type annotations
export { Rpc, RpcType } from "./builders"

// Event client for advanced usage
export { rpcEventClient } from "./event-client"

// Types
export type { CapturedRequest, RpcRequestEvent, RpcResponseEvent, RpcDevtoolsEventMap } from "./types"
```

### Component Exports (`@hazel/rpc-devtools/components`)

```typescript
// Main devtools panel
export { RpcDevtoolsPanel } from "./RpcDevtoolsPanel"

// Individual components for custom UIs
export { RequestList } from "./RequestList"
export { RequestDetail } from "./RequestDetail"

// Styles for custom theming
export { styles, injectKeyframes } from "./styles"
```

## Using the Hooks Directly

Build custom UIs using the provided hooks:

```tsx
import { useRpcRequests, useRpcStats, clearRequests } from "@hazel/rpc-devtools"

function MyCustomDevtools() {
  const requests = useRpcRequests()
  const stats = useRpcStats()

  return (
    <div>
      <p>Total: {stats.total}, Pending: {stats.pending}, Avg: {stats.avgDuration}ms</p>
      <button onClick={clearRequests}>Clear</button>
      <ul>
        {requests.map((req) => (
          <li key={req.captureId}>
            {req.method} - {req.response?.status ?? "pending"}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Tree-Shaking

The package is designed for optimal tree-shaking:

- React components are only loaded when importing from `/components`
- The `DevtoolsProtocolLayer` is a no-op in production when conditionally imported
- Type annotations from `Rpc.mutation()`/`Rpc.query()` have zero runtime cost

```typescript
// This pattern ensures devtools code is removed in production builds
export const RpcProtocolLive = import.meta.env.DEV
  ? Layer.provideMerge(DevtoolsProtocolLayer, BaseProtocolLive)
  : BaseProtocolLive
```

## License

MIT
