/**
 * CLASS 4: THE LENSES SYSTEM
 * Extracted from "CLASS 4 ASTROLOGY.txt"
 * 
 * The LENSES System is the practical methodology for reading charts
 * by choosing a specific topic/question and filtering all astrological 
 * data through that lens.
 */

/**
 * THE CORE LENSES PHILOSOPHY
 * (Lines 800-1600)
 */
export const LENSES_PHILOSOPHY = {
    problem: "Charts are overwhelming - too many planets, too many aspects, too much math. How do you know where to start?",

    solution: "LENSES - choosing the topic/question. Everything in the chart is viewed THROUGH that lens.",

    hardestRead: {
        type: "Natal Chart Report (Full Reading)",
        problem: "Impossible to cover everything in 45 minutes. Can spend 45 minutes on FIRST HOUSE alone and still not finish.",
        why: "Complex individuals require progressions, relocations, transits, aspects - years of discovery.",
        advice: "Charge significantly more for these. Still won't satisfy everyone - questions always remain."
    },

    easiestRead: {
        type: "Question-Based Reading",
        method: "Ask a specific question, then answer through chart analysis.",
        examples: [
            "Why am I always having problems in love?",
            "What career best suits me?",
            "How do I make money?",
            "Why do I feel so down all the time?",
            "What's my relationship with my father like?"
        ],
        benefit: "Once you know how to read, these become EASY. Pick a lens, dive deep on that topic only."
    },

    critical: "PICK A STOPPING POINT or you will fall into the rabbit hole forever. Astrology is a vortex - you must decide when you have enough information."
};

/**
 * HOW LENSES WORK: LOVE EXAMPLE
 * (Lines 1163-1600)
 */
export const LOVE_LENS = {
    commonMistake: "Most astrologers say '7th house = love' and stop there. This is incomplete and leaves people roadblocked.",

    truthAboutLove: "EVERY HOUSE relates to love on different levels. Love is abstract - it's an emotion, a feeling. You must break it down astrologically.",

    housesInLove: {
        first: "Your identity/solo endeavors within love. What you need to maintain individuality in relationships.",
        second: "Your values in love. What you value in a partner. Sensuality, material needs.",
        third: "How you speak/communicate in terms of love. Love language.",
        fourth: "How you feel safe. Home life with partner. Emotional foundation.",
        fifth: "ROMANCE - puppy love, first stage, risk-taking, pride, fun, creative expression. Baby love. The intro to love.",
        sixth: "How you serve your partner. Health within relationships. Daily routines together.",
        seventh: "Your romantic partner. One-to-one interactions. First marriage. WHERE YOU START for love questions.",
        eighth: "INTIMACY - deep bonds, secrets, trust. Comes AFTER engagement. Not for random partners - for people you trust.",
        ninth: "Expansion/journeys with partner. 'What ifs', fantastical scenarios, playful exploration. How you travel together.",
        tenth: "How you are in public with partner. Reputation as a couple.",
        eleventh: "Hopes/dreams with partner. Friendships. Independence needs. How you interact outside the partnership.",
        twelfth: "Behind the scenes. Music/spirituality in context of love. Hidden aspects of relationship."
    },

    method: "Take ALL house themes and 'chisel them down' / 'carve out' the love-specific meaning. Same themes, different lens.",

    startingPoint: "ALWAYS start with 7th house for love, but don't STOP there. It's just the beginning."
};

/**
 * LENSES WITHIN LENSES
 * (Lines 4200-5000)
 */
export const LENSES_DEPTH = {
    concept: "You can analyze a LENS WITHIN A LENS. Example: 'Love' lens → 'Values within Love' lens → 'Father's Values within Love' lens.",

    example: {
        mainLens: "Love/Relationships",
        subLens: "Values (2nd house ruler Venus)",
        deeperLens: "Father's influence on values (Venus square Pluto in 7th)",
        interpretation: "Expects partner to take on traditional roles (cooking at home) influenced by father's values. Square to Pluto = striving for intimacy never had with father."
    },

    warning: "Don't get overwhelmed. Pause, go back if needed. It's like learning Spanish - words, then phrases, then tenses, then slang, then conversation. BABY STEPS.",

    layering: "We are LAYERING information. This is complex but systematic. Take it step by step.",

    rabbitHole: "Astrology IS a rabbit hole / vortex. If you don't pick a stopping point, you will NEVER finish the reading. Must decide when you have enough."
};

/**
 * CAREER LENS STRUCTURE
 * (Mentioned but not fully detailed in excerpts - would follow same pattern as Love)
 */
