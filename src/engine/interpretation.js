/**
 * Astrology Readings - Interpretation Engine
 * Implements PHSR Sequence: Planet → House → Sign → Ruler
 * 
 * ALCHEMISTIC ASTROLOGY PRINCIPLES:
 * - Read ENERGY, not placements
 * - Ask "How does it manifest?" not "What does it mean?"
 * - Everything is personal - even metapersonal planets connect to YOU
 * - Free will allows alchemy (shift/harmonize/redirect energy)
 */

import {
    PLANETARY_TIERS, PLANET_TO_TIER, SIGN_RULERS, SIGN_ELEMENTS,
    SIGN_MODALITIES, HOUSE_THEMES, MOTION_STATES, DECANS,
    PLANET_SYMBOLS, SIGN_SYMBOLS
} from '../core/constants.js';

import {
    PLANETS as ALCHEMISTIC_PLANETS,
    ZODIAC_SIGNS as ALCHEMISTIC_SIGNS,
    HOUSES as ALCHEMISTIC_HOUSES,
    VITALITY_ANCHORS,
    PLANET_GROUPS,
    TRUE_PLACEMENTS,
    ALCHEMISTIC_RULES,
    ALCHEMISTIC_FORMULAS
} from '../data/alchemistic-knowledge.js';

// ============================================
// PLANETARY INTERPRETATIONS
// ============================================

