'use client'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { navLinks } from '@/constants'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import Logo from './Logo'

const MobileSidebar = () => {
  const pathname = usePathname()
  return (
    <header className='header'>
      <Logo />
      <nav className='flex gap-2'>
        <SignedIn>
          <UserButton afterSignOutUrl='/' />

          <Sheet>
            <SheetTrigger>
              <Image
                alt='menu'
                src={'/assets/icons/menu.svg'}
                width={32}
                height={32}
                className='menu-pointer'
              />
            </SheetTrigger>
            <SheetContent>
              <Image src={'/assets/images/logo-text.svg'} alt='logo' width={152} height={23} />
              <nav className='h-[95%] flex justify-between flex-col'>
                <SignedIn>
                  <ul className='header-nav_elements'>
                    {navLinks.slice(0, 6).map(link => {
                      const isActive = link.route === pathname
                      return (
                        <li
                          key={link.route}
                          className={`sidebar-nav_element group  ${
                            isActive
                              ? 'text-purple-600'
                              : ' text-gray-700 dark:text-slate-300 hover:text-purple-600'
                          }`}
                        >
                          <Link className='sidebar-link' href={link.route}>
                            <Image src={link.icon} alt='nav-icon' width={24} height={24} />
                            {link.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                  <ul className='header-nav_elements'>
                    {navLinks.slice(6).map(link => {
                      const isActive = link.route === pathname
                      return (
                        <li
                          key={link.route}
                          className={`sidebar-nav_element group  ${
                            isActive
                              ? 'text-purple-600'
                              : ' text-gray-700 dark:text-slate-300 hover:text-purple-600'
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
                </SignedIn>
              </nav>
            </SheetContent>
          </Sheet>
        </SignedIn>
        <SignedOut>
          <Button asChild className='button bg-purple-gradient bg-cover'>
            <Link href={'/sign-in'}>Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  )
}

export default MobileSidebar
