import Image from 'next/image'

interface BadgeProps {
  name: string
  imageUrl: string
}

export const BadgeDisplay: React.FC<BadgeProps> = ({ name, imageUrl }) => {
  return (
    <div className="flex flex-col items-center p-4 border rounded-lg shadow-lg bg-white hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105">
      <Image src={imageUrl || "/placeholder.svg"} alt={name} width={50} height={50} />
      <span className="text-sm mt-1">{name}</span>
    </div>
  )
}