// Use alchemistic planet definitions matched to User Prompt
export const PLANET_MEANINGS = {
    sun: {
        focus: 'The Right to Exist, Vitality, Father Energy',
        keywords: ['right to exist', 'father energy', 'inner child', 'risk', 'vitality'],
        question: 'What parts of my true self did I have to suppress to be accepted by my father or authority figures?',
        group: PLANET_GROUPS.ultraPersonal.name,
        groupDescription: PLANET_GROUPS.ultraPersonal.description,
        energy: 'The fuel that keeps you moving and your creative expression',
        beginnerExplanation: 'The Sun is your "Right to Exist." In the split with Saturn, it represents the vital, risk-taking "Father" energy and the inner child. It asks: Can you take the risk of being seen as you truly are?',
        simpleQuestion: 'Where do I need to take the risk of authentic existence?'
    },
    moon: {
        focus: 'Safety, Emotional Needs, The Mother, The Activator',
        keywords: ['safety', 'emotional needs', 'the past', 'activator', 'gut reaction'],
        question: 'What did I need as a child that I am still trying to provide for myself today?',
        group: PLANET_GROUPS.ultraPersonal.name,
        groupDescription: PLANET_GROUPS.ultraPersonal.description,
        energy: 'Instinctual reactions and emotional security',
        beginnerExplanation: 'The Moon is "The Mother"—the primary attachment. It is the activator of your emotions. It reveals the adaptations you made to feel safe. When the Moon triggers a degree, it is an invitation to look at your gut reactions.',
        simpleQuestion: 'What do I need to feel deeply, authentically safe?'
    },
    mercury: {
        focus: 'The Mind, Logic, Identity (The ID)',
        keywords: ['mental acuity', 'logic', 'identity', 'communication', 'processing'],
        question: 'How do my thoughts protect me from feeling my deeper emotions?',
        group: PLANET_GROUPS.personal.name,
        groupDescription: PLANET_GROUPS.personal.description,
        energy: 'Mental acuity and processing',
        beginnerExplanation: 'Mercury is your "Identity" and your mind. It rules the inward thought (Gemini) and the outward practical routine (Virgo). It is how you navigate the world intellectually, sometimes at the expense of feeling.',
        simpleQuestion: 'How does my mind process my reality?'
    },
    venus: {
        focus: 'Value, Self-Worth, Relational Attachment',
        keywords: ['value', 'self-worth', 'relational value', 'engagement', 'resources'],
        question: 'What do I find valuable because it was valued by those I needed to love me?',
        group: PLANET_GROUPS.personal.name,
        groupDescription: PLANET_GROUPS.personal.description,
        energy: 'The concept of Value (Self and Relational)',
        beginnerExplanation: 'Venus is about VALUE. It is the bridge to others. In Taurus, it is your internal sense of self-worth. In Libra, it is how you determine value through others. It shows what you find worthy of your engagement.',
        simpleQuestion: 'How do I determine what is truly valuable?'
    },
    mars: {
        focus: 'Action, The Body, Force, Connection',
        keywords: ['physical body', 'action', 'force', 'speed', 'connection'],
        question: 'How does my body carry the stress I cannot express through words?',
        group: PLANET_GROUPS.extraPersonal.name,
        groupDescription: PLANET_GROUPS.extraPersonal.description,
        energy: 'Physical force and connection to the world',
        beginnerExplanation: 'Mars is the "Physical Body." It is action, not necessarily anger. It is how you connect to the external world through force. If suppressed, this energy often manifests as stress or disease within the body.',
        simpleQuestion: 'How do I use my physical force to connect or protect?'
    },
    jupiter: {
        focus: 'The Great Amplifier, Expansion, Belief',
        keywords: ['amplifier', 'expansion', 'philosophy', 'higher learning', 'beliefs'],
        question: 'What am I amplifying to avoid looking at my internal pain?',
        group: PLANET_GROUPS.transpersonal.name,
        groupDescription: PLANET_GROUPS.transpersonal.description,
        energy: 'Amplification of whatever it touches',
        beginnerExplanation: 'Jupiter is the "Great Amplifier." It expands what it touches—wealth, hope, but also excess and avoidance. It is the search for a larger meaning that can sometimes be a flight from the self.',
        simpleQuestion: 'Where am I seeking expansion in my life?'
    },
    saturn: {
        focus: 'Structure, Restriction, The Container, The Father',
        keywords: ['structure', 'restriction', 'authority', 'time', 'container'],
        question: 'What external structures have I built to replace the missing internal ones?',
        group: PLANET_GROUPS.transpersonal.name,
        groupDescription: PLANET_GROUPS.transpersonal.description,
        energy: 'The Container that gives form to life',
        beginnerExplanation: 'Saturn is the "Father" energy of structure and restriction. It provides the container for life. If your Saturn is retrograde, you are the "Authority over Authority," distrusting titles and respecting only earned competence (Rule R045).',
        simpleQuestion: 'Where must I accept the discipline of structure?'
    },
    uranus: {
        focus: 'Awakening, Rebellion, Abrupt Change',
        keywords: ['awakening', 'future', 'abrupt change', 'rebellion', 'breaking structure', 'quick luck'],
        question: 'Where is my authentic self screaming to break free from the jail of social conformity?',
        group: PLANET_GROUPS.metapersonal.name,
        groupDescription: PLANET_GROUPS.metapersonal.description,
        energy: 'Abrupt change and breaking of structures',
        beginnerExplanation: 'Uranus is the "Great Awakener." It has an axial tilt over 90 degrees—it is essentially "upside down" (Rule R005). It breaks Saturnian structures to allow the authentic future to emerge through abrupt, electrifying change.',
        simpleQuestion: 'Where do I need to break free from tradition?'
    },
    neptune: {
        focus: 'Spiral, Spirituality, Dissolution, Fog',
        keywords: ['illusion', 'spirituality', 'subconscious', 'dreams', 'fog', 'health illusion'],
        question: 'Where am I escaping reality to find a sense of connection I lacked as a child?',
        group: PLANET_GROUPS.metapersonal.name,
        groupDescription: PLANET_GROUPS.metapersonal.description,
        energy: 'The Fog that obscures reality',
        beginnerExplanation: 'Neptune is the spiritual realm, the "fog." If retrograde, it is an "Inward Utopianism." It represents the dissolution of boundaries. Be careful of illusions regarding health or spiritual bypass (Rule R054/R080).',
        simpleQuestion: 'Where is my perception most foggy or idealized?'
    },
    pluto: {
        focus: 'Power, Transformation, The Underworld, Evolution',
        keywords: ['power', 'transformation', 'underworld', 'evolution', 'phoenix', 'potential death'],
        question: 'What must die within me for my true power to be born?',
        group: PLANET_GROUPS.metapersonal.name,
        groupDescription: PLANET_GROUPS.metapersonal.description,
        energy: 'Evolution through destruction of the old',
        beginnerExplanation: 'Pluto is "Power." If retrograde, you go through intense teardowns and rebuilds in private (Rule R046). It is the evolution of life through the total destruction of what is no longer authentic.',
        simpleQuestion: 'Where do I experience the most intense transformation?'
    },
    chiron: {
        focus: 'The Authentic Wound, The Inner Authority',
        keywords: ['weakness turned strength', 'inner authority', 'rainbow bridge', 'unstable orbit', 'mentorship', 'hidden opportunity'],
        question: 'What is the pain I am carrying, and how has it become my greatest adaptation?',
        group: 'Other Points',
        groupDescription: 'Chiron and Liliths are special sensitivity points',
        energy: 'The "Rainbow Bridge" between inner structure (Saturn) and outer rebellion (Uranus).',
        beginnerExplanation: 'Chiron is where your structure was broken down. It is not a wound to be "healed" but an invitation to mentorship. It is the unstable centaur—the bridge between your Saturnian container and your Uranian freedom. Your greatest authority lives in your greatest pain.',
        simpleQuestion: 'Can I accept my "wounded" area as the foundation of my true authority?'
    },
    vesta: {
        focus: 'Spark of Life, Vitality, Internal Flame',
        keywords: ['vitality', 'passion', 'internal flame', 'devotion', 'spark of life'],
        question: 'What is the internal spark that keeps me alive?',
        group: 'Other Points',
        groupDescription: 'Asteroids and specialized points',
        energy: 'The eternal flame of the soul',
        beginnerExplanation: 'Vesta is the "Spark of Life." It represents your internal flame and your capacity for focus and devotion. It is what keeps you vitalized from the inside out.',
        simpleQuestion: 'What is my sacred internal spark of life?'
    },
    meanLilith: {
        focus: 'The Repressed Shadow, Internalized Shame',
        keywords: ['shadow', 'primal', 'the bully', 'internalized shame', 'repression', 'guilt'],
        question: 'What parts of my primal self was I forced to hide to remain safe in my family?',
        group: 'Other Points',
        groupDescription: 'Chiron and Liliths are special sensitivity points',
        energy: 'The "Mean Bully"—internalized shame (Rule R012/R013).',
        beginnerExplanation: 'Mean Lilith is the internalized "Bully." It represents themes of rebellion and independence that were suppressed. It is tied to guilt and shame. The work is to move into a "Shame-Free Zone" (Rule R082).',
        simpleQuestion: 'What part of my raw truth do I feel ashamed to speak?'
    },
    trueLilith: {
        focus: 'Outward Projection, Geometric Rebellion',
        keywords: ['visceral', 'oscillation', 'outward projection', 'rebellion', 'jagged path'],
        question: 'Where do I project my need for absolute freedom onto the world?',
        group: 'Other Points',
        groupDescription: 'Chiron and Liliths are special sensitivity points',
        energy: 'The "Osculating" precise point—where the leash is tested (Rule R011).',
        beginnerExplanation: 'True (Osculating) Lilith is the precise, jagged path of your rebellion. It is outward projection. The strategy here is the "Leash Rule": let her out of the cage, but do not let her off the leash (Rule R011).',
        simpleQuestion: 'Where do I defy social norms to the point of potentially alienating myself?'
    },
    // NEW ALCHEMISTIC EXTENSIONS
    delegate: {
        focus: 'The Representative, The Local Executor',
        energy: 'The energy that embodies the intention of a house elsewhere in the chart.',
        rule: 'A delegate is a representative of a house sign ruling energy (Rule R002/R028).'
    }
};

