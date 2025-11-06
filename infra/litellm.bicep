metadata description = 'Creates an Azure Container App running LiteLLM proxy to provide OpenAI-compatible API for Azure OpenAI.'

param location string = resourceGroup().location
param resourceToken string
param containerAppsEnvironmentId string
@secure()
param azureOpenAiApiKey string
param azureOpenAiEndpoint string
param azureOpenAiApiVersion string
param gpt4oDeploymentName string
param gpt4oMiniDeploymentName string
param embeddingDeploymentName string

// LiteLLM Proxy Container App
resource litellm 'Microsoft.App/containerApps@2025-07-01' = {
  name: 'litellm-${resourceToken}'
  location: location
  properties: {
    managedEnvironmentId: containerAppsEnvironmentId
    configuration: {
      ingress: {
        external: false  // Internal only - only AMS and Functions should access
        targetPort: 4000
        transport: 'http'
        allowInsecure: false
      }
    }
    template: {
      containers: [
        {
          name: 'litellm'
          image: 'ghcr.io/berriai/litellm:main-latest'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            {
              name: 'AZURE_API_KEY'
              value: azureOpenAiApiKey
            }
            {
              name: 'AZURE_API_BASE'
              value: azureOpenAiEndpoint
            }
            {
              name: 'AZURE_API_VERSION'
              value: azureOpenAiApiVersion
            }
            {
              name: 'LITELLM_MASTER_KEY'
              value: 'sk-1234'  // Simple key for internal communication
            }
            {
              name: 'LITELLM_LOG'
              value: 'INFO'
            }
            // Model mappings: Map OpenAI model names to Azure deployments
            {
              name: 'MODEL_LIST'
              value: '[{"model_name": "gpt-4o", "litellm_params": {"model": "azure/${gpt4oDeploymentName}", "api_base": "${azureOpenAiEndpoint}", "api_key": "${azureOpenAiApiKey}", "api_version": "${azureOpenAiApiVersion}"}}, {"model_name": "gpt-4o-mini", "litellm_params": {"model": "azure/${gpt4oMiniDeploymentName}", "api_base": "${azureOpenAiEndpoint}", "api_key": "${azureOpenAiApiKey}", "api_version": "${azureOpenAiApiVersion}"}}, {"model_name": "text-embedding-3-small", "litellm_params": {"model": "azure/${embeddingDeploymentName}", "api_base": "${azureOpenAiEndpoint}", "api_key": "${azureOpenAiApiKey}", "api_version": "${azureOpenAiApiVersion}"}}]'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
}

// Outputs
output id string = litellm.id
output name string = litellm.name
output uri string = 'https://${litellm.properties.configuration.ingress.fqdn}'
output fqdn string = litellm.properties.configuration.ingress.fqdn
