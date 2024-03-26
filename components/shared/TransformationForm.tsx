'use client'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { aspectRatioOptions, defaultValues, transformationTypes } from '@/constants'
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
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils'
import { useState, useTransition } from 'react'

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
})

const TransformationForm = ({
  action,
  data = null,
  type,
  userId,
  creditBalance,
  config = null,
}: TransformationFormProps) => {
  const [image, setImage] = useState(data)
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)
  const [isSubmitting, setNewSubmitting] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformationConfig, setTransformationConfig] = useState(config)
  const [isPending, startTransition] = useTransition()

  const transformationType = transformationTypes[type]

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
      aspectRation: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }))

    setNewTransformation(transformationType.config)

    return onChangeField(value)
  }

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
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
      onChangeField(value)
    }, 1000)
  }

  //Todo
  const onTransformHandler = async () => {
    setIsTransforming(true)
    setTransformationConfig(deepMergeObjects(newTransformation, transformationConfig))
    setNewTransformation(null)

    startTransition(async () => {})
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
              <Select onValueChange={value => onSelectFieldHandler(value, field.onChange)}>
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
        <div className='flex flex-col lg:flex-row gap-4 w-full justify-end'>
          <Button
            onClick={onTransformHandler}
            disabled={isTransforming || newTransformation === null}
            className='submit-button capitalize'
            type='button'
          >
            {isTransforming ? 'Transforming...' : 'Apply Transformation'}
          </Button>
          <Button disabled={isSubmitting} className='submit-button capitalize' type='submit'>
            {isSubmitting ? 'Submitting...' : 'Save Image'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default TransformationForm
