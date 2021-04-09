import Appwrite from "appwrite";

const sdk = new Appwrite();

sdk.setEndpoint("https://demo.appwrite.io/v1").setProject("6062f9c2c09ce");

export {sdk};