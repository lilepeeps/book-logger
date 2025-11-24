import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

export const getTableClient = (tableName: string) => {
  if (!connectionString) {
    // For development without Azure, we could mock this or throw an error.
    // For now, let's warn and assume the user will provide it.
    console.warn("AZURE_STORAGE_CONNECTION_STRING is not set.");
    // Fallback for dev/test if needed, or just let it fail if real connection required.
    // In a real scenario, we might return a mock client here if in dev mode.
  }

  return TableClient.fromConnectionString(connectionString || "UseDevelopmentStorage=true", tableName);
};

export interface BookEntity {
  partitionKey: string; // Author or Genre? Or just "Library"
  rowKey: string; // ISBN or UUID
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
  rating?: number;
  readDate?: string;
  timestamp?: Date;
}
