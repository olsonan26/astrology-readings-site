/**
 * ALCHEMISTIC ASTROLOGY KNOWLEDGE BASE
 * Based on the Uber Newbie Basics and This Astrology Philosophy
 * 
 * IMPORTANT: This system views astrology as ENERGY, not definitions.
 * Always ask "How does it manifest?" not "What does it mean?"
 * Free will and alchemy allow you to shift, harmonize, or redirect energy.
 */

// ============================================
// IMPORTANCE HIERARCHY
// ASC is MOST important, followed by Moon, then Sun
// ============================================

export const IMPORTANCE_HIERARCHY = {
    order: ['ascendant', 'moon', 'sun', 'ic'],
    description: 'The Ascendant sign is the MOST important, followed by Moon, then Sun. The Sun is actually #3.',
    note: 'Many people think Sun signs are most important because of pop culture astrology. In reality, the Ascendant defines your entire chart structure.'
};

// ============================================
// CHILDREN PLACEMENT PATTERN
// ============================================

export const CHILDREN_PLACEMENTS = {
    pattern: 'Every 2 houses starting from the 5th',
    mapping: {
        1: { house: 5, description: '1st child in 5th house - tends to be dramatic ("it\'s your first one")' },
        2: { house: 7, description: '2nd child in 7th house - you\'re "more in tune" from experience' },
        3: { house: 9, description: '3rd child in 9th house - expansion and vision' },
        4: { house: 11, description: '4th child in 11th house - community and humanitarian' }
    },
    note: 'Each child is represented 2 houses after the previous one. This pattern continues.'
};

// ============================================
// PLANET GROUPINGS
// ============================================

export const PLANET_GROUPS = {
    ultraPersonal: {
        name: 'Ultra-Personal Planets',
        planets: ['sun', 'moon'],
        description: 'The most personal to you and closest to heart. Along with the Ascendant, these are the most important. They relate to your sense of happiness, purpose, emotional security, safety, and needs.',
        importance: 'These are the planets you make the most decisions in life based off of.'
    },
    personal: {
        name: 'Personal Planets',
        planets: ['mercury', 'venus'],
        description: 'These operate between intrapersonal and interpersonal. They sit between the Earth and Sun within the ecliptic.',
        positions: {
            inferior: 'Intrapersonal (inward) - Mercury rules Gemini (inner mind), Venus rules Taurus (self-value)',
            superior: 'Interpersonal (outward) - Mercury rules Virgo (outward mental faculty), Venus rules Libra (value in relation to others)'
        }
    },
    extraPersonal: {
        name: 'Extra-Personal Planet',
        planets: ['mars'],
        description: 'Mars is NOT a personal planet. It never sits between Earth and Sun. It is a CONNECTOR that connects you (Earth/reality) to the outside world. Mars rules the physical body - that outer layer that enables you to do things in the world.',
        note: 'Whenever you see Mars or Aries energy, look at it as a connector to the rest of the world.'
    },
    transpersonal: {
        name: 'Transpersonal Planets',
        planets: ['jupiter', 'saturn'],
        description: 'These relate to society, the world, and the general public. They represent the next stage in energetic frequency after taking action.'
    },
    metapersonal: {
        name: 'Metapersonal Planets',
        planets: ['uranus', 'neptune', 'pluto'],
        description: 'These set the stage BEYOND. Not about the world, but what is beyond the world. Uranus is beyond time, Neptune is beyond reality, Pluto is beyond value/depths.',
        important: 'These are NOT "generational planets". Every planet is personal. They all connect to you.'
    }
};

// ============================================
// PLANET DATA
// ============================================

export const PLANETS = {
    sun: {
        name: 'Sun',
        symbol: '☉',
        group: 'ultraPersonal',
        keywords: ['happiness', 'purpose', 'greatest achievements', 'core identity', 'vitality'],
        description: 'Represents your greatest achievements and core identity. The Sun shows up four times in your chart: the Leo house, the 5th house, and through both its house and sign placement.',
        glyphOrigin: 'Greek and Egyptian - circle with dot represents Ra or Helios, the sun god and "god\'s eye".',
        energy: 'Where your core identity expresses and what drives your sense of purpose and happiness.'
    },
    moon: {
        name: 'Moon',
        symbol: '☽',
        group: 'ultraPersonal',
        keywords: ['emotional security', 'needs', 'emotional safety', 'nurturing', 'comfort'],
        description: 'Your emotional security, safety, and needs. What makes you feel comfortable on an emotional level.',
        glyphOrigin: 'Based on lunar phases - the crescent moon.',
        energy: 'What you need emotionally to feel safe and secure.'
    },
    mercury: {
        name: 'Mercury',
        symbol: '☿',
        group: 'personal',
        keywords: ['mind', 'mental faculty', 'communication', 'thinking', 'ideas'],
        description: 'Rules the mind and mental faculty. In Gemini (inferior position) it is the inner mind. In Virgo (superior position) it is outward mental faculty - how you relate to others.',
        glyphOrigin: 'The winged messenger.',
        energy: 'How you think, communicate, and process information.'
    },
    venus: {
        name: 'Venus',
        symbol: '♀',
        group: 'personal',
        keywords: ['value', 'self-worth', 'beauty', 'relationships', 'attraction'],
        description: 'Rules value. In Taurus (inferior position) it is self-value. In Libra (superior position) it is value in relation to others.',
        glyphOrigin: 'The mirror of the goddess.',
        energy: 'What you value and how you connect with others through appreciation and beauty.'
    },
    mars: {
        name: 'Mars',
        symbol: '♂',
        group: 'extraPersonal',
        keywords: ['action', 'physical body', 'drive', 'assertion', 'competition'],
        description: 'The CONNECTOR planet. Rules the physical body - your outer layer that enables you to do things in the world. Not personal - it connects you to the outside world.',
        glyphOrigin: 'Roman/Greek - arrow and shield representing Aries/Mars, god of war. Represents forward concentrated directed energy.',
        energy: 'How you take action and connect with the physical world.',
        important: 'Mars does not represent aggression by default. Mars is ACTION. You can alchemize it to be assertive, actionable, or directed rather than aggressive.'
    },
    jupiter: {
        name: 'Jupiter',
        symbol: '♃',
        group: 'transpersonal',
        keywords: ['expansion', 'growth', 'society', 'opportunity', 'wisdom'],
        description: 'Sits in the transpersonal realm connecting you to society and the world at large.',
        glyphOrigin: 'Based on Zeus - a stylized lightning bolt and Z.',
        energy: 'Where you expand and grow in relation to the world.'
    },
    saturn: {
        name: 'Saturn',
        symbol: '♄',
        group: 'transpersonal',
        keywords: ['time', 'structure', 'discipline', 'mastery', 'the past'],
        description: 'Has to do with time (Kronos). Represents the past because of where it sits at the bottom of the sun\'s declination. Saturn is sustaining - pulling something that already is.',
        glyphOrigin: 'The sickle of Kronos.',
        energy: 'Where you must develop mastery and discipline. What you build here LASTS.'
    },
    uranus: {
        name: 'Uranus',
        symbol: '♅',
        group: 'metapersonal',
        keywords: ['beyond time', 'innovation', 'sudden change', 'awakening', 'rebellion'],
        description: 'Metapersonal - not about time, but what is BEYOND time.',
        energy: 'Where you break free from convention and experience awakening.'
    },
    neptune: {
        name: 'Neptune',
        symbol: '♆',
        group: 'metapersonal',
        keywords: ['beyond reality', 'spirituality', 'dreams', 'intuition', 'dissolution'],
        description: 'Metapersonal - not about reality, but what is BEYOND reality.',
        glyphOrigin: 'Poseidon\'s trident - water, the sea, connects to royalty from the quincunx to Leo.',
        energy: 'Where you transcend the physical and connect to the spiritual.'
    },
    pluto: {
        name: 'Pluto',
        symbol: '♇',
        group: 'metapersonal',
        keywords: ['transformation', 'depth', 'intimacy', 'power', 'rebirth'],
        description: 'Metapersonal - about immersing yourself into depths, beyond surface value. Pluto is a binary system with its moon, which is why it has to do with intimacy and bonds.',
        energy: 'Where you experience profound transformation and depth.'
    }
};

// ============================================
// ZODIAC SIGNS
// ============================================

