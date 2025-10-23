# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
TypeScript-based chat application using Azure Static Web Apps and Azure Functions that integrates with Redis Agent Memory Server (AMS) to create PodBot - a specialized chatbot that provides podcast recommendations.

## Project Structure

**Critical**: This is a **monorepo workspace** with unusual structure:
```
web/                           # Frontend + Backend combined
├── api/                       # Azure Functions backend (NOTE: nested under web/)
│   ├── src/
│   │   ├── functions/         # HTTP function definitions
│   │   ├── services/          # Business logic layers
│   │   ├── config.ts
│   │   └── main.ts            # Entry point (imports functions/sessions.ts)
│   ├── host.json
│   ├── local.settings.json    # Local environment config
│   ├── package.json           # Workspace: @podbot/api
│   └── tsconfig.json
├── src/                       # Frontend application
│   ├── main.ts
│   ├── api.ts                 # Backend API client
│   ├── types.ts
│   └── style.css
├── package.json               # Workspace: @podbot/web
└── staticwebapp.config.json

infra/                         # Bicep templates for Azure deployment
docker-compose.yaml            # Redis + AMS for local dev
package.json                   # Root workspace: @podbot/root
azure.yaml                     # Azure Developer CLI config
```

**Workspace Structure**: Root package.json defines workspaces at `web` and `web/api` (not `api`). The API is nested inside the web directory, which is unconventional but required for Azure Static Web Apps deployment.

## Development Commands

### Local Development Setup
```bash
# 1. Install all workspace dependencies
npm install

# 2. Start Docker services (Redis + AMS)
docker compose up

# 3. Build and start dev servers (from root)
npm run dev              # Builds both, then runs API + SWA CLI in parallel
```

This starts:
- Azure Functions at http://localhost:7071
- SWA CLI at http://localhost:4280 (proxies /api/* to Functions)

### Individual Workspace Commands
```bash
# Build commands (from root)
npm run build              # Build both workspaces sequentially
npm run build:api          # Build API only (runs in web/api workspace)
npm run build:web          # Build web only (runs in web workspace)

# Dev commands (from root)
npm run dev:api            # Start Azure Functions only
npm run dev:web            # Start SWA CLI only

# From web/api directory
cd web/api
npm run build              # TypeScript compilation with tsc + tsc-alias
npm run dev                # Start Azure Functions (func start)

# From web directory
cd web
npm run build              # Vite build
npm run dev                # SWA CLI (not Vite!)
```

### Docker Management
```bash
docker compose up          # Start Redis + AMS
docker compose down        # Stop services
docker compose logs -f     # View logs
```

### Testing API Directly
```bash
# Send message
curl -X POST http://localhost:7071/api/sessions/testuser \
  -H "Content-Type: application/json" \
  -d '{"message": "Recommend some history podcasts"}'

# Get history
curl -X GET http://localhost:7071/api/sessions/testuser

# Clear session
curl -X DELETE http://localhost:7071/api/sessions/testuser
```

## Architecture & Key Implementation Details

### Azure Functions v4 Programming Model
- Uses `app.http()` registration pattern in `web/api/src/functions/sessions.ts`
- Each endpoint has separate handler file (fetch-session-history.ts, request-and-response.ts, delete-session.ts)
- Entry point at `web/api/src/main.ts` imports `functions/sessions.ts` to trigger registration
- All functions registered with `authLevel: 'anonymous'` for local development
- Single route pattern: `sessions/{username}` with different HTTP methods (GET/POST/DELETE)

### TypeScript Path Aliases (web/api only)
The API uses path aliases configured in tsconfig.json:
```typescript
import { config } from '@/config.js'          // Maps to src/config.js
import { fetchHistory } from '@services/chat-service.js'  // Maps to src/services/
import { successResponse } from '@functions/http-responses.js'  // Maps to src/functions/
```

**Critical**: Must use `tsc-alias` after TypeScript compilation to resolve these paths. Build command is `tsc && tsc-alias`.

### Message Conversion Flow
The application converts between three message formats:

1. **LangChain Messages** (BaseMessage, HumanMessage, AIMessage, SystemMessage)
   - Used for LLM communication in `agent-adapter.ts`

2. **AMS Messages** (AmsMessage with role: 'user'|'assistant')
   - Used for Redis Agent Memory Server API in `memory-server.ts`

3. **Chat Messages** (ChatMessage with role: 'user'|'podbot'|'summary')
   - Used for frontend/API communication

**Key conversion functions** in `web/api/src/services/chat-service.ts`:
- `amsToLangChainMessage()` - AMS → LangChain
- `langchainToAmsMessage()` - LangChain → AMS
- `amsToChatMessage()` - AMS → Chat API
- `amsContextToChatMessage()` - AMS context string → Chat summary message

### Environment-Aware LLM Configuration
The `agent-adapter.ts` service switches between OpenAI and Azure OpenAI based on `NODE_ENV`:
- `dev`: Uses `ChatOpenAI` with direct OpenAI API (`gpt-4o-mini`)
- `prod`/`stage`: Uses `AzureChatOpenAI` with Azure OpenAI endpoints

