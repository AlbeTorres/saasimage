'use client'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  const { theme, setTheme } = useTheme()

  const val = theme === 'dark'
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