export const ZODIAC_SIGNS = {
    aries: {
        name: 'Aries',
        symbol: '♈',
        ruler: 'mars',
        element: 'fire',
        modality: 'cardinal',
        keywords: ['action', 'initiation', 'direction', 'self', 'autonomy'],
        description: 'Forward concentrated directed energy. Represents sunrise - when the sun crosses 0° going north. Aries is a pivot point of change in direction.',
        glyphMeaning: 'Stylized ram horns forming a V-shape pointing down - emulates directed energy with the arrow.',
        energy: 'Aries strikes. The action after all the festering of Scorpio comes out in competition, aggression, and assertion.',
        astronomicalNote: 'Marks the Spring Equinox - the sun at 0° declination heading north.'
    },
    taurus: {
        name: 'Taurus',
        symbol: '♉',
        ruler: 'venus',
        element: 'earth',
        modality: 'fixed',
        keywords: ['value', 'self-worth', 'stability', 'resources', 'sustenance'],
        description: 'Self-value (inward Venus). About what is of value to you and building something sustainable.',
        glyphMeaning: 'Bull\'s head with horns. The circle represents life and vitality.',
        energy: 'Sustaining energy - what is already started, you sustain here.'
    },
    gemini: {
        name: 'Gemini',
        symbol: '♊',
        ruler: 'mercury',
        element: 'air',
        modality: 'mutable',
        keywords: ['options', 'communication', 'thinking', 'duality', 'local environment'],
        description: 'The inner mind (inward Mercury). Rules OPTIONS - not two different things, but two options within the same paradigm.',
        glyphMeaning: 'Roman numeral 2 representing the twins Castor and Pollux. IMPORTANT: They are NOT disconnected. They work together. The duality is CONNECTED.',
        energy: 'Gemini is the LEAST dual of all dualities. It represents choices within the same thing, not separate paths.',
        important: 'Gemini is often misinterpreted. It is not "two different things" - it is options within the same thing.'
    },
    cancer: {
        name: 'Cancer',
        symbol: '♋',
        ruler: 'moon',
        element: 'water',
        modality: 'cardinal',
        keywords: ['nurturing', 'emotional security', 'home', 'family', 'protection'],
        description: 'The peak of the sun\'s declination (Summer Solstice). About nurturing, motherhood, and protection.',
        glyphMeaning: 'Often seen as crab claws, but ALSO represents nurturing (the symbol has a dual nature). Represents duality - note the two separated curves.',
        energy: 'Protective and nurturing energy. Where we find emotional security.',
        astronomicalNote: 'Marks the Summer Solstice - the sun at maximum 23.44° north declination.'
    },
    leo: {
        name: 'Leo',
        symbol: '♌',
        ruler: 'sun',
        element: 'fire',
        modality: 'fixed',
        keywords: ['expression', 'creativity', 'presence', 'ego', 'character'],
        description: 'Fixed fire sign. The lion\'s mane and tail. Represents presence, personality, and character.',
        glyphMeaning: 'Lion\'s mane and tail. Contains a circle which represents life and vitality.',
        energy: 'Where you shine and express yourself. Your creative force and character.'
    },
    virgo: {
        name: 'Virgo',
        symbol: '♍',
        ruler: 'mercury',
        element: 'earth',
        modality: 'mutable',
        keywords: ['service', 'analysis', 'improvement', 'health', 'routine'],
        description: 'Outward mental faculty (superior Mercury). How you relate to the world through analysis.',
        glyphMeaning: 'The M is for Maiden. The tail comes back in and wraps - "legs are closed, she\'s a prude." Signifies modesty and the harvest (holding wheat).',
        energy: 'Where you refine, analyze, and serve. The adapter energy seeking to improve.'
    },
    libra: {
        name: 'Libra',
        symbol: '♎',
        ruler: 'venus',
        element: 'air',
        modality: 'cardinal',
        keywords: ['balance', 'partnership', 'value with others', 'design', 'public to personal'],
        description: 'Represents SUNSET - arguably more important than sunrise. The horizon line. Value in relation to others (superior Venus).',
        glyphMeaning: 'Not just scales - it is the HORIZON LINE. The sun descending. Contains duality with separated curves.',
        energy: 'The transition point where things PUBLIC come back to you PERSONAL. The descendant sits here - this is where you bring people into your personal world.',
        important: 'Protect this energy carefully. Whatever you connect to on this level is coming back inward into your private life.',
        astronomicalNote: 'Marks the Fall Equinox - the sun at 0° declination heading south.'
    },
    scorpio: {
        name: 'Scorpio',
        symbol: '♏',
        ruler: 'pluto',
        element: 'water',
        modality: 'fixed',
        keywords: ['transformation', 'depth', 'protection', 'intensity', 'shared resources'],
        description: 'Protection and transformation. The stinger points outward - readiness to strike.',
        glyphMeaning: 'The M based on the maiden (sextile to Virgo) plus the scorpion\'s tail/stinger. The stinger points outward - readiness to strike.',
        energy: 'Scorpio does NOT strike. Scorpio is the brewing, the festering, the readiness. Aries strikes. Scorpio feeds into Aries through the quincunx.',
        important: 'Scorpio represents what builds up before action. The conflict, brewing, and protection that leads to Aries taking action.'
    },
    sagittarius: {
        name: 'Sagittarius',
        symbol: '♐',
        ruler: 'jupiter',
        element: 'fire',
        modality: 'mutable',
        keywords: ['vision', 'truth', 'expansion', 'seeking', 'higher understanding'],
        description: 'The arrow of the centaur aiming UP. About vision, truth, and seeking something bigger, better, higher.',
        glyphMeaning: 'The arrow pointing upward - aiming for heightened visibility, going outward, rising.',
        energy: 'SEEKING and SEARCHING. We have not achieved it - we are looking for it. It is the AIM, not the arrival.',
        important: 'Sagittarius is about the search, not the destination. It is "better" only as a goal, not as a state.'
    },
    capricorn: {
        name: 'Capricorn',
        symbol: '♑',
        ruler: 'saturn',
        element: 'earth',
        modality: 'cardinal',
        keywords: ['structure', 'mastery', 'achievement', 'the past', 'discipline'],
        description: 'The sea goat - a Babylonian hybrid creature. Represents ice (water hardened), structure, and the past.',
        glyphMeaning: 'The serpent\'s tail of the sea creature. Earth element but WATER-BASED earth (sextiles to Scorpio and Pisces).',
        energy: 'Saturn and Capricorn represent the PAST because of the sun\'s lowest declination. Sustaining - pulling something that already is.',
        important: 'Capricorn is earth but rules ICE (hardened water). It\'s about structure which we attribute to earthly things.',
        astronomicalNote: 'Marks the Winter Solstice - the sun at maximum 23.44° south declination.'
    },
    aquarius: {
        name: 'Aquarius',
        symbol: '♒',
        ruler: 'uranus',
        element: 'air',
        modality: 'fixed',
        keywords: ['future', 'innovation', 'groups', 'individuality', 'knowledge flow'],
        description: 'The water bearer. Represents waves, energy, knowledge flow, transmission.',
        glyphMeaning: 'Double zigzags representing streams, waves, and transmission. Contains duality.',
        energy: 'Takes what we have (from Capricorn) and asks "How do we move this forward?" Future-oriented.'
    },
    pisces: {
        name: 'Pisces',
        symbol: '♓',
        ruler: 'neptune',
        element: 'water',
        modality: 'mutable',
        keywords: ['surrender', 'transcendence', 'integration', 'spirituality', 'duality'],
        description: 'Two fish swimming in opposite directions, TETHERED by a cord. About surrendering and integrating duality.',
        glyphMeaning: 'Two fish pulling against each other but stuck together. Curves with a bridge connecting inner and outer realms.',
        energy: 'You cannot fight your other half. They are stuck together. You must learn to INTEGRATE them - not separate them.',
        important: 'This is about surrendering to the duality within you, not fighting it. Transcendence and dualism together.'
    }
};

// ============================================
// HOUSES (FIELDS) - With Natural Rulership
// ============================================

