import Link from 'next/link'
import Image from 'next/image'

import { CircleUser } from 'lucide-react'
import { getUserInfo } from '@/utils/supabase/actions'
import NavMenu from './NavMenu'
import { cn } from '@/utils/cn'

const Navbar = async () => {
  const user = await getUserInfo()

  return (
    <nav
      className={cn(
        `flex items-center justify-between h-[var(--navbar-height)] top-0 z-40`,
      )}
    >
      <Link href="/">Title</Link>

      <NavMenu />

      <Link className="rounded-full overflow-hidden" href="/profile">
        {user ? (
          <Image
            src={user.image_url || ''}
            alt="user_image"
            width={36}
            height={36}
          />
        ) : (
          <CircleUser className="h-8 w-8 opacity-70" strokeWidth={1.3} />
        )}
      </Link>
    </nav>
  )
}

export default Navbar
