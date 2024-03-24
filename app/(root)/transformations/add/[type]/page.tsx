import Header from '@/components/shared/Header'
import { transformationTypes } from '@/constants'

const AddTransformationTypePage = ({ params: { type } }: SearchParamProps) => {
  const { title, subTitle } = transformationTypes[type]

  return (
    <>
      <Header title={title} subtitle={subTitle} />
    </>
  )
}

export default AddTransformationTypePage
