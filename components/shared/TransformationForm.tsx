'use client'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from '@/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CustomField } from './CustomField'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addImage, updateImage } from '@/lib/actions/image.actions'
import { updateCredits } from '@/lib/actions/user.actions'
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils'
import { getCldImageUrl } from 'next-cloudinary'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { InsufficientCreditsModal } from './InsufficientCreditsModal'
import MediaUploader from './MediaUploader'
import TransformedImage from './TransformedImage'

export const formSchema = z.object({
  title: z
    .string({
      required_error: 'This field is required.',
    })
    .min(1, { message: 'This field is required' }),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string().min(1, { message: 'This field is required' }),
})

const TransformationForm = ({
  action,
  data = null,
  type,
  userId,
  creditBalance,
  config = null,
}: TransformationFormProps) => {
  const [image, setImage] = useState<CloudinaryImage | null>(data)
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformationConfig, setTransformationConfig] = useState(config)
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const transformationType = transformationTypes[type]

  let showTransformationButton = false

  if (action === 'Add') {
    showTransformationButton = true
  } else if (
    transformationType.type !== 'removeBackground' &&
    transformationType.type !== 'restore'
  ) {
    showTransformationButton = true
  }

  const initialValues =
    data && action === 'Update'
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })

  const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey]

    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }))

    setNewTransformation(transformationType.config)

    return onChangeField(value)
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    if (data || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image!.publicId,
        ...transformationConfig,
      })

      const imageData = {
        title: values.title,
        publicId: image!.publicId,
        transformationType: type,
        width: image!.width,
        height: image!.height,
        config: transformationConfig,
        secureURL: image!.secureURL,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      }

      if (action === 'Add') {
        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: '/',
          })

          if (newImage) {
            form.reset()
            setImage(data)
            router.push(`/transformations/${newImage._id}`)
          }
        } catch (error) {
          console.log(error)
        }
      }

      if (action === 'Update') {
        try {
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data._id,
            },
            userId,
            path: `/transformations/${data._id}`,
          })

          if (updatedImage) {
            router.push(`/transformations/${updatedImage._id}`)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    setIsSubmitting(false)
  }

  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]: { ...prevState?.[type], [fieldName === 'prompt' ? 'prompt' : 'to']: value },
      }))
    }, 1000)()
    return onChangeField(value)
  }

  //Todo
  const onTransformHandler = async () => {
    setIsTransforming(true)
    setTransformationConfig(deepMergeObjects(newTransformation, transformationConfig))
    setNewTransformation(null)

    startTransition(async () => {
      await updateCredits(userId, creditFee)
    })
  }

  useEffect(() => {
    if (image && (type === 'restore' || type === 'removeBackground')) {
      setNewTransformation(transformationType.config)
    }
  }, [image, transformationType.config, type])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
        <CustomField
          control={form.control}
          name='title'
          formLabel='Image Title'
          className='w-full'
          render={({ field }) => <Input className='input-field' {...field} />}
        />
        {type === 'fill' && (
          <CustomField
            control={form.control}
            name='aspectRatio'
            formLabel='Aspect Ratio'
            className='w-full'
            render={({ field }) => (
              <Select
                onValueChange={value => onSelectFieldHandler(value, field.onChange)}
                value={field.value}
              >
                <SelectTrigger className='select-field'>
                  <SelectValue placeholder='Select size' />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map(key => (
                    <SelectItem key={key} value={key} className='select-item'>
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === 'remove' || type === 'recolor') && (
          <div className='prompt-field'>
            <CustomField
              control={form.control}
              name='prompt'
              formLabel={type === 'remove' ? 'Object to remove' : 'Object to recolor'}
              className='w-full'
              render={({ field }) => (
                <Input
                  className='input-field'
                  value={field.value}
                  onChange={e =>
                    onInputChangeHandler('prompt', e.target.value, type, field.onChange)
                  }
                />
              )}
            />
          </div>
        )}
        {type === 'recolor' && (
          <div className='prompt-field'>
            <CustomField
              control={form.control}
              name='color'
              formLabel={'Replacement Color'}
              className='w-full'
              render={({ field }) => (
                <Input
                  className='input-field'
                  value={field.value}
                  onChange={e =>
                    onInputChangeHandler('color', e.target.value, 'recolor', field.onChange)
                  }
                />
              )}
            />
          </div>
        )}

        <div className='media-uploader-field'>
          <CustomField
            control={form.control}
            name='publicId'
            className='flex size-full flex-col'
            render={({ field }) => (
              <MediaUploader
                image={image}
                setImage={setImage}
                publicId={field.value}
                onValueChange={field.onChange}
                type={type}
              />
            )}
          />

          <TransformedImage
            image={image}
            type={type}
            title={form.getValues('title')}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
            hasDownload={false}
          />
        </div>

        <div className='flex flex-col lg:flex-row gap-4 w-full justify-end'>
          <Button
            onClick={onTransformHandler}
            disabled={isTransforming || newTransformation === null || !showTransformationButton}
            className=' bg-purple-gradient dark:bg-purplegardient dark:text-slate-300 bg-cover rounded-md py-4 px-6 p-16-semibold h-[50px] w-full md:w-fit md:h-[54px] capitalize'
            type='button'
          >
            {isTransforming ? 'Transforming...' : 'Apply Transformation'}
          </Button>

          <Button
            disabled={isSubmitting || transformationConfig === null}
            className=' bg-purple-gradient dark:bg-purplegardient dark:text-slate-300 bg-cover rounded-md py-4 px-6 p-16-semibold h-[50px] w-full md:w-fit md:h-[54px] capitalize'
            type='submit'
          >
            {isSubmitting ? 'Submitting...' : 'Save Image'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default TransformationForm
