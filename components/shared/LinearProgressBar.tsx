'use client'

export default function LinearProgressBar() {
  return (
    <div className='bg-neutral-200 relative overflow-hidden h-full'>
      <div className='animate-indeterminate-progress-bar absolute bg-purplegardient w-1/2 h-full'></div>
    </div>
  )
}
