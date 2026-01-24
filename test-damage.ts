// Test para verificar la lógica de daño de tipos
// Charjabug: Bicho/Eléctrico

import { TYPE_OFFENSIVE } from "@/lib/typeData";

const calculateDamage = (attackType: string, defendTypes: string[]): number => {
  let multiplier = 1;
  const offensiveData = TYPE_OFFENSIVE[attackType as keyof typeof TYPE_OFFENSIVE];

  if (!offensiveData) return 1;

  // Calcular daño contra cada tipo del Pokémon defensor
  for (const defendType of defendTypes) {
    // Si el tipo atacante es superefectivo contra este tipo defensivo, 2x
    if (offensiveData.superEffectiveAgainst.includes(defendType)) {
      multiplier *= 2;
    } else {
      // Verificar si este tipo defensivo resiste al tipo atacante
      // Para eso, buscamos si el tipo atacante es superefectivo contra el que lo resiste
      const defendTypeOffensive = TYPE_OFFENSIVE[defendType as keyof typeof TYPE_OFFENSIVE];
      if (defendTypeOffensive && defendTypeOffensive.superEffectiveAgainst.includes(attackType)) {
        // El tipo defensivo es superefectivo contra el atacante = resistencia
        multiplier *= 0.5;
      }
    }
  }

  return multiplier;
};

// Test: Charjabug (bug, electric)
const charjabugTypes = ["bug", "electric"];

console.log("Testing Charjabug (bug/electric):");
console.log("Tierra (ground) vs Charjabug:", calculateDamage("ground", charjabugTypes)); // Should be 2x
console.log("Fuego (fire) vs Charjabug:", calculateDamage("fire", charjabugTypes)); // Should be 2x
console.log("Roca (rock) vs Charjabug:", calculateDamage("rock", charjabugTypes)); // Should be 2x
console.log("Agua (water) vs Charjabug:", calculateDamage("water", charjabugTypes)); // Should be 1x

// Expected: ground, fire, rock all do 2x damage
// So we need to pick ONE as the correct answer