export const HOUSES = {
    1: {
        number: 1,
        naturalSign: 'aries',
        naturalRuler: 'mars',
        name: 'House of Self',
        keywords: ['self', 'action', 'autonomy', 'physical body', 'first reactions'],
        description: 'The field of self and action. Any planet here is an ARIES planet (True Placement). This is HOW you show up in the world.',
        physicalBody: 'Rules the physical body - jawline, skin tone, hair thickness, first reactions.',
        identity: 'Physical Identity - "what your body does" instinctively, your automatic reactions.',
        note: 'The Ascendant sits here but has different meaning - ASC is WHY you showed up, the 1st house is HOW you show up.'
    },
    2: {
        number: 2,
        naturalSign: 'taurus',
        naturalRuler: 'venus',
        name: 'House of Value',
        keywords: ['value', 'self-worth', 'resources', 'possessions', 'security'],
        description: 'The field of value and resources. Any planet here is a TAURUS planet (True Placement).'
    },
    3: {
        number: 3,
        naturalSign: 'gemini',
        naturalRuler: 'mercury',
        name: 'House of Mental Identity',
        keywords: ['mental identity', 'mindset', 'communication', 'siblings', 'local environment', 'learning'],
        description: 'The field of MENTAL IDENTITY - your brain itself! How you think, learn, and communicate. Any planet here is a GEMINI planet (True Placement).',
        identity: 'Mental Identity - how smart you are, how you think, how you speak, how you get what is in the brain OUT.',
        rulesTheBrain: 'Gemini/3rd house rules the brain itself. This is your ID, your mental acuity, how you learn.',
        distinction: 'THIS IS DIFFERENT FROM 5TH HOUSE: 3rd house = how you THINK (mental identity). 5th house = how you ACT when being yourself (personality).'
    },
    4: {
        number: 4,
        naturalSign: 'cancer',
        naturalRuler: 'moon',
        name: 'House of Foundation',
        keywords: ['home', 'family', 'emotional security', 'ancestry', 'roots'],
        description: 'The field of home and emotional foundation. Any planet here is a CANCER planet (True Placement).'
    },
    5: {
        number: 5,
        naturalSign: 'leo',
        naturalRuler: 'sun',
        name: 'House of Expression',
        keywords: ['creativity', 'happiness', 'pleasure', 'romance', 'ego', 'drama'],
        description: 'The field of creative expression, joy, and personality. Any planet here is a LEO planet (True Placement).',
        identity: 'Personality/Creative Expression - how you ACT when you are being yourself (distinct from 3rd house mental identity).',
        childPlacement: '1ST CHILD - Your first child is represented here. First children tend to be dramatic ("it\'s your first one").',
        romance: 'Romance like "puppy love" - the playful, flirtatious side of love. What makes you HAPPY.',
        distinction: 'THIS IS DIFFERENT FROM 1ST HOUSE: 1st house = what your body does. 5th house = who you ARE when being you.'
    },
    6: {
        number: 6,
        naturalSign: 'virgo',
        naturalRuler: 'mercury',
        name: 'House of Service',
        keywords: ['service', 'health', 'routine', 'work', 'improvement'],
        description: 'The field of daily work and health. Any planet here is a VIRGO planet (True Placement).'
    },
    7: {
        number: 7,
        naturalSign: 'libra',
        naturalRuler: 'venus',
        name: 'House of Partnership',
        keywords: ['partnership', 'relationships', 'one-on-one', 'balance', 'contracts'],
        description: 'The field of one-on-one relationships. Any planet here is a LIBRA planet (True Placement). The Descendant sits here.',
        childPlacement: '2ND CHILD - Your second child is represented here. You\'re "more in tune" because you\'ve already dealt with one.',
        note: 'This house is about bringing people from PUBLIC into your PERSONAL world.'
    },
    8: {
        number: 8,
        naturalSign: 'scorpio',
        naturalRuler: 'pluto',
        name: 'House of Transformation',
        keywords: ['transformation', 'shared resources', 'depth', 'intimacy', 'rebirth'],
        description: 'The field of deep transformation and shared resources. Any planet here is a SCORPIO planet (True Placement).'
    },
    9: {
        number: 9,
        naturalSign: 'sagittarius',
        naturalRuler: 'jupiter',
        name: 'House of Expansion',
        keywords: ['expansion', 'philosophy', 'travel', 'higher learning', 'vision'],
        description: 'The field of expansion and seeking. Any planet here is a SAGITTARIUS planet (True Placement).',
        childPlacement: '3RD CHILD - Your third child is represented here. Pattern continues: every 2 houses (11th = 4th child, etc).'
    },
    10: {
        number: 10,
        naturalSign: 'capricorn',
        naturalRuler: 'saturn',
        name: 'House of Achievement',
        keywords: ['career', 'public image', 'achievement', 'mastery', 'reputation'],
        description: 'The field of public achievement and mastery. Any planet here is a CAPRICORN planet (True Placement).'
    },
    11: {
        number: 11,
        naturalSign: 'aquarius',
        naturalRuler: 'uranus',
        name: 'House of Community',
        keywords: ['groups', 'friends', 'future', 'humanitarian', 'innovation'],
        description: 'The field of groups and future vision. Any planet here is an AQUARIUS planet (True Placement).'
    },
    12: {
        number: 12,
        naturalSign: 'pisces',
        naturalRuler: 'neptune',
        name: 'House of Transcendence',
        keywords: ['transcendence', 'spirituality', 'hidden', 'dissolution', 'surrender'],
        description: 'The field of the unconscious and transcendence. Any planet here is a PISCES planet (True Placement).'
    }
};

// ============================================
// ASPECTS - The 7 Major Aspects
// ============================================

export const ASPECTS = {
    conjunction: {
        name: 'Conjunction',
        symbol: '☌',
        degrees: 0,
        keyword: 'Together',
        description: 'Planets are conjunct when within each other\'s orb of influence at 0 degrees. They blend and work together as one.',
        energy: 'Unified energy - the planets merge and operate as a combined force.'
    },
    semisextile: {
        name: 'Semi-Sextile',
        symbol: '⚺',
        degrees: 30,
        keyword: 'Hard Stop',
        description: 'A 30° aspect. Creates an issue when action is taken without considering value. Two different directions that need to converge.',
        energy: 'You need to pull the two energies together. Maximize one by applying it to something of value.',
        example: 'Aries (action) semi-sextiles Taurus (value) - most actions have no worth until aligned with value.'
    },
    sextile: {
        name: 'Sextile',
        symbol: '⚹',
        degrees: 60,
        keyword: 'Companion',
        description: 'A 60° companion/partnership energy. NOT a "mini-trine" - completely different. The energies must be used together.',
        energy: 'Consider the other energy - they must be used together to resolve what you\'re trying to do.',
        important: 'This is NOT half of a trine. It is a partnership that requires consideration of both.'
    },
    square: {
        name: 'Square',
        symbol: '□',
        degrees: 90,
        keyword: 'Conflict/Growth',
        description: 'A 90° aspect of conflict. But conflict creates GROWTH. Squares are very important and can be very positive.',
        energy: 'Tension and friction that forces development and growth.',
        important: 'Squares are not "bad" - they are opportunities for significant growth through challenge.'
    },
    trine: {
        name: 'Trine',
        symbol: '△',
        degrees: 120,
        keyword: 'Direct Effect',
        description: 'A 120° aspect. Whatever happens at the first point WILL affect the second point. Trines are NOT always easy!',
        energy: 'Direct flow between planets. What occurs at one directly influences the other.',
        important: 'Trines are often taught as "easy" but they are DIRECT EFFECTS that can be uncomfortable. Something annoying you might feel like a trine because it flows naturally - whether you like it or not.'
    },
    quincunx: {
        name: 'Quincunx',
        symbol: '⚻',
        degrees: 150,
        keyword: 'Toggle',
        description: 'A 150° toggle aspect. You can do one OR the other, but NEVER both at the same time.',
        energy: 'One or the other - a choice that cannot be combined.',
        example: 'Scorpio quincunx Aries - you can hold rage in (Scorpio) OR take action (Aries), but not both simultaneously. Being rageful makes you angry (8th to 1st), not the other way around.',
        important: 'There is an ORDER to the quincunx - the energy flows from one to the other in a specific direction.'
    },
    opposition: {
        name: 'Opposition',
        symbol: '☍',
        degrees: 180,
        keyword: 'Counterbalance',
        description: 'A 180° aspect about counterbalancing - NOT combining or meeting in the middle!',
        energy: 'Maintain BOTH energies equally from their respective points. Balance does not mean compromise.',
        example: 'Aries-Libra opposition: "How do I maintain myself, my autonomy, while also being in a relationship?" The answer is NOT to meet in the middle, but to hold BOTH fully.',
        important: 'Opposition does NOT mean to combine or find middle ground. If you meet in the middle of a seesaw, it tips wildly. You must balance both from their own positions.'
    }
};

// ============================================
// VITALITY ANCHORS (Mathematical Points)
// ============================================

export const VITALITY_ANCHORS = {
    ascendant: {
        name: 'Ascendant',
        abbreviation: 'ASC',
        keyword: 'Emergence',
        location: 'Always in the 1st House',
        description: 'This is WHERE and WHY you come out into the world through your actions. It is the horizon point at birth.',
        important: 'The Ascendant is WHY you showed up. The 1st House is HOW you show up. These are different things.',
        note: 'This is a mathematical point with NO orb of influence. Any planet touching it is in a FORCED aspect - the planet envelops the point.',
        alchemisticTerm: 'Hot Wire - when planets access this point they are felt much stronger than simply sitting in the 1st house.'
    },
    descendant: {
        name: 'Descendant',
        abbreviation: 'DSC',
        keyword: 'Submergence',
        location: 'Always in the 7th House (180° from ASC)',
        description: 'What you want to bring from the PUBLIC realm back into your PRIVATE/PERSONAL realm. The sunset point.',
        important: 'This is NOT "my partner". The 7th house is about partners. The Descendant is about what you bring from public to personal.',
        note: 'This is a mathematical point with NO orb of influence. Only connect to people you want to bring into your personal life.',
        alchemisticTerm: 'Hot Wire - the sunsetted energy is no longer public, it becomes private.'
    },
    midheaven: {
        name: 'Midheaven',
        abbreviation: 'MC',
        keyword: 'Peak Aspiration',
        location: 'CAN FLOAT - anywhere above the ASC-DSC axis (not locked to 10th house)',
        description: 'Your highest public visibility and peak aspiration. The highest point the sun reaches.',
        important: 'MC moves depending on latitude and house system. It can show up in the 1st house, 7th house, or anywhere above the horizon.',
        note: 'This is a mathematical point with NO orb of influence. Do NOT call it the Zenith - Zenith is directly overhead, which is different.',
        alchemisticTerm: 'Hot Wire - represents your peak public presence.'
    },
    ic: {
        name: 'Subheaven',
        abbreviation: 'IC',
        keyword: 'Core Anchor',
        location: 'CAN FLOAT - anywhere below the ASC-DSC axis (180° from MC)',
        description: 'Your deepest emotional truths and what keeps you tethered to this world. Your core anchor to reality.',
        important: 'IC is NOT Cancer energy, NOT the 4th house, NOT where you came from. It can BE in those places but is not those things.',
        note: 'This is a mathematical point with NO orb of influence. Do NOT call it the Nadir - Nadir is directly below through the Earth, which is different.',
        alchemisticTerm: 'Subheaven is the This Astrology term. It pulls you and roots you to reality.'
    }
};

