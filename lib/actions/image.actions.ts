'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Image, { IImage } from '../database/models/image.models'
import User from '../database/models/user.model'
import { connectToDatabase } from '../database/mongoose'
import { handleError } from '../utils'

const populateUser = (query: any) =>
  query.populate({
    path: 'author',
    model: 'User',
    select: '_id firstName lastName',
  })

// Add Image
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await connectToDatabase()

    const author = await User.findById(userId)
    console.log(author)

    if (!author) {
      throw new Error('User not found')
    }

    const newImage = await Image.create({
      ...image,
      author: author._id,
    })

    revalidatePath(path)
    return JSON.parse(JSON.stringify(newImage))
  } catch (error) {
    handleError(error)
  }
}

//Update Image
export async function updateImage({ image, userId, path }: UpdateImageParams) {
  try {
    await connectToDatabase()

    const imageToUpdate = await Image.findById<IImage>(image._id)
    console.log(imageToUpdate)
    if (!imageToUpdate || imageToUpdate.author !== userId) {
      throw new Error('Unautorized or Image not found')
    }

    const updateImage = await Image.findByIdAndUpdate(imageToUpdate._id, image, { new: true })

    revalidatePath(path)
    return JSON.parse(JSON.stringify(updateImage))
  } catch (error) {
    handleError(error)
  }
}

//Deleted Image
export async function deleteImage(imageId: string) {
  try {
    await connectToDatabase()

    await Image.findByIdAndDelete<IImage>(imageId)
  } catch (error) {
    handleError(error)
  } finally {
    redirect('/')
  }
}

export async function getImageById(imageId: string) {
  try {
    await connectToDatabase()

    const image = await populateUser(Image.findById(imageId))

    if (!image) throw new Error('Image not found')

    return JSON.parse(JSON.stringify(image))
  } catch (error) {
    handleError(error)
  }
}