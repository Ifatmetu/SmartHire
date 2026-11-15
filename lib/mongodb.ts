import { setServers as setDnsServers } from "node:dns/promises"
import { MongoClient } from "mongodb"

const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(",")
  .map((server) => server.trim())
  .filter(Boolean)

if (dnsServers?.length) {
  setDnsServers(dnsServers)
}

const mongodbUri = process.env.BETTER_AUTH_MONGODB_URI

if (!mongodbUri) {
  throw new Error("BETTER_AUTH_MONGODB_URI is not set")
}

// MongoDB client reuse across hot reloads in development.
const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient
}

export const mongoClient =
  globalForMongo.mongoClient ?? new MongoClient(mongodbUri)

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient
}

export const db = mongoClient.db("SmartHiredb")
