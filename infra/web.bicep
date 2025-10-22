metadata description = 'Creates an Azure Static Web App with integrated Azure Functions backend.'

param location string = resourceGroup().location
param resourceToken string
param environmentName string
param openAiEndpoint string
param openAiDeploymentName string
@secure()
param openAiApiKey string
param functionsIdentityId string
param amsBaseUrl string
param applicationInsightsConnectionString string

// Azure Static Web App
resource staticWebApp 'Microsoft.Web/staticSites@2024-11-01' = {
  name: 'swa-${resourceToken}'
  location: location
  tags: {
    'azd-service-name': 'web'
  }
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${functionsIdentityId}': {}
    }
  }
  properties: {
    buildProperties: {
      skipGithubActionWorkflowGeneration: true
    }
  }
}

// Configure app settings for Azure Functions
resource staticWebAppSettings 'Microsoft.Web/staticSites/config@2024-11-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    // Application Insights
    APPLICATIONINSIGHTS_CONNECTION_STRING: applicationInsightsConnectionString

    // Environment
    NODE_ENV: environmentName

    // Azure OpenAI Configuration (API key auth)
    AZURE_OPENAI_ENDPOINT: openAiEndpoint
    AZURE_OPENAI_DEPLOYMENT: openAiDeploymentName
    AZURE_OPENAI_API_KEY: openAiApiKey

    // AMS Configuration
    AMS_BASE_URL: amsBaseUrl
    AMS_CONTEXT_WINDOW_MAX: '4000'
  }
}

// Outputs
output id string = staticWebApp.id
output name string = staticWebApp.name
output uri string = 'https://${staticWebApp.properties.defaultHostname}'
output defaultHostname string = staticWebApp.properties.defaultHostname
