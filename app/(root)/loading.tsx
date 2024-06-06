import LinearProgressBar from '@/components/shared/LinearProgressBar'

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='fixed left-0 top-0 z-[100] h-0.5 w-full'>
      <LinearProgressBar />
    </div>
  )
}
