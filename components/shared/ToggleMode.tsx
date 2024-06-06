'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

const ToggleMode = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant={'secondary'} size={'icon'} disabled />
  }

  const dark = theme === 'dark'

  return (
    <Button
      className='lg:w-full lg:h-fit h-10 w-10 lg:!py-4'
      variant={'secondary'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      {dark ? (
        <div className='lg:flex lg:items-center lg:gap-4 lg:w-full'>
          <Sun /> <p className='hidden lg:block'>Light mode</p>
        </div>
      ) : (
        <div className='lg:flex lg:items-center lg:gap-4 lg:w-full'>
          <Moon /> <p className='hidden lg:block'>Dark mode</p>
        </div>
      )}
    </Button>
  )
}

export default ToggleMode
