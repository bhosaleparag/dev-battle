export default function calculateLevel(xp=0){
  const level = Math.floor(xp / 500) + 1;
  const currentXP = xp % 500;
  const nextLevelXP = 500;
  return { level, currentXP, nextLevelXP };
}