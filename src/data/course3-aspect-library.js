/**
 * Course 3 Aspect Library - Rich Interpretations
 * Extracted from "COURSE 3 astrology.txt" transcript
 * 
 * These interpretations go deeper than generic astrology,
 * emphasizing manifestation, polarity, and practical application.
 */

export const COURSE_3_ASPECTS = {
    conjunction: {
        title: "The Power of Fusion",
        keywords: ["Power", "Focus", "Intensity", "Fusion", "New Moon Energy"],
        description: "Two planets occupying the same space, creating a unified force. Like a New Moon where Sun and Moon work together. This is POWER - harnessed energy at one point.",
        positive: "Unified strength, intense focus, successful blending of energies. Can create manifestation when aligned.",
        negative: "Overwhelming intensity, loss of individual distinction, oscillation between energies, one planet overpowering the other.",
        manifestation: "Use BOTH energies together intentionally. Don't let one dominate. Balance is key to accessing the full power.",
        orb: "Full planetary orb of influence applies"
    },

    opposition: {
        title: "The Awareness of Duality",
        keywords: ["Awareness", "Balance", "Compromise", "Polarity", "Choice"],
        description: "A 180° tug-of-war creating awareness. You can focus on one energy while pulling from the other. This is marriage, Opposites Attract, the grass-is-greener dynamic.",
        positive: "Objective perspective, ability to choose focus, complementary strengths. Creates awareness you wouldn't have otherwise.",
        negative: "Projection ('it's them not me'), swinging to extremes, losing yourself in one side, indecision.",
        manifestation: "Find the compromise. Focus on one while BORROWING from the other. Don't abandon either side completely.",
        orb: "Full planetary orb of influence applies",
        examples: {
            "sun-neptune": "Sun (ego/personality) vs Neptune (spirituality/illusion). Can be compassionate & spiritual OR depressed & lost. Must balance ego expression with spiritual sensitivity."
        }
    },

    square: {
        title: "The Friction of Progress",
        keywords: ["Friction", "Action", "Conflict", "Growth", "Achievement"],
        description: "90° angle creating friction and energetic disagreement. TWO planets wanting the same space at the same time. Neither will budge - requires BENDING the energies to appease both.",
        positive: "Drive to achieve, breaking stagnation, immense productive energy. Essential for progress - squares create the friction that moves you forward.",
        negative: "Stubbornness, crisis, forced change, difficulty finding resolution.",
        manifestation: "Appease BOTH energies equally. Find higher/lower vibrations of each. Without squares, you may never accomplish anything major.",
        orb: "Full planetary orb of influence applies",
        critical: "Squares are NOT purely negative! People who achieve greatness often have many squares. They're the engine of progress."
    },

    trine: {
        title: "The Flow of Direct Harmony",
        keywords: ["Flow", "Ease", "Talent", "Direct Effect", "Natural Blessing"],
        description: "120° direct energy flow. Planet One naturally FEEDS Planet Two. Energy flows so smoothly it often goes UNNOTICED and is taken for granted.",
        positive: "Natural gifts, effortless expression, luck, talents you didn't know you had.",
        negative: "Laziness, taking blessings for granted, lack of growth (no friction = no motivation), wasted potential.",
        manifestation: "Be CONSCIOUS of what you're sending. Don't become lazy. Understand the gift and use it intentionally.",
        orb: "Full planetary orb of influence applies"
    },

    sextile: {
        title: "The Cooperative Opportunity",
        keywords: ["Opportunity", "Cooperation", "Support", "Potential", "Upon Request"],
        description: "60° cooperative aspect. Energies support each other ONLY when requested/activated. This is potential energy without kinetic - a hidden talent or opportunity.",
        positive: "Available support when needed, creative solutions, awakened talents. Can be highly transformational once understood.",
        negative: "Stagnancy if ignored, missed opportunities, 'potential' that never becomes 'kinetic'. Easy to forget this connection exists.",
        manifestation: "LOOK for your sextiles. Activate them consciously. Ask: 'How can I blend these two energies to create something new?'",
        orb: "1-2 degree tight orb (MINOR aspect)",
        critical: "Severely underrated! Once you unlock your sextiles, there's so much potential to tap into."
    },

    semiSextile: {
        title: "The Neighborly Agitation",
        keywords: ["Agitation", "Discord", "Adjustment", "Cause & Effect", "Minor Friction"],
        description: "30° aspect - next door neighbors. These energies don't integrate easily, creating minor disharmony. Like neighbors who are polite but never really talk.",
        positive: "Refinement through adjustment, learning to tolerate difference, cause-and-effect awareness.",
        negative: "Persistent irritation, minor friction, 'wince' when activated, inherent lack of integration.",
        manifestation: "Accept the agitation. These planets ARE linked but won't blend smoothly. Work around it rather than trying to force harmony.",
        orb: "1-2 degree VERY tight orb (MINOR aspect)"
    },

    quincunx: {
        title: "The Great Adjustment",
        keywords: ["Toggle", "Redirect", "Adjustment", "Detachment"],
        description: "150° aspect requiring constant adjustment. Energies that don't 'see' each other - must TOGGLE between states.",
        positive: "Flexibility, ability to compartmentalize, detached support.",
        negative: "Difficulty integrating energies, feeling pulled in incompatible directions.",
        manifestation: "Accept the TOGGLE. These energies operate separately - support at arm's length.",
        orb: "1-2 degree tight orb (MINOR aspect)"
    },

    quintile: {
        title: "The Creative Manifestor",
        keywords: ["Talent", "Manifestation", "Creative", "Outward Expression", "Compulsive"],
        description: "72° aspect revealing WHERE YOU ARE CREATIVELY INNOVATIVE AND PURPOSEFULLY MANIFEST THINGS. 'This is intentional. This is where you can create things that you want.' External expression - used outwardly in career and with people.",
        positive: "Drive, passion, purpose. Intentional creative manifestation. Natural talents that MOTIVATE you because you can actually use them.",
        negative: "Can show compulsivity in behaviors when activated. Obsessive over this talent. Can be expressed positively or negatively.",
        manifestation: "This is INTENTIONAL CREATION. Usually overlooked but gives you drive, passion, and purpose. External expression.",
        orb: "1-2 degree very tight orb (stays close to avoid confusion with Quincunx at 150°)",
        critical: "OUTWARD/EXTERNAL - something you DO outwardly, use in career, use when dealing with people. Motivates you because it's a talent you can actually use."
    },

    biQuintile: {
        title: "The Internal Problem-Solver",
        keywords: ["Hidden Talent", "Creative Solutions", "Inward", "Artistic Access", "Research"],
        description: "144° aspect showing 'where you have access to creative and artistic talents.' Less obvious than Quintile, harder to grab onto. Works INWARDLY - 'I can DO certain things' (not 'I can MAKE certain things'). Really good for bringing creative solutions to problematic issues.",
        positive: "Brings creative solutions to problematic issues. Hidden research/analytical talents. Internal processing abilities. Obsessive research capabilities.",
        negative: "Harder to recognize and access than Quintile. May not realize you have this talent.",
        manifestation: "This is INTERNAL TALENT. Something you use FOR YOURSELF to help you do things. Perfect for research, problem-solving, internal creativity.",
        orb: "1-2 degree very tight orb",
        critical: "INWARD/INTERNAL - talent you use for yourself, not shown outwardly. BiQuintile is the LARGER angle (144°) vs Quintile (72°).",
        examples: {
            "mercury-jupiter": "Ability to obsessively research online resources, scan massive amounts of information, maintain 70-80 browser tabs, multi-monitor research setup. Internal talent for information synthesis and deep diving."
        }
    },

    semiSquare: {
        title: "The Minor Frustration",
        keywords: ["Frustration", "Minor Conflict", "Agitation", "Stubbornness"],
        description: "45° aspect creating minor conflict - less intense than a full Square but creates frustration. 'The power word is FRUSTRATION' - energies are very frustrating to work with because often it feels like it shouldn't play that way, but it does.",
        positive: "Minor friction that can push you to resolve issues. Less destructive than Square.",
        negative: "Persistent frustration. Creates stubbornness in the mixture of energies. Feels like 'you shouldn't feel that if you know how to do something.'",
        manifestation: "Know this exists so you expect the frustration and kickback. Don't be surprised when this energy creates resistance from others.",
        orb: "1-2 degree tight orb (RARELY USED aspect)",
        critical: "Instructor says 'I don't use this one as much. I look at it, I don't pay too much mind to it.' OPTIONAL aspect - not essential."
    }
};