// Rule-based insights and house definitions continue below...


export const LILITH_HOUSE_INSIGHTS = {
    1: 'You may feel a deep disconnect or shame around your physical body and identity. You reject expectations of how you are "supposed" to look, yet feel an urge to prove your existence (Rule R035/R043).',
    2: 'Rebellion against traditional value and money systems. You likely feel "the authority is already there" but struggle with the "idea-money hiccup"—how to monetize your revolutionary truth (Rule R038/R089).',
    3: 'Communication feels heavy. You reject small talk and need "dead air" to process what is NOT being said. You likely learned at home that your words weren\'t safe (Rule R100/R111).',
    4: 'Your emotional roots and family home felt like a cage. You expect from others what you never received at home (Rule R101). Your foundation is built on non-traditional "spirituality" rather than biology.',
    5: 'Rebellion around creativity and romance. Regarding children, you might seek non-traditional paths (IVF) or feel a visceral "No" to the standard domestic script. You need to let your creativity be wild (Rule R053).',
    6: 'You don\'t like routine; it feels like oppression. You do things quicker than others but shut down if forced to do it "their way." Your health is tied to your sense of freedom (Rule R047).',
    7: 'The "Double Whammy" of shame in partnership. You feel a visceral fight-or-flight with authority figures and may have shame around your words or being "too much" for a partner (Rule R024/R111).',
    8: 'Intimacy is a minefield of "shoulds." You feel an expectation of diving deeper that you intuitively reject. You have authority here but feel challenged by the shadow of the other (Rule R052).',
    9: 'Rejection of formal education and religion. You already understood the philosophy intuitively and find college to be of "poor vibe" or lacking soul (Rule R031/R088).',
    10: 'Rebellion against traditional status. "I already have the authority, but I don\'t like the vibe of authority." You refuse to dumb yourself down for a paycheck (Rule R016/R114).',
    11: 'Dislike of networking and "friendship games." You feel better than the people in the group because you see the conformity "nut job" stage. You need your own circle (Rule R033/R096).',
    12: 'The furthest point from Earth—intense isolation and spiritual disconnect. You are a bridge to the subconscious, but your "weirdness" feels like a liability until you accept it as your power.'
};

// ============================================
// SIGN INTERPRETATIONS
// ============================================

