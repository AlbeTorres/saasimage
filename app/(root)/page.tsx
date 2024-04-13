import { Collection } from '@/components/shared/Collection'
import { navLinks } from '@/constants'
import { getAllImages } from '@/lib/actions/image.actions'
import Image from 'next/image'
import Link from 'next/link'

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1
  const searchQuery = (searchParams?.query as string) || ''

  const allImages = await getAllImages({ page, searchQuery })

  return (
    <>
      <section className='home'>
        <h1 className='home-heading'>Unleash Your Creative Vision with SmartEditfy</h1>
        <ul className='flex-center w-full gap-20'>
          {navLinks.slice(1, 5).map(link => (
            <Link key={link.route} href={link.route} className='flex-center flex-col gap-2'>
              <li className='flex-center bg-white  dark:bg-slate-300 rounded-full w-fit p-4 '>
                <Image src={link.icon} width={24} height={24} alt='image' />
              </li>
              <p className='p-14-medium text-center text-white  dark:text-slate-300'>
                {link.label}
              </p>
            </Link>
          ))}
        </ul>
      </section>

      <section className='sm:mt-12'>
        <Collection
          totalPages={allImages?.totalPage}
          images={allImages!.data}
          page={page}
          hasSearch={true}
        />
      </section>
    </>
  )
}

export default Home
