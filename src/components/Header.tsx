'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { usePreferences } from '../contexts/PreferencesContext'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { colorFormat, setColorFormat } = usePreferences()

  return (
    <header className="shadow-md bg-white">
      <div className="px-4 py-3 flex items-center justify-between container">
        <div className="flex items-center gap-4">
          {pathname !== '/' && (
            <button
              onClick={() => router.back()}
              className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          )}
          <Link href="/" className="text-xl font-semibold">
            Paletto
          </Link>
        </div>

        <select
          value={colorFormat}
          onChange={(e) =>
            setColorFormat(e.target.value as 'hex' | 'rgb' | 'hsl')
          }
          className="px-3 py-1 border rounded-md bg-white"
        >
          <option value="hex">HEX</option>
          <option value="rgb">RGB</option>
          <option value="hsl">HSL</option>
        </select>
      </div>
    </header>
  )
}
