import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm'
import { transformationTypes } from '@/constants'
import { getUserById } from '@/lib/actions/user.actions'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const AddTransformationTypePage = async ({ params: { type } }: SearchParamProps) => {
  const { userId } = auth()
  const transformation = transformationTypes[type]
  const { title, subTitle } = transformation

  if (!userId) redirect('/sign-in')

  const user = await getUserById(userId)

  return (
    <>
      <Header title={title} subtitle={subTitle} />
      <section className='mt-10'>
        <TransformationForm
          userId={user?._id}
          action='Add'
          type={transformation.type as TransformationTypeKey}
          creditBalance={user?.creditBalance || 0}
        />
      </section>
    </>
  )
}

export default AddTransformationTypePage
