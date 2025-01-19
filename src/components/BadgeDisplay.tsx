import Image from 'next/image'

interface BadgeProps {
  name: string
  imageUrl: string
}

export const BadgeDisplay: React.FC<BadgeProps> = ({ name, imageUrl }) => {
  return (
    <div className="flex flex-col items-center">
      <Image src={imageUrl || "/placeholder.svg"} alt={name} width={50} height={50} />
      <span className="text-sm mt-1">{name}</span>
    </div>
  )
}

