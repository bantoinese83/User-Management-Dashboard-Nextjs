interface AchievementProps {
  name: string
  description: string
  points: number
}

export const AchievementDisplay: React.FC<AchievementProps> = ({ name, description, points }) => {
  return (
    <div className="border p-4 rounded-lg">
      <h3 className="font-bold">{name}</h3>
      <p className="text-sm">{description}</p>
      <span className="text-blue-500">{points} points</span>
    </div>
  )
}

