'use client'
import { navLinks } from '@/constants'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import Logo from './Logo'
import ToggleMode from './ToggleMode'

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className='hidden lg:block p-5 w-72'>
      <Logo />

      <nav className='sidebar-nav'>
        <SignedIn>
          <ul className='sidebar-nav_elements'>
            {navLinks.slice(0, 6).map(link => {
              const isActive = link.route === pathname
              return (
                <li
                  key={link.route}
                  className={`sidebar-nav_element group  ${
                    isActive
                      ? 'bg-purple-gradient dark:bg-purplegardient dark:text-slate-300 text-white'
                      : ' text-gray-700 dark:text-slate-300 dark:hover:text-purple-600 hover:text-purple-600'
                  }`}
                >
                  <Link className='sidebar-link' href={link.route}>
                    <Image
                      src={link.icon}
                      alt='nav-icon'
                      width={24}
                      height={24}
                      className={`${isActive && 'brightness-200'}`}
                    />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <ul className='sidebar-nav_elements'>
            {navLinks.slice(6).map(link => {
              const isActive = link.route === pathname
              return (
                <li
                  key={link.route}
                  className={`sidebar-nav_element group  ${
                    isActive
                      ? 'bg-purple-gradient text-white  dark:bg-purplegardient dark:text-slate-300'
                      : ' text-gray-700 hover:text-purple-600  dark:text-slate-300 dark:hover:text-purple-600'
                  }`}
                >
                  <Link className='sidebar-link' href={link.route}>
                    <Image
                      src={link.icon}
                      alt='nav-icon'
                      width={24}
                      height={24}
                      className={`${isActive && 'brightness-200'}`}
                    />
                    {link.label}
                  </Link>
                </li>
              )
            })}
            <ToggleMode />
            <li className='flex-center gap-2 p-4 cursor-pointer'>
              <UserButton afterSignOutUrl='/' showName />
            </li>
          </ul>
        </SignedIn>
        <SignedOut>
          <Button
            asChild
            className='button bg-purple-gradient dark:bg-purplegardient dark:text-slate-300 bg-cover'
          >
            <Link href={'/sign-in'}>Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </aside>
  )
}

export default Sidebar