export const CAREER_LENS = {
    startingPoint: "10th house (Midheaven) - public image, career, legacy",

    housesInCareer: {
        first: "How you present yourself professionally",
        second: "How you make money, values in work",
        third: "Communication skills, daily work environment",
        fourth: "Work from home, foundation for career",
        fifth: "Creative career expression, passion projects",
        sixth: "Daily work, service, health at work",
        seventh: "Business partnerships, clients",
        eighth: "Shared resources, investments, transformation through career",
        ninth: "Teaching, higher education, international work",
        tenth: "PUBLIC CAREER - start here",
        eleventh: "Team dynamics, future career goals, networking",
        twelfth: "Behind-the-scenes work, hidden talents"
    },

    method: "Same as love - filter ALL houses through career lens."
};

/**
 * CHILDREN LENS 
 * (Lines 9200-10000)
 */
export const CHILDREN_LENS = {
    childrenPlacement: {
        firstChild: "5th house (natural house of children)",
        secondChild: "7th house (count 2 houses from 5th following zodiac)",
        thirdChild: "9th house (count 2 more houses)"
    },

    method: "Start at 5th house for first child. Each subsequent child is +2 houses in zodiacal order.",

    ruling: "Look at RULER of that house and where it's placed. Analyze aspects to that ruler.",

    example: "5th house cusp in Gemini = Mercury rules first child. Look where Mercury is, what it aspects, what house it's in.",

    interpretation: "Chart doesn't tell you IF you'll have kids (that's a choice). It tells you what the ENERGY / RELATIONSHIP with children will be like.",

    manifestation: "If there are challenging aspects (Chiron, Saturn, etc.), you can work consciously to manifest better relationships with children.",

    important: "This can reveal heavy topics (loss, developmental issues, etc.). Must be prepared for difficult readings."
};

/**
 * READING METHODOLOGY
 */
export const READING_METHOD = {
    step1: "Choose the LENS (topic/question)",

    step2: "Identify the PRIMARY HOUSE for that lens (7th for love, 10th for career, 5th for children, etc.)",

    step3: "Look at the SIGN on that house cusp",

    step4: "Find the RULER of that sign and see where it's placed",

    step5: "Analyze ASPECTS to the ruler",

    step6: "Layer in other relevant houses through the same lens",

    step7: "Look for ASPECT PATTERNS involving the key placements",

    step8: "PICK A STOPPING POINT - don't fall into the rabbit hole",

    spokenReading: "Speak insights out loud as you go. If you can't remember everything, write notes as you connect information.",

    practice: "Gets easier with repetition. Becomes second nature like speaking a language."
};

/**
 * CRITICAL PRINCIPLES
 */
export const LENSES_PRINCIPLES = {
    everything_has_subparts: "Everything in the world breaks down into smaller parts. Body → cells → atoms. Astrology → signs → decans → dwads. You can go infinitely deep.",

    stop_before_overwhelm: "Once you reach a good understanding, STOP. The vortex is endless.",

    not_a_blueprint: "Astrology is ENERGY, not a blueprint. You can't predict if someone WILL do something (have kids, get married, etc.). You can only see the energies and potential paths.",

    manifestation: "Challenging placements can be worked with consciously to create better outcomes. Chart shows potential, not destiny.",

    layer_by_layer: "Build understanding incrementally. Don't try to see everything at once.",

    astrology_is_valid: "When done correctly with this methodology, astrology is 'valid and accurate' - instructor's personal experience with Jupiter in Scorpio (obsessive deep diving) in 4th house (personal foundation)."
};

/**
 * INSTRUCTOR NOTES
 */
export const INSTRUCTOR_INSIGHTS = {
    personal: "Instructor has studied own chart for 6-7 years OBSESSIVELY and still finds new things. Not because lacking - because complexity is infinite.",

    gemini_mercury_sun: "Loves information, communication, data, statistics (Mercury + Sun in Gemini)",

    jupiter_scorpio_4th: "Obsesses over anything personal/deep (Jupiter in Scorpio on IC). Expands and dives deep repeatedly.",

    reading_problem: "Used to have problem diving too deep, going down rabbit holes, never finishing readings. Had to learn to STOP.",

    language_analogy: "Learning astrology is like learning Spanish - overwhelming at first if you try to do everything. Break it into digestible pieces.",

    heavy_readings: "Deals with very heavy situations regularly (loss of children, death, developmental issues, relationship trauma). Must be prepared emotionally."
};