/**
 * Specific Planet Pair Examples from Course 3
 */
export const SPECIFIC_PAIR_EXAMPLES = {
    "sun-neptune-opposition": {
        description: "Sun (identity, ego, expression) opposite Neptune (spirituality, illusion, music)",
        positive: "Compassionate, kind, spiritual, intuitive. Can blend creative expression with spiritual depth. Music as personality.",
        negative: "Depression, loss of purpose, illusion, feeling everything has disappeared. Can lose self in spirituality.",
        resolution: "Balance ego/expression (Sun) with sensitivity/spirituality (Neptune). Don't swing to extremes. Use music/art as the bridge."
    },

    "pluto-sun": {
        description: "Pluto (transformation, power, rebirth) aspecting Sun (identity, creative expression)",
        positive: "Use rebirth/regeneration to enhance Sun. Career in occult/transformation. Personal power. Level up creative talents.",
        negative: "Manipulation, control, attracting wrong people who attack your personality.",
        resolution: "Use transformation POSITIVELY. Don't become manipulative. Attract people through balanced power, not control."
    },

    "moon-vesta-conjunction": {
        description: "Moon (emotions, security) conjunct Vesta (eternal flame, passion)",
        manifestation: "Emotional security IS your passion. When emotions are low, reconnect to your passions/drive to reignite yourself."
    }
};