// ============================================
// SELF-GROWTH POINTS
// ============================================

export const SELF_GROWTH_POINTS = {
    northNode: {
        name: 'North Node',
        symbol: '☊',
        keyword: 'Future Emotional Growth',
        orbOfInfluence: 3, // Moon-derived
        description: 'Calculated from when the Moon is heading south-to-north across the ecliptic at birth. Represents future emotional growth direction.',
        energy: 'What you need emotionally in the FUTURE. Out of comfort zone that you need to acquire comfort with.',
        important: 'You can NEVER fully reach or embody your North Node because it is always in the future. You can only align trajectory toward it.',
        relationship: 'The relationship with your mother you NEVER had but wish you did. That\'s why it\'s uncomfortable.'
    },
    southNode: {
        name: 'South Node',
        symbol: '☋',
        keyword: 'Past/Familiar',
        orbOfInfluence: 3, // Moon-derived
        description: 'The opposite point of the North Node (180°). Represents past patterns, instinct, and familiarity.',
        energy: 'What has always been for you with family, home, security, needs. Your habits and instincts.',
        important: 'Gives you great strength and skill but does not allow for emotional growth.',
        relationship: 'The relationship with your mother that you always had. Rooted in what always has been.',
        note: 'Because of the opposition, you use one node to fuel the other.'
    },
    chiron: {
        name: 'Chiron',
        symbol: '⚷',
        keyword: 'The Authentic Wound / The Key',
        orbOfInfluence: 1.5, // Surgical precision
        description: 'Chiron is an unstable Centaur orbiting between Saturn and Uranus. It is the "Rainbow Bridge" between your structure and your rebellion. It represents an area where you feel "not normal" and lack confidence, despite often having inherent authority there.',
        energy: 'The wound that cannot be "fixed," only accepted. Once you stop trying to be normal in this field, the wound becomes your greatest strength and your primary tool for mentorship.',
        important: 'Chiron is NOT a ruling planet. It is an unstable outlier. Its aspects should be read as "channels" rather than traditional connections.',
        teacherVoice: 'Teacher Voice: "Chiron is where you are broken, but it is also where you hold the key. Win without making a form. Accept the weakness as your unique authority."',
        vulnerability: 'This is where you feel like you are failing at being a "normal" human. The goal is to discover your OWN way of doing things in this house.',
        examples: [
            '4th House: Broken foundation; you find your own way to nurture and ground without traditional family structures.',
            '7th House: Relationship "failure"; typically manifests as divorce or non-traditional bonds that teach others how to relate authentically.',
            '10th House: Reputation attacks; your authority is non-traditional and lives outside of public status/titles.',
            '12th House: Hidden weirdness; you are a bridge to the spiritual world because you don\'t fit into the physical one correctly.'
        ]
    },
    blackMoonLilith: {
        name: 'Black Moon Lilith (Mean)',
        symbol: '⚸',
        keyword: 'Raw Emotional Truth',
        orbOfInfluence: 3, // Moon-derived
        description: 'The APOGEE of the Moon - the furthest point from Earth in the Moon\'s orbit at birth. Calculation of the Moon.',
        energy: 'Untethered liberation, seeking raw emotional needs and truth which disconnects from reality, thus creating deep guilt and shame.',
        important: 'You need to understand why you feel guilt and shame around things. What stops you from doing things because you feel it\'s not okay for you.',
        note: 'Use MEAN Black Moon Lilith, not True. Mean is inward, True adjusts for orbital variances and is outward.',
        opposite: 'White Moon Sophia (replaces Priapus in This Astrology) - the perigee, closest point to Earth.'
    }
};

// ============================================
// PHSR READING ORDER
// ============================================

export const PHSR = {
    name: 'PHSR Reading Order',
    description: 'The ONLY specific order for reading energy in This Astrology. You MUST read in this order.',
    order: [
        { letter: 'P', meaning: 'Planet', role: 'Focus', description: 'What is the energy source? The planet is the focus.' },
        { letter: 'H', meaning: 'House', role: 'Field', description: 'Where does it express in life? The house is the field.' },
        { letter: 'S', meaning: 'Sign', role: 'Tone', description: 'How is the energy colored? The sign is the tone.' },
        { letter: 'R', meaning: 'Ruler', role: 'Wrapper', description: 'What wraps it all together? Chase the ruler - it becomes the Planet again, continuing the chain.' }
    ],
    important: 'When you expand PHSR, insert decans, degrees, and aspects. You cannot say "Mars in the 7th house means X" without considering the Sign and Ruler.',
    example: {
        wrong: '"Mars in the 7th house means aggression toward partners."',
        why: 'You have Planet and House, but not Sign or Ruler. Without context, you cannot draw conclusions.',
        correct: 'Mars (Planet) in 7th House (Field) through Taurus (Tone) with ruler Venus in 6th (Wrapper) = Aries energy directed into partnership, expressed through self-value themes, wrapped in service and health matters.'
    }
};

// ============================================
// TRUE PLACEMENTS CONCEPT
// ============================================

export const TRUE_PLACEMENTS = {
    name: 'True Placements',
    description: 'In This Astrology, the HOUSE (inner wheel/Earth\'s rotation) is the core of your energy and arguably MORE IMPORTANT than the zodiac sign initially.',
    concept: 'Natural rulership replaces house numbers. A planet in a house takes on the energy of its natural ruling sign.',
    mapping: {
        1: 'Aries - If a planet is in your 1st house, it is an ARIES planet',
        2: 'Taurus - If a planet is in your 2nd house, it is a TAURUS planet',
        3: 'Gemini - If a planet is in your 3rd house, it is a GEMINI planet',
        4: 'Cancer - If a planet is in your 4th house, it is a CANCER planet',
        5: 'Leo - If a planet is in your 5th house, it is a LEO planet',
        6: 'Virgo - If a planet is in your 6th house, it is a VIRGO planet',
        7: 'Libra - If a planet is in your 7th house, it is a LIBRA planet',
        8: 'Scorpio - If a planet is in your 8th house, it is a SCORPIO planet',
        9: 'Sagittarius - If a planet is in your 9th house, it is a SAGITTARIUS planet',
        10: 'Capricorn - If a planet is in your 10th house, it is a CAPRICORN planet',
        11: 'Aquarius - If a planet is in your 11th house, it is an AQUARIUS planet',
        12: 'Pisces - If a planet is in your 12th house, it is a PISCES planet'
    },
    important: 'You are not your Sagittarius Rising - if Sagittarius is your Ascendant, you are an ARIES because the Ascendant sits in your 1st house, which is naturally ruled by Aries.',
    example: 'If you have Sun in the 8th house, your Sun is a SCORPIO Sun (True Placement) that EXPRESSES through whatever zodiac sign overlays that house.'
};

// ============================================
// MODALITIES
// ============================================

export const MODALITIES = {
    cardinal: {
        name: 'Cardinal',
        signs: ['aries', 'cancer', 'libra', 'capricorn'],
        keywords: ['pivot', 'change in direction', 'initiation'],
        description: 'Represent the solstices and equinoxes - the pivot points where direction changes.',
        important: 'Cardinal does not just mean "starting". It means PIVOT POINT. Capricorn is cardinal and about sustaining - because it is changing direction/pivoting, not because it starts something new.'
    },
    fixed: {
        name: 'Fixed',
        signs: ['taurus', 'leo', 'scorpio', 'aquarius'],
        keywords: ['sustaining', 'stabilizing', 'maintaining'],
        description: 'The sustainers - what is already initiated gets sustained here.',
        important: 'Fixed is not about what stays. It is about what is SUSTAINABLE. Sustenance and sustainability.'
    },
    mutable: {
        name: 'Mutable',
        signs: ['gemini', 'virgo', 'sagittarius', 'pisces'],
        keywords: ['adapting', 'changing', 'flowing'],
        description: 'The adapters - finding the way, seeing what needs to change, flowing with it.',
        important: 'Mutable signs CAN get stuck. Even though mutable means change, you can get stuck in the adaptation process.'
    }
};

// ============================================
// DUAL WHEEL STRUCTURE
// ============================================

