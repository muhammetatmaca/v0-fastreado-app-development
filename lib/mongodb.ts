import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment")
}

const uri = process.env.MONGODB_URI

let client = new MongoClient(uri)
let clientPromise: Promise<MongoClient> = client.connect()

export default clientPromise
