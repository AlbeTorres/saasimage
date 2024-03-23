import { Document, Schema, model, models } from 'mongoose'

interface IUser extends Document {
  clerkId: string
  email: string
  username: string
  photo: URL
  firstName: string
  lastName: string
  planId: string
  creditBalance: string
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  photo: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  planId: { type: String },
  creditBalance: { type: Number },
})

const User = models?.User || model('User', UserSchema)
export default User