/**
 * Critical Course 3 Principles
 */
export const COURSE_3_PRINCIPLES = {
    aspectsAreTheGlue: "Aspects are what make you DIFFERENT from someone with the same Sun sign. They're the glue of astrology.",

    orbsVaryByAspect: {
        conjunction: "Full planetary orb",
        opposition: "Full planetary orb",
        square: "Full planetary orb",
        trine: "Full planetary orb",
        sextile: "1-2° (minor aspect)",
        semiSextile: "1-2° (minor aspect)",
        quincunx: "1-2° (minor aspect)"
    },

    chronologicalSuccession: "Order matters! Read aspects in chronological succession of signs (e.g., Moon → Sun, not Sun → Moon). The earlier planet INFORMS the later one.",

    degreesNotElements: "Aspects are determined by DEGREES, not elements. A 28° Gemini Sun with 1° Libra North Node is a SQUARE (90°), even though both are Air signs.",

    stelliumVsSatellitium: {
        stellium: "Planets within each other's orb of influence - energies FUSE together.",
        satellitium: "Planets in same sign/house but NOT within orbs - act independently in same space."
    },

    manifestationKey: "Understanding aspects lets you steer situations in your favor. Know the negatives to transmute them into positives (alchemy).",

    applyingVsSeparating: {
        definition: "Faster planet approaching slower planet = APPLYING (getting stronger). Faster planet departing slower planet = SEPARATING (getting weaker).",
        importance: "APPLYING aspects are STRONGER. SEPARATING aspects loosen/weaken over time.",
        howToRead: "Check which planet moves faster. If it hasn't reached exact degree yet = applying. If it passed exact degree = separating.",
        note: "This affects aspect intensity. Applying aspects build tension, separating aspects release it."
    },

    minorAspectsImportance: "Don't dismiss 'minor' aspects! Once you resolve them, you gain 'this next level of just knowing yourself and being able to unlock different things.' They're critical for growth."
};

/**
 * TRANSITS - The External Forces
 * (Lines 14200-15000+)
 */
export const COURSE_3_TRANSITS = {
    definition: "Transits are the position of the planets NOW (or at any specific time). Your natal chart is an IMPRINT of energies at birth. Transits are where planets are currently - how external forces are pressuring/impacting you.",

    howToRead: "Transit Saturn conjunct natal Moon means: Saturn (external force) is now sitting on top of your Moon (internal emotional needs), creating pressure/opportunities in that area.",

    natalVsTransit: {
        natal: "Imprint of the energies at the EXACT moment and location of your birth. This is WHO YOU ARE internally.",
        transit: "Current position of planets in the sky NOW. This is EXTERNAL FORCE coming inward, creating focus and opportunity."
    },

    leadPlanetRule: {
        principle: "The planet IN THE LEAD always takes control. This is EXTREMELY IMPORTANT when reading conjunctions.",
        applying: "Faster planet APPROACHING slower planet = **APPLYING** = STRONGER aspect. Energy coming FULL FORCE at each other (like a car coming AT you).",
        separating: "Faster planet DEPARTING slower planet = **SEPARATING** = WEAKER aspect. Energy loosens, releases (like a car moving AWAY).",
        example: {
            jupiterSaturn2020: "The Great Conjunction Dec 2020 - Jupiter applying to Saturn was TERRIBLE (restriction leading). Once Jupiter PASSED Saturn and took the lead, things got EASIER (expansion leading). Even though still conjunct, the separating aspect loosened the amplified energy AND Jupiter's energy came first.",
            lesson: "Lead planet MATTERS. Jupiter ahead = expansion first, then restriction. Saturn ahead = restriction first, crushing expansion."
        },
        critical: "When transits form conjunctions, the LEAD PLANET INFLUENCES THE MOST. Check which planet moved faster to determine who leads."
    },

    saturnReturn: {
        definition: "Saturn has made its way through the entire Zodiac and returns to its NATAL POSITION. External discipline/responsibility impacts internal discipline/responsibility.",
        challenge: "We think our ego (Sun) is more important. We ignore Saturn's authority. But Saturn is the 3rd LARGEST planet - we can work WITH it or fight it and have our lives ruined.",
        resolution: "Work WITH Saturn. Understand it's forcing you to figure out your life and do things good for the long-term. THEN factor in your Sun/happiness."
    },

    solarReturn: "One of the most popular transits (mentioned but not detailed in this section).",

    transitAspects: {
        toNatal: "When transit planets aspect YOUR natal planets (e.g., Transit Saturn square natal Sun)",
        toEachOther: "When current transiting planets aspect each other in the sky (affects everyone, not just you)",
        reading: "Transits become a FOCUS. The aspects transits form become a FOCUS. Use that energy because it's creating opportunity (or agitation/struggle)."
    },

    stubbornness: "We as human beings are stubborn. We always think our ego knows best. The biggest struggle with transits is our resistance to the external force trying to guide us."
};

