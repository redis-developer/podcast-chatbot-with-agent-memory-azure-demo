targetScope = 'resourceGroup'

@description('Name of the environment which is used to generate a short unique hash used in all resources.')
@allowed(['stage', 'prod'])
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string = resourceGroup().location

var resourceToken = toLower(uniqueString(resourceGroup().id, environmentName, location))

// ==============================================================================
// Shared Infrastructure & Services
// ==============================================================================

// Container Apps environment for hosting AMS
module containerAppsEnvironment './containers.bicep' = {
  name: 'container-apps-env'
  params: {
    resourceToken: resourceToken
    logAnalyticsWorkspaceId: monitoring.outputs.logAnalyticsWorkspaceId
  }
}

// Monitor application with Azure Monitor (Application Insights)
module monitoring './monitoring.bicep' = {
  name: 'monitoring'
  params: {
    resourceToken: resourceToken
  }
}

// User-assigned managed identities
module identities './identities.bicep' = {
  name: 'identities'
  params: {
    resourceToken: resourceToken
  }
}

// ==============================================================================
// Core Services
// ==============================================================================

// Azure OpenAI Service
module openAi './openai.bicep' = {
  name: 'openai'
  params: {
    resourceToken: resourceToken
  }
}

// Azure Managed Redis
module redis './redis.bicep' = {
  name: 'redis'
  params: {
    resourceToken: resourceToken
  }
}

// Agent Memory Server Container App
module ams './ams.bicep' = {
  name: 'ams'
  params: {
    resourceToken: resourceToken
    containerAppsEnvironmentId: containerAppsEnvironment.outputs.id
    redisConnectionString: redis.outputs.connectionString
    openAiApiKey: openAi.outputs.apiKey
    openAiEndpoint: openAi.outputs.endpoint
    tenantId: tenant().tenantId
  }
}

// ==============================================================================
// Application Services
// ==============================================================================

// Static Web App
module web './web.bicep' = {
  name: 'web'
  params: {
    resourceToken: resourceToken
  }
}

// Azure Function App
module functions './functions.bicep' = {
  name: 'functions'
  params: {
    resourceToken: resourceToken
    environmentName: environmentName
    openAiConfig: {
      endpoint: openAi.outputs.endpoint
      deploymentName: openAi.outputs.gpt4oMiniDeploymentName
      apiKey: openAi.outputs.apiKey
    }
    amsConfig: {
      baseUrl: ams.outputs.uri
    }
    functionsIdentityId: identities.outputs.functionsIdentityId
    applicationInsightsConnectionString: monitoring.outputs.applicationInsightsConnectionString
  }
}

// Link Function App to Static Web App
resource staticWebAppBackend 'Microsoft.Web/staticSites/linkedBackends@2025-03-01' = {
  name: 'swa-${resourceToken}/backend'
  properties: {
    backendResourceId: functions.outputs.id
    region: location
  }
}

// ==============================================================================
// OUTPUTS: Deployment Information
// ==============================================================================

output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_RESOURCE_GROUP string = resourceGroup().name

output AZURE_OPENAI_ENDPOINT string = openAi.outputs.endpoint

output REDIS_HOSTNAME string = redis.outputs.hostName
output REDIS_PORT int = redis.outputs.port

output AMS_URI string = ams.outputs.uri

output API_URI string = functions.outputs.uri
output WEB_URI string = web.outputs.uri
output APPLICATIONINSIGHTS_CONNECTION_STRING string = monitoring.outputs.applicationInsightsConnectionString
