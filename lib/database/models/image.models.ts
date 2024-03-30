import { Document, Schema, model, models } from 'mongoose'

interface Author {
  _id: string
  firstName: string
  lastName: string
}

export interface IImage extends Document {
  title: string
  transformationType: string
  publicId: string
  secureURL: URL
  width?: number
  height?: number
  config?: object
  transformationURL?: URL
  aspectRatio?: string
  color?: string
  prompt?: string
  author: any
  createdAt?: Date
  updateAt?: Date
}

const ImageSchema = new Schema({
  title: { type: String, required: true },
  transformationType: { type: String, required: true },
  publicId: { type: String, required: true },
  secureURL: { type: String, required: true },
  width: { type: Number },
  height: { type: Number },
  config: { type: Object },
  transformationURL: { type: String },
  aspectRatio: { type: String },
  color: { type: String },
  prompt: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
})

const Image = models?.Image || model('Image', ImageSchema)
export default Image