/**
 * ASPECT PATTERNS - Configurations
 * (Lines 5741-6396)
 */
export const COURSE_3_ASPECT_PATTERNS = {
    definition: "When multiple aspects link together to form geometric patterns in the chart. Often overlooked but can reveal powerful dynamics.",

    grandTrine: {
        title: "Grand Trine",
        structure: "Three planets each trining each other, forming a TRIANGLE pattern in the chart. Usually (but not always) in the same element.",
        keyword: "HARMONIOUS FLOW (but can be too easy)",
        description: "Energy flows harmoniously between all three planets. You don't even NOTICE it - that's the problem. Often taken for granted.",
        positive: "Natural talents, effortless expression, things that come easy, inherent gifts. Easy link between three life areas.",
        negative: "LAZINESS. Taking blessings for granted. Lack of growth because there's no friction. Don't realize how easy certain things are. Wasted potential.",
        manifestation: "Recognize the gift! Don't become lazy. Things that come naturally to you may be struggles for others - value this.",
        example: "Sun-Moon-Pluto Grand Trine (Water): Personality, emotions, and transformation flow together effortlessly. Hard to hide feelings. Expression and emotion naturally linked.",
        critical: "Grand Trines 'kind of suck sometimes' because the energy is SO easy you never develop it. It's automatic inclusion without effort."
    },

    kite: {
        title: "Kite Configuration",
        structure: "A Grand Trine PLUS an opposition to one of the trine planets, with two sextiles completing the shape. Forms a kite/diamond pattern.",
        keyword: "PIVOT POINT for gifts",
        description: "The planet in opposition to the Grand Trine becomes the PIVOT POINT. You must balance this planet to utilize all the Grand Trine gifts.",
        positive: "Activates the Grand Trine gifts through conscious work on the pivot planet. Gives direction to otherwise lazy trine energy.",
        negative: "If you ignore the pivot point (opposition), you can't access the Grand Trine gifts effectively.",
        manifestation: "Focus on the OPPOSITION planet - it's your key to unlocking the entire configuration. Use it to direct the trine's flow.",
        example: "Grand Trine (Sun-Moon-Pluto) with Neptune opposite Sun = Kite. Neptune is the pivot. Must use compassion/spirituality through teaching to utilize all the gifts (7th, 11th, 3rd houses).",
        structure_note: "Grand Trine + Opposition + Two Sextiles = Kite"
    },

    trine_vs_grandTrine: {
        trine: "ONE connection between two planets at 120° - a single line/aspect.",
        grandTrine: "THREE trines connecting three planets - forms a TRIANGLE pattern. All three planets must be involved.",
        note: "You can have three different trines in a chart without them forming a Grand Trine if they don't close the triangle."
    },

    automaticInclusion: {
        concept: "With a Grand Trine, the energies are 'automatically included' - they work together without you thinking about it.",
        example: "Sun-Moon trine: Personality and emotions go hand-in-hand automatically. Not conflicted feeling one way and expressing another. It just IS.",
        contrast: "No aspect between planets = they're NOT connected. Have to CHOOSE to use them together (e.g., Moon-Mercury no aspect = don't naturally say what you feel)."
    },

    instructorNote: "Instructor says he 'forgot to do a slide on aspect patterns' and 'isn't something I really want to get into anyway' - implying this is ADVANCED and optional, but powerful when understood."
};

