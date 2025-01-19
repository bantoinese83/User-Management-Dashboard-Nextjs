import Image from 'next/image'

interface BadgeProps {
  name: string
  imageUrl?: string
}

export const BadgeDisplay: React.FC<BadgeProps> = ({ name, imageUrl }) => {
  return (
    <div className="flex flex-col items-center">
      {imageUrl ? (
        <Image src={imageUrl} alt={name} width={50} height={50} />
      ) : (
        <Image src="/placeholder.svg" alt="Placeholder" width={50} height={50} />
      )}
      <span className="text-sm mt-1">{name}</span>
    </div>
  )
}
