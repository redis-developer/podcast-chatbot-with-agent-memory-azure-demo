# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
TypeScript-based chat application using Azure Static Web Apps and Azure Functions that integrates with Redis Agent Memory Server (AMS) to create PodBot - a specialized chatbot that provides podcast recommendations.

## Project Structure

**Critical**: This is a **monorepo workspace** with standard structure:
```
api/                           # Azure Functions backend
├── src/
│   ├── functions/             # HTTP function definitions
│   │   ├── sessions.ts        # Route registration (app.http calls)
│   │   ├── fetch-session-history.ts
│   │   ├── request-and-response.ts
│   │   ├── delete-session.ts
│   │   └── http-responses.ts
│   ├── services/              # Business logic layers
│   │   ├── agent-adapter.ts   # LLM integration (OpenAI/Azure OpenAI)
│   │   ├── chat-service.ts    # Message conversion & orchestration
│   │   └── memory-server.ts   # AMS API client
│   ├── config.ts
│   └── main.ts                # Entry point (imports functions/sessions.ts)
├── host.json
├── local.settings.json        # Local environment config
├── package.json               # Workspace: @podbot/api
└── tsconfig.json

web/                           # Frontend application
├── src/
│   ├── model/                 # MVC Model layer
│   │   ├── chat-api.ts        # API client
│   │   └── chat-model.ts      # Business logic
│   ├── view/                  # MVC View layer
│   │   ├── display-view.ts    # Chat display
│   │   ├── session-view.ts    # Session controls
│   │   └── sender-view.ts     # Message input
│   ├── controller.ts          # MVC Controller
│   ├── main.ts                # App entry point
│   ├── types.ts
│   └── style.css
├── index.html
├── package.json               # Workspace: @podbot/web
└── staticwebapp.config.json

infra/                         # Bicep templates for Azure deployment
docker-compose.yaml            # Redis + AMS + LiteLLM for local dev
package.json                   # Root workspace: @podbot/root
azure.yaml                     # Azure Developer CLI config
```

**Workspace Structure**: Root package.json defines workspaces at `web` and `api` as sibling directories.

## Development Commands

### Local Development Setup
```bash
# 1. Install all workspace dependencies
npm install

# 2. Start Docker services (Redis + AMS + LiteLLM)
docker compose up

# 3. Build and start dev servers (from root)
npm run dev              # Builds both, then runs API + SWA CLI in parallel
```

This starts:
- LiteLLM proxy at http://localhost:4000
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

# From api directory
cd api
npm run build              # TypeScript compilation with tsc + tsc-alias
npm run dev                # Start Azure Functions (func start)

# From web directory
cd web
npm run build              # Vite build
npm run dev                # SWA CLI (not Vite!)
```

### Docker Management
```bash
docker compose up          # Start Redis + AMS + LiteLLM
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
- Uses `app.http()` registration pattern in `api/src/functions/sessions.ts`
- Each endpoint has separate handler file (fetch-session-history.ts, request-and-response.ts, delete-session.ts)
- Entry point at `api/src/main.ts` imports `functions/sessions.ts` to trigger registration
- All functions registered with `authLevel: 'anonymous'` for local development
- Single route pattern: `sessions/{username}` with different HTTP methods (GET/POST/DELETE)

### TypeScript Path Aliases (api only)
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

**Key conversion functions** in `api/src/services/chat-service.ts`:
- `amsToLangChainMessage()` - AMS → LangChain
- `langchainToAmsMessage()` - LangChain → AMS
- `amsToChatMessage()` - AMS → Chat API
- `amsContextToChatMessage()` - AMS context string → Chat summary message

### LLM Configuration via LiteLLM Proxy
The application uses **LiteLLM** as a unified OpenAI-compatible gateway for all LLM calls in both local and production environments:
- **Local dev**: LiteLLM proxy forwards to OpenAI API using `OPENAI_API_KEY` from `.env`
- **Azure deployment**: LiteLLM proxy translates OpenAI API calls to Azure OpenAI format

**Why LiteLLM?** Azure OpenAI has a different API structure than standard OpenAI:
- Different URL paths (includes deployment names in path)
- Different authentication headers (`api-key` vs `Authorization: Bearer`)
- Requires `api-version` query parameter
- No model in request body (specified in URL)

