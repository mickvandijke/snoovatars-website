export function getMintClasses(totalQuantity: number) {
  if (totalQuantity <= 75) {
    return ["bg-sky-400"];
  } else if (totalQuantity <= 250) {
    return ["bg-yellow-300"];
  } else if (totalQuantity <= 777) {
    return ["bg-gray-300"];
  } else if (totalQuantity <= 5000) {
    return ["bg-orange-300"];
  } else {
    return ["bg-red-500"];
  }
}

export function getMintClassesText(totalQuantity: number) {
  if (totalQuantity <= 75) {
    return ["text-sky-400"];
  } else if (totalQuantity <= 250) {
    return ["text-yellow-300"];
  } else if (totalQuantity <= 777) {
    return ["text-gray-300"];
  } else if (totalQuantity <= 5000) {
    return ["text-orange-300"];
  } else {
    return ["text-red-500"];
  }
}

export interface RarityInfo {
  tier: 'rare' | 'gold' | 'silver' | 'common';
  icon: string;
  color: string;
  label: string;
}

export function getRarityInfo(totalQuantity: number): RarityInfo {
  if (totalQuantity < 100) {
    return {
      tier: 'rare',
      icon: '💎',
      color: 'text-blue-400',
      label: 'Rare'
    };
  } else if (totalQuantity <= 200) {
    return {
      tier: 'gold',
      icon: '🔶',
      color: 'text-yellow-400',
      label: 'Gold'
    };
  } else if (totalQuantity <= 600) {
    return {
      tier: 'silver',
      icon: '🪙',
      color: 'text-gray-300',
      label: 'Silver'
    };
  } else {
    return {
      tier: 'common',
      icon: '⬛',
      color: 'text-gray-500',
      label: 'Common'
    };
  }
}