export const SIGN_MEANINGS = {
    aries: {
        tone: 'Initial survival, defensive pioneering',
        style: 'Direct, urgent, and courageous',
        shadow: 'Impatience born of a fear of being overlooked',
        adaptation: 'You likely learned early that to be noticed, you had to lead or act with extreme urgency. Your boldness is a survival strategy to ensure your needs are met in a world that felt competitive.'
    },
    taurus: {
        tone: 'Grounding for safety, sensual stability',
        style: 'Steady, deliberate, and practical',
        shadow: 'Stubbornness as a defense against change',
        adaptation: 'Your need for physical comfort and stability was likely a response to early unpredictability. You learned that having "tangible" resources made you safe.'
    },
    gemini: {
        tone: 'Mental agility, inquisitive processing',
        style: 'Quick, versatile, and communicative',
        shadow: 'Fragmentation born of over-processing',
        adaptation: 'Your quick mind was likely an adaptation to an unpredictable environment where you had to "read the room" or process data rapidly to stay safe or stay relevant.'
    },
    cancer: {
        tone: 'Nurturing defense, sensitivity to the field',
        style: 'Protective, emotional, and intuitive',
        shadow: 'Clinging as a response to perceived abandonment',
        adaptation: 'You developed a heightened sensitivity to the emotional states of those around you. You learned to nurture to ensure you remained connected to your primary attachments.'
    },
    leo: {
        tone: 'Radiant identity, the need to be seen',
        style: 'Expressive, confident, and warm',
        shadow: 'Performative validation-seeking',
        adaptation: 'You likely learned that you were safest when you were at the center of attention. Your "shine" is a way to ensure you aren\'t overlooked or forgotten.'
    },
    virgo: {
        tone: 'Precision as control, helpful refinement',
        style: 'Analytical, helpful, and detail-oriented',
        shadow: 'Critical perfectionism born of anxiety',
        adaptation: 'You likely learned that being "perfect" or "useful" was the only way to avoid chaos or criticism. Your attention to detail is your effort to keep a potentially messy world in check.'
    },
    libra: {
        tone: 'Diplomacy as peace-keeping, relational harmony',
        style: 'Balanced, fair, and aesthetically driven',
        shadow: 'Self-erasure in the name of "getting along"',
        adaptation: 'You mastery of seeing all sides as a way to diffuse tension. Your "people-pleasing" tendencies are adaptations to a home life where peace was fragile.'
    },
    scorpio: {
        tone: 'Intensity as protection, deep perception',
        style: 'Magnetic, probing, and transformative',
        shadow: 'Suspicion as a response to perceived betrayal',
        adaptation: 'You developed a "psychic radar" to detect hidden threats. Your intensity is a survival mechanism to ensure that nobody can surprise or hurt you again.'
    },
    sagittarius: {
        tone: 'Expansion as flight, philosophical search',
        style: 'Freedom-loving, optimistic, and direct',
        shadow: 'Avoiding the internal heavy through external vastness',
        adaptation: 'Your need for freedom and "the truth" was likely an adaptation to a childhood that felt heavy, restrictive, or burdened with local stress.'
    },
    capricorn: {
        tone: 'The structured adult, endurance as value',
        style: 'Strategic, disciplined, and enduring',
        shadow: 'Rigidity as a defense against perceived failure',
        adaptation: 'You were likely the "little adult" who took on responsibility before you were ready. Your discipline is your way of proving that you can carry the world without breaking.'
    },
    aquarius: {
        tone: 'Detached innovation, social rebellion',
        style: 'Original, objective, and forward-thinking',
        shadow: 'Emotional isolation masquerading as independence',
        adaptation: 'You adapted by stepping outside of the system. You learned that emotional detachment and intellectual uniqueness kept you safe from the pressures of conformity.'
    },
    pisces: {
        tone: 'Dissolutive empathy, imaginative refuge',
        style: 'Compassionate, mystical, and fluid',
        shadow: 'Escapism born of an inability to filter pain',
        adaptation: 'You likely fled to your imagination or a spiritual world when the material world felt too harsh or insensitive. Your empathy is your capacity to feel the collective pain of the world.'
    }
};

export const CHIRON_HOUSE_INSIGHTS = {
    1: 'The wound is in the physical body and self-perception. You likely feel "wrong" or "broken" in your basic identity and strive to prove you are "enough."',
    2: 'Wound around money and value. You likely reject the expectations of traditional value systems and feel a visceral dislike for "meaningless" money.',
    3: 'The wound is in the mind. You might dislike facts, figures, or the structure of early education, feeling that your non-linear thought process is a defect.',
    4: 'Wound in the foundational safety and home. Your emotional roots felt like a site of fracture, forcing you to find your own authority away from biology.',
    5: 'The wound of creative "theatrics." You might feel awkward about play or traditionally "fun" things, leading to self-expression that is unique but pressurized.',
    6: 'Routine feels like oppression. Your health and daily work are sites of friction where you reject being "just another cog" in the machine.',
    7: 'The wound of the mirror. You relate to others through your "brokenness," often trying to prove your worth by being all things to all people.',
    8: 'Intimacy and shared power are the sites of surgery. You feel the "underworld" intensely and may retreat from traditional intimacy to protect your authority.',
    9: 'Rejection of higher education "vibe." You already understood the philosophy intuitively and find formal institutions lacking in authentic soul.',
    10: 'The wound of public authority. You likely dislike traditional leadership and feel that success in the public eye is a jagged path toward internal peace.',
    11: 'Friction in groups and networking. You see the conformity of the group as a "nut job" stage and prefer to operate as the lone authentic visionary.',
    12: 'The hidden wound. You feel "weird" or disconnected in a way you can\'t name, serving as a bridge to the subconscious that others cannot see.'
};

