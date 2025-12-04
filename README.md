# Podcast Chatbot with Agent Memory and Azure

## Overview

The **Podcast Chatbot**—or **Podbot** for short—demonstrates how Redis Agent Memory Server enables intelligent, context-aware AI chatbots with persistent conversation memory. Built on Azure using Static Web Apps, Functions, and OpenAI, this demo showcases Redis's ability to manage short- and long-term conversation context and provide multi-session support for AI applications.

## Table of Contents

- [Demo Objectives](#demo-objectives)
- [Setup](#setup)
- [Running the Demo](#running-the-demo)
- [Slide Deck](#slide-deck)
- [Known Issues](#known-issues)
- [Architecture](#architecture)
- [Resources](#resources)
- [Maintainers](#maintainers)
- [License](#license)

## Demo Objectives

- Highlight [Redis Agent Memory Server](https://redis.github.io/agent-memory-server/) (AMS) to manage short- and long-term memory for AI workflows.
- Demonstrate integration of AMS with [Azure](https://azure.microsoft.com/) including Static Web Apps, Functions, and Azure Managed Redis.
- Show [LiteLLM](https://www.litellm.ai/) as a proxy for Azure OpenAI API access.

## Setup

### Dependencies

**For Local Development:**

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) for local Redis, AMS, and LiteLLM
- [OpenAI API Key](https://platform.openai.com/api-keys)

**For Azure Deployment:**

- [Azure](https://portal.azure.com/) subscription
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
- [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd)

### Configuration

**Local Configuration:**

Copy `.env.example` to `.env` and fill in your OpenAI API key.

```bash
cp .env.example .env
```

If you use Node Version Manager run:

```bash
nvm use
```

Install Node.js dependencies:

```bash
npm install
```

**Azure Configuration:**

No configuration necessary.

## Running the Demo

**Running Locally:**

In one terminal window start the Docker services for Redis, AMS, and LiteLLM:

```bash
docker compose up
```

In another terminal window, start the development servers:

```bash
npm run dev
```

This will compile and start the application. Now, just naviagate to [http://localhost:4280](http://localhost:4280) in your browser and start using Podbot.

**Running on Azure:**

```bash
azd up
```

Navigate to the URL provided by the `azd up` command in your browser and start using Podbot.

### Using the Demo

**Login:**
Enter a username and password. Click "Login" or just hit enter. Any username will work but the password must be "password".

**Sessions:**
The app will automatically create a session for you. If there are existing sessions, you will be added to the most recently used one. If you want to start a new session, click the "New Session" button. If you want to switch sessions, just click on the one you want.

**Chatting:**
Ask about podcasts in the textbox at the bottom. Responses will show up in the main panel. If you have navigated away from the chat view, you can return to it by clicking the "Chat" icon at the top.

**Working Memory:**
Working Memory is accessed via the "Note" icon at the top. When selected, the main panel shows the compacted summary of older messages and recent conversation history that Podbot is using to generate responses. Working Memory will change if you switch sessions or ask Podbot more questions.

**Long-term Memory:**
Long-term Memory is accessed via the "Brain" icon at the top. This panel shows the memories that Podbot has extracted from all of your conversations and stored for future reference. Long-term Memory will change if you switch users.

**Logout**
Click the "Logout" icon in the top right corner. This will return you to the login screen. All sessions and memory will be saved in Redis for later.

### Stopping the Demo

**Running Locally:**

Just hit `Ctrl+C` in the terminal windows where you ran `npm run dev` and `docker compose up` respectively.

**Running on Azure:**

```bash
azd down --purge
```

Note that this will delete all resources, including the Redis database. All data will be lost.

## Slide Deck

📑 **Slide Deck:** _(Coming soon)_
Covers demo goals, architecture overview, and key Redis features.

## Architecture

![Architecture Diagram](./assets/architecture.png)

The Svelte 5 + Tailwind CSS frontend is hosted on Azure Static Web Apps and sends user requests to a collection of Azure Functions written in TypeScript. These functions use Azure OpenAI (via the LiteLLM proxy), Redis, and Redis Agent Memory Server to service those requests. AMS manages the conversation history—automatically summarizing older messages, extracting long-term memories using Azure OpenAI (again, via LiteLLM), and storing it all in Redis.

## Known Issues

- None at this time.

## Resources

- [LiteLLM Documentation](https://docs.litellm.ai/)
- [Redis Agent Memory Server Documentation](https://redis.github.io/agent-memory-server/)
- [Redis Agent Memory Server Source Code](https://github.com/redis/agent-memory-server)

## Maintainers

**Maintainers:**

- Guy Royse — [guyroyse](https://github.com/guyroyse)

## License

This project is licensed under the [MIT License](./LICENSE).