LiteLLM provides:
- Standard OpenAI API interface for both environments
- Automatic translation to Azure OpenAI's different API structure
- Unified monitoring and rate limiting
- Easy provider switching without code changes

The `agent-adapter.ts` service always uses `ChatOpenAI` class, pointing to LiteLLM in both environments:
- Local dev: LiteLLM at `http://localhost:4000` (which forwards to OpenAI)
- Azure deployment: LiteLLM proxy (which translates to Azure OpenAI)

Required config (from `api/src/config.ts`):
- Local: `OPENAI_API_KEY=sk-1234` (LiteLLM master key), `OPENAI_BASE_URL=http://localhost:4000`
- Azure: `OPENAI_API_KEY=sk-1234` (LiteLLM master key), `OPENAI_BASE_URL` (LiteLLM proxy URL)

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
Defined in `api/src/services/agent-adapter.ts`:
- Specialized persona that **only** discusses podcasts
- Politely redirects off-topic questions
- Maintains preferences across conversations
- Uses temperature 0.7 for creative recommendations

### Frontend MVC Architecture
The web frontend uses a clean MVC (Model-View-Controller) pattern:
- **Model** (`chat-model.ts`): Manages data and business logic via `chat-api.ts`
- **View** (separate view classes):
  - `DisplayView`: Chat message display with markdown rendering
  - `SessionView`: Username input and session management
  - `SenderView`: Message input form
- **Controller** (`controller.ts`): Coordinates between views and model using EventTarget pattern
- Views extend EventTarget for custom events (load, clear, send, etc.)

### Frontend-Backend Integration
- SWA CLI (`swa start`) proxies `/api/*` to Azure Functions (port 7071)
- `staticwebapp.config.json` configures runtime: `node:20`
- Frontend at `web/src/model/chat-api.ts` makes fetch calls to `/api/sessions/{username}`
- Markdown rendering via `marked.js` for bot responses
- LocalStorage persists username between sessions

### Docker Compose Services
```yaml
redis:                    # Port 6379
  - Volume: ./redis:/data (persists data locally)

litellm:                  # Port 4000
  - Image: ghcr.io/berriai/litellm:main-stable
  - Env: OPENAI_API_KEY (from .env - your real OpenAI key)
  - Env: LITELLM_MASTER_KEY=sk-1234 (for internal auth)

agent-memory-server:      # Port 8000
  - Env: REDIS_URL=redis://redis:6379 (container network)
  - Env: OPENAI_API_KEY=sk-1234 (LiteLLM master key)
  - Env: OPENAI_BASE_URL=http://litellm:4000
  - Env: AUTH_MODE=disabled (no auth for local dev)
  - Env: LOG_LEVEL=DEBUG
  - Image: redislabs/agent-memory-server:latest
```

## Environment Configuration

**`.env` (for Docker Compose)**:
```
OPENAI_API_KEY=your_key_here
```

**`api/local.settings.json` (checked into repo, no secrets)**:
```json
{
  "Values": {
    "OPENAI_API_KEY": "sk-1234",
    "OPENAI_BASE_URL": "http://localhost:4000",
    "AMS_BASE_URL": "http://localhost:8000",
    "AMS_CONTEXT_WINDOW_MAX": "4000",
    "NODE_ENV": "dev"
  }
}
```

Note: `.env.example` provides template for the real OpenAI API key needed by LiteLLM.

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
- Azure Container Apps (for AMS and LiteLLM)
- Azure OpenAI Service
- LiteLLM Proxy (translates OpenAI API to Azure OpenAI)
- Application Insights
- Managed Identity for authentication

**LiteLLM Integration**:
- Deployed as Container App alongside AMS in the same Container Apps Environment
- Configured with Azure OpenAI credentials and deployment mappings
- Provides internal OpenAI-compatible endpoint for Azure Functions and AMS
- Uses simple master key (`sk-1234`) for internal authentication between services

**Deployment flow** (defined in `azure.yaml`):
1. `predeploy` hook: `npm install && npm run build`
2. Deploy `api` service as Azure Functions
3. Deploy `web` service to Static Web Apps
4. Bicep provisions all Azure resources

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