// ============================================
// RETROGRADE INTERPRETATIONS (Natal)
// ============================================

export const RETROGRADE_MEANINGS = {
    mercury: {
        theme: 'Internalized mental processing (Adaptation to being unheard)',
        description: 'You tend to overcompensate to prove you have a "normal" mind. This energy is turned inward, leading to deep non-linear thinking. You likely learned that speaking up wasn\'t safe or effective, so you developed a profound internal world instead (Rule R039).',
        gift: 'The ability to find original, non-linear answers that others miss entirely.',
        challenge: 'Chronic self-doubt about your intelligence and your right to be understood.'
    },
    venus: {
        theme: 'Internalized value (Adaptation to conditional love)',
        description: 'You push harder to prove your self-worth because you likely felt that love was something to be earned. Your standards of beauty and value are unique because they were forged in internal isolation. You may oscillate between "over-giving" and "shutting down."',
        gift: 'The Capacity for radical, non-traditional self-love that doesn\'t rely on external praise.',
        challenge: 'A tendency to over-value others at the total expense of your own boundaries.'
    },
    mars: {
        theme: 'Internalized force (Adaptation to suppressed anger)',
        description: 'Because your physical drive was likely discouraged or shamed, you turned that force inward. You compete with yourself aggressively to prove you are "enough," yet often feel stuck in inaction when the body feels unsafe.',
        gift: 'Precision and surgical discipline when you finally choose to act from your center.',
        challenge: 'Internalized stress and physical tension that can manifest as bodily symptoms.'
    },
    jupiter: {
        theme: 'Internalized belief (Adaptation to lack of hope)',
        description: 'You seek internal expansion because external "luck" or support may have felt missing early on. You often over-prepare or over-believe in private systems because you don\'t trust the external world to hold you.',
        gift: 'An unshakeable internal optimism that can withstand external hardship.',
        challenge: 'Ignoring real-world boundaries in pursuit of an internal "spiritual bypass."'
    },
    saturn: {
        theme: 'Internalized authority (The Authority over Authority)',
        description: 'You likely had caregivers who failed to provide a reliable container, so you became your own judge. You do not respect titles born of tradition; you only respect earned competence (Rule R045).',
        gift: 'A profound internal moral compass and the ability to build your own reality.',
        challenge: 'Chronic feelings of unworthiness because your internal standards are impossibly high.'
    },
    uranus: {
        theme: 'Internalized awakening (The Private Rebel)',
        description: 'The impulse to rebel is core to your identity, but you may have had to keep it secret. You disrupt your own progress to ensure you aren\'t being controlled by external scripts.',
        gift: 'Total authenticity—even in private. You cannot be manipulated by social pressure.',
        challenge: 'Self-sabotage as a way to "prove" that nobody owns your success.'
    },
    neptune: {
        theme: 'Internalized utopianism (Emotional Dissolution)',
        description: 'You have an internal vision of connection that the world often fails to meet. You may over-idealize internal concepts or "check out" emotionally to avoid the pain of a disconnected reality.',
        gift: 'Deep internal compassion and a direct connection to the subconscious.',
        challenge: 'A tendency to use spirituality as a distraction from your physical reality.'
    },
    pluto: {
        theme: 'Internalized evolution (Powerless to Powerful)',
        description: 'You may feel a chronic lack of control, often stemming from early environments where you were small and powerless. This causes a massive internal drive to regenerate and prove you are in charge of your own survival (Rule R046).',
        gift: 'The ability to rise from the ashes entirely on your own strength.',
        challenge: 'Fear of intimacy, as letting someone in feels like a loss of power.'
    },
    meanLilith: {
        theme: 'Inward Shadow Conversation (Rule R080)',
        description: 'When Lilith is in retrograde, the shadow of shame is turned inward. You are essentially "oppressing yourself" to stay safe. You may feel guilty for your own authentic needs even when nobody is judging you (Rule R021).',
        gift: 'Total self-authority once you stop being your own internal bully.',
        challenge: 'Intense self-criticism and a visceral sense of being "wrong" for existing.'
    }
};

// ============================================
// PHSR INTERPRETATION SEQUENCE
// ============================================

/**
 * Generate full PHSR interpretation for a planet placement
 * Planet (Focus) → House (Field) → Sign (Tone) → Ruler (Delegate)
 */