export const DUAL_WHEEL = {
    innerWheel: {
        name: 'Inner Wheel (Houses/Fields)',
        color: 'Blue',
        represents: 'The EARTH spinning on its axis',
        creates: 'Houses (fields) and the Ascendant point',
        importance: 'This is the CORE of your energies. Arguably MORE IMPORTANT than zodiac signs initially.',
        note: 'The houses are based on sidurial rotation - one full spin of Earth on its axis.'
    },
    outerWheel: {
        name: 'Outer Wheel (Zodiac/Tone)',
        color: 'Purple',
        represents: 'The UNIVERSE outside - static, does not spin',
        creates: 'The zodiac signs based on the ecliptic and sun\'s declination',
        importance: 'This is the membrane/stained glass window through which energy passes.',
        note: 'The zodiac is based on the tropical structure (seasons from axial tilt), NOT constellations.'
    },
    center: {
        name: 'Center (Earth)',
        symbol: '⊕',
        represents: 'The Earth - YOU are an extension of the Earth',
        note: 'When people ask "where is Earth in the chart?" - it is EVERYWHERE. The whole chart IS the Earth. You, as an extension of Earth, every point is sensitive.'
    },
    transits: {
        name: 'Transits (Green Glyphs)',
        position: 'Outside the natal chart',
        represents: 'The universe\'s synastry with you',
        energy: 'They push IN through the outer membrane. The universe impresses its energy upon you.',
        important: 'You cannot fight the universe - it is too big. You must work WITH transits, not against them.'
    }
};

// ============================================
// NATAL RETROGRADES (Class #2)
// Different from transit retrogrades - these are INTERNALIZED energy
// ============================================

export const NATAL_RETROGRADES = {
    description: 'When a planet is retrograde in your natal chart, its energy is INTERNALIZED. This is completely different from transit retrogrades. Natal retrogrades are karmic lessons you\'re meant to learn.',
    important: 'The Sun and Moon cannot be retrograde. Retrogrades create an internalization of energy - working inward rather than outward.',

    mercury: {
        name: 'Mercury Retrograde',
        keywords: ['repetition', 'non-linear thinking', 'abstract', 'critical thinker'],
        description: 'You absorb thoughts and ideas through repetition and osmosis rather than deliberate study. You think out of the box, in non-linear patterns.',
        traits: [
            'Learning through doing, not reading textbooks',
            'Abstract thinking - may find "faster" ways to solve problems',
            'Constantly editing, reviewing, rethinking, replaying in your mind',
            'Critical thinker who questions what others say',
            'Difficulty "showing work" in conventional ways',
            'Can always get the right answer but not the "normal" way'
        ],
        challenge: 'School may have been difficult because you can\'t learn the standard way. You need application and experience.',
        gift: 'Once something clicks through repetition, you\'ve got it.'
    },
    venus: {
        name: 'Venus Retrograde',
        keywords: ['internalized love', 'unconventional beauty', 'different standards'],
        description: 'Your view of pleasure, love, and beauty is internalized and different from social norms. You seek unconventional partners, friends, and styles.',
        traits: [
            'Less concerned with social norms for beauty/relationships',
            'Internalized sense of what is beautiful or valuable',
            'Seek people who are different, not just "surface pretty"',
            'Need to communicate your needs because they\'re not obvious',
            'Partnership needs are not as obvious on the outside',
            'Look for something inward that connects outward'
        ],
        challenge: 'People don\'t understand what you need because it\'s not expressed outwardly.',
        gift: 'You find beauty and value where others don\'t see it.'
    },
    mars: {
        name: 'Mars Retrograde',
        keywords: ['self-competition', 'internalized anger', 'personal records'],
        description: 'You are not as competitive outwardly because you are in competition with YOURSELF. You set personal records and one-up yourself.',
        traits: [
            'Competes with self rather than others',
            'Sets personal records and goals against previous self',
            'Internalizes anger which "leaks out" unexpectedly',
            'May bottle up what\'s wrong instead of expressing it',
            'Anger comes out when you least expect it',
            'Drive is directed inward before being expressed outward'
        ],
        challenge: 'Look at what HOUSE Mars is in - that\'s where repressed anger gets taken out (7th house = partner, 1st house = your own actions).',
        gift: 'Constantly improving against your own standards, not others\'.'
    },
    jupiter: {
        name: 'Jupiter Retrograde',
        keywords: ['hidden opportunities', 'own philosophy', 'untried paths'],
        description: 'You see luck and opportunities where others ignore or pass by them. You prefer to take another crack at things others have tried and failed.',
        traits: [
            'See opportunities others miss',
            'Form your own moral, ethical code, religion, philosophy',
            'Seek answers from within, not external authority',
            'Don\'t care as much for other people\'s experiences as your own',
            'Seek abundance in untried and unproven areas',
            'Forge your own path in areas that are untested'
        ],
        challenge: 'Can go both ways - you might keep trying something that obviously doesn\'t work, OR find success where others failed.',
        gift: 'You don\'t give up and you find your own way to expansion.'
    },
    saturn: {
        name: 'Saturn Retrograde',
        keywords: ['self-worth doubts', 'late bloomer', 'self-imposed limitations'],
        description: 'You may doubt your worthiness as a human being. Authority is internalized - you seek it constantly from yourself. This is a really tough retrograde.',
        traits: [
            'Doubt self-worth and authority over anything',
            'May avoid taking responsibility for mistakes',
            'Fearful of taking chances',
            'Self-imposed limitations and burdens',
            'Late bloomer - even more so than typical Saturn',
            'Subconscious fear of rejection, loss, and limitation',
            'May blame others to protect fragile self-worth'
        ],
        challenge: 'If ill-aspected with Venus/Taurus, can lead to depression or being perceived as lazy ("what\'s the point?"). Fear of losing reputation/authority.',
        gift: 'Once you accept responsibility and build internal authority, you become incredibly strong and disciplined.',
        parentNote: 'If your child has Saturn retrograde, work on building their self-worth. Make them feel supported and capable.'
    },
    uranus: {
        name: 'Uranus Retrograde',
        keywords: ['natural rebel', 'reformer', 'proves self to self'],
        description: 'You are a natural born rebel, not just outwardly but at your very core. You have strong reformer instincts for everybody else.',
        traits: [
            'Internally rebellious - especially against authority',
            'Strong desire to help others fix themselves or live better',
            'Constantly testing personal abilities against others',
            'Must prove yourself TO yourself repeatedly',
            'Try to make your own structures and foundations make sense to yourself',
            'Test yourself by throwing things out of whack to prove you can sustain it'
        ],
        challenge: 'Can get into trouble by rebelling against everything. Reformer instincts can come across as telling people how to be.',
        gift: 'Deeply committed to innovation and breaking unnecessary systems from within.'
    },
    neptune: {
        name: 'Neptune Retrograde',
        keywords: ['virtue confusion', 'savior complex', 'super generous'],
        description: 'You can be confused inwardly as to whether you\'re virtuous or not. You might not know if you\'re a good person. Persistently seeking to help others.',
        traits: [
            'Unclear internally if you\'re a good person',
            'Help others whether the help is wanted or not',
            'Super generous, super helpful',
            'Always looking out for the underdog (because you feel like one)',
            'Illusional quality about how you see yourself',
            'Utopian view with savior complex tendencies'
        ],
        challenge: 'More susceptible to being taken advantage of. May offer unsolicited help. Be careful not to push your desire to "save" onto others.',
        gift: 'Deeply compassionate and genuinely helpful when help is wanted.'
    },
    pluto: {
        name: 'Pluto Retrograde',
        keywords: ['transformation difficulty', 'hidden power', 'mortality issues'],
        description: 'About half the population has this. You have difficulty accepting transformation or fully accepting death. You question your own personal power.',
        traits: [
            'Hard time with deep transformational change',
            'May have issues with mortality and endings',
            'Question own personal power',
            'Unaware of your effect on others',
            'Deep sense of upheaval from within',
            'Transformation comes from a very deep, karmic place'
        ],
        challenge: 'Don\'t realize when you say things that they cut to the core of people (positively or negatively). Unaware of your depth.',
        gift: 'Once you accept your power and internalize it, you become incredibly transformative for yourself and others in the area where Pluto sits.'
    }
};

// ============================================
// DECANS (Class #2)
// 10-degree subdivisions with element-based flavors
// ============================================

