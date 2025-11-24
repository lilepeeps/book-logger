# Script to provision Azure Static Web App and get deployment token

$resourceGroupName = "book-logger-rg"
$location = "westeurope" # Change as needed
$appName = "book-logger-app"
$repoUrl = "https://github.com/lilepeeps/book-logger"

# Login if not already logged in
# az login

# Create Resource Group
Write-Host "Creating Resource Group '$resourceGroupName'..."
az group create --name $resourceGroupName --location $location

# Create Static Web App
Write-Host "Creating Static Web App '$appName'..."
az staticwebapp create --name $appName --resource-group $resourceGroupName --source $repoUrl --location $location --branch main --login-with-github

# Get Deployment Token
Write-Host "Retrieving Deployment Token..."
$token = az staticwebapp secrets list --name $appName --resource-group $resourceGroupName --query "properties.apiKey" -o tsv

Write-Host "--------------------------------------------------"
Write-Host "Deployment Token: $token"
Write-Host "--------------------------------------------------"
Write-Host "1. Go to your GitHub Repo -> Settings -> Secrets and variables -> Actions"
Write-Host "2. Create a New Repository Secret named 'AZURE_STATIC_WEB_APPS_API_TOKEN'"
Write-Host "3. Paste the token above as the value."
Write-Host "4. Push this change to trigger the workflow!"
