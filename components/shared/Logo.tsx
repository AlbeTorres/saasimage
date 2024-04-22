import clsx from 'clsx'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Logo = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const val = theme === 'dark'

  if (!mounted) {
    return (
      <div className='flex items-center gap-2 md:py-2 '>
        <Image
          alt='logo'
          priority
          src={'/assets/icons/stars-dark.svg'}
          width={50}
          height={50}
          className='md:w-12 md:h-12 w-6 h-6 animate-pulse'
        />
        <p
          className={
            'animate-pulse bg-slate-300 text-transparent bg-clip-text md:text-4xl text-xl  font-bold'
          }
        >
          SmartEditfy
        </p>
      </div>
    )
  }

  return (
    <Link className='flex items-center gap-2 md:py-2' href={'/'}>
      <Image
        alt='logo'
        priority
        src={val ? '/assets/icons/stars-dark.svg' : '/assets/icons/stars-logo.svg'}
        width={50}
        height={50}
        className='md:w-12 md:h-12 w-6 h-6'
      />
      <p
        className={clsx(
          val ? 'dark:bg-slate-300' : 'bg-purple-gradient',
          'text-transparent bg-clip-text md:text-4xl text-xl  font-bold'
        )}
      >
        SmartEditfy
      </p>
    </Link>
  )
}

export default Logo