export const DECANS = {
    description: 'Each zodiac sign is 30° divided into three 10° subdivisions called decans. Each decan adds a "flavor" from the next sign of the same element.',
    system: 'Traditional Decans (NOT Chaldean) - follows element order',
    usage: 'A decan adds flavor to the sign - still reading the main sign energy, but with added detail.',

    aries: {
        first: { degrees: '0-10°', flavor: 'aries', ruler: 'mars', description: 'Pure Aries energy - Mars/Aries' },
        second: { degrees: '10-20°', flavor: 'leo', ruler: 'sun', description: 'Aries with Leo flavor - adds drama, entertainment, ego' },
        third: { degrees: '20-30°', flavor: 'sagittarius', ruler: 'jupiter', description: 'Aries with Sagittarius flavor - adds teaching, travel, philosophy' }
    },
    taurus: {
        first: { degrees: '0-10°', flavor: 'taurus', ruler: 'venus', description: 'Pure Taurus energy - Venus/Taurus' },
        second: { degrees: '10-20°', flavor: 'virgo', ruler: 'mercury', description: 'Taurus with Virgo flavor - adds service, organization, analysis' },
        third: { degrees: '20-30°', flavor: 'capricorn', ruler: 'saturn', description: 'Taurus with Capricorn flavor - adds structure, discipline, mastery' }
    },
    gemini: {
        first: { degrees: '0-10°', flavor: 'gemini', ruler: 'mercury', description: 'Pure Gemini energy - Mercury/Gemini' },
        second: { degrees: '10-20°', flavor: 'libra', ruler: 'venus', description: 'Gemini with Libra flavor - adds partnership, balance, value with others' },
        third: { degrees: '20-30°', flavor: 'aquarius', ruler: 'uranus', description: 'Gemini with Aquarius flavor - adds innovation, groups, future thinking' }
    },
    cancer: {
        first: { degrees: '0-10°', flavor: 'cancer', ruler: 'moon', description: 'Pure Cancer energy - Moon/Cancer' },
        second: { degrees: '10-20°', flavor: 'scorpio', ruler: 'pluto', description: 'Cancer with Scorpio flavor - adds depth, transformation, intensity' },
        third: { degrees: '20-30°', flavor: 'pisces', ruler: 'neptune', description: 'Cancer with Pisces flavor - adds spirituality, creativity, transcendence' }
    },
    leo: {
        first: { degrees: '0-10°', flavor: 'leo', ruler: 'sun', description: 'Pure Leo energy - Sun/Leo' },
        second: { degrees: '10-20°', flavor: 'sagittarius', ruler: 'jupiter', description: 'Leo with Sagittarius flavor - adds vision, seeking, expansion' },
        third: { degrees: '20-30°', flavor: 'aries', ruler: 'mars', description: 'Leo with Aries flavor - adds action, drive, initiation' }
    },
    virgo: {
        first: { degrees: '0-10°', flavor: 'virgo', ruler: 'mercury', description: 'Pure Virgo energy - Mercury/Virgo' },
        second: { degrees: '10-20°', flavor: 'capricorn', ruler: 'saturn', description: 'Virgo with Capricorn flavor - adds structure, mastery, discipline' },
        third: { degrees: '20-30°', flavor: 'taurus', ruler: 'venus', description: 'Virgo with Taurus flavor - adds value, self-worth, sustainability' }
    },
    libra: {
        first: { degrees: '0-10°', flavor: 'libra', ruler: 'venus', description: 'Pure Libra energy - Venus/Libra' },
        second: { degrees: '10-20°', flavor: 'aquarius', ruler: 'uranus', description: 'Libra with Aquarius flavor - adds innovation, groups, independence' },
        third: { degrees: '20-30°', flavor: 'gemini', ruler: 'mercury', description: 'Libra with Gemini flavor - adds communication, thinking, options' }
    },
    scorpio: {
        first: { degrees: '0-10°', flavor: 'scorpio', ruler: 'pluto', description: 'Pure Scorpio energy - Pluto/Scorpio' },
        second: { degrees: '10-20°', flavor: 'pisces', ruler: 'neptune', description: 'Scorpio with Pisces flavor - adds spirituality, intuition, transcendence' },
        third: { degrees: '20-30°', flavor: 'cancer', ruler: 'moon', description: 'Scorpio with Cancer flavor - adds nurturing, emotional security, family' }
    },
    sagittarius: {
        first: { degrees: '0-10°', flavor: 'sagittarius', ruler: 'jupiter', description: 'Pure Sagittarius energy - Jupiter/Sagittarius' },
        second: { degrees: '10-20°', flavor: 'aries', ruler: 'mars', description: 'Sagittarius with Aries flavor - adds action, competition, direction' },
        third: { degrees: '20-30°', flavor: 'leo', ruler: 'sun', description: 'Sagittarius with Leo flavor - adds creativity, ego, expression' }
    },
    capricorn: {
        first: { degrees: '0-10°', flavor: 'capricorn', ruler: 'saturn', description: 'Pure Capricorn energy - Saturn/Capricorn' },
        second: { degrees: '10-20°', flavor: 'taurus', ruler: 'venus', description: 'Capricorn with Taurus flavor - adds value, resources, stability' },
        third: { degrees: '20-30°', flavor: 'virgo', ruler: 'mercury', description: 'Capricorn with Virgo flavor - adds service, analysis, improvement' }
    },
    aquarius: {
        first: { degrees: '0-10°', flavor: 'aquarius', ruler: 'uranus', description: 'Pure Aquarius energy - Uranus/Aquarius' },
        second: { degrees: '10-20°', flavor: 'gemini', ruler: 'mercury', description: 'Aquarius with Gemini flavor - adds communication, local connection, ideas' },
        third: { degrees: '20-30°', flavor: 'libra', ruler: 'venus', description: 'Aquarius with Libra flavor - adds partnership, balance, one-on-one' }
    },
    pisces: {
        first: { degrees: '0-10°', flavor: 'pisces', ruler: 'neptune', description: 'Pure Pisces energy - Neptune/Pisces' },
        second: { degrees: '10-20°', flavor: 'cancer', ruler: 'moon', description: 'Pisces with Cancer flavor - adds nurturing, home, emotional security' },
        third: { degrees: '20-30°', flavor: 'scorpio', ruler: 'pluto', description: 'Pisces with Scorpio flavor - adds transformation, depth, intensity' }
    }
};

// ============================================
// ORB VALUES (Class #2)
// Planet-specific orb of influence values
// ============================================

export const ORB_VALUES = {
    description: 'Orb of influence values are based on planet SIZE and PROXIMITY to Earth. Larger/closer planets have larger orbs.',
    usage: 'Apply in BOTH directions from the planet\'s degree. E.g., Sun at 10° with 8° orb = influences 2° to 18°.',
    important: 'These values apply to both natal aspects AND transits.',

    sun: { min: 8, max: 10, note: 'Largest orb - the Sun is huge and pulsates energy broadly' },
    moon: { min: 2, max: 3, note: 'Small but close - very personal, quick-moving influence' },
    mercury: { min: 2, max: 3, note: 'Small planet, tight orb' },
    venus: { min: 5, max: 6, note: 'Medium-sized inner planet' },
    mars: { min: 3, max: 4, note: 'Small but distinct influence' },
    jupiter: { min: 7, max: 8, note: 'Giant planet, large orb' },
    saturn: { min: 7, max: 8, note: 'Giant planet, large orb - very important for Saturn returns' },
    uranus: { min: 3, max: 5, note: 'Outer planet, moderate orb' },
    neptune: { min: 3, max: 4, note: 'Outer planet, moderate orb' },
    pluto: { min: 2, max: 3, note: 'Small and distant, tight orb - may be even less' },

    asymmetricInfluence: 'When a larger planet\'s orb reaches a smaller planet but not vice versa, the larger planet influences the smaller one, but not the reverse. E.g., Saturn reaching Mercury means Saturn influences Mercury, but Mercury doesn\'t fully influence Saturn.'
};

// ============================================
// DEEP ANGLES (Class #2)
// Enhanced interpretations for the four angles
// ============================================

