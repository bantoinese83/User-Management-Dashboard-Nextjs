interface AchievementProps {
  name: string
  description: string
  points: number
}

export const AchievementDisplay: React.FC<AchievementProps> = ({ name, description, points }) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105">
      <h3 className="font-bold text-lg mb-2">{name}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <span className="text-blue-500 font-semibold">{points} points</span>
    </div>
  )
}
