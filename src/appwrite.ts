import Appwrite from "appwrite";

const server = {
    endpoint: import.meta.env.VITE_APP_ENDPOINT,
    project: import.meta.env.VITE_APP_PROJECT,
    collection: import.meta.env.VITE_APP_COLLECTION_ID
}

const sdk = new Appwrite();

sdk.setEndpoint(server.endpoint).setProject(server.project);

export {sdk, server};