export const DEEP_ANGLES = {
    ascendant: {
        name: 'Ascendant (ASC)',
        notAMask: 'The Ascendant is NOT a mask you wear - that is completely wrong. It literally IS you.',
        represents: [
            'Physical body and appearance',
            'How you dress',
            'Self-awareness and first impressions',
            'Immediate gut, knee-jerk reactions',
            'Your physical presence on an Earthly soul level'
        ],
        hotWire: 'When planets access this point, they are felt MUCH stronger than just sitting in the 1st house.',
        distinction: 'The 1st house is the house of self. The Ascendant is the point that describes what happens to YOU directly.'
    },

    descendant: {
        name: 'Descendant (DSC)',
        represents: [
            'How you handle direct one-on-one influence',
            'Your relationship with other people',
            'How other people impact you',
            'What people see when you are NOT engaging',
            'Compatibility basis - what you NEED in relationships',
            'Conditions for which you get married',
            'Your SHADOW qualities - things you don\'t see about yourself'
        ],
        shadowExplanation: 'People don\'t actually see your ascendant when you\'re just sitting there - they see your descendant. When you\'re ENGAGED and ACTIVE, they see your ascendant.',
        shadows: {
            aries_rising: { dsc: 'libra', shadow: 'Don\'t see how much you need balance and partnership, or how indecisive you can be' },
            taurus_rising: { dsc: 'scorpio', shadow: 'Don\'t see how intense and transformative you can be, or how possessive' },
            gemini_rising: { dsc: 'sagittarius', shadow: 'Don\'t see how philosophical or preachy you can be' },
            cancer_rising: { dsc: 'capricorn', shadow: 'Don\'t see how ambitious and structured you are, or how cold you can seem' },
            leo_rising: { dsc: 'aquarius', shadow: 'Don\'t see how good a friend you can be (or how detached you can be)' },
            virgo_rising: { dsc: 'pisces', shadow: 'Don\'t notice how much service you give (or how critical you are)' },
            libra_rising: { dsc: 'aries', shadow: 'Don\'t see how competitive and self-focused you can be' },
            scorpio_rising: { dsc: 'taurus', shadow: 'Don\'t see how stubborn and value-focused you can be' },
            sagittarius_rising: { dsc: 'gemini', shadow: 'Don\'t see how scattered or multi-focused you can be' },
            capricorn_rising: { dsc: 'cancer', shadow: 'Don\'t see how emotional and nurturing you can be' },
            aquarius_rising: { dsc: 'leo', shadow: 'Don\'t see how dramatic and attention-seeking you can be' },
            pisces_rising: { dsc: 'virgo', shadow: 'Don\'t see how critical and analytical you can be' }
        }
    },

    ic: {
        name: 'IC (Imum Coeli / Nadir)',
        canFloat: 'IC can sit in the 3rd, 4th, or 5th house in Whole Signs',
        represents: [
            'Childhood environment (especially first 5-6 years)',
            'Innermost feelings and privacy',
            'Things you don\'t share with other people',
            'Access to your deep emotional self',
            'Connection to repressed memories',
            'Lineage, ancestry, familial roots',
            'Where you came from'
        ],
        byHouse: {
            3: {
                name: 'IC in 3rd House',
                childhood: 'Early childhood tied to communications, relationships with siblings or cousins, local environment',
                private: 'Things you acted on, said, or did in childhood that you don\'t put on display'
            },
            4: {
                name: 'IC in 4th House',
                childhood: 'Childhood tied to your mother, physical home, and family dynamics',
                private: 'Family may know your private self if IC is here'
            },
            5: {
                name: 'IC in 5th House',
                childhood: 'Childhood tied to creativity, creative expression, recreation',
                private: 'Your creative inner world and playful side that you keep private'
            }
        },
        akashicNote: 'For past life readings, the IC along with the Moon and South Node are used to derive where you came from and what type of energy you had prior to this lifetime.'
    },

    mc: {
        name: 'Midheaven (MC / Medium Coeli)',
        canFloat: 'MC can sit in the 9th, 10th, or 11th house in Whole Signs',
        represents: [
            'Soul\'s outward projection',
            'Life purpose and career direction',
            'Public reputation and social standing',
            'How people see you in terms of the public',
            'Everything you put out there (opposite of IC\'s privacy)',
            'The themes of HOW you achieve your career'
        ],
        distinction: 'The 10th house tells you the FIELD you\'ll be in. The MC tells you the THEMES of how you\'ll achieve that career.',
        byHouse: {
            9: {
                name: 'MC in 9th House',
                purpose: 'Life purpose through philosophy, opinion, higher understanding',
                expression: 'Your outward expression is about where you fit in the world and how you see things differently. You have to do things YOUR way.'
            },
            10: {
                name: 'MC in 10th House',
                purpose: 'Life purpose through career, reputation, public image',
                expression: 'Traditional career orientation - climbing the corporate ladder, fame, notoriety, positive public image.'
            },
            11: {
                name: 'MC in 11th House',
                purpose: 'Life purpose through networking, groups, humanitarian efforts',
                expression: 'Your outward expression is about working with groups, teams, organizations, hopes and dreams, not necessarily climbing a career ladder.'
            }
        }
    }
};

// ============================================
// PLANETARY CLUSTERS (Class #2)
// Stellium vs Satellitium
// ============================================

export const PLANETARY_CLUSTERS = {
    stellium: {
        name: 'Stellium',
        definition: 'Three or more planets in the same sign that ARE within each other\'s orb of influence',
        effect: 'The planets blend and change each other\'s energy. They work together as a combined force.',
        important: 'You must check the ORBS - just being in the same sign is not enough!',
        example: 'Planets at 25°, 27°, and 29° of a sign would typically be a stellium as they are within most planets\' orbs.'
    },
    satellitium: {
        name: 'Satellitium',
        definition: 'Three or more planets in the same sign that are NOT within each other\'s orb of influence',
        effect: 'The planets work INDEPENDENTLY within the same area of life. They do NOT change each other\'s energy.',
        important: 'This is a cluster of planets that do NOT impact each other - very different from a stellium!',
        example: 'Planets at 5°, 15°, and 24° of Libra - too far apart to be in orb, so they work independently on Libra/7th house matters.'
    },
    detection: {
        step1: 'Count planets in the same sign',
        step2: 'If 3+, check the degrees of each planet',
        step3: 'Apply the larger planet\'s orb to see if they overlap',
        step4: 'If orbs overlap = Stellium. If not = Satellitium.'
    }
};

// ============================================
// RULERSHIP CHAINS (Class #2)
// Layered and bidirectional rulership interpretation
// ============================================

export const RULERSHIP_CHAINS = {
    description: 'The unique interpretation method that makes readings accurate. Follow rulership chains multiple layers deep.',

    standardRulership: {
        name: 'Standard Rulership (Forward)',
        steps: [
            '1. Look at a house (e.g., 2nd house of money)',
            '2. Note the sign on that house (e.g., Pisces)',
            '3. Find the ruler of that sign (Neptune for Pisces)',
            '4. See where the ruler sits (e.g., 11th house)',
            '5. Interpret: Money comes through 11th house matters (groups, networking, technology)'
        ],
        example: '2nd house in Pisces → Neptune rules Pisces → Neptune in 11th house → Money through networking/groups'
    },

    secondLayer: {
        name: 'Second Layer (Deeper)',
        description: 'Continue the chain by finding the ruler of the house where the first ruler sits',
        steps: [
            '1. From Standard Rulership, note what house the ruler is in (e.g., 11th)',
            '2. Note what sign is on THAT house (e.g., Sagittarius)',
            '3. Find the ruler of Sagittarius (Jupiter)',
            '4. See where Jupiter sits (e.g., 4th house)',
            '5. Interpret: The networking/groups have to do with home/family/nurturing themes'
        ],
        example: 'Neptune in 11th (Sagittarius) → Jupiter rules Sagittarius → Jupiter in 4th → Groups connected to home/family'
    },

    reverseRulership: {
        name: 'Bidirectional/Reverse Rulership',
        description: 'Look at planets IN a house and trace back what they RULE',
        steps: [
            '1. Note a planet sitting in a house (e.g., Mars in 2nd)',
            '2. Ask: What does Mars RULE? (Aries)',
            '3. Find where Aries is in the chart (e.g., 3rd house)',
            '4. Interpret: 3rd house matters (identity, communication) FEED INTO 2nd house (money)'
        ],
        example: 'Mars in 2nd house → Mars rules Aries → Aries on 3rd house → Identity/communication feeds into making money'
    },

    rulerInOwnHouse: {
        name: 'Ruler in Own House',
        description: 'When a house ruler sits in its own house (e.g., Mars in Aries 1st house)',
        effect: 'The focus is COMPARTMENTALIZED back onto the same theme. Not bringing other areas of life into focus.',
        examples: [
            'Saturn in Capricorn in 10th = Focus purely on career, authority, achievement',
            'Moon in Cancer in 4th = Focus purely on home, family, emotional security',
            'Mars in Aries in 1st = Focus purely on self, action, autonomy'
        ],
        important: 'This is neither good nor bad - it simply means that theme is self-contained until aspects bring in other energies.'
    },

    lenses: {
        name: 'Using Lenses',
        description: 'Read planets through the TOPIC you are examining',
        example: 'When discussing money (2nd house), don\'t read Mars as "sex" - read it as "passion and drive for value"',
        important: 'Keep thematic associations relevant to your query, but keep other meanings in the back of your mind as secondary influences.'
    }
};

// ============================================
// ASPECT DIRECTION (Class #2)
// Applying vs Separating aspects
// ============================================

export const ASPECT_DIRECTION = {
    description: 'Aspects have DIRECTION. Which planet is faster matters for interpretation.',
    important: 'This is especially relevant for transits and progressions.',

    applying: {
        name: 'Applying Aspect',
        definition: 'The faster planet is APPROACHING the exact aspect',
        energy: 'Influence is BUILDING. The energy is intensifying toward the exact hit.',
        interpretation: 'Events and themes are developing and coming together.'
    },

    exact: {
        name: 'Exact Aspect',
        definition: 'Planets are at the precise aspect degree (e.g., exactly 0° for conjunction)',
        energy: 'Maximum intensity. The aspect is fully active.',
        interpretation: 'Peak of the energy expression.'
    },

    separating: {
        name: 'Separating Aspect',
        definition: 'The faster planet has PASSED the exact aspect and is moving away',
        energy: 'Influence is RELEASING. The faster planet now takes the lead.',
        interpretation: 'The faster planet\'s energy becomes dominant. Things may feel easier as the aspect releases.',
        example: 'The Great Conjunction (Saturn-Jupiter 2020) got easier AFTER the exact hit because Jupiter took the lead and its expansive energy dominated.'
    },

    whichPlanetLeads: {
        faster: 'Moon → Mercury → Venus → Sun → Mars → Jupiter → Saturn → Uranus → Neptune → Pluto (slowest)',
        note: 'After an aspect perfects, the faster planet "takes the lead" and its energy is expressed more prominently.'
    }
};

