metadata description = 'Creates an Azure Function App for PodBot API.'

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

// Storage Account for Function App
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: 'stfn${resourceToken}'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
  }
}

// App Service Plan (Consumption)
resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: 'plan-fn-${resourceToken}'
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  properties: {
    reserved: true
  }
}

// Function App
resource functionApp 'Microsoft.Web/sites@2024-04-01' = {
  name: 'func-${resourceToken}'
  location: location
  kind: 'functionapp,linux'
  tags: {
    'azd-service-name': 'api'
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${functionsIdentityId}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20'
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower('func-${resourceToken}')
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsightsConnectionString
        }
        {
          name: 'NODE_ENV'
          value: environmentName
        }
        {
          name: 'AZURE_OPENAI_ENDPOINT'
          value: openAiEndpoint
        }
        {
          name: 'AZURE_OPENAI_DEPLOYMENT'
          value: openAiDeploymentName
        }
        {
          name: 'AZURE_OPENAI_API_KEY'
          value: openAiApiKey
        }
        {
          name: 'AZURE_OPENAI_API_VERSION'
          value: '2024-08-01-preview'
        }
        {
          name: 'AMS_BASE_URL'
          value: amsBaseUrl
        }
        {
          name: 'AMS_CONTEXT_WINDOW_MAX'
          value: '4000'
        }
      ]
      cors: {
        allowedOrigins: [
          'https://portal.azure.com'
        ]
      }
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
    }
  }
}

// Outputs
output id string = functionApp.id
output name string = functionApp.name
output uri string = 'https://${functionApp.properties.defaultHostName}'
output defaultHostName string = functionApp.properties.defaultHostName