export function interpretPlacement(planetName, planetData, houses, chartData) {
    const planet = PLANET_MEANINGS[planetName];
    const sign = SIGN_MEANINGS[planetData.sign];
    const house = HOUSE_THEMES[planetData.house];
    const ruler = SIGN_RULERS[planetData.sign];
    const rulerData = chartData.planets[ruler];
    const rulerHouse = rulerData?.house;

    const tier = PLANET_TO_TIER[planetName];
    const element = SIGN_ELEMENTS[planetData.sign];
    const modality = SIGN_MODALITIES[planetData.sign];

    // Get decan flavor
    const decanSign = DECANS[planetData.sign][planetData.decan - 1];
    const decanRuler = SIGN_RULERS[decanSign];

    const interpretation = {
        summary: `${capitalize(planetName)} in ${capitalize(planetData.sign)} in House ${planetData.house}`,

        // P - Planet (Focus)
        planet: {
            name: capitalize(planetName),
            symbol: PLANET_SYMBOLS[planetName],
            tier: tier,
            focus: planet.focus,
            question: planet.question,
            keywords: planet.keywords
        },

        // H - House (Field) - Enhanced with alchemistic data
        house: {
            number: planetData.house,
            name: house.name,
            _debug_house_type: typeof planetData.house,
            _debug_lookup: !!ALCHEMISTIC_HOUSES[planetData.house],
            alchemisticName: ALCHEMISTIC_HOUSES[planetData.house]?.name || house.name,
            field: `This energy operates in the field of ${house.name.toLowerCase()}`,
            keywords: ALCHEMISTIC_HOUSES[planetData.house]?.keywords || house.keywords,
            lifeArea: `Manifests through: ${house.keywords.join(', ')}`,

            // EARTH ARC IDENTITY (True Placement)
            naturalSign: ALCHEMISTIC_HOUSES[planetData.house]?.naturalSign || null,
            trueIdentity: ALCHEMISTIC_HOUSES[planetData.house]?.naturalSign
                ? capitalize(ALCHEMISTIC_HOUSES[planetData.house].naturalSign)
                : null,
            truePlacement: ALCHEMISTIC_HOUSES[planetData.house]
                ? `In the ${ordinal(planetData.house)} house, this planet takes on ${ALCHEMISTIC_HOUSES[planetData.house].naturalSign.toUpperCase()} energy (True Placement).`
                : null,

            // Pass specific Alchemystic properties
            identity: ALCHEMISTIC_HOUSES[planetData.house]?.identity || null,
            physicalBody: ALCHEMISTIC_HOUSES[planetData.house]?.physicalBody || null,
            romance: ALCHEMISTIC_HOUSES[planetData.house]?.romance || null
        },

        // S - Sign (Tone)
        sign: {
            name: capitalize(planetData.sign),
            symbol: SIGN_SYMBOLS[planetData.sign],
            tone: sign.tone,
            style: sign.style,
            shadow: sign.shadow,
            element: element,
            modality: modality
        },

        // R - Ruler (Delegate)
        ruler: {
            planet: capitalize(ruler),
            rulerSymbol: PLANET_SYMBOLS[ruler],
            house: rulerHouse,
            delegation: rulerHouse
                ? `${capitalize(planetData.sign)}'s ruler ${capitalize(ruler)} sits in House ${rulerHouse}, delegating this energy to ${HOUSE_THEMES[rulerHouse]?.name.toLowerCase()} matters`
                : 'Ruler position provides additional context'
        },

        // Additional context
        decan: {
            number: planetData.decan,
            flavor: `${capitalize(decanSign)} decan (${capitalize(decanRuler)} flavor)`,
            description: `Adds a ${SIGN_MEANINGS[decanSign].tone.toLowerCase()} nuance`
        },

        motionState: {
            state: planetData.motionState,
            ...MOTION_STATES[planetData.motionState]
        },

        // Retrograde interpretation if applicable
        retrograde: planetData.motionState === 'retrograde' && RETROGRADE_MEANINGS[planetName]
            ? RETROGRADE_MEANINGS[planetName]
            : null,

        // Full narrative
        narrative: generateNarrative(planetName, planetData, house, sign, ruler, rulerHouse),

        // Actionable Guidance
        guidance: generateGuidance(planetName, planetData, house, sign)
    };

    return interpretation;
}

/**
 * Generate a readable narrative interpretation
 */
function generateNarrative(planetName, planetData, house, sign, ruler, rulerHouse) {
    const planet = PLANET_MEANINGS[planetName];
    const signData = SIGN_MEANINGS[planetData.sign];

    let narrative = `Your **${capitalize(planetName)}** is here to help you find **${planet.focus.toLowerCase()}**. `;
    narrative += `Because it's in **${capitalize(planetData.sign)}**, you do this in a **${signData.style.toLowerCase()}** way. `;
    narrative += `This focuses your energy on **${house.name}**, specifically affecting your **${house.keywords.slice(0, 2).join(' and ')}**.`;

    if (rulerHouse) {
        narrative += `\n\nKey Insight: Since this energy is ruled by **${capitalize(ruler)}** in House ${rulerHouse}, you'll find that your **${house.name}** success is actually tied to your **${HOUSE_THEMES[rulerHouse]?.name}**.`;
    }

    if (planetData.motionState === 'retrograde') {
        const retro = RETROGRADE_MEANINGS[planetName];
        if (retro) {
            narrative += `\n\n**Retrograde Note:** You experience this internally. ${retro.description}`;
        }
    }

    return narrative;
}