Required config (from `web/api/src/config.ts`):
- Local: `OPENAI_API_KEY`
- Azure: `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_DEPLOYMENT`, `AZURE_OPENAI_API_KEY`

### AMS Integration Details
**Redis Agent Memory Server** manages conversation history with smart context window management.

API calls in `memory-server.ts`:
- `readWorkingMemory(sessionId, namespace)` - Returns 404 for new sessions (handled gracefully)
- `replaceWorkingMemory(sessionId, context_window_max, amsMemory)` - Saves with token limit
- `removeWorkingMemory(sessionId, namespace)` - Deletes session

**Critical parameters**:
- `namespace`: Always 'chat' (allows future multi-namespace support)
- `context_window_max`: Token limit for AMS to trim old messages (default: 4000)
- `X-Client-Version: 0.12.0` header required on all requests

AMS response structure includes:
- `context`: Summarized conversation history (older messages)
- `messages`: Recent message array (user/assistant)

### PodBot System Prompt
Defined in `web/api/src/services/agent-adapter.ts`:
- Specialized persona that **only** discusses podcasts
- Politely redirects off-topic questions
- Maintains preferences across conversations
- Uses temperature 0.7 for creative recommendations

### Frontend-Backend Integration
- SWA CLI (`swa start`) proxies `/api/*` to Azure Functions (port 7071)
- `staticwebapp.config.json` configures runtime: `node:20`
- Frontend at `web/src/api.ts` makes fetch calls to `/api/sessions/{username}`
- Markdown rendering via `marked.js` for bot responses
- LocalStorage persists username between sessions

### Docker Compose Services
```yaml
redis:                    # Port 6379
  - Volume: ./redis:/data (persists data locally)

agent-memory-server:      # Port 8000
  - Env: REDIS_URL=redis://redis:6379 (container network)
  - Env: AUTH_MODE=disabled (no auth for local dev)
  - Env: LOG_LEVEL=DEBUG
  - Image: redislabs/agent-memory-server:latest
```

## Environment Configuration

**`.env` (for Docker Compose)**:
```
OPENAI_API_KEY=your_key_here
AUTH_MODE=disabled
LOG_LEVEL=DEBUG
```

**`web/api/local.settings.json` (for Azure Functions)**:
```json
{
  "Values": {
    "OPENAI_API_KEY": "your_key_here",
    "AMS_BASE_URL": "http://localhost:8000",
    "AMS_CONTEXT_WINDOW_MAX": "4000",
    "NODE_ENV": "dev"
  }
}
```

Note: `.env.example` and `web/api/local.settings.example.json` provide templates.

## Azure Deployment

Uses **Azure Developer CLI** (`azd`):
```bash
azd up              # Deploy all resources
azd deploy          # Deploy code only
azd down            # Delete all resources
```

**Infrastructure** (Bicep templates in `infra/`):
- Azure Static Web Apps (frontend + API)
- Azure Managed Redis
- Azure Container Apps (for AMS)
- Azure OpenAI Service
- Application Insights
- Managed Identity for authentication

**Deployment flow** (defined in `azure.yaml`):
1. `predeploy` hook: `npm install && npm run build`
2. Deploy `web` service to Static Web Apps (includes API from `web/api`)
3. Bicep provisions all Azure resources

## API Endpoints

All routes use pattern `/api/sessions/{username}`:

- `GET /api/sessions/{username}` - Fetch conversation history
  - Returns: `ChatMessage[]` with roles: 'summary', 'user', 'podbot'

- `POST /api/sessions/{username}` - Send message and get response
  - Body: `{ "message": "your message here" }`
  - Returns: `{ "response": "PodBot's reply" }`

- `DELETE /api/sessions/{username}` - Clear conversation history
  - Returns: 204 No Content

## Common Issues & Workarounds

### ESM/CommonJS Compatibility
`@azure/functions` package has ESM/CommonJS interop issues. The codebase uses:
```typescript
import { app } from '@azure/functions'  // Works with current setup
```

If you encounter module resolution errors, verify:
1. `package.json` has `"type": "module"`
2. All imports use `.js` extensions (even for `.ts` files)
3. `tsconfig.json` uses `"module": "NodeNext"`

### Path Alias Resolution
When adding new imports with path aliases (`@/`, `@services/`, `@functions/`):
- TypeScript will compile successfully
- Runtime will fail unless `tsc-alias` runs after compilation
- Build script must be: `tsc && tsc-alias` (already configured)

### AMS 404 Handling
First-time users return 404 from `readWorkingMemory()`. This is expected behavior - the code returns empty session object rather than throwing error.

### Workspace Command Confusion
- Running `npm run dev` from root ≠ running from `web/` directory
- Root `npm run dev` builds both workspaces then starts API + SWA CLI
- `web/package.json` `npm run dev` only starts SWA CLI
- Always run development commands from **root directory** for full stack
