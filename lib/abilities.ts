// Diccionario completo de habilidades en español con descripciones
// Fuente ÚNICA: Wikidex (https://www.wikidex.net/wiki/Lista_de_habilidades)
export const ABILITIES_COMPLETE: Record<string, {name: string; description: string}> = {
  "stench": {
    name: "Hedor",
    description: "Puede amedrentar a un Pokémon al atacarlo debido al mal olor que emana."
  },
  "drizzle": {
    name: "Llovizna",
    description: "Hace que llueva al entrar en combate."
  },
  "speed-boost": {
    name: "Impulso",
    description: "Aumenta su velocidad en cada turno."
  },
  "battle-armor": {
    name: "Armadura batalla",
    description: "La robusta coraza que lo protege bloquea los golpes críticos."
  },
  "sturdy": {
    name: "Robustez",
    description: "El Pokémon no puede debilitarse de un solo golpe cuando tiene los PS al máximo. También evita los movimientos fulminantes."
  },
  "damp": {
    name: "Humedad",
    description: "Aumenta la humedad del entorno y evita que se puedan utilizar movimientos explosivos, tales como autodestrucción."
  },
  "limber": {
    name: "Flexibilidad",
    description: "Evita ser paralizado gracias a la flexibilidad de su cuerpo."
  },
  "sand-veil": {
    name: "Velo arena",
    description: "Aumenta su evasión durante las tormentas de arena."
  },
  "static": {
    name: "Electricidad estática",
    description: "La electricidad estática que lo envuelve puede paralizar al Pokémon que lo ataque con un movimiento de contacto."
  },
  "volt-absorb": {
    name: "Absorbe electricidad",
    description: "Si lo alcanza un movimiento de tipo eléctrico, recupera PS en vez de sufrir daño."
  },
  "water-absorb": {
    name: "Absorbe agua",
    description: "Si lo alcanza un movimiento de tipo agua, recupera PS en vez de sufrir daño."
  },
  "oblivious": {
    name: "Despiste",
    description: "Su indiferencia evita que sea provocado, caiga presa del enamoramiento o sufra los efectos de intimidación."
  },
  "cloud-nine": {
    name: "Aclimatación",
    description: "Anula todos los efectos del tiempo atmosférico."
  },
  "compound-eyes": {
    name: "Ojo compuesto",
    description: "Aumenta la precisión de sus movimientos."
  },
  "insomnia": {
    name: "Insomnio",
    description: "Su resistencia al sueño le impide quedarse dormido."
  },
  "color-change": {
    name: "Cambio de color",
    description: "Adopta el tipo del último movimiento del que es blanco."
  },
  "immunity": {
    name: "Inmunidad",
    description: "Su sistema inmunitario evita el envenenamiento."
  },
  "flash-fire": {
    name: "Absorbefuego",
    description: "Si lo alcanza algún movimiento de tipo fuego, potencia sus propios movimientos de dicho tipo."
  },
  "shield-dust": {
    name: "Polvo escudo",
    description: "El polvo de escamas que lo envuelve lo protege de los efectos secundarios de los ataques recibidos."
  },
  "own-tempo": {
    name: "Ritmo propio",
    description: "Como le gusta hacer las cosas a su manera, no le afecta la confusión ni sufre los efectos de intimidación."
  },
  "suction-cups": {
    name: "Ventosas",
    description: "Sus ventosas se aferran al suelo, con lo cual anula movimientos y objetos que fuercen el cambio de Pokémon."
  },
  "intimidate": {
    name: "Intimidación",
    description: "Al entrar en combate, amilana al rival de tal manera que reduce su ataque."
  },
  "shadow-tag": {
    name: "Sombra trampa",
    description: "Pisa la sombra del rival para impedir que huya o lo cambien por otro."
  },
  "rough-skin": {
    name: "Piel tosca",
    description: "Hiere con su piel áspera al Pokémon que lo ataque con un movimiento de contacto."
  },
  "wonder-guard": {
    name: "Superguardia",
    description: "Gracias a un poder misterioso, solo le hacen daño los movimientos supereficaces."
  },
  "levitate": {
    name: "Levitación",
    description: "Su capacidad de flotar sobre el suelo le proporciona inmunidad frente a los movimientos de tipo tierra."
  },
  "effect-spore": {
    name: "Efecto espora",
    description: "Puede dormir, envenenar o paralizar al Pokémon que lo ataque con un movimiento de contacto."
  },
  "synchronize": {
    name: "Sincronía",
    description: "Contagia el envenenamiento, las quemaduras o la parálisis al Pokémon que le cause ese estado."
  },
  "clear-body": {
    name: "Cuerpo puro",
    description: "Evita que se reduzcan sus características a causa de movimientos o habilidades de otros Pokémon."
  },
  "natural-cure": {
    name: "Curación natural",
    description: "Sus problemas de estado desaparecen cuando se retira del combate."
  },
  "lightning-rod": {
    name: "Pararrayos",
    description: "Atrae y neutraliza los movimientos de tipo eléctrico, que además le aumentan el ataque especial."
  },
  "serene-grace": {
    name: "Dicha",
    description: "Aumenta la probabilidad de que los movimientos causen efectos secundarios."
  },
  "swift-swim": {
    name: "Nado rápido",
    description: "Aumenta su velocidad cuando llueve."
  },
  "chlorophyll": {
    name: "Clorofila",
    description: "Aumenta su velocidad cuando hace sol."
  },
  "illuminate": {
    name: "Iluminación",
    description: "Al iluminar el entorno, evita que su precisión se reduzca."
  },
  "trace": {
    name: "Calco",
    description: "Copia la habilidad del rival al entrar en combate."
  },
  "huge-power": {
    name: "Potencia",
    description: "Duplica la potencia de sus ataques físicos."
  },
  "poison-point": {
    name: "Punto tóxico",
    description: "Puede envenenar al Pokémon que lo ataque con un movimiento de contacto."
  },
  "inner-focus": {
    name: "Fuerza mental",
    description: "Gracias a su profunda concentración, no se amedrenta ante los ataques de otros Pokémon ni sufre los efectos de intimidación."
  },
  "magma-armor": {
    name: "Escudo de magma",
    description: "Gracias al magma candente que lo envuelve, no puede ser congelado."
  },
  "water-veil": {
    name: "Velo de agua",
    description: "Evita las quemaduras gracias a la capa de agua que lo envuelve."
  },
  "magnet-pull": {
    name: "Imán",
    description: "Su magnetismo atrae a los Pokémon de tipo acero y les impide huir o ser cambiados por otros."
  },
  "soundproof": {
    name: "Insonorización",
    description: "Su aislamiento acústico lo protege de movimientos que usan sonido."
  },
  "rain-dish": {
    name: "Cura lluvia",
    description: "Recupera PS de forma gradual cuando llueve."
  },
  "sand-stream": {
    name: "Chorro arena",
    description: "Crea una tormenta de arena al entrar en combate."
  },
  "pressure": {
    name: "Presión",
    description: "Presiona al rival de tal manera que este consume más PP al usar sus movimientos."
  },
  "thick-fat": {
    name: "Sebo",
    description: "Gracias a la gruesa capa de grasa que lo protege, reduce a la mitad el daño que recibe de ataques de tipo fuego o hielo."
  },
  "early-bird": {
    name: "Madrugador",
    description: "Si se duerme, tardará la mitad de tiempo en despertarse."
  },
  "flame-body": {
    name: "Cuerpo de fuego",
    description: "Puede quemar al Pokémon que lo ataque con un movimiento de contacto."
  },
  "run-away": {
    name: "Fuga",
    description: "Puede escapar de cualquier Pokémon salvaje."
  },
  "keen-eye": {
    name: "Vista lince",
    description: "Su aguda vista evita que su precisión se reduzca."
  },
  "hyper-cutter": {
    name: "Corte fuerte",
    description: "Evita que otros Pokémon le reduzcan el ataque."
  },
  "pickup": {
    name: "Recogida",
    description: "Puede recoger objetos que otros Pokémon hayan usado, o bien aquellos que encuentre en plena aventura."
  },
  "truant": {
    name: "Ausente",
    description: "Al ejecutar un movimiento, descansará en el turno siguiente."
  },
  "hustle": {
    name: "Entusiasmo",
    description: "Aumenta su ataque, pero reduce su precisión."
  },
  "cute-charm": {
    name: "Gran encanto",
    description: "Puede causar enamoramiento al Pokémon que lo ataque con un movimiento de contacto."
  },
  "plus": {
    name: "Más",
    description: "Aumenta su ataque especial si un Pokémon aliado tiene la habilidad más o la habilidad menos."
  },
  "minus": {
    name: "Menos",
    description: "Aumenta su ataque especial si un Pokémon aliado tiene la habilidad más o la habilidad menos."
  },
  "forecast": {
    name: "Predicción",
    description: "Cambia a tipo agua, fuego o hielo en función del tiempo atmosférico."
  },
  "sticky-hold": {
    name: "Viscosidad",
    description: "Los objetos se quedan pegados a su cuerpo, por lo que no pueden robárselos."
  },
  "shed-skin": {
    name: "Mudar",
    description: "Puede curar sus problemas de estado al mudar la piel."
  },
  "guts": {
    name: "Agallas",
    description: "Si sufre un problema de estado, se arma de valor y aumenta su ataque."
  },
  "marvel-scale": {
    name: "Escama especial",
    description: "Si sufre un problema de estado, sus escamas especiales reaccionan y aumenta su defensa."
  },
  "liquid-ooze": {
    name: "Toxisecreción",
    description: "Exuda una secreción viscosa y tóxica de intenso hedor que hiere a quienes intentan drenarle PS."
  },
  "overgrow": {
    name: "Espesura",
    description: "Potencia sus movimientos de tipo planta cuando le quedan pocos PS."
  },
  "blaze": {
    name: "Mar de llamas",
    description: "Potencia sus movimientos de tipo fuego cuando le quedan pocos PS."
  },
  "torrent": {
    name: "Torrente",
    description: "Potencia sus movimientos de tipo agua cuando le quedan pocos PS."
  },
  "swarm": {
    name: "Enjambre",
    description: "Potencia sus movimientos de tipo bicho cuando le quedan pocos PS."
  },
  "rock-head": {
    name: "Cabeza roca",
    description: "No pierde PS al usar movimientos que también hieren al usuario."
  },
  "drought": {
    name: "Sequía",
    description: "El tiempo pasa a ser soleado al entrar en combate."
  },
  "arena-trap": {
    name: "Trampa de arena",
    description: "Evita que el rival huya o sea cambiado por otro."
  },
  "vital-spirit": {
    name: "Espíritu vital",
    description: "Su determinación le impide quedarse dormido."
  },
  "white-smoke": {
    name: "Humo blanco",
    description: "El humo blanco que lo protege evita que otros Pokémon le reduzcan las características."
  },
  "pure-power": {
    name: "Energía pura",
    description: "Duplica la potencia de sus ataques físicos gracias al yoga."
  },
  "shell-armor": {
    name: "Caparazón",
    description: "La robusta coraza que lo protege bloquea los golpes críticos."
  },
  "air-lock": {
    name: "Esclusa de aire",
    description: "Neutraliza todos los efectos del tiempo atmosférico."
  },
  "tangled-feet": {
    name: "Tambaleo",
    description: "Aumenta su evasión si está confuso."
  },
  "motor-drive": {
    name: "Electromotor",
    description: "Si le alcanza un movimiento de tipo eléctrico, aumenta su velocidad en vez de sufrir daño."
  },
  "rivalry": {
    name: "Rivalidad",
    description: "Si el objetivo es del mismo sexo, su competitividad le lleva a infligir más daño. Si es del sexo contrario, en cambio, el daño será menor."
  },
  "steadfast": {
    name: "Impasible",
    description: "Cada vez que se amedrenta, aumenta su velocidad debido a su voluntad inquebrantable."
  },
  "snow-cloak": {
    name: "Manto níveo",
    description: "Aumenta su evasión cuando nieva."
  },
  "gluttony": {
    name: "Gula",
    description: "Cuando sus PS se ven reducidos a la mitad, engulle la baya que normalmente solo se comería cuando le quedasen pocos PS."
  },
  "anger-point": {
    name: "Irascible",
    description: "Si recibe un golpe crítico, monta en cólera y su ataque aumenta al máximo."
  },
  "unburden": {
    name: "Liviano",
    description: "Aumenta su velocidad si usa o pierde el objeto que lleva."
  },
  "heatproof": {
    name: "Ignífugo",
    description: "Su cuerpo, resistente al calor, reduce a la mitad el daño recibido por movimientos de tipo fuego."
  },
  "simple": {
    name: "Simple",
    description: "Duplica los cambios en las características."
  },
  "dry-skin": {
    name: "Piel seca",
    description: "Pierde PS si hace sol y los recupera si llueve o recibe un movimiento de tipo agua. Los movimientos de tipo fuego, por su parte, le hacen más daño de lo normal."
  },
  "download": {
    name: "Descarga",
    description: "Compara la defensa y la defensa especial del rival para ver cuál es inferior y aumenta su propio ataque o ataque especial según sea lo más eficaz."
  },
  "iron-fist": {
    name: "Puño férreo",
    description: "Aumenta la potencia de los movimientos con los puños."
  },
  "poison-heal": {
    name: "Antídoto",
    description: "Si resulta envenenado, recupera PS en vez de perderlos."
  },
  "adaptability": {
    name: "Adaptable",
    description: "Potencia aún más los movimientos cuyo tipo coincida con el suyo."
  },
  "skill-link": {
    name: "Encadenado",
    description: "Ejecuta siempre los movimientos de ataque múltiple con el número máximo de golpes."
  },
  "hydration": {
    name: "Hidratación",
    description: "Cura los problemas de estado si está lloviendo."
  },
  "solar-power": {
    name: "Poder solar",
    description: "Si hace sol, aumenta su ataque especial, pero pierde PS en cada turno."
  },
  "quick-feet": {
    name: "Pies rápidos",
    description: "Aumenta su velocidad si sufre problemas de estado."
  },
  "normalize": {
    name: "Normalidad",
    description: "Hace que todos sus movimientos se vuelvan de tipo normal y aumenta ligeramente su potencia."
  },
  "sniper": {
    name: "Puntería",
    description: "Potencia los golpes críticos que asesta aún más de lo normal."
  },
  "magic-guard": {
    name: "Muro mágico",
    description: "Solo recibe daño de ataques."
  },
  "no-guard": {
    name: "Indefenso",
    description: "Al quedar ambos expuestos, tanto sus movimientos como los del Pokémon que lo ataque acertarán siempre."
  },
  "stall": {
    name: "Rezagado",
    description: "Ejecuta su movimiento tras todos los demás."
  },
  "technician": {
    name: "Experto",
    description: "Aumenta la potencia de sus movimientos débiles."
  },
  "leaf-guard": {
    name: "Defensa hoja",
    description: "Evita los problemas de estado si hace sol."
  },
  "klutz": {
    name: "Torpeza",
    description: "No puede usar objetos equipados."
  },
  "mold-breaker": {
    name: "Rompemoldes",
    description: "Sus movimientos no se ven afectados por la habilidad del objetivo."
  },
  "super-luck": {
    name: "Afortunado",
    description: "Su buena suerte aumenta la probabilidad de asestar golpes críticos."
  },
  "aftermath": {
    name: "Secuela",
    description: "Daña al Pokémon que le ha dado el golpe de gracia con un movimiento de contacto."
  },
  "anticipation": {
    name: "Anticipación",
    description: "Prevé los movimientos peligrosos del rival."
  },
  "forewarn": {
    name: "Alerta",
    description: "Revela uno de los movimientos del rival al entrar en combate."
  },
  "unaware": {
    name: "Ignorancia",
    description: "Pasa por alto los cambios en las características de un Pokémon al atacarlo o recibir daño."
  },
  "tinted-lens": {
    name: "Cromolente",
    description: "Potencia los movimientos que no son muy eficaces, que infligen ahora un daño normal."
  },
  "filter": {
    name: "Filtro",
    description: "Mitiga el daño que le infligen los movimientos supereficaces."
  },
  "slow-start": {
    name: "Inicio lento",
    description: "Reduce a la mitad su ataque y su velocidad durante cinco turnos."
  },
  "scrappy": {
    name: "Intrépido",
    description: "Alcanza a Pokémon de tipo fantasma con movimientos de tipo normal o lucha. Además, no sufre los efectos de intimidación."
  },
  "storm-drain": {
    name: "Colector",
    description: "Atrae y neutraliza los movimientos de tipo agua, que además le aumentan el ataque especial."
  },
  "ice-body": {
    name: "Cuerpo de hielo",
    description: "Recupera PS de forma gradual cuando nieva."
  },
  "solid-rock": {
    name: "Roca sólida",
    description: "Mitiga el daño que le infligen los movimientos supereficaces."
  },
  "snow-warning": {
    name: "Nevada",
    description: "Invoca una nevada al entrar en combate."
  },
  "honey-gather": {
    name: "Cosechamiel",
    description: "Puede que encuentre miel una vez concluido el combate."
  },
  "frisk": {
    name: "Inspección",
    description: "Puede ver el objeto que lleva el rival al entrar en combate."
  },
  "reckless": {
    name: "Audaz",
    description: "Potencia los movimientos que también dañan al usuario."
  },
  "multitype": {
    name: "Multitipo",
    description: "Cambia su tipo al de la tabla que lleve."
  },
  "flower-gift": {
    name: "Don floral",
    description: "Si hace sol, aumenta su ataque y su defensa especial, así como los de sus aliados."
  },
  "bad-dreams": {
    name: "Mal sueño",
    description: "Inflige daño a cualquier rival que esté dormido."
  },
  "pickpocket": {
    name: "Hurto",
    description: "Roba el objeto del Pokémon que lo ataque con un movimiento de contacto."
  },
  "sheer-force": {
    name: "Potencia bruta",
    description: "Aumenta la potencia de sus movimientos en detrimento de los efectos secundarios, que se ven anulados."
  },
  "contrary": {
    name: "Respondón",
    description: "Invierte los cambios en las características: bajan cuando les toca subir y suben cuando les toca bajar."
  },
  "unnerve": {
    name: "Nerviosismo",
    description: "Pone nervioso al rival y le impide usar bayas."
  },
  "defiant": {
    name: "Competitivo",
    description: "Aumenta mucho su ataque cuando el rival le reduce cualquiera de sus características."
  },
  "defeatist": {
    name: "Flaquear",
    description: "Cuando sus PS se ven reducidos a la mitad, se cansa tanto que su ataque y su ataque especial también se ven reducidos a la mitad."
  },
  "cursed-body": {
    name: "Cuerpo maldito",
    description: "Puede anular el movimiento usado en su contra."
  },
  "healer": {
    name: "Alma sanadora",
    description: "A veces cura los problemas de estado de un aliado."
  },
  "friend-guard": {
    name: "Compiescolta",
    description: "Reduce el daño que sufren los aliados."
  },
  "weak-armor": {
    name: "Armadura frágil",
    description: "Al recibir daño de un ataque físico, se reduce defensa, pero aumenta mucho su velocidad."
  },
  "heavy-metal": {
    name: "Metal pesado",
    description: "Duplica su peso."
  },
  "light-metal": {
    name: "Metal liviano",
    description: "Reduce a la mitad su peso."
  },
  "multiscale": {
    name: "Multiescamas",
    description: "Reduce el daño que sufre si sus PS están al máximo."
  },
  "toxic-boost": {
    name: "Ímpetu tóxico",
    description: "Aumenta la potencia de sus ataques físicos cuando está envenenado."
  },
  "flare-boost": {
    name: "Ímpetu ardiente",
    description: "Aumenta la potencia de sus ataques especiales cuando sufre quemaduras."
  },
  "harvest": {
    name: "Cosecha",
    description: "Puede reutilizar varias veces una misma baya."
  },
  "telepathy": {
    name: "Telepatía",
    description: "Elude los ataques de los aliados durante el combate."
  },
  "moody": {
    name: "Temperamental",
    description: "Aumenta mucho una característica en cada turno, pero reduce otra."
  },
  "overcoat": {
    name: "Funda",
    description: "No recibe daño de las tormentas de arena ni sufre los efectos causados por polvos o esporas."
  },
  "poison-touch": {
    name: "Contacto tóxico",
    description: "Puede envenenar al Pokémon al que ataque con un movimiento de contacto."
  },
  "regenerator": {
    name: "Regeneración",
    description: "Recupera unos pocos PS cuando se retira del combate."
  },
  "big-pecks": {
    name: "Sacapecho",
    description: "Impide que otros Pokémon le reduzcan la defensa."
  },
  "sand-rush": {
    name: "Ímpetu arena",
    description: "Aumenta su velocidad durante las tormentas de arena."
  },
  "wonder-skin": {
    name: "Piel milagrosa",
    description: "Presenta una mayor resistencia ante los movimientos de estado."
  },
  "analytic": {
    name: "Cálculo final",
    description: "Aumenta la potencia de su movimiento si es el último en atacar."
  },
  "illusion": {
    name: "Ilusión",
    description: "Adopta el aspecto del último Pokémon del equipo al entrar en combate para desconcertar al rival."
  },
  "imposter": {
    name: "Impostor",
    description: "Se transforma en el Pokémon que tiene enfrente."
  },
  "infiltrator": {
    name: "Allanamiento",
    description: "Ataca sorteando las barreras o el sustituto del objetivo."
  },
  "mummy": {
    name: "Momia",
    description: "Contagia la habilidad momia al Pokémon que lo ataque con un movimiento de contacto."
  },
  "moxie": {
    name: "Autoestima",
    description: "Al debilitar a un objetivo, su confianza se refuerza de tal manera que aumenta su ataque."
  },
  "justified": {
    name: "Justiciero",
    description: "Si le alcanza un movimiento de tipo siniestro, aumenta el ataque debido a su integridad."
  },
  "rattled": {
    name: "Cobardía",
    description: "Si lo alcanza un ataque de tipo siniestro, bicho o fantasma, o si sufre los efectos de intimidación, el miedo hace que aumente su velocidad."
  },
  "magic-bounce": {
    name: "Espejo mágico",
    description: "Puede devolver los movimientos de estado sin verse afectado por ellos."
  },
  "sap-sipper": {
    name: "Herbívoro",
    description: "Si lo alcanza un movimiento de tipo planta, aumenta su ataque en vez de sufrir daño."
  },
  "prankster": {
    name: "Timador",
    description: "Sus movimientos de estado tienen prioridad alta."
  },
  "sand-force": {
    name: "Poder arenoso",
    description: "Potencia los movimientos de tipo tierra, acero y roca durante las tormentas de arena."
  },
  "iron-barbs": {
    name: "Punta acero",
    description: "Inflige daño con sus púas de acero al Pokémon que lo ataque con un movimiento de contacto."
  },
  "zen-mode": {
    name: "Modo zen",
    description: "Cambia de forma si sus PS se ven reducidos a la mitad o menos."
  },
  "victory-star": {
    name: "Tinovictoria",
    description: "Aumenta su precisión y la de sus aliados."
  },
  "turboblaze": {
    name: "Turbollama",
    description: "Sus movimientos no se ven afectados por la habilidad del objetivo."
  },
  "teravolt": {
    name: "Terravoltaje",
    description: "Sus movimientos no se ven afectados por la habilidad del objetivo."
  },
  "aroma-veil": {
    name: "Velo aromático",
    description: "Se protege a sí mismo y a sus aliados de efectos que impiden usar movimientos."
  },
  "flower-veil": {
    name: "Velo florido",
    description: "Evita que los Pokémon de tipo planta aliados sufran problemas de estado o que les reduzcan sus características."
  },
  "cheek-pouch": {
    name: "Mejillas",
    description: "Recupera PS al comer cualquier baya."
  },
  "protean": {
    name: "Mutatipo",
    description: "Al entrar en combate, cambia su tipo al del primer movimiento que va a usar."
  },
  "fur-coat": {
    name: "Pelaje recio",
    description: "Reduce a la mitad el daño que recibe de ataques físicos."
  },
  "magician": {
    name: "Prestidigitador",
    description: "Roba el objeto del Pokémon al que alcance con un movimiento."
  },
  "bulletproof": {
    name: "Antibalas",
    description: "No le afectan las bombas ni algunos proyectiles."
  },
  "competitive": {
    name: "Tenacidad",
    description: "Aumenta mucho su ataque especial cuando el rival le reduce cualquiera de sus características."
  },
  "strong-jaw": {
    name: "Mandíbula fuerte",
    description: "Su robusta mandíbula le confiere una mordedura mucho más potente."
  },
  "refrigerate": {
    name: "Piel helada",
    description: "Convierte los movimientos de tipo normal en tipo hielo y aumenta ligeramente su potencia."
  },
  "sweet-veil": {
    name: "Velo dulce",
    description: "No cae dormido y evita también que sus aliados se duerman."
  },
  "stance-change": {
    name: "Cambio táctico",
    description: "Adopta la forma filo al lanzar un ataque, o bien la forma escudo si usa el movimiento escudo real."
  },
  "gale-wings": {
    name: "Alas vendaval",
    description: "Da prioridad a los movimientos de tipo volador si sus PS están al máximo."
  },
  "mega-launcher": {
    name: "Megalanzador",
    description: "Aumenta la potencia de algunos movimientos de pulsos y auras."
  },
  "grass-pelt": {
    name: "Manto frondoso",
    description: "Aumenta su defensa si hay un campo de hierba en el terreno de combate."
  },
  "symbiosis": {
    name: "Simbiosis",
    description: "Pasa su objeto a un aliado cuando este use el suyo."
  },
  "tough-claws": {
    name: "Garra dura",
    description: "Aumenta la potencia de los movimientos de contacto."
  },
  "pixilate": {
    name: "Piel feérica",
    description: "Convierte los movimientos de tipo normal en tipo hada y aumenta ligeramente su potencia."
  },
  "gooey": {
    name: "Baba",
    description: "Reduce la velocidad del Pokémon que lo ataque con un movimiento de contacto."
  },
  "aerilate": {
    name: "Piel celeste",
    description: "Convierte los movimientos de tipo normal en tipo volador y aumenta ligeramente su potencia."
  },
  "parental-bond": {
    name: "Amor filial",
    description: "Une fuerzas con su cría y ataca dos veces."
  },
  "dark-aura": {
    name: "Aura oscura",
    description: "Aumenta la potencia de los movimientos de tipo siniestro de todos los Pokémon."
  },
  "fairy-aura": {
    name: "Aura feérica",
    description: "Aumenta la potencia de los movimientos de tipo hada de todos los Pokémon."
  },
  "aura-break": {
    name: "Rompeaura",
    description: "Invierte los efectos de las habilidades de auras, por lo que reduce la potencia de ciertos movimientos en vez de aumentarla."
  },
  "primordial-sea": {
    name: "Mar del albor",
    description: "Altera el clima para anular los ataques de tipo fuego."
  },
  "desolate-land": {
    name: "Tierra del ocaso",
    description: "Altera el clima para anular los ataques de tipo agua."
  },
  "delta-stream": {
    name: "Ráfaga delta",
    description: "Altera el clima para anular las vulnerabilidades del tipo volador."
  },
  "stamina": {
    name: "Firmeza",
    description: "Aumenta su defensa al recibir un ataque."
  },
  "wimp-out": {
    name: "Huida",
    description: "Se asusta y abandona el terreno de combate cuando sus PS se ven reducidos a la mitad."
  },
  "emergency-exit": {
    name: "Retirada",
    description: "Abandona el terreno de combate cuando sus PS se ven reducidos a la mitad para evitar males mayores."
  },
  "water-compaction": {
    name: "Hidrorrefuerzo",
    description: "Aumenta mucho la defensa si le alcanza un movimiento de tipo agua."
  },
  "merciless": {
    name: "Ensañamiento",
    description: "Hace que sus movimientos asesten siempre un golpe crítico si el objetivo está envenenado."
  },
  "shields-down": {
    name: "Escudo limitado",
    description: "Rompe su coraza cuando sus PS se ven reducidos a la mitad y adopta una forma ofensiva."
  },
  "stakeout": {
    name: "Vigilante",
    description: "Si el objetivo de su ataque es sustituido por otro, duplica el daño que infligirá."
  },
  "water-bubble": {
    name: "Acuaburbuja",
    description: "Reduce el daño que le provocan los movimientos de tipo fuego y es inmune a las quemaduras."
  },
  "steelworker": {
    name: "Acero templado",
    description: "Potencia los movimientos de tipo acero."
  },
  "berserk": {
    name: "Ira",
    description: "Aumenta su ataque especial si sus PS se ven reducidos a la mitad debido a algún ataque."
  },
  "slush-rush": {
    name: "Quitanieves",
    description: "Aumenta su velocidad cuando nieva."
  },
  "long-reach": {
    name: "Remoto",
    description: "Puede usar cualquier movimiento sin entrar en contacto con su objetivo."
  },
  "liquid-voice": {
    name: "Voz fluida",
    description: "Hace que todos sus movimientos que usan sonido pasen a ser de tipo agua."
  },
  "triage": {
    name: "Socorro",
    description: "Da prioridad a los movimientos que restauran PS."
  },
  "galvanize": {
    name: "Piel eléctrica",
    description: "Convierte los movimientos de tipo normal en tipo eléctrico y aumenta ligeramente su potencia."
  },
  "surge-surfer": {
    name: "Cola surf",
    description: "Duplica su velocidad si hay un campo eléctrico en el terreno de combate."
  },
  "schooling": {
    name: "Banco",
    description: "Forma bancos con sus congéneres cuando tiene muchos PS, lo cual le otorga más fuerza. Cuando le quedan pocos PS, el banco se dispersa."
  },
  "disguise": {
    name: "Disfraz",
    description: "Puede eludir un ataque valiéndose de la tela que le cubre el cuerpo una vez por combate."
  },
  "battle-bond": {
    name: "Fuerte afecto",
    description: "Al derrotar a un Pokémon, los vínculos con su Entrenador se refuerzan y aumentan su ataque, su ataque especial y su velocidad."
  },
  "power-construct": {
    name: "Agrupamiento",
    description: "Cuando sus PS se ven reducidos a la mitad, las células se reagrupan y adopta su forma completa."
  },
  "corrosion": {
    name: "Corrosión",
    description: "Puede envenenar incluso a Pokémon de tipo acero o veneno."
  },
  "comatose": {
    name: "Letargo perenne",
    description: "No despierta jamás de su profundo letargo e incluso ataca dormido."
  },
  "queenly-majesty": {
    name: "Regia presencia",
    description: "Intimida al rival y le impide usar movimientos con prioridad contra él y sus aliados."
  },
  "innards-out": {
    name: "Revés",
    description: "Al caer debilitado, inflige al atacante un daño equivalente a los PS que le quedaran antes de recibir el golpe de gracia."
  },
  "dancer": {
    name: "Pareja de baile",
    description: "Puede copiar inmediatamente cualquier movimiento de baile que haya usado otro Pokémon presente en el combate."
  },
  "battery": {
    name: "Batería",
    description: "Potencia los ataques especiales de los aliados."
  },
  "fluffy": {
    name: "Mullido",
    description: "Reduce a la mitad el daño recibido por los movimientos de contacto, pero duplica el que le infligen los de tipo fuego."
  },
  "dazzling": {
    name: "Cuerpo vívido",
    description: "Desconcierta al rival y le impide usar movimientos con prioridad contra él y sus aliados."
  },
  "soul-heart": {
    name: "Coránima",
    description: "Aumenta su ataque especial cada vez que un Pokémon cae debilitado."
  },
  "tangling-hair": {
    name: "Rizos rebeldes",
    description: "Reduce la velocidad del Pokémon que lo ataque con un movimiento de contacto."
  },
  "receiver": {
    name: "Receptor",
    description: "Adquiere la habilidad de un aliado debilitado."
  },
  "power-of-alchemy": {
    name: "Reacción química",
    description: "Reacciona copiando la habilidad de un aliado debilitado."
  },
  "beast-boost": {
    name: "Ultraimpulso",
    description: "Al derrotar a un Pokémon, aumenta su característica más fuerte."
  },
  "rks-system": {
    name: "Sistema alfa",
    description: "Cambia su tipo según el disco que lleve instalado."
  },
  "electric-surge": {
    name: "Electrogénesis",
    description: "Crea un campo eléctrico al entrar en combate."
  },
  "psychic-surge": {
    name: "Psicogénesis",
    description: "Crea un campo psíquico al entrar en combate."
  },
  "misty-surge": {
    name: "Nebulogénesis",
    description: "Crea un campo de niebla al entrar en combate."
  },
  "grassy-surge": {
    name: "Herbogénesis",
    description: "Crea un campo de hierba al entrar en combate."
  },
  "full-metal-body": {
    name: "Guardia metálica",
    description: "Evita que se reduzcan sus características a causa de movimientos o habilidades de otros Pokémon."
  },
  "shadow-shield": {
    name: "Guardia espectro",
    description: "Reduce el daño que sufre si sus PS están al máximo."
  },
  "prism-armor": {
    name: "Armadura prisma",
    description: "Mitiga el daño que le infligen los movimientos supereficaces."
  },
  "neuroforce": {
    name: "Fuerza cerebral",
    description: "Potencia los ataques supereficaces."
  },
  "intrepid-sword": {
    name: "Espada indómita",
    description: "Aumenta su ataque al entrar en combate por primera vez."
  },
  "dauntless-shield": {
    name: "Escudo recio",
    description: "Aumenta su defensa al entrar en combate por primera vez."
  },
  "libero": {
    name: "Líbero",
    description: "Al entrar en combate, cambia su tipo al del primer movimiento que va a usar."
  },
  "ball-fetch": {
    name: "Buscabola",
    description: "Si no lleva equipado ningún objeto, recupera la Poké Ball del primer intento de captura fallido."
  },
  "cotton-down": {
    name: "Pelusa",
    description: "Al ser alcanzado por un ataque, suelta una pelusa de algodón que reduce la velocidad de todos los demás Pokémon."
  },
  "propeller-tail": {
    name: "Hélice caudal",
    description: "Ignora los efectos de las habilidades o los movimientos que permiten a un Pokémon centrar la atención sobre sí."
  },
  "mirror-armor": {
    name: "Coraza reflejo",
    description: "Refleja los efectos que reducen las características."
  },
  "gulp-missile": {
    name: "Tragamisil",
    description: "Tras usar surf o buceo, emerge con una presa en la boca. Al recibir daño, ataca escupiéndola."
  },
  "stalwart": {
    name: "Acérrimo",
    description: "Ignora los efectos de las habilidades o los movimientos que permiten a un Pokémon centrar la atención sobre sí."
  },
  "steam-engine": {
    name: "Combustible",
    description: "Si le alcanza un movimiento de tipo fuego o tipo agua, aumenta muchísimo su velocidad."
  },
  "punk-rock": {
    name: "Punk rock",
    description: "Potencia los movimientos que usan sonido y reduce a la mitad el daño que le infligen dichos movimientos."
  },
  "sand-spit": {
    name: "Expulsarena",
    description: "Provoca una tormenta de arena al recibir un ataque."
  },
  "ice-scales": {
    name: "Escama de hielo",
    description: "Las gélidas escamas que protegen su cuerpo reducen a la mitad el daño que le infligen los ataques especiales."
  },
  "ripen": {
    name: "Maduración",
    description: "Hace madurar las bayas, por lo que duplica sus efectos."
  },
  "ice-face": {
    name: "Cara de hielo",
    description: "Absorbe el daño de un ataque físico con el hielo de la cabeza, tras lo cual cambia de forma. El hielo se regenerará la próxima vez que nieve."
  },
  "power-spot": {
    name: "Fuente energía",
    description: "Potencia los movimientos de los Pokémon adyacentes."
  },
  "mimicry": {
    name: "Mimetismo",
    description: "Cambia su tipo según el campo que haya en el terreno de combate."
  },
  "screen-cleaner": {
    name: "Antibarrera",
    description: "Anula los efectos de pantalla de luz, reflejo y velo aurora tanto de rivales como de aliados al entrar en combate."
  },
  "steely-spirit": {
    name: "Alma acerada",
    description: "Potencia los movimientos de tipo acero del Pokémon y sus aliados."
  },
  "perish-body": {
    name: "Cuerpo mortal",
    description: "Si lo alcanza un movimiento de contacto, se debilitará al cabo de 3 turnos, así como el atacante, a menos que abandonen el terreno de combate."
  },
  "wandering-spirit": {
    name: "Alma errante",
    description: "Si lo alcanza un movimiento de contacto, intercambia su habilidad con la del atacante."
  },
  "gorilla-tactics": {
    name: "Obstinación",
    description: "Aumenta su ataque, pero solo puede usar el primer movimiento escogido."
  },
  "neutralizing-gas": {
    name: "Gas reactivo",
    description: "Anula los efectos de las habilidades de los demás Pokémon presentes mientras esté en el terreno de combate."
  },
  "pastel-veil": {
    name: "Velo pastel",
    description: "Se protege a sí mismo y a sus aliados del envenenamiento."
  },
  "hunger-switch": {
    name: "Mutapetito",
    description: "Alterna entre su forma saciada y forma voraz al final de cada turno."
  },
  "quick-draw": {
    name: "Mano rápida",
    description: "A veces, puede atacar el primero."
  },
  "unseen-fist": {
    name: "Puño invisible",
    description: "Si usa un movimiento de contacto, puede infligir daño al objetivo aunque este se proteja."
  },
  "curious-medicine": {
    name: "Medicina extraña",
    description: "Al entrar en combate, rezuma una substancia medicinal por la caracola que revierte los cambios en las características de los aliados."
  },
  "transistor": {
    name: "Transistor",
    description: "Potencia los movimientos de tipo eléctrico."
  },
  "dragons-maw": {
    name: "Mandíbula dragón",
    description: "Potencia los movimientos de tipo dragón."
  },
  "chilling-neigh": {
    name: "Relincho blanco",
    description: "Al derrotar a un objetivo, emite un relincho gélido y aumenta su ataque."
  },
  "grim-neigh": {
    name: "Relincho negro",
    description: "Al derrotar a un objetivo, emite un relincho aterrador y aumenta su ataque especial."
  },
  "as-one": {
    name: "Unidad ecuestre",
    description: "El Pokémon tiene dos habilidades según su forma."
  },
  "lingering-aroma": {
    name: "Aroma incesante",
    description: "Contagia la habilidad olor persistente al Pokémon que lo ataque con un movimiento de contacto."
  },
  "seed-sower": {
    name: "Disemillar",
    description: "Crea un campo de hierba al recibir un ataque."
  },
  "thermal-exchange": {
    name: "Termoconversión",
    description: "Evita las quemaduras y, si lo alcanza un movimiento de tipo fuego, aumenta su ataque."
  },
  "anger-shell": {
    name: "Coraza ira",
    description: "Cuando un ataque reduce sus PS a la mitad, un arrebato de cólera reduce su defensa y su defensa especial, pero aumenta su ataque, su ataque especial y su velocidad."
  },
  "purifying-salt": {
    name: "Sal purificadora",
    description: "Su sal pura lo protege de los problemas de estado y reduce a la mitad el daño que recibe de ataques de tipo fantasma."
  },
  "well-baked-body": {
    name: "Pan comido",
    description: "Si lo alcanza un movimiento de tipo fuego, aumenta mucho su defensa en vez de sufrir daño."
  },
  "wind-rider": {
    name: "Surcavientos",
    description: "Si sopla un viento afín o lo alcanza un movimiento que usa viento, aumenta su ataque. Tampoco recibe daño de este último."
  },
  "guard-dog": {
    name: "Perro guardián",
    description: "Aumenta su ataque si sufre los efectos de intimidación. También anula movimientos y objetos que fuercen el cambio de Pokémon."
  },
  "rocky-payload": {
    name: "Transportarrocas",
    description: "Potencia los movimientos de tipo roca."
  },
  "wind-power": {
    name: "Energía eólica",
    description: "Su cuerpo se carga de electricidad si lo alcanza un movimiento que usa viento, lo que potencia su siguiente movimiento de tipo eléctrico."
  },
  "zero-to-hero": {
    name: "Cambio heroico",
    description: "Adopta la forma heroica cuando se retira del combate."
  },
  "commander": {
    name: "Comandante",
    description: "Si al entrar en combate coincide con un Dondozo aliado, se cuela en el interior de su boca para tomar el control."
  },
  "electromorphosis": {
    name: "Dinamo",
    description: "Su cuerpo se carga de electricidad al recibir daño, lo que potencia su siguiente movimiento de tipo eléctrico."
  },
  "protosynthesis": {
    name: "Paleosíntesis",
    description: "Si hace sol o lleva un tanque de energía potenciadora, aumenta su característica más alta."
  },
  "quark-drive": {
    name: "Carga cuark",
    description: "Si hay un campo eléctrico en el terreno de combate o lleva un tanque de energía potenciadora, aumenta su característica más alta."
  },
  "good-as-gold": {
    name: "Cuerpo áureo",
    description: "Su robusto cuerpo de oro inoxidable lo hace inmune frente a movimientos de estado de otros Pokémon."
  },
  "vessel-of-ruin": {
    name: "Caldero debacle",
    description: "Reduce el ataque especial de todos los demás Pokémon con el poder de su caldero maldito."
  },
  "sword-of-ruin": {
    name: "Espada debacle",
    description: "Reduce la defensa de todos los demás Pokémon con el poder de su espada maldita."
  },
  "tablets-of-ruin": {
    name: "Tablilla debacle",
    description: "Reduce el ataque de todos los demás Pokémon con el poder de sus tablillas malditas."
  },
  "beads-of-ruin": {
    name: "Cuenta debacle",
    description: "Reduce la defensa especial de todos los demás Pokémon con el poder de sus abalorios malditos."
  },
  "orichalcum-pulse": {
    name: "Latido oricalco",
    description: "El tiempo pasa a ser soleado cuando entra en combate. Si hace mucho sol, su ataque aumenta gracias a su pulso primigenio."
  },
  "hadron-engine": {
    name: "Motor hadrónico",
    description: "Crea un campo eléctrico al entrar en combate. Si hay un campo eléctrico, su ataque especial aumenta gracias a su motor futurista."
  },
  "opportunist": {
    name: "Oportunista",
    description: "Copia las mejoras en las características del rival, aprovechándose de la situación."
  },
  "cud-chew": {
    name: "Rumia",
    description: "Cuando ingiere una baya, la regurgita al final del siguiente turno y se la come por segunda vez."
  },
  "sharpness": {
    name: "Cortante",
    description: "Aumenta la potencia de los movimientos cortantes."
  },
  "supreme-overlord": {
    name: "General supremo",
    description: "Al entrar en combate, su ataque y su ataque especial aumentan un poco por cada miembro del equipo que haya sido derrotado hasta el momento."
  },
  "costar": {
    name: "Unísono",
    description: "Al entrar en combate, copia los cambios en las características de su aliado."
  },
  "toxic-debris": {
    name: "Capa tóxica",
    description: "Al recibir daño de un ataque físico, lanza una trampa de púas tóxicas a los pies del rival."
  },
  "armor-tail": {
    name: "Cola armadura",
    description: "La extraña cola que le envuelve la cabeza impide al rival usar movimientos con prioridad contra él y sus aliados."
  },
  "earth-eater": {
    name: "Geofagia",
    description: "Si lo alcanza un movimiento de tipo tierra, recupera PS en vez de sufrir daño."
  },
  "mycelium-might": {
    name: "Poder fúngico",
    description: "El Pokémon siempre actúa con lentitud cuando usa movimientos de estado, pero estos no se ven afectados por la habilidad del objetivo."
  },
  "hospitality": {
    name: "Hospitalidad",
    description: "Al entrar en combate, restaura algunos PS de su aliado como muestra de hospitalidad."
  },
  "minds-eye": {
    name: "Ojo mental",
    description: "Alcanza a Pokémon de tipo fantasma con movimientos de tipo normal o lucha. Su precisión no se puede reducir e ignora los cambios en la evasión del objetivo."
  },
  "embody-aspect": {
    name: "Evocarrecuerdos",
    description: "Al evocar viejos recuerdos, el Pokémon hace brillar su máscara y aumenta una característica."
  },
  "toxic-chain": {
    name: "Cadena tóxica",
    description: "Gracias al poder de su cadena impregnada de toxinas, puede envenenar gravemente al Pokémon al que ataque."
  },
  "supersweet-syrup": {
    name: "Néctar dulce",
    description: "Al entrar en combate por primera vez, esparce un aroma dulzón a néctar que reduce la evasión del rival."
  },
  "tera-shift": {
    name: "Teracambio",
    description: "Al entrar en combate, adopta la Forma Teracristal tras absorber la energía de su alrededor."
  },
  "tera-shell": {
    name: "Teracaparazón",
    description: "Su caparazón encierra energía de todos los tipos. Gracias a ello, si sus PS están al máximo, el movimiento que lo alcance no será muy eficaz."
  },
  "teraform-zero": {
    name: "Teraformación 0",
    description: "Cuando Terapagos adopta la Forma Astral, anula todos los efectos del tiempo atmosférico y de los campos que haya en el terreno gracias a su poder oculto."
  },
  "poison-puppeteer": {
    name: "Títere tóxico",
    description: "Los rivales que Pecharunt envenene con sus movimientos también sufrirán confusión."
  },
};

export function getAbilityName(abilityId: string): string {
  const ability = ABILITIES_COMPLETE[abilityId];
  return ability?.name || abilityId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getAbilityDescription(abilityId: string): string {
  const ability = ABILITIES_COMPLETE[abilityId];
  return ability?.description || "Descripción no disponible";
}