/**
 * Generate actionable advice ("You should...")
 */
function generateGuidance(planetName, planetData, house, sign) {
    const planet = PLANET_MEANINGS[planetName];
    const signData = SIGN_MEANINGS[planetData.sign];

    // Template: "To maximize [Planet], you should [Sign Action] in your [House Area]."
    return `To make the most of your **${capitalize(planetName)}** (your ${planet.keywords[0]} energy): \n\n` +
        `🚀 **Action:** You should adopt a **${signData.tone.split(',')[0]}** approach.\n` +
        `🎯 **Focus:** Direct this energy effectively into **${house.name}** matters like **${house.keywords[0]}**.\n` +
        `✨ **Manifestation Tip:** When you act acting **${signData.style}**, you unlock the full power of this placement!`;
}

// ============================================
// RULERSHIP CHAINS
// ============================================

/**
 * Trace bi-directional and layered rulership
 */
export function traceRulership(houseNumber, chartData, depth = 0, maxDepth = 3) {
    if (depth >= maxDepth) return null;

    const houseSign = chartData.houses[houseNumber]?.sign;
    if (!houseSign) return null;

    const ruler = SIGN_RULERS[houseSign];
    const rulerData = chartData.planets[ruler];
    const rulerHouse = rulerData?.house;

    const chain = {
        house: houseNumber,
        sign: houseSign,
        ruler: ruler,
        rulerHouse: rulerHouse,
        interpretation: `House ${houseNumber} (${capitalize(houseSign)}) → ${capitalize(ruler)} in House ${rulerHouse}`,
        meaning: `${HOUSE_THEMES[houseNumber]?.name} matters are influenced by ${HOUSE_THEMES[rulerHouse]?.name?.toLowerCase()} through ${capitalize(ruler)}`
    };

    // Forward (layered) rulership - follow the chain
    if (rulerHouse && rulerHouse !== houseNumber) {
        chain.nextLayer = traceRulership(rulerHouse, chartData, depth + 1, maxDepth);
    }

    // Reverse rulership - what houses does this ruler rule?
    chain.reverseRulership = findHousesRuledBy(ruler, chartData);

    return chain;
}

/**
 * Find all houses ruled by a planet
 */
function findHousesRuledBy(planetName, chartData) {
    const houses = [];

    for (const [houseNum, houseData] of Object.entries(chartData.houses)) {
        const sign = houseData.sign;
        if (SIGN_RULERS[sign] === planetName) {
            houses.push({
                house: parseInt(houseNum),
                sign: sign,
                meaning: `${capitalize(planetName)} brings House ${houseNum} (${HOUSE_THEMES[houseNum]?.name}) energy wherever it sits`
            });
        }
    }

    return houses;
}

// ============================================
// ANGLE INTERPRETATIONS (VITALITY ANCHORS)
// ============================================