// ============================================
// CHART AXES (Class #2)
// Understanding the two main axes
// ============================================

export const CHART_AXES = {
    description: 'The chart has two main axes that create four quadrants. Understanding the axes helps understand balance.',

    ascendantDescendant: {
        name: 'ASC-DSC Axis (Horizon Line)',
        theme: 'Self vs Others',
        ascendant: 'WHO YOU ARE - your identity, your actions, your physical presence',
        descendant: 'HOW YOU RELATE - one-on-one relationships, what you bring from public to private',
        balance: 'Maintain BOTH energies from their respective points. Don\'t meet in the middle.',
        example: 'Aries-Libra: "How do I maintain myself, my autonomy, while also being in a relationship?" Hold BOTH fully.'
    },

    icMidheaven: {
        name: 'IC-MC Axis (Meridian Line)',
        theme: 'Private vs Public',
        ic: 'YOUR ROOTS - childhood, ancestry, private emotional self, what you hide',
        mc: 'YOUR PROJECTION - career, reputation, public image, what you show',
        balance: 'Use childhood experiences (IC) to inform your public path (MC), but don\'t let the past limit your public expression.',
        example: 'What you experienced in childhood shapes what you project outward in career - either repeating patterns or breaking them.'
    },

    quadrants: {
        first: { houses: [1, 2, 3], theme: 'Personal Development - Self, Value, Identity' },
        second: { houses: [4, 5, 6], theme: 'Personal Expression - Home, Creativity, Service' },
        third: { houses: [7, 8, 9], theme: 'Social Expansion - Partnership, Transformation, Philosophy' },
        fourth: { houses: [10, 11, 12], theme: 'Social Integration - Career, Community, Transcendence' }
    }
};

// ============================================
// DEGREE INTERPRETATION (Class #2)
// How to read degrees and minutes correctly
// ============================================

export const DEGREE_INTERPRETATION = {
    description: 'Understanding how to read degrees and minutes in astrological charts.',

    format: {
        example: '15°32\'',
        meaning: '15 degrees and 32 minutes',
        calculation: '60 minutes = 1 degree',
        decimal: '15°32\' ≈ 15.53° (32/60 = 0.53)'
    },

    rounding: {
        rule: 'If minutes are 30+, effectively treat as next degree for orb calculations',
        examples: [
            '5°56\' is effectively 6° (56 minutes is almost a full degree)',
            '15°32\' is effectively 15.5°',
            '24°15\' is effectively 24.25°'
        ]
    },

    importance: {
        note: 'Don\'t just look at the degree number - look at the whole thing',
        example: 'A planet at 5°56\' is almost at 6°, not "at 5". This matters for determining orbs and aspects.'
    },

    criticalDegrees: {
        description: 'Certain degrees are considered more potent',
        anareticDegree: '29° of any sign - the "fate degree", represents completion and urgency',
        zeroDegree: '0° of any sign - fresh, new energy of that sign, powerful initiation point'
    }
};
// ============================================
// ALCHEMISTIC RULES (Extracted Knowledge)
// ============================================

export const ALCHEMISTIC_RULES = {
    R001: { id: 'R001', name: 'House Condition Priority', description: 'Conditions of houses must be considered for interpretation.' },
    R002: { id: 'R002', name: 'The Delegate Principle', description: 'A delegate is a representative of the energy expressed through a sign ruler.' },
    R003: { id: 'R003', name: 'Financial Flow Source', description: 'Maternal figures influence financial flow (2nd House).' },
    R004: { id: 'R004', name: 'The Title Rule', description: 'The 10th House represents public reputation and the "Title" one holds.' },
    R005: { id: 'R005', name: 'Leo Rising Exception', description: 'Emotional sensitivity to family dynamics applies ONLY to Leo rising natives.' },
    R006: { id: 'R006', name: 'Statis Period', description: 'When Multiple planets (Mercury, Mars, Jupiter) are in retrograde, internal work must precede external action.' },
    R007: { id: 'R007', name: 'Applying vs. Separating', description: 'Retrograde planets moving back towards a point are thematic revisits of lessons.' },
    R008: { id: 'R008', name: 'Descendant-to-First Relay', description: 'Points on the descendant can impact the 1st house if they opposition the ascendant.' },
    R009: { id: 'R009', name: 'Rulership Firewall', description: 'A planet\'s current state (e.g. retrograde) does not change its status as a house ruler.' },
    R010: { id: 'R010', name: 'Remote Activation', description: 'Geographical locations activate personal chart energy.' },
    R011: { id: 'R011', name: 'Moon in 8th Warning', description: 'Moon in 8th is "not desired" due to the intensity of feeling hidden or secret emotions.' },
    R012: { id: 'R012', name: 'Frequency Law', description: 'Astrological influence is based on frequency and energy flow, not just static placement.' },
    R013: { id: 'R013', name: 'Burnout Trigger', description: 'Energy directed into pursuits conflicting with desires (Mars/Asc) triggers burnout.' },
    R014: { id: 'R014', name: 'Sextile = Companion Energy', description: 'If a native has a sextile, they must realize it is a companion energy designed to resolve conflict.' },
    R015: { id: 'R015', name: 'The Repression Law', description: 'We repress what we don\'t remember.' },
    R016: { id: 'R016', name: 'The Prime Law', description: 'If you don\'t have the Order of planets and energies, you don\'t have Astrology.' },
    R017: { id: 'R017', name: 'Juno Constraint', description: 'If Juno is retrograde (especially with Chiron Rx), the native cannot commit to the same thing in perpetuity.' },
    R018: { id: 'R018', name: 'Rule of Resource Source', description: 'If Pluto is in the 2nd, the resource sense comes from Scorpio\'s position (as a delegate).' },
    R019: { id: 'R019', name: 'Money through Trauma', description: 'If 2nd house is tied to 8th/12th delegates, income comes from other people\'s trauma, not yours.' },
    R020: { id: 'R020', name: 'Energy Flow Priority', description: 'Saturn is often the "Main Influence" while other active planets may not be affecting a specific house.' },
    R021: { id: 'R021', name: 'Motivational Value', description: 'Value is tied directly to motivations. Saturn in 1st structures motivation by duty.' },
    R022: { id: 'R022', name: 'Parenthood and Children', description: 'Rulers in the 1st house vs Sun presence in family charts.' },
    R023: { id: 'R023', name: 'Job Archetypes', description: 'Commission jobs (performance-based) vs Hourly jobs (fixed-rate).' },
    R024: { id: 'R024', name: 'Reframing 8th/12th', description: 'These houses are areas of deep exploration, not inherent stigma.' },
    R025: { id: 'R025', name: 'Memory Recall', description: 'Neptune/Jupiter must align with other planets to trigger higher-order spiritual recall.' },
    R026: { id: 'R026', name: 'The Workloop Paradox', description: 'Lilith in 6th conjunct South Node leads to compulsive work habits without clear reasons.' },
    R027: { id: 'R027', name: 'The Purpose Block', description: 'Over-criticizing your purpose prevents it from manifesting.' },
    R028: { id: 'R028', name: 'Rulership Firewall II', description: 'A planet\'s current state (retrograde) is delegated to the house, not the ruler status.' },
    R029: { id: 'R029', name: 'The New Moon Signature', description: 'Born just after a New Moon means Purpose precedes Comfort.' },
    R030: { id: 'R030', name: 'Buffer Rule', description: 'Time management must include a buffer to account for energy flow.' },
    R031: { id: 'R031', name: 'Identity Conflict', description: 'If Ascendant sits on a 2nd/3rd cusp, self-worth and communication conflict (Rule R061/R062).' }
};

export const ALCHEMISTIC_FORMULAS = {
    F001: { id: 'F001', name: 'The Theme Formula', formula: 'Theme = (Rising Sign House Order) + (Associated Sign Energy)' },
    F002: { id: 'F002', name: 'Communication Depth', formula: 'CommDepth = (Solar Energy + 3rd House Condition) / (12th House Subconscious Influences)' },
    F003: { id: 'F003', name: 'Total House Condition', formula: 'TotalCond = (Direct Aspects) + (Out-of-Orb Thematic Resonances)' },
    F004: { id: 'F004', name: 'Energy Spillage', formula: 'Spillage = (Planet degree < 1.5° or > 28.5°) and (Distance to next house boundary)' },
    F005: { id: 'F005', name: 'Internal Authority', formula: 'Authority = (Resolution of 4th House Trauma) + (Acceptance of 2nd House Value)' },
    F006: { id: 'F006', name: 'Priority Selection', formula: 'House Ruler (Delegate) > Natural Ruler for local environment.' }
};