export function interpretAngles(angles, houses) {
    return {
        ascendant: {
            name: 'Ascendant (ASC)',
            keyword: VITALITY_ANCHORS.ascendant.keyword,
            sign: capitalize(angles.ascendant.sign),
            degree: `${Math.floor(angles.ascendant.degreeInSign)}°${Math.round((angles.ascendant.degreeInSign % 1) * 60)}'`,
            location: VITALITY_ANCHORS.ascendant.location,
            meaning: VITALITY_ANCHORS.ascendant.description,
            themes: ['WHY you showed up', 'Emergence into the world', 'Gateway to action'],
            important: VITALITY_ANCHORS.ascendant.important,
            interpretation: `Your Ascendant is in **${capitalize(angles.ascendant.sign)}**. This is your "Hot Wire" to reality.`,
            guidance: `Because you have **${capitalize(angles.ascendant.sign)} Rising**, the world sees you as **${SIGN_MEANINGS[angles.ascendant.sign].style}**. You should embrace your natural **${SIGN_MEANINGS[angles.ascendant.sign].tone}** energy when starting anything new. Don't hide this—it's your front door!`,
            alchemisticNote: VITALITY_ANCHORS.ascendant.alchemisticTerm
        },

        descendant: {
            name: 'Descendant (DSC)',
            keyword: VITALITY_ANCHORS.descendant.keyword,
            sign: capitalize(angles.descendant.sign),
            degree: `${Math.floor(angles.descendant.degreeInSign)}°${Math.round((angles.descendant.degreeInSign % 1) * 60)}'`,
            location: VITALITY_ANCHORS.descendant.location,
            meaning: VITALITY_ANCHORS.descendant.description,
            themes: ['What you bring from public to personal', 'Sunset point', 'Submergence'],
            important: VITALITY_ANCHORS.descendant.important,
            interpretation: `Your Descendant is in **${capitalize(angles.descendant.sign)}**. This is your point of "Submergence" or the sunset.`,
            guidance: `You attract **${capitalize(angles.descendant.sign)}** energy from others. When you meet people you want to bring into your inner circle, look for those who embody **${SIGN_MEANINGS[angles.descendant.sign].tone}** traits. You are learning to balance your own energy with this polarity.`,
            alchemisticNote: VITALITY_ANCHORS.descendant.alchemisticTerm
        },

        midheaven: {
            name: 'Midheaven (MC)',
            keyword: VITALITY_ANCHORS.midheaven.keyword,
            sign: capitalize(angles.midheaven.sign),
            house: getAngleHouse(angles.midheaven.longitude, houses),
            degree: `${Math.floor(angles.midheaven.degreeInSign)}°${Math.round((angles.midheaven.degreeInSign % 1) * 60)}'`,
            location: VITALITY_ANCHORS.midheaven.location,
            meaning: VITALITY_ANCHORS.midheaven.description,
            themes: ['Peak aspiration', 'Highest public visibility', 'Public purpose'],
            important: VITALITY_ANCHORS.midheaven.important,
            interpretation: `Your MC is in **${capitalize(angles.midheaven.sign)}**. This is your Peak Aspiration and highest visibility.`,
            guidance: `To succeed in your public life, you should embody **${capitalize(angles.midheaven.sign)}** qualities. Be **${SIGN_MEANINGS[angles.midheaven.sign].tone}** in your career. The world wants to see you showing up with this specific energy!`,
            warning: 'Do NOT call this the Zenith - the Zenith is directly overhead, which is different.',
            alchemisticNote: VITALITY_ANCHORS.midheaven.alchemisticTerm
        },

        ic: {
            name: 'Subheaven (IC)',
            keyword: VITALITY_ANCHORS.ic.keyword,
            sign: capitalize(angles.ic.sign),
            house: getAngleHouse(angles.ic.longitude, houses),
            degree: `${Math.floor(angles.ic.degreeInSign)}°${Math.round((angles.ic.degreeInSign % 1) * 60)}'`,
            location: VITALITY_ANCHORS.ic.location,
            meaning: VITALITY_ANCHORS.ic.description,
            themes: ['Core anchor', 'Deepest emotional truths', 'What tethers you to reality'],
            important: VITALITY_ANCHORS.ic.important,
            interpretation: `Your Subheaven (IC) is in **${capitalize(angles.ic.sign)}**. This is your anchor to reality.`,
            guidance: `When you feel lost or ungrounded, retreat to your **${capitalize(angles.ic.sign)}** roots. You find stability through **${SIGN_MEANINGS[angles.ic.sign].tone}** experiences. This is your safe place.`,
            warning: 'Do NOT call this the Nadir - the Nadir is directly below through the Earth, which is different.',
            alchemisticNote: VITALITY_ANCHORS.ic.alchemisticTerm
        }
    };
}

function getAngleHouse(longitude, houses) {
    for (const [num, data] of Object.entries(houses)) {
        if (longitude >= data.startDegree && longitude < data.endDegree) {
            return parseInt(num);
        }
    }
    return null;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getOrdinalSuffix(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

function ordinal(n) {
    return n + getOrdinalSuffix(n);
}

// ============================================
// FULL CHART INTERPRETATION
// ============================================

/**
 * Generate complete chart interpretation
 */
export function interpretFullChart(chartData) {
    const interpretations = {
        angles: interpretAngles(chartData.angles, chartData.houses),
        planets: {},
        rulershipChains: {}
    };

    // Interpret each planet
    for (const [planetName, planetData] of Object.entries(chartData.planets)) {
        interpretations.planets[planetName] = interpretPlacement(
            planetName,
            planetData,
            chartData.houses,
            chartData
        );
    }

    // Generate rulership chains for key houses
    const keyHouses = [1, 2, 4, 7, 10]; // Self, Money, Home, Relationships, Career
    for (const house of keyHouses) {
        interpretations.rulershipChains[house] = traceRulership(house, chartData);
    }

    return interpretations;
}

// ============================================
// LENS ANALYSIS
// ============================================

/**
 * Identify interpretation availability for specific lenses
 * (e.g. Love = 5, 7, 8; Career = 2, 6, 10)
 */
export function analyzeLens(lensName, chartData) {
    // Lenses Mapping
    const lenses = {
        love: {
            name: 'Love & Relationship Lens',
            houses: [5, 7, 8],
            description: 'Focuses on Romance (5th), Partnership (7th), and Intimacy (8th).'
        },
        career: {
            name: 'Career & Purpose Lens',
            houses: [2, 6, 10],
            description: 'Focuses on Money (2nd), Daily Work (6th), and Public Standing (10th).'
        }
    };

    const target = lenses[lensName.toLowerCase()];
    if (!target) return null;

    const result = {
        name: target.name,
        description: target.description,
        components: []
    };

    target.houses.forEach(houseNum => {
        result.components.push(traceRulership(houseNum, chartData));
    });

    return result;
}
