/**
 * DEEP REPORT GENERATOR
 * Conversational, detailed, explains the WHY behind every placement.
 * Gender-themed printable HTML (feminine = rose gold/ethereal, masculine = navy/platinum).
 * NO em-dashes, en-dashes, or m-dashes anywhere.
 */

import { HOUSE_THEMES, SIGN_SYMBOLS, PLANET_SYMBOLS, SIGN_RULERS, SIGN_ELEMENTS } from '../core/constants.js';
import { PLANET_MEANINGS, RETROGRADE_MEANINGS, LILITH_HOUSE_INSIGHTS, SIGN_MEANINGS, CHIRON_HOUSE_INSIGHTS } from './interpretation.js';

// ============================================
// HELPERS
// ============================================
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function deg(d) { return d != null ? d.toFixed(1) + String.fromCharCode(176) : '?' + String.fromCharCode(176); }


// ============================================
// ALCHEMISTIC ALCHEMY: ADVANCED LOGIC
// ============================================

const ALCHEMIST_ORBS = {
    mars: 4.0,
    moon: 3.0,
    chiron: 1.5, // The "Low Orb" rule
    default: 2.0
};

/**
 * Checks if a planet is in the "Fusion Cusp Area" (28.5 to 29.9)
 * or simply "Reaching" into the next house (based on orb).
 */
function getFusionStatus(pName, pData) {
    if (!pData || pData.degreeInSign === undefined) return null;
    const orb = ALCHEMIST_ORBS[pName] || ALCHEMIST_ORBS.default;
    const deg = pData.degreeInSign;

    if (deg >= 28.5) return 'FUSION'; // Blending energies
    if (deg + orb >= 30) return 'REACHING'; // Reaching into next sign/house
    return null;
}

/**
 * Reverse Vantage: The perspective of Planet 2 (The Receiver)
 */
function getReverseVantage(aspect, chart) {
    const p1 = aspect.planetOne;
    const p2 = aspect.planetTwo;
    if (!p1 || !p2) return null;

    const p1Name = p1.name.toLowerCase();
    const p2Name = p2.name.toLowerCase();

    // Teacher style descriptions for the "Reverse Vantage"
    const receivers = {
        moon: `Your **Moon** (Receiver) is catching this energy from ${cap(p1Name)}. This means your emotional security is founded upon how you process this ${cap(p1Name)} influence. It isn't just about the wound or the action; it's about whether your inner child FEELS safe with it. Alignment is required—you have to "put the glove up" to catch this ball.`,
        chiron: `Your **Chiron** is the one receiving this. This energy is pushing directly into your wound. You might feel attacked or exposed, but the Reverse Vantage shows that this is an invitation to use YOUR wound as a bridge for this energy.`,
        ascendant: `Your **Ascendant** is the receiver. My motors and motivations didn't ask for this ${cap(p1Name)} energy, but here it is. I have to reposition my "vehicle" to say: "Okay, you want to be here too? What are you offering me?"`,
        sun: `Your **Sun** is receiving this. It becomes a matter of identity. Does this ${cap(p1Name)} energy help you shine, or does it feel like a forced obligation?`,
        saturn: `Your **Saturn** is the receiver. Responsibility is being demanded. Your Saturn expects this ${cap(p1Name)} energy to be part of the work. Build it right or don't build it at all.`
    };

    // Specific Chiron-Moon Reverse Vantage (Major Transcript Point)
    if (p1Name === 'chiron' && p2Name === 'moon') {
        return `Coming from **Reverse Vantage**, we look at your **Moon** first. Your emotional security is currently tied to a wound (${cap(p1Name)}). But instead of just saying "I'm wounded," your Moon is asking: "Did I even want this message? Am I prepared to receive it?" You need to assess your internal structure and mother-dynamics to see why you're and only reading the wound as emotional rebellion. True security comes when you stop asserting the moon on the wound and start understanding what the wound actually needs.`;
    }

    return receivers[p2Name] || `From the perspective of your **${cap(p2Name)}**, this ${cap(p1Name)} influence is something that must be integrated into your ${PLANET_REAL_TALK[p2Name]?.focus || 'energy'}. It is about how you *receive* the message, not just who sent it.`;
}

const SIGN_STYLE = {
    aries: 'bold, direct, and action-first', taurus: 'grounded, steady, and sensual', gemini: 'curious, quick, and adaptable',
    cancer: 'nurturing, protective, and emotionally driven', leo: 'confident, warm, and expressive', virgo: 'analytical, precise, and detail-oriented',
    libra: 'diplomatic, charming, and balance-seeking', scorpio: 'intense, magnetic, and deeply perceptive',
    sagittarius: 'adventurous, philosophical, and freedom-loving', capricorn: 'ambitious, disciplined, and strategic',
    aquarius: 'innovative, independent, and future-focused', pisces: 'intuitive, compassionate, and imaginative'
};

const PLANET_REAL_TALK = {
    sun: { focus: 'your identity, your vitality, your right to exist', why: 'It shows where you MUST take risks to feel alive. Without honoring your Sun, you feel hollow.', icon: String.fromCodePoint(0x2609) },
    moon: { focus: 'your emotional needs, your safety, your gut reactions', why: 'This is what you need to feel SAFE. When your Moon is not fed, anxiety and fear take over.', icon: String.fromCodePoint(0x263D) },
    mercury: { focus: 'how you think, process information, and communicate', why: 'This is your mental wiring. It determines how you learn, speak, and make decisions.', icon: String.fromCodePoint(0x263F) },
    venus: { focus: 'what you value, how you love, and your self-worth', why: 'Venus is not just romance. It is VALUE. What you find worthy of your time, energy, and heart.', icon: String.fromCodePoint(0x2640) },
    mars: { focus: 'how you take action, your physical drive, and your force', why: 'Mars is your engine. It is how you connect to the external world through action and assertion.', icon: String.fromCodePoint(0x2642) },
    jupiter: { focus: 'where you expand, grow, and what gets amplified', why: 'Jupiter amplifies whatever it touches, good OR bad. Debt, ego, luck, wisdom: it makes it BIGGER.', icon: String.fromCodePoint(0x2643) },
    saturn: { focus: 'your life lessons, restrictions, and long-term goals', why: 'Saturn is the test. It shows where life demands discipline, boundaries, and patience before rewarding you.', icon: String.fromCodePoint(0x2644) },
    uranus: { focus: 'where you experience sudden change and awakening', why: 'Uranus is too fast to allow luck to "sit." It signifies quickness regarding luck. It breaks what Saturn built, but only what is outdated.', icon: String.fromCodePoint(0x2645) },
    neptune: { focus: 'where reality gets foggy, spiritual, or confusing', why: 'Neptune dissolves boundaries. It relates to the "illusion of health"—thinking things are a certain way when they aren\'t. Trust your gut.', icon: String.fromCodePoint(0x2646) },
    pluto: { focus: 'where you experience deep transformation and power dynamics', why: 'Pluto is the phoenix. It is about evolution and potential death of the old self. Whatever it touches must be reborn.', icon: String.fromCodePoint(0x2647) },
    chiron: { focus: 'your authentic wound and your hidden authority', why: 'Chiron represents where you feel "broken" or "not normal." Once you stop trying to fix the wound and start accepting it, you discover that this is where your greatest mentorship power lives. It is the key to your unique authority.', icon: String.fromCodePoint(0x26B7) },
    meanLilith: { focus: 'your raw, primal power and deep visceral instincts', why: 'Lilith is the energy society shamed. In Alchemistic Astrology, we don\'t hide her—we alchemize her. This is your raw power that must be accepted without guilt or remorse.', icon: String.fromCodePoint(0x26B8) },
    vesta: { focus: 'your internal spark of life and original devotion', why: 'Vesta is the "Spark of Life." It is the eternal flame that keeps you going when everything else fails. It is what you are truly devoted to.', icon: '🕯️' }
};

const HOUSE_REAL_TALK = {
    1: 'your identity, how people see you, your physical body', 2: 'your money, your resources, your self-worth',
    3: 'your mind, communication, siblings, local environment', 4: 'your home, family, roots, emotional foundation',
    5: 'your creativity, romance, children, fun', 6: 'your daily work, health, routines, service',
    7: 'your partnerships, marriage, close one-on-one relationships', 8: 'shared resources, intimacy, transformation, other people\'s stuff',
    9: 'beliefs, philosophy, higher learning, travel, expansion', 10: 'your career, public reputation, legacy, authority',
    11: 'your friends, community, hopes, dreams, networks', 12: 'your subconscious, hidden enemies, spirituality, isolation'
};

// ============================================
// UNIQUE TRANSIT DESCRIPTIONS (no repeating)
// ============================================

const TRANSIT_DESCRIPTIONS = {
    Pluto: {
        conjunction: (natal) => `Pluto is currently sitting on your natal ${cap(natal)}. This is a moment of deep, forced authenticity. The demolition of the old self is not meant to harm you, but to remove the survival structures that are no longer serving your true nature. We must ask: What are you so afraid of losing that Pluto must break it for you?`,
        opposition: (natal) => `Pluto is in opposition to your natal ${cap(natal)}. This is the "tug of war" between your past adaptations and your present need for evolution. Power struggles with others are merely mirrors for the internal struggle to own your authentic power. The stress you feel is the resistance of the old self to the new reality.`,
        square: (natal) => `Pluto is squaring your natal ${cap(natal)}, creating internal pressure that often manifests as visceral stress. This is not arbitrary friction; it is the friction required for a total psychic reorganization. You are being pushed to find the power that lives beneath your defenses.`,
        trine: (natal) => `Pluto is in a trine to your natal ${cap(natal)}. Transformation is flowing through you with less resistance. This is a time to look gently at your patterns and allow the parts of you that have reached their expiration date to fall away without the need for a crisis.`
    },
    Neptune: {
        conjunction: (natal) => `Neptune is currently dissolving the boundaries of your ${cap(natal)}. This fog is not a defect; it is a temporary invitation to stop navigating through your defenses and start navigating through your soul. Where are you still clinging to a rigid reality that Neptune is trying to spiritualize for you?`,
        opposition: (natal) => `Neptune is opposing your natal ${cap(natal)}, creating a mirror of idealization or illusion. You may be seeking an external savior or a utopian escape because the internal reality feels too heavy. The question is: What pain are you trying to bypass with this fog?`,
        square: (natal) => `Neptune is squaring your natal ${cap(natal)}, creating a period of spiritual confusion. The "ground" of your ${cap(natal).toLowerCase()} energy feels slippery. This confusion is a prerequisite for a deeper clarity that comes not from the mind, but from a profound state of being.`,
        trine: (natal) => `Neptune is flowing into your natal ${cap(natal)}. Intuition and compassion are your primary navigators right now. It is a time for gentle integration—allowing the spiritual and the material to coexist without the usual friction.`
    },
    Uranus: {
        conjunction: (natal) => `Uranus is electrifying your natal ${cap(natal)}. Abrupt shifts are expected. Remember: the chaos you feel is the breakable part of your life proving that it can no longer contain your authentic self. Uranus only shatters the structures that were already suffocating you.`,
        opposition: (natal) => `Uranus is opposing your natal ${cap(natal)}. You may experience unpredictability from others. This is a mirror for your own internal restlessness. Can you be the stable center while the world around your ${cap(natal).toLowerCase()} energy shifts?`,
        square: (natal) => `Uranus is squaring your natal ${cap(natal)}, a transit of profound restlessness. This is the authentic self screaming to be heard. Do not make impulsive escapes; instead, make intentional space for your own uniqueness.`,
        trine: (natal) => `Uranus is trining your natal ${cap(natal)}. Fresh perspectives and positive innovations are available. This is the energy of "quick luck"—a sudden opening that rewards your willingness to be different.`
    },
    Saturn: {
        conjunction: (natal) => `Saturn is currently sitting on your natal ${cap(natal)}. This is the "final exam" of your current developmental stage. It asks: Have you built a container strong enough to hold your true potential? If you have been avoiding responsibility, you will feel restriction. If you have been doing the work, you will feel stability.`,
        opposition: (natal) => `Saturn is opposing your natal ${cap(natal)}. The world is holding up a mirror to your boundaries and your maturity. Frustration here is merely the signal that your internal structure needs to be reinforced. It is a time for absolute honesty with yourself.`,
        square: (natal) => `Saturn is squaring your natal ${cap(natal)}, creating the pressure of a "reality check." The friction is not there to block you, but to ensure that what you are building is structurally sound. Effort is required, but the reward is a foundation that can never be shaken.`,
        trine: (natal) => `Saturn is trining your natal ${cap(natal)}. You are naturally establishing the systems and boundaries that will serve you for years to can. Discipline feels less like a burden and more like a relief.`
    },
    Jupiter: {
        conjunction: (natal) => `Jupiter is amplifying your natal ${cap(natal)}. It expands whatever it touches. If you have been living in avoidance, that avoidance will grow. If you have been living in truth, that truth will prosper. It is an amplifier of your current state, inviting you to see what is truly there.`,
        opposition: (natal) => `Jupiter is opposing your natal ${cap(natal)}. You may be looking for external validation or excess to fill an internal void. The expansion you seek is outside of you; the amplification you need is within.`,
        square: (natal) => `Jupiter is squaring your natal ${cap(natal)}. This is a growth push that feels uncomfortable. You are being asked to expand your capacity for ${cap(natal).toLowerCase()} energy beyond your current comfort zone. The friction is the stretch marks of the soul.`,
        trine: (natal) => `Jupiter is trining your natal ${cap(natal)}. Support and expansiveness come naturally now. Doors open, and your internal truth feels more easily shared with the world. Take the leap while the energy is buoyant.`
    },
    Chiron: {
        trine: (natal) => `Chiron is gently supporting your natal ${cap(natal)} through a trine. Healing happens naturally and without force. Your ${cap(natal).toLowerCase()} energy is integrating past wounds in a way that feels organic. You may find that things that used to trigger you barely register anymore. This is quiet, powerful healing.`
    }
};

// ============================================
// SECTION GENERATORS
// ============================================

function generateOpeningMessage(name, gender, chart) {
    const rising = cap(chart.angles.ascendant.sign);
    const sun = cap(chart.planets.sun.sign);
    const moon = cap(chart.planets.moon.sign);

    let text = `Dear ${name},\n\nThe question we are really asking here is not just "Who am I?" but "How did I adapt to survive?" and "What is my authentic self trying to tell me through this pain?"\n\nYour chart is a map of your energetic blueprint. You are a ${sun} Sun, ${moon} Moon, and ${rising} Rising. This combination is a sacred architecture. My goal in this report is to help you see these placements not as static "traits," but as adaptations and potentials.\n\nWe have organized your report into the following Alchemical Sections:\n\n`;
    text += `**Section 1: The Delegate Hierarchy - ** We start with your Chain of Command. If you don't have the order, you don't have astrology. \n\n`;
    text += `**Section 2: The Individual Placements - ** We look at each planet as a survival adaptation. These are the parts of your personality that "learned" how to be you to stay safe.\n\n`;
    text += `**Section 3: The Inner Conversations - ** How your adaptations speak to each other (Aspects).\n\n`;
    text += `**Section 4: The Current Sky - ** What the universe is pressing into you right now (Transits).\n\n`;

    if (gender === 'female') {
        text += `We will look into the shadow—the places where you may have suppressed your truth to maintain safety or attachment—and we will explore how that internal friction is actually the engine of your evolution. This is an invitation to move from adaptation back into authenticity.\n\nLet us begin this compassionate inquiry together.`;
    } else {
        text += `This report is an exploration of that infrastructure. We aren't going to stay on the surface. We are going to ask: "What stress are you carrying in your body that actually belongs to these energetic blocks?" and "Where is your authenticity screaming to be heard?"\n\nLet's move into the inquiry.`;
    }
    return text;
}

function writePlanetSection(planetName, planetData, chart, interpretations) {
    const info = PLANET_REAL_TALK[planetName];
    const mean = PLANET_MEANINGS[planetName];
    if (!info) return null;
    const sign = planetData.sign;
    const house = planetData.house;
    const signInfo = SIGN_MEANINGS[sign] || {};
    const houseInfo = HOUSE_THEMES[house] || { name: 'this life area' };
    const houseArea = houseInfo.name;
    const ruler = SIGN_RULERS[sign];
    const rulerData = chart.planets[ruler];
    const rulerHouse = rulerData?.house;
    const isRetro = planetData.motionState === 'retrograde';
    const rxInfo = isRetro ? RETROGRADE_MEANINGS[planetName] : null;

    // THE ALCHEMIST SEQUENCE (Class #3 logic)
    const spark = Math.floor(planetData.degreeInSign);
    const tone = cap(sign);
    const field = `${house}${ordSuffix(house)} house`;

    let text = `**${info.icon} Your ${cap(planetName)}** in ${tone} ${SIGN_SYMBOLS[sign] || ''}, House ${house} (${deg(planetData.degreeInSign)})`;
    if (isRetro) text += ` Rx RETROGRADE`;
    text += `\n\n`;

    // Narrative Flow (Gabor Maté Style)
    text += `**The Inquiry:** We are looking at your **Pulse**—the core energy of ${cap(planetName)}. It manifests within the **Field** of your ${field} (**${houseArea}**). This is not just a placement; it is the site of a developmental adaptation. \n\n`;

    text += `**Deep Insight:** ${mean?.beginnerExplanation || info.why}\n\n`;

    text += `**The Adaptation (Tone):** Because this energy is in ${tone}, ${signInfo.adaptation || ''}\n\n`;

    if (planetName === 'chiron') {
        text += `**Teacher Voice (Rule R017/Rule of Authority):** "Chiron is the Rainbow Bridge between your structure (Saturn) and your rebellion (Uranus). It is where you feel 'broken,' but that break is actually an opening for authority. If Juno is also retrograde, do not try to commit to the wound—accept the instability."\n\n`;
        text += `Because your Chiron is in the **${field}**, the friction manifests regarding **${houseArea}**. ${CHIRON_HOUSE_INSIGHTS[house] || ''}\n\n`;
        text += `**The Alchemical Shift:** Stop trying to fix what you believe is broken. Accept the wound, and you transition from 'victim' to 'authority'—mentoring others who walk this same jagged path.\n\n`;
    } else if (planetName === 'venus') {
        text += `**Alchemistic Insight (Rule R021):** Venus rules Value, both Self-Worth (2nd) and Relational (7th). She also relates to hormones and legal matters. Because she is in ${tone}, her value is "tinted" by this sign's frequency. If this is Aries, you may feel an urgent need to prove your worth (Color Theory Tainting).\n\n`;
    } else if (planetName === 'pluto' && house === 2) {
        text += `**Rule R018/R019 (Money through Trauma):** With Pluto in your 2nd House, your sense of resources is tied to Scorpio's location. This means your value or money often comes from other people's trauma or deep investigations rather than standard hourly work.\n\n`;
    } else if (planetName === 'meanLilith') {
        text += `**Teacher Voice:** "Mean Lilith is the 'Mean Bully'—the internalized shame we use to repress our own truth (Rule R012). It feels like a recurring theme of rebellion that was never allowed to breathe."\n\n`;
        if (house === 6) {
            text += `**Rule R026 (The Workloop Paradox):** In your 6th house, this creates a feeling of needing to work constantly without a clear reason. You must lower your expectations to avoid overthinking.\n\n`;
        } else {
            text += `Because this is in your **${field}**, ${LILITH_HOUSE_INSIGHTS[house] || ''}\n\n`;
        }
        text += `**The Work:** Move toward a "Shame-Free Zone." Acknowledge where you have been bullying yourself for your primal needs. You aren't wrong; you were just trying to survive.\n\n`;
    } else if (planetName === 'trueLilith') {
        text += `**Teacher Voice:** "This is the precise point of your rebellion—the jagged, oscillating path of your raw truth. The winning strategy is the **Leash Rule**: you must let her out of the cage, but do not let her off the leash (Rule R011)."\n\n`;
        text += `This ${field} placement represents an outward projection of freedom. If you don't ground this energy, it becomes "extremely dangerous" and leads to total isolation. Ground yourself in your authentic presence, not just the act of rebellion.\n\n`;
    } else if (planetName === 'mercury') {
        text += `**Identity Note:** Mercury is your ID and your Identity. It rules the inward mind (Gemini) and the practical routine (Virgo). Because it is in ${tone}, your processing style is uniquely suited for ${signInfo.adaptation || 'this field'}.\n\n`;
    } else if (planetName === 'moon' && house === 8) {
        text += `**Rule R011 (Moon in 8th Warning):** This is a sensitive placement. The Moon in the 8th is often "not desired" because the intensity of hidden or secret emotions can feel overwhelming. You process emotional security through depth, which can feel like a constant state of transition.\n\n`;
    } else if (planetName === 'pluto' && house === 2) {
        text += `**Rule R018/R019 (Money through Trauma):** With Pluto in your 2nd House, your sense of resources is tied to Scorpio's location. This means your value or money often comes from other people's trauma or deep investigations rather than standard hourly work.\n\n`;
    }

    // Ruler delegation (PHSR chain)
    if (rulerHouse && ruler !== planetName) {
        text += `**The Delegate Connection (PHSR):** The 'Boss' of your ${tone} energy is **${cap(ruler)}**, located in House ${rulerHouse}. This means your success in ${houseArea} is actually linked to how you handle your **${HOUSE_THEMES[rulerHouse]?.name || 'that other area'}**. When you fix the internal delegate, the primary house stabilizes.\n\n`;
    }

    // Retrograde (Planet-Specific)
    if (isRetro && rxInfo) {
        text += `**Rx Retrograde (${rxInfo.theme}):** ${rxInfo.description}\n`;
        text += `*The Gift:* ${rxInfo.gift}\n`;
        text += `*The Challenge:* ${rxInfo.challenge}\n\n`;
    }

    return { title: `${info.icon} ${cap(planetName)} in ${tone}, House ${house}`, content: text, icon: info.icon };
}

function writeAspectSection(aspects) {
    if (!aspects || aspects.length === 0) return null;
    let text = `The aspects in your chart are the internal conversations between your different survival adaptations. Some are harmonious, flowing without resistance, while others create the friction necessary for evolution. We must ask: How do these two parts of you either support or sabotage each other? Tension is not a defect; it is energy that has not yet been alchemized into authenticity.\n\n`;

    const sorted = [...aspects].sort((a, b) => {
        const aForced = (a.forcedStatus && a.forcedStatus !== 'mutual' && a.forcedStatus !== 'weak') ? 1 : 0;
        const bForced = (b.forcedStatus && b.forcedStatus !== 'mutual' && b.forcedStatus !== 'weak') ? 1 : 0;
        if (bForced !== aForced) return bForced - aForced;
        const typeOrder = { conjunction: 0, square: 1, opposition: 2, trine: 3, sextile: 4 };
        return (typeOrder[a.type] || 5) - (typeOrder[b.type] || 5);
    }).slice(0, 10);

    for (const asp of sorted) {
        const p1 = cap(asp.planetOne?.name || '');
        const p2 = cap(asp.planetTwo?.name || '');
        const isForced = asp.forcedStatus && asp.forcedStatus !== 'mutual' && asp.forcedStatus !== 'weak';

        text += `**${p1} ${asp.symbol || '.'} ${p2} (${cap(asp.type)})**`;
        if (isForced) text += ` WARNING: FORCED`;
        text += `\n`;

        if (asp.type === 'conjunction') {
            text += `These two energies are MERGED. They act as one. ${p1} and ${p2} cannot be separated in your experience. When one activates, the other fires too.\n`;
        } else if (asp.type === 'square') {
            text += `This is TENSION. ${p1} and ${p2} are in conflict, creating friction. But here is the thing: this friction is what drives you forward. Do not try to "fix" it. Use it as fuel.\n`;
        } else if (asp.type === 'opposition') {
            text += `These two are pulling in opposite directions. ${p1} wants one thing, ${p2} wants the opposite. The lesson is BALANCE, not choosing one over the other.\n`;
        } else if (asp.type === 'trine') {
            text += `This is natural flow. ${p1} and ${p2} support each other effortlessly. But caution: trines have NO DEFENSE. If either planet carries toxic energy, the other absorbs it without a filter.\n`;
        } else if (asp.type === 'sextile') {
            text += `This is an opportunity aspect. ${p1} and ${p2} can work together beautifully, but you have to actively USE it. It will not activate on its own.\n`;
        } else if (asp.type === 'quintile') {
            text += `This is a **Creative Powerhouse**. You are creatively innovative here and can purposefully manifest things. It is about unique, purposeful manifestation.\n`;
        } else if (asp.type === 'biQuintile') {
            text += `This is an **Internal Talent**. You have access to deep creative and artistic solutions here. It is an internal gift for problem-solving.\n`;
        } else if (asp.type === 'quincunx') {
            text += `This is the **Queen Kunk**. These two planets are in a constant "toggle." They do not see each other and speak different languages. You must intentionally bridge them.\n`;
        }

        if (asp.perception) text += `*What you feel:* ${asp.perception}\n`;
        if (asp.resolution) text += `*How to use it:* ${asp.resolution}\n`;

        if (isForced) {
            const receiver = asp.forcedStatus === 'forced_by_1' ? p2 : p1;
            text += `WARNING: This is a **Forced Aspect**. ${receiver} does not naturally "see" this energy coming. It feels like a blind-side hit. ${receiver} needs to be upgraded to handle this incoming energy.\n`;
        }
        text += `\n`;
    }

    return { title: 'Your Key Aspects: The Inner Conversations', content: text, icon: String.fromCodePoint(0x26A1) };
}

/**
 * NEW: The Delegate Hierarchy (Chain of Command)
 * Explains how each house delegates its energy to its ruler's location.
 */
function writeDelegateHierarchy(chart) {
    let text = `**Rule R016: "If you don't have the Order, you don't have Astrology."**\n\n`;
    text += `In this section, we reveal your chart's **Chain of Command**. Astrology is not a collection of static placements; it is a system of **Delegation**. When a house (a field of life) has a specific sign on its cusp, it delegates its "intentions" to the planet that rules that sign. \n\n`;
    text += `We follow the energy from the **Field** (the House) to the **Delegate** (the Ruler) to see where your life matters are actually being processed. This is the **PHSR Sequence**: Planet → House → Sign → Ruler.\n\n`;

    const keyHouses = [1, 2, 4, 7, 10]; // Self, Money, Home, Relationships, Career
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

    for (const hNum of keyHouses) {
        const hData = chart.houses[hNum];
        const hSign = hData.sign;
        const hRuler = SIGN_RULERS[hSign];
        const rData = chart.planets[hRuler];
        const rHouse = rData?.house;
        const houseArea = HOUSE_REAL_TALK[hNum];

        text += `### 🏛️ The ${hNum}${ordSuffix(hNum)} House Authority (${cap(houseArea)})\n`;
        text += `**Intent (Sign):** ${cap(hSign)} energy sets the tone.\n`;
        text += `**The Delegate:** **${cap(hRuler)}** is the representative of this house.\n`;
        text += `**Current Location:** House ${rHouse} (${HOUSE_REAL_TALK[rHouse] || 'that field'}).\n`;
        text += `**Command Logic:** Your ${houseArea} energy is **DELEGATED** to your ${HOUSE_REAL_TALK[rHouse] || 'other area'}. This means that for your ${houseArea} to function properly, the conditions in House ${rHouse} must be addressed first. (Rule R002/R028).\n\n`;

        if (rData && rData.motionState === 'retrograde') {
            text += `> **Warning (Rule R009):** Your delegate is in Retrograde. The "status" of the delegate is internalized. It does not change its ruler status (The Rulership Firewall), but it means these matters are processed in private or through re-evaluation before the world sees the result.\n\n`;
        }
    }

    text += `**Formula F006:** The House Ruler (Delegate) always takes precedence for the local environment, while the Natural Ruler provides the flavor. If you find conflict between your 2nd house (Money) and 7th house (Partnerships), look for the delegate connection—they are likely speaking different languages.\n`;

    return { title: 'Section 1: The Delegate Hierarchy', content: text, icon: '📜' };
}

function writeTransitSection(chart, currentDate) {
    let text = `Here is what is happening in the sky RIGHT NOW and how it is hitting YOUR chart specifically. This is not general astrology. These are the exact transits affecting your personal placements.\n\n`;

    const now = currentDate || new Date();
    const transits = [
        { planet: 'Pluto', sign: 'aquarius', degree: 3, icon: String.fromCodePoint(0x2647), speed: 'Very Slow (20yr cycle)' },
        { planet: 'Neptune', sign: 'aries', degree: 0, icon: String.fromCodePoint(0x2646), speed: 'Slow (14yr cycle)' },
        { planet: 'Uranus', sign: 'taurus', degree: 27, icon: String.fromCodePoint(0x2645), speed: 'Slow (7yr cycle)' },
        { planet: 'Saturn', sign: 'pisces', degree: 28, icon: String.fromCodePoint(0x2644), speed: 'Medium (2.5yr cycle)' },
        { planet: 'Jupiter', sign: 'cancer', degree: 17, icon: String.fromCodePoint(0x2643), speed: 'Medium (1yr per sign)' },
        { planet: 'Chiron', sign: 'taurus', degree: 5, icon: String.fromCodePoint(0x26B7), speed: 'Slow (varies)' }
    ];

    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    const ascSign = chart.angles.ascendant.sign;
    const ascIdx = signs.indexOf(ascSign);

    text += `**Your Rising Sign is ${cap(ascSign)}, so here is how the current sky maps onto YOUR houses:**\n\n`;

    for (const t of transits) {
        const tIdx = signs.indexOf(t.sign);
        const transitHouse = ((tIdx - ascIdx + 12) % 12) + 1;
        const houseArea = HOUSE_REAL_TALK[transitHouse] || 'this area';

        text += `**${t.icon} Transit ${t.planet} in ${cap(t.sign)} ${deg(t.degree)}** is in Your House ${transitHouse} (${houseArea})\n`;
        text += `*Speed: ${t.speed}*\n`;

        // Check aspects to natal planets
        const natalHits = [];
        for (const [pName, pData] of Object.entries(chart.planets)) {
            if (!pData || !pData.longitude) continue;
            const tLong = tIdx * 30 + t.degree;
            const diff = Math.abs(((tLong - pData.longitude + 180) % 360) - 180);
            let aspectType = null;
            if (diff <= 6) aspectType = 'conjunction';
            else if (Math.abs(diff - 180) <= 6) aspectType = 'opposition';
            else if (Math.abs(diff - 90) <= 5) aspectType = 'square';
            else if (Math.abs(diff - 120) <= 5) aspectType = 'trine';

            if (aspectType) {
                natalHits.push({ planet: pName, type: aspectType, orb: diff <= 6 ? diff : Math.abs(diff - (aspectType === 'opposition' ? 180 : aspectType === 'square' ? 90 : 120)) });
            }
        }

        if (natalHits.length > 0) {
            for (const hit of natalHits) {
                const orbStr = hit.orb.toFixed(1);
                text += `   > **${cap(hit.type)} your natal ${cap(hit.planet)}** (orb: ${orbStr}${String.fromCharCode(176)})\n`;

                // Use unique descriptions per planet+aspect
                const descSet = TRANSIT_DESCRIPTIONS[t.planet];
                if (descSet && descSet[hit.type]) {
                    text += `   ${descSet[hit.type](hit.planet)}\n`;
                } else {
                    text += `   This transit is activating your ${cap(hit.planet).toLowerCase()} energy through a ${hit.type}.\n`;
                }
            }
        } else {
            text += `   No direct hits to natal planets right now, but the house theme (${houseArea}) is still activated.\n`;
        }
        text += `\n`;
    }

    // Saturn Return check (from Cassie transcript: "Saturn Return happens between 28 and 30")
    const saturnNatal = chart.planets.saturn;
    if (saturnNatal) {
        const satTransitSign = 'pisces';
        const satTransitDeg = 28;
        const satNatalLong = saturnNatal.longitude;
        const satTransitLong = signs.indexOf(satTransitSign) * 30 + satTransitDeg;
        const satDiff = Math.abs(((satTransitLong - satNatalLong + 180) % 360) - 180);
        if (satDiff <= 10) {
            text += `\nSATURN RETURN ALERT\n`;
            text += `Transit Saturn is within ${satDiff.toFixed(1)}${String.fromCharCode(176)} of your natal Saturn. `;
            if (satDiff <= 3) {
                text += `This is EXACT or nearly exact. You are IN your Saturn Return right now. `;
            } else {
                text += `Your Saturn Return is either approaching or just passed. `;
            }
            text += `The Saturn Return (age 28 to 30) is a major life exam. Saturn comes back to where it was when you were born and tests you: "Did you learn the lesson?" For you, the lesson is in House ${saturnNatal.house} (${HOUSE_REAL_TALK[saturnNatal.house] || 'this area'}). Set FIRM boundaries, get serious about what you will and will not tolerate, and Saturn will reward you with stability and respect. But you have to pass the test first.\n\n`;
        }
    }

    text += `**Bottom line:** Transits are not predictions. They are weather. You cannot control the weather, but you can decide how to dress for it. The planets create pressure; YOU decide how to respond.\n`;

    return { title: 'Current Transits: What Is Happening Right Now', content: text, icon: String.fromCodePoint(0x1F30C) };
}

function writeClosingMessage(name, gender, chart) {
    const rising = cap(chart.angles.ascendant.sign);
    if (gender === 'female') {
        return `${name},\n\nIf you have read this far, you now know more about your chart than most people will ever know about theirs. And here is what I want you to take away from this:\n\n**You are not broken. You are not "too much." You are not "not enough."**\n\nEvery placement in your chart, even the hard ones, especially the hard ones, is there for a reason. The squares that create tension? They are your fuel. The retrogrades that make things feel harder? They are your superpowers turned inward. The houses that feel heavy? They are where you are building something that will last.\n\nYour chart does not define you. It describes the ENERGY you were given to work with. You have free will. You can choose the highest expression of every placement: the balcony instead of the basement.\n\nThe universe did not make a mistake with you. Your ${rising} Rising, your specific combination of planets and houses, it is all intentional. Trust the blueprint.\n\nYou have got this.\n\nWith cosmic love and real talk,\n*Your Astrology Reading*`;
    } else {
        return `${name},\n\nYou now have the blueprint. The raw data. The math behind your wiring.\n\n**Here is what matters:** Every placement, even the difficult ones, is a tool. Squares are friction, and friction creates power. Oppositions are counterweights that create balance. Retrogrades are internal engines running at higher pressure. None of it is a weakness.\n\nYour chart is not your fate. It is your equipment. A ${rising} Rising with your specific planetary configuration is built for a particular mission. The question is not "why am I like this?" It is "how do I use this?"\n\nThe hard placements? Those are where your greatest strength lives. Saturn's restrictions become your foundation. Pluto's transformations become your resilience. Chiron's wounds become your wisdom.\n\n**Own the chart. Use the energy. Build something that matters.**\n\nThis is your cosmic operating manual. Now go execute.\n\n*Your Astrology Reading*`;
    }
}

function ordSuffix(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return (s[(v - 20) % 10] || s[v] || s[0]);
}

// ============================================
// QUESTION-ANSWERING ENGINE (Cassie-style deep analysis)
// ============================================

const QUESTION_ROUTING = {
    career: { keywords: ['career', 'job', 'work', 'profession', 'calling', 'purpose', 'business', 'money', 'income', 'boss', 'coworker', 'fired', 'promotion', 'stuck in my career', 'unemployed'], houses: [6, 10, 2], planets: ['saturn', 'sun', 'jupiter', 'mars'], angles: ['midheaven'] },
    relationships: { keywords: ['relationship', 'love', 'partner', 'dating', 'marriage', 'boyfriend', 'girlfriend', 'spouse', 'attract', 'romance', 'crush', 'ex', 'breakup', 'divorce', 'single', 'soulmate', 'twin flame'], houses: [7, 5, 8], planets: ['venus', 'mars', 'moon', 'chiron'], angles: ['descendant'] },
    emotions: { keywords: ['emotion', 'feel', 'feeling', 'anxiety', 'depressed', 'overwhelm', 'cry', 'anger', 'fear', 'mood', 'sensitive', 'unstable', 'attacked', 'spiral'], houses: [4, 1, 12], planets: ['moon', 'neptune', 'pluto', 'chiron'] },
    home: { keywords: ['home', 'family', 'parent', 'mother', 'father', 'roommate', 'move', 'house', 'living situation', 'childhood'], houses: [4, 10], planets: ['moon', 'saturn', 'pluto'] },
    friends: { keywords: ['friend', 'friendship', 'social', 'community', 'betrayal', 'fake friend', 'lonely', 'isolated', 'group'], houses: [11, 3], planets: ['venus', 'mercury', 'neptune'] },
    health: { keywords: ['health', 'body', 'sick', 'energy', 'tired', 'weight', 'illness', 'pain', 'routine', 'exercise'], houses: [6, 1], planets: ['mars', 'saturn', 'chiron'] },
    growth: { keywords: ['grow', 'heal', 'transform', 'change', 'stuck', 'pattern', 'repeat', 'block', 'shadow', 'wound', 'karma', 'past life'], houses: [12, 8, 1], planets: ['chiron', 'pluto', 'saturn', 'meanLilith'] },
    identity: { keywords: ['identity', 'who am i', 'purpose', 'lost', 'direction', 'confused', 'authentic', 'self', 'confidence', 'worth'], houses: [1, 10, 5], planets: ['sun', 'moon', 'chiron', 'meanLilith'], angles: ['ascendant'] }
};

function categorizeQuestion(question) {
    const q = question.toLowerCase();
    const matches = [];
    for (const [category, data] of Object.entries(QUESTION_ROUTING)) {
        const score = data.keywords.filter(kw => q.includes(kw)).length;
        if (score > 0) matches.push({ category, score, ...data });
    }
    matches.sort((a, b) => b.score - a.score);
    return matches.length > 0 ? matches : [{ category: 'general', houses: [1, 4, 7, 10], planets: ['sun', 'moon', 'saturn', 'chiron'], keywords: [] }];
}

function writeQuestionAnswer(question, chart, aspects, currentDate) {
    const categories = categorizeQuestion(question);
    const primary = categories[0];
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    const ascSign = chart.angles.ascendant.sign;
    const ascIdx = signs.indexOf(ascSign);

    let text = '';

    // ===== HEADER =====
    text += `**Your Question:** "${question}"\n\n`;
    text += `I am not going to give you a generic answer. I pulled up your actual chart, ran the math, and I am going to show you exactly what is going on based on YOUR placements and what the planets are doing right now. Let me break this down.\n\n`;

    // ===== CURRENT TRANSIT POSITIONS (calculated from date) =====
    const transits = getApproxTransitPositions(currentDate);

    // ===== CHECK FOR STELLIUMS IN QUESTION-RELEVANT HOUSES =====
    const allPlanets = Object.entries(chart.planets).filter(([, p]) => p && p.house);
    const houseCounts = {};
    for (const [name, p] of allPlanets) {
        if (!houseCounts[p.house]) houseCounts[p.house] = [];
        houseCounts[p.house].push({ name, ...p });
    }

    // Also count transiting planets per house
    for (const t of transits) {
        const tIdx = signs.indexOf(t.sign);
        const tLong = tIdx * 30 + t.degree;
        const tHouse = getHouseFromLongitude(tLong, ascIdx);
        if (!houseCounts[tHouse]) houseCounts[tHouse] = [];
        if (['Pluto', 'Neptune', 'Uranus', 'Saturn', 'Jupiter'].includes(t.planet)) {
            houseCounts[tHouse].push({ name: 'Transit ' + t.planet, sign: t.sign, degree: t.degree, isTransit: true });
        }
    }

    // Find stelliums relevant to the question
    for (const houseNum of primary.houses) {
        const occupants = houseCounts[houseNum];
        if (occupants && occupants.length >= 3) {
            const houseArea = HOUSE_REAL_TALK[houseNum] || 'this area';
            text += `**MAJOR ALERT: ${occupants.length} PLANETS IN YOUR ${houseNum}${ordSuffix(houseNum)} HOUSE (${houseArea.toUpperCase()})**\n\n`;
            text += `Right now there are **${occupants.length} planets** concentrated in your ${houseNum}${ordSuffix(houseNum)} house:\n`;
            for (const occ of occupants) {
                const prefix = occ.isTransit ? '(Transit) ' : '';
                text += `  ${prefix}${cap(occ.name)} in ${cap(occ.sign || '')} ${occ.degree != null ? deg(occ.degree) : ''}\n`;
            }
            text += `\n**What this means:** This house is getting MASSIVE energy right now. This area of your life (${houseArea}) is not quiet, it is a focal point. `;
            if (occupants.some(o => o.name.toLowerCase().includes('mars') || o.name.toLowerCase().includes('pluto'))) {
                text += `With Mars and/or Pluto energy here, there can be power struggles, intense emotions, and situations that feel forced or high-pressure. `;
            }
            text += `The more planets here, the more this area dominates your experience.\n\n`;
        }
    }

    // ===== NATAL CHART ANALYSIS (House Rulers + Planets) =====
    text += `**YOUR NATAL CHART ON THIS TOPIC:**\n\n`;

    for (const houseNum of primary.houses) {
        const houseSign = signs[(ascIdx + houseNum - 1) % 12];
        const ruler = SIGN_RULERS[houseSign];
        const rulerData = chart.planets[ruler];
        const planetsInHouse = Object.entries(chart.planets).filter(([, p]) => p && p.house === houseNum);
        const houseArea = HOUSE_REAL_TALK[houseNum] || 'this area';

        text += `**${houseNum}${ordSuffix(houseNum)} House (${cap(houseArea)}):** ${cap(houseSign)} on the cusp.\n`;

        if (ruler && rulerData) {
            text += `The ruler is **${cap(ruler)}** in ${cap(rulerData.sign)} at ${deg(rulerData.degreeInSign)} in House ${rulerData.house} (${HOUSE_REAL_TALK[rulerData.house] || 'that area'}).`;
            if (rulerData.motionState === 'retrograde') {
                text += ` **And it is retrograde.** `;
                if (houseNum === 10 || ruler === 'saturn') {
                    text += `**Important:** Since your 10th house ruler (or Saturn) is retrograde, you are not meant to have a career in the standard traditional sense. Your path involves re-working and re-visiting how you show up as an authority. `;
                }
                text += `Standard approaches in this area do not work for you. The energy is turned inward. You process this area of life internally before you act on it externally. That is not a flaw, that is your design.`;
            } else {
                text += ` So the energy of your ${houseArea} is being DIRECTED through House ${rulerData.house}. Whatever happens in your ${HOUSE_REAL_TALK[rulerData.house] || 'that area'} directly feeds back into your ${houseArea}.`;
            }

            // Check ruler's aspects
            const rulerAspects = aspects.filter(a =>
                a.planetOne?.name === ruler || a.planetTwo?.name === ruler
            ).slice(0, 3);
            if (rulerAspects.length > 0) {
                text += ` Key aspects: `;
                for (const asp of rulerAspects) {
                    const other = asp.planetOne?.name === ruler ? asp.planetTwo?.name : asp.planetOne?.name;
                    if (asp.type === 'square') text += `${cap(ruler)} square ${cap(other)} (friction, pressure). `;
                    else if (asp.type === 'opposition') text += `${cap(ruler)} opposition ${cap(other)} (tug of war). `;
                    else if (asp.type === 'conjunction') text += `${cap(ruler)} conjunct ${cap(other)} (merged energy). `;
                    else if (asp.type === 'trine') text += `${cap(ruler)} trine ${cap(other)} (natural flow). `;
                    else if (asp.type === 'sextile') text += `${cap(ruler)} sextile ${cap(other)} (opportunity). `;
                }
            }
            text += `\n`;
        }

        if (planetsInHouse.length > 0) {
            for (const [pName, pData] of planetsInHouse) {
                const info = PLANET_REAL_TALK[pName];
                const rxInfo = (pData.motionState === 'retrograde') ? RETROGRADE_MEANINGS[pName] : null;
                if (info) {
                    text += `  ${info.icon} **${cap(pName)}** (${deg(pData.degreeInSign)} ${cap(pData.sign)}): ${info.focus}. `;

                    if (rxInfo) {
                        text += `**Rx:** ${rxInfo.theme}. ${rxInfo.description.split('.')[0]}. `;
                    }

                    if (pName === 'chiron') {
                        text += `This is your Rainbow Bridge. Stop trying to fix the ${houseArea} wound; accept it as your unique authority.`;
                    } else if (pName === 'saturn') {
                        text += `This is your Container, requiring discipline around your ${houseArea}.`;
                    }
                    text += `\n`;
                }
            }
        } else {
            text += `Remember that **empty houses are not really empty.** Your ${houseArea} is managed by the "Boss" planet (**${cap(ruler)}**), currently located in House ${rulerData?.house}. Follow the boss to understand this house.\n`;
        }
        text += `\n`;
    }

    // ===== KEY PLANETS FOR THIS QUESTION =====
    text += `**THE KEY PLAYERS:**\n\n`;
    for (const planetKey of primary.planets) {
        const pData = chart.planets[planetKey];
        if (!pData) continue;
        const info = PLANET_REAL_TALK[planetKey];
        if (!info) continue;

        text += `${info.icon} **${cap(planetKey)}** in ${cap(pData.sign)}, House ${pData.house} at ${deg(pData.degreeInSign)}`;
        if (pData.motionState === 'retrograde') text += ` (RETROGRADE)`;
        text += `\n`;
        text += `${info.focus}. `;

        if (planetKey === 'moon') {
            text += `Your emotional safety is anchored in ${cap(pData.sign)} energy and expressed through House ${pData.house} (${HOUSE_REAL_TALK[pData.house] || ''}). When this area of life gets disrupted, your ENTIRE emotional state destabilizes. `;
        }
        if (planetKey === 'venus') {
            text += `This is how you love, what you value, and what you attract. Venus in ${cap(pData.sign)} means you are attracted to ${SIGN_STYLE[pData.sign] || 'a specific type of'} energy. In House ${pData.house}, your love story plays out through ${HOUSE_REAL_TALK[pData.house] || 'this area'}. `;
            if (pData.house === 12) text += `Venus in the 12th is significant. Your love style is hidden, private, possibly self-sacrificing. You may attract situations where love is behind the scenes, unavailable, or complicated. `;
            if (pData.house === 8) text += `Venus in the 8th means love is not casual for you. It is deep, transformative, all-or-nothing. Surface-level relationships will never satisfy you. `;
            if (pData.house === 7) text += `Venus in the 7th is strong for partnerships. You value commitment and are designed for one-on-one connections. `;
        }
        if (planetKey === 'chiron') {
            text += `Chiron is your **Authentic Wound**. It represents a lack of confidence in an area where you already HAVE authority. Most people spend their lives trying to fix this; in Alchemistic Astrology, we learn to accept it. This "weakness" in ${HOUSE_REAL_TALK[pData.house] || 'this area'} is what allows you to see what others miss. `;
        }

        // Key aspects to this planet
        const planetAspects = aspects.filter(a =>
            (a.planetOne?.name === planetKey || a.planetTwo?.name === planetKey)
        ).slice(0, 4);

        if (planetAspects.length > 0) {
            text += `\nKey connections: `;
            for (const asp of planetAspects) {
                const other = asp.planetOne?.name === planetKey ? asp.planetTwo?.name : asp.planetOne?.name;
                if (asp.type === 'square') text += `**Square ${cap(other)}** (friction, fuel). `;
                else if (asp.type === 'opposition') text += `**Opposition ${cap(other)}** (tug of war, mirror). `;
                else if (asp.type === 'conjunction') text += `**Conjunct ${cap(other)}** (merged, amplified). `;
                else if (asp.type === 'trine') text += `**Trine ${cap(other)}** (natural support). `;
                else if (asp.type === 'sextile') text += `**Sextile ${cap(other)}** (gentle assist). `;
                else if (asp.type === 'quintile') text += `**Quintile ${cap(other)}** (creative manifestor). `;
                else if (asp.type === 'biQuintile') text += `**Bi-Quintile ${cap(other)}** (internal talent). `;
                else if (asp.type === 'quincunx') text += `**Quincunx ${cap(other)}** (Queen Kunk: toggle). `;
            }
        }
        text += `\n\n`;
    }

    // ===== ACTIVE TRANSITS (the weather report) =====
    let transitHits = [];
    for (const t of transits) {
        const tIdx = signs.indexOf(t.sign);
        const tLong = tIdx * 30 + t.degree;

        for (const [planetKey, pData] of Object.entries(chart.planets)) {
            if (!pData || !pData.longitude) continue;
            const diff = Math.abs(((tLong - pData.longitude + 540) % 360) - 180);
            let aspectType = null;
            let exactAngle = 0;
            if (diff <= 8) { aspectType = 'conjunction'; exactAngle = 0; }
            else if (Math.abs(diff - 180) <= 8) { aspectType = 'opposition'; exactAngle = 180; }
            else if (Math.abs(diff - 90) <= 6) { aspectType = 'square'; exactAngle = 90; }
            else if (Math.abs(diff - 120) <= 6) { aspectType = 'trine'; exactAngle = 120; }
            if (aspectType) {
                const orb = aspectType === 'conjunction' ? diff : Math.abs(diff - exactAngle);
                const isRelevant = primary.planets.includes(planetKey);
                transitHits.push({
                    transit: t.planet, transitSign: t.sign, transitDegree: t.degree,
                    natal: planetKey, natalSign: pData.sign, natalDegree: pData.degreeInSign,
                    natalHouse: pData.house,
                    type: aspectType, orb: orb, isRelevant
                });
            }
        }
    }

    transitHits.sort((a, b) => {
        if (a.isRelevant !== b.isRelevant) return a.isRelevant ? -1 : 1;
        return a.orb - b.orb;
    });

    const seen = new Set();
    transitHits = transitHits.filter(h => {
        const key = h.transit + '-' + h.natal + '-' + h.type;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    if (transitHits.length > 0) {
        text += `**WHAT IS HAPPENING RIGHT NOW (Current Transits):**\n\n`;

        const critical = transitHits.filter(h => h.orb <= 5 && ['Pluto', 'Neptune', 'Uranus', 'Saturn', 'Chiron'].includes(h.transit));
        const supporting = transitHits.filter(h => !critical.includes(h)).slice(0, 5);

        if (critical.length > 0) {
            text += `**CRITICAL TRANSITS (Tight Orbs):**\n\n`;
            for (let i = 0; i < critical.length && i < 8; i++) {
                const hit = critical[i];
                text += `**${i + 1}. ${hit.transit.toUpperCase()} ${hit.type.toUpperCase()} NATAL ${cap(hit.natal).toUpperCase()}**\n`;
                text += `   Transit ${hit.transit} in ${cap(hit.transitSign)} ${deg(hit.transitDegree)} > ${cap(hit.type)} > Natal ${cap(hit.natal)} in ${cap(hit.natalSign)} ${deg(hit.natalDegree)}\n`;
                text += `   Orb: ${hit.orb.toFixed(1)}${String.fromCharCode(176)}`;
                if (hit.orb <= 2) text += ` (EXACT!)`;
                else if (hit.orb <= 4) text += ` (Very tight)`;
                text += `\n\n`;

                const descSet = TRANSIT_DESCRIPTIONS[hit.transit];
                if (descSet && descSet[hit.type]) {
                    text += `   ${descSet[hit.type](hit.natal)}\n\n`;
                }

                if (hit.natalHouse) {
                    text += `   This is hitting your House ${hit.natalHouse} (${HOUSE_REAL_TALK[hit.natalHouse] || ''}) energy. So the effects show up most in ${HOUSE_REAL_TALK[hit.natalHouse] || 'that area'} of your life.\n\n`;
                }
            }
        }

        if (supporting.length > 0) {
            text += `**Supporting Transits:**\n\n`;
            for (const hit of supporting) {
                text += `${hit.transit} ${hit.type} your ${cap(hit.natal)} (orb: ${hit.orb.toFixed(1)}${String.fromCharCode(176)}). `;
                const descSet = TRANSIT_DESCRIPTIONS[hit.transit];
                if (descSet && descSet[hit.type]) {
                    text += descSet[hit.type](hit.natal);
                }
                text += `\n\n`;
            }
        }
    }

    // ===== SATURN RETURN CHECK =====
    const saturnNatal = chart.planets.saturn;
    if (saturnNatal) {
        for (const t of transits) {
            if (t.planet === 'Saturn') {
                const tIdx = signs.indexOf(t.sign);
                const tLong = tIdx * 30 + t.degree;
                const diff = Math.abs(((tLong - saturnNatal.longitude + 540) % 360) - 180);
                if (diff <= 15) {
                    text += `**SATURN RETURN ALERT:**\n`;
                    text += `Saturn is within ${diff.toFixed(0)}${String.fromCharCode(176)} of your natal Saturn in ${cap(saturnNatal.sign)} (House ${saturnNatal.house}). `;
                    if (diff <= 5) {
                        text += `This is your **Saturn Return** happening RIGHT NOW. This is the most important transit of your late 20s/early 30s. Saturn is testing you: did you learn the lesson? For you, the lesson is around ${HOUSE_REAL_TALK[saturnNatal.house] || 'this area'}. Every boundary you failed to set, every responsibility you avoided is being called out. But if you DO the work, Saturn rewards you with permanent stability.\n\n`;
                    } else {
                        text += `Your Saturn Return is **approaching**. The pressure in ${HOUSE_REAL_TALK[saturnNatal.house] || 'this area'} will intensify. Start setting boundaries NOW. Those who prepare get promoted. Those who resist get repeated.\n\n`;
                    }
                }
            }
        }
    }

    // ===== SYNTHESIS: WHY YOU FEEL THIS WAY =====
    text += `**SUMMARY: WHY YOUR CHART SAYS THIS IS HAPPENING**\n\n`;

    if (primary.category === 'relationships') {
        const venus = chart.planets.venus;
        const chiron = chart.planets.chiron;
        const moon = chart.planets.moon;
        const h7Sign = signs[(ascIdx + 6) % 12];

        text += `**Based on your natal chart + current transits:**\n\n`;

        text += `1. **Your Love Pattern:**\n`;
        if (venus) {
            text += `   Venus in ${cap(venus.sign)} (House ${venus.house}) controls how you attract and what you value. `;
            if (venus.house === 12) text += `In the 12th house, your love life has a "hidden" quality. Love happens behind closed doors, through sacrifice, or with unavailable people. You attract karmic relationships that force you to confront your deepest patterns.`;
            else if (venus.house === 8) text += `In the 8th house, love is never surface-level for you. You need DEPTH, intensity, and total honesty. Casual does not work. This also means you attract transformative, sometimes painful, dynamics.`;
            else if (venus.house === 5) text += `In the 5th house, romance and joy are central. You want love that feels FUN. But you may confuse the excitement of the chase with real commitment.`;
            else text += `In House ${venus.house}, your love energy flows through the area of ${HOUSE_REAL_TALK[venus.house] || 'life'}.`;
        }
        text += `\n\n`;

        text += `2. **What You Attract:**\n`;
        text += `   Your 7th house is ${cap(h7Sign)}. The ruler, ${cap(SIGN_RULERS[h7Sign])}, determines the CONDITIONS and TYPE of people who show up as partners. Look at where that ruler sits in your chart. Its condition (sign, house, aspects, retrograde status) tells you everything about the quality and nature of your partnerships.\n\n`;

        if (chiron) {
            text += `3. **The Wound:**\n`;
            text += `   Chiron in ${cap(chiron.sign)} (House ${chiron.house}) shows where you feel "broken." This wound keeps attracting the SAME types of situations until you heal it. When you say "everyone cheats or leaves," that is Chiron's pattern repeating. The pattern does not change until YOU change your relationship to the wound.\n\n`;
        }

        if (moon) {
            text += `4. **Emotional Needs:**\n`;
            text += `   Your Moon in ${cap(moon.sign)} (House ${moon.house}) is what you NEED to feel safe. If your partners are not providing ${SIGN_STYLE[moon.sign] || 'this type of'} security, you will always feel unsettled regardless of how "good" they look on paper.\n\n`;
        }

        text += `**Bottom Line:** The answer to "what am I doing wrong" is rarely about you being wrong. Your chart is set up in a specific way that requires specific conditions for love to work. When you try to force love to look like everyone else's, it breaks. When you honor how YOUR Venus, 7th house, and Moon are designed, the right connection finds you. Stop chasing what looks right on paper and start honoring what your chart actually NEEDS.\n\n`;

    } else if (primary.category === 'career') {
        const saturnP = chart.planets.saturn;
        const venus = chart.planets.venus;

        text += `**Based on your natal chart + current transits:**\n\n`;

        // Check for Money/Finance keywords
        const isMoney = /money|income|wealth|finance|salary|paid/i.test(question);

        if (isMoney) {
            text += `1. **The Money Code (The "Libra Point"):**\n`;
            text += `   Most people check the 2nd House for money. That is basic. While your 2nd House (and its ruler) shows how you **make** money, the secret is your **Libra House**. Venus rules both Taurus (Money) and Libra (Balance). If your financial bucket has a hole in it, it is always the Libra House.\n`;

            // Calculate Libra House
            const libraIndex = signs.indexOf('libra');
            const libraHouse = ((libraIndex - ascIdx + 12) % 12) + 1;

            text += `   Your Libra is likely in **House ${libraHouse}** (${HOUSE_REAL_TALK[libraHouse] || 'this area'}). This is where you must maintain balance to KEEP what you earn. If this area is chaotic, your bank account will be too, no matter how much you hustle.\n\n`;

            if (venus) {
                text += `2. **Your Value Driver (Venus):**\n`;
                text += `   Venus in ${cap(venus.sign)} (House ${venus.house}) shows what you VALUE. Money flows when you honor this placement. If you are doing work that conflicts with your Venus sign's values, the money will dry up because the energetic alignment is off.\n\n`;
            }
        } else {
            text += `1. **Work Zone Issues:**\n`;
            text += `   Your 6th house shows daily work and the 10th house shows career path. The rulers of these houses and their conditions explain WHY things feel the way they do.\n\n`;
        }

        if (saturnP) {
            text += `3. **Saturn's Lesson:**\n`;
            text += `   Saturn in House ${saturnP.house} shows where you MUST build discipline and set boundaries. If people are walking all over you or you feel restricted, check if Saturn's lesson (boundaries, discipline) has been learned or ignored.\n\n`;
        }

        text += `**Bottom Line:** Your career/financial path is not broken. It is being tested. ${isMoney ? 'Look at your Libra house—restore balance there, and the money stabilizes.' : 'Set boundaries. Take responsibility for what is yours. Let go of what is not.'} The pressure is temporary, but your decisions under pressure are permanent.\n\n`;

    } else if (primary.category === 'identity') {
        const sun = chart.planets.sun;
        const pluto = chart.planets.pluto;
        // Robust check for North Node across possible data structures
        const nn = chart.planets.northNode || chart.planets['North Node'] || chart.planets['north node'] || (chart.points && (chart.points.northNode || chart.points.north_node));

        text += `**Based on your natal chart + deep manifestation mechanics:**\n\n`;

        if (sun && pluto) {
            text += `1. **The Manifestation Engine (Sun + Pluto):**\n`;
            text += `   True manifestation is not just "thinking positive." It is aligning your **Sun** (The Conscious Goal) with your **Pluto** (The Nuclear Power Source). \n`;
            text += `   Your Sun is in ${cap(sun.sign)} (House ${sun.house}). This is what you WANT.\n`;
            text += `   Your Pluto is in ${cap(pluto.sign)} (House ${pluto.house}). This is your POWER.\n`;

            // Check aspect between Sun and Pluto
            const sunPlutoAspect = aspects.find(a =>
                (a.planetOne.name === 'sun' && a.planetTwo.name === 'pluto') ||
                (a.planetOne.name === 'pluto' && a.planetTwo.name === 'sun')
            );

            if (sunPlutoAspect) {
                if (['square', 'opposition'].includes(sunPlutoAspect.type)) {
                    text += `   **You have a ${cap(sunPlutoAspect.type)} between them.** This means your conscious desires and your subconscious power are fighting. You might self-sabotage right when you get close to the goal. The Secret: **Transmutation.** You need to use the friction (the fear/intensity) as FUEL. Do not try to be calm. Use the intensity to drive the action.\n\n`;
                } else if (['trine', 'sextile'].includes(sunPlutoAspect.type)) {
                    text += `   **You have a ${cap(sunPlutoAspect.type)} between them.** This is a superpower. Your will and your deep power flow together naturally. Use this. When you truly decide on a goal, you can move mountains with less effort than others.\n\n`;
                } else if (sunPlutoAspect.type === 'conjunction') {
                    text += `   **They are Conjunct.** You are a powerhouse. Your identity IS transformation. You do not just achieve goals, you destroy the old version of yourself to get them.\n\n`;
                }
            } else {
                text += `   They are not forming a major aspect. This means you have to consciously bridge them. Your power source (Pluto) is separate from your ego (Sun). You must intentionally visit your Pluto house (${HOUSE_REAL_TALK[pluto.house]}) to recharge before chasing your Sun goals.\n\n`;
            }
        }

        if (sun && moon && Math.abs(sun.longitude - moon.longitude) < 3) {
            text += `3. **Your New Moon Signature:**\n`;
            text += `   You were born during a **New Moon** (Sun conjunct Moon). This is a powerful, unified signature. Your ego (Sun) and your emotional needs (Moon) are aligned. You don't have the typical internal "tug of war" between what you want and what you feel—they are one and the same. This gives you a massive ability to manifest because you aren't fighting yourself.\n\n`;
        }

        if (nn) {
            text += `4. **Your True North (The North Node):**\n`;
            text += `   If you feel lost, it is because you are hanging out in your South Node (your comfort zone/past lives). Your **North Node is in ${cap(nn.sign)} (House ${nn.house})**.\n`;
            text += `   **The Secret:** The North Node always feels uncomfortable at first. It feels "new" and "risky." But it is the ONLY direction that fulfills you. Stop doing what you are good at (South Node) and start doing what scares you a little (North Node).\n\n`;
        }

        text += `**Bottom Line:** You are not lost. You are just buffering between who you were (South Node) and who you are becoming (North Node). Align your Sun's goal with Pluto's power, and move toward the thing that scares you. That is the map.\n\n`;

    } else if (primary.category === 'emotions') {
        const moonP = chart.planets.moon;
        text += `**Based on your natal chart + current transits:**\n\n`;
        if (moonP) {
            text += `1. **Emotional Core:**\n`;
            text += `   Your Moon in ${cap(moonP.sign)} (House ${moonP.house}) is what you FEEL. When that is threatened, anxiety and overwhelm take over. This is not you being "too emotional." This is your Moon being unmet.\n\n`;
        }
        text += `2. **What Is Triggering You:**\n`;
        text += `   The transits above show exactly what is shaking your foundation right now. ${transitHits.filter(h => h.natal === 'moon').length > 0 ? 'Your Moon IS being hit by active transits. The instability you feel is real and has a cause.' : 'Even without direct Moon transits, the chart activation is creating pressure.'}\n\n`;
        text += `**Bottom Line:** Your emotions are not the enemy. They are data. Stop trying to control them and start LISTENING. What does your Moon actually need? Give it that.\n\n`;

    } else {
        text += `Every placement connected to your question tells a specific story. The houses show WHERE, the planets show WHAT, the signs show HOW, and the transits show WHEN. You are not imagining things. The chart confirms what you are feeling.\n\n`;
    }

    // ===== FINAL PROTOCOL =====
    text += `**THE PROTOCOL: THE ALCHEMICAL PATH**\n\n`;
    text += `You have to understand the sequence: **Spark (Degree) > Tone (Sign) > Field (House) > Delegate (Ruler)**. Stop looking at your placements as "static" things. They are energies in motion. \n\n`;
    text += `When you face a challenge in this area, use the **Reverse Vantage.** Ask: "How is my receiving planet (the planet being hit) programmed to catch this ball?" You have the power of alchemy. The planets create the pressure; you decide the manifestation. Change the internal reception, and you change the external result. \n\n`;
    text += `Remember: You are an extension of the Earth. The whole chart is YOU. Let's look at your Subheaven (IC) to see what roots you, and your Ascendant to see why you emerged.\n\n`;
    text += `Teacher Voice: "Fixed the internal, and the map opens up. If you haven't dealt with the inner authority issues, no relocation or success will fix it—you'll just be relocating the problems." Trust your blueprint.\n`;

    return { title: 'Your Question Answered', content: text, icon: String.fromCodePoint(0x1F4AC) };
}

// Approximate transit positions based on date (outer planets move slowly)
function getApproxTransitPositions(date) {
    const d = date instanceof Date ? date : new Date();
    const refDate = new Date(2026, 0, 1);
    const daysSinceRef = (d - refDate) / (1000 * 60 * 60 * 24);

    return [
        { planet: 'Pluto', sign: 'aquarius', degree: Math.min(29, Math.max(0, 1 + daysSinceRef * 0.01)) },
        { planet: 'Neptune', sign: daysSinceRef > 80 ? 'aries' : 'pisces', degree: daysSinceRef > 80 ? Math.min(29, (daysSinceRef - 80) * 0.011) : Math.min(29, 29.5 + daysSinceRef * 0.011) },
        { planet: 'Uranus', sign: daysSinceRef > 180 ? 'gemini' : 'taurus', degree: daysSinceRef > 180 ? Math.min(29, (daysSinceRef - 180) * 0.012) : Math.min(29, 27 + daysSinceRef * 0.012) },
        { planet: 'Saturn', sign: daysSinceRef > 150 ? 'aries' : 'pisces', degree: daysSinceRef > 150 ? Math.min(29, (daysSinceRef - 150) * 0.033) : Math.min(29, 25 + daysSinceRef * 0.033) },
        { planet: 'Jupiter', sign: 'cancer', degree: Math.min(29, Math.max(0, 12 + daysSinceRef * 0.083)) },
        { planet: 'Chiron', sign: 'taurus', degree: Math.min(29, Math.max(0, 24 + daysSinceRef * 0.015)) }
    ];
}

// Determine house from ecliptic longitude given ascendant sign index (whole sign houses)
function getHouseFromLongitude(longitude, ascIdx) {
    const signIdx = Math.floor((longitude % 360) / 30);
    return ((signIdx - ascIdx + 12) % 12) + 1;
}


// ============================================
// MAIN GENERATOR
// ============================================
export function generateDeepReport(chartReading, birthData, currentDate = new Date(), userQuestions = []) {
    const { chart, interpretations, aspects } = chartReading;
    const name = birthData.name || 'Friend';
    const gender = birthData.gender || 'female';

    const sections = [];

    sections.push({ title: 'A Personal Message', content: generateOpeningMessage(name, gender, chart), icon: String.fromCodePoint(0x1F4AB), isOpening: true });

    // If user asked questions, answer them FIRST (before anything else)
    if (userQuestions && userQuestions.length > 0) {
        for (let i = 0; i < userQuestions.length; i++) {
            const qSection = writeQuestionAnswer(userQuestions[i], chart, aspects, currentDate);
            qSection.title = userQuestions.length > 1 ? `Question ${i + 1} Answered` : 'Your Question Answered';
            sections.push(qSection);
        }
    }

    // NEW: Delegate Hierarchy
    sections.push(writeDelegateHierarchy(chart));

    let coreText = `Before we dive into individual planets, let's look at the baseline of your energetic container:\n\n`;
    const asc = chart.angles.ascendant;
    coreText += `**Your Rising Sign: ${cap(asc.sign)} ${SIGN_SYMBOLS[asc.sign] || ''}**\n`;
    coreText += `Your Rising Sign is the most critical point in your blueprint. It is not your personality; it is the **primary response style** you developed to navigate the world. It determines the entire landscape of your life—the "Field" in which every other part of you must operate. \n\n`;
    coreText += `With **${cap(asc.sign)}** Rising, you learned to project an energy that is ${SIGN_MEANINGS[asc.sign]?.style || 'unique'}. This was your first successful adaptation for interacting with society. Whether you are aware of it or not, this is the "vehicle" you are driving through this lifetime.\n\n`;

    // ADDED: 12 Degrees Rule (Astrocartography principle)
    if (asc.degreeInSign >= 11.5 && asc.degreeInSign <= 12.5) {
        coreText += `**Special Signature (12 Degrees):** Since your Ascendant is at 12 degrees, you have a deep, intuitive, and Neptune-influenced layer to your response style. You sense the "undercurrents" of a room before anything is even said.\n\n`;
    }

    sections.push({ title: `Your Foundation: ${cap(asc.sign)} Rising`, content: coreText, icon: String.fromCodePoint(0x1F3DB) });

    // Retrograde Dynamics (Concise Overview)
    const rxPlanets = Object.keys(chart.planets).filter(p => chart.planets[p] && chart.planets[p].motionState === 'retrograde');
    if (rxPlanets.length > 0) {
        let rxText = `You have **${rxPlanets.length} planets in retrograde** in your chart: ${rxPlanets.map(p => cap(p)).join(', ')}.\n\n`;
        rxText += `In our work together, we see retrogrades as **Internalized Survival Protocols**. Because these energies were not mirrored or supported in your early environment, you turned them inward. You are here to master these areas for *yourself* first, often going through a period of "overcompensation" until you find your own internal authority.\n`;
        sections.push({ title: 'The Internal Turn: Retrograde Overview', content: rxText, icon: '🔄' });
    }

    const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'meanLilith'];
    for (const p of planetOrder) {
        if (!chart.planets[p]) continue;
        const section = writePlanetSection(p, chart.planets[p], chart, interpretations);
        if (section) sections.push(section);
    }

    // NEW: Alchemistic Advanced Layers (Fusion Cusp & Orbs)
    let advancedText = `This is where we go beyond basic descriptions and look at the **Mechanics of your Integration**. These are the subtle thresholds where your adaptations blend and your wounds find surgical precision.\n\n`;
    let hasAdvanced = false;

    // 1. Fusion Cusps & Reaching Planets
    let fusionHits = [];
    for (const pName of planetOrder) {
        const pData = chart.planets[pName];
        const status = getFusionStatus(pName, pData);
        if (status) {
            const nextHouse = (pData.house % 12) + 1;
            if (status === 'FUSION') {
                let fusionDesc = `**${cap(pName)} at ${deg(pData.degreeInSign)}:** You are in a **Threshold Area**. Your ${PLANET_REAL_TALK[pName].focus} is not just in one house; it is definitively bleeding into the next. You influence multiple areas of life through a single pulse. It's a "gradient spill-off" effect where your boundaries between life areas are naturally thin.`;
                if (Math.round(pData.degreeInSign) === 29) {
                    fusionDesc += ` **Special Note:** Being at the 29th degree specifically brings in a sense of urgency. You may feel regular "teardowns" in this area as you prepare to move into a new state of being.`;
                }
                fusionHits.push(fusionDesc);
            } else {
                fusionHits.push(`**${cap(pName)} at ${deg(pData.degreeInSign)}:** Your influence is **reaching into the next field**. While your direct actions are in one house, the emotional impact is already felt in the next. You are living on the edge of a developmental shift.`);
            }
        }
    }
    if (fusionHits.length > 0) {
        hasAdvanced = true;
        advancedText += `### 🧬 Threshold Areas: Where Your Worlds Blend\n`;
        advancedText += `In our work, when a planet sits at the edge of a sign, we call it a **Threshold**. You aren't just "in the room"; you are "at the door." The energy is merging. You cannot separate these two areas of your life easily.\n\n`;
        advancedText += fusionHits.join('\n\n') + `\n\n`;
    }

    // 2. Reverse Vantage Perspective
    if (aspects && aspects.length > 0) {
        hasAdvanced = true;
        advancedText += `### 🔄 The Receiver's Voice: Internal Dialogue\n`;
        advancedText += `Most analysis tells you how your planets "fight." But we ask: how are you **receiving** the pressure? To understand an internal conflict, we must go to the part of you that is "catching the ball." \n\n`;

        // Pick the top 4 most precise aspects for RV analysis
        const rvAspects = aspects.slice(0, 4);
        for (const asp of rvAspects) {
            const rvDescription = getReverseVantage(asp, chart);
            if (rvDescription) {
                advancedText += `**${cap(asp.planetOne.name)} interaction with ${cap(asp.planetTwo.name)}:** ${rvDescription}\n\n`;
            }
        }
    }

    // 3. Specific Rule: 6th House Ruler Rx
    const signsArr = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    const ascIdx = signsArr.indexOf(chart.angles.ascendant.sign);
    const house6Sign = signsArr[(ascIdx + 5) % 12];
    const ruler6 = SIGN_RULERS[house6Sign];
    const ruler6Data = chart.planets[ruler6];
    if (ruler6Data && ruler6Data.motionState === 'retrograde') {
        hasAdvanced = true;
        advancedText += `### ⚖️ The Burden Release Adaptation\n`;
        advancedText += `Your **6th House Ruler (${cap(ruler6)}) is Retrograde**. You likely adapted to stress by taking on more and more responsibility, hoping it would make you safe. **The Inquiry:** As soon as you determine something is "enough," get it out the door. Releasing the work is the only way to avoid the physical burden of stress.\n\n`;
    }

    // 4. Chiron Precision (Low Orb)
    if (chart.planets.chiron) {
        hasAdvanced = true;
        advancedText += `### 🏹 The Surgical Wound: Chiron\n`;
        advancedText += `Chiron highlights where our wounds are most precise. `;
        if (chart.planets.chiron.house === 10) {
            advancedText += `With this in your field of Authority, you may feel public scrutiny is a recurring pain. Your path is to own your story so completely that the public "theatrics" no longer have power over your internal peace. `;
        }
        if (chart.planets.chiron.house === 12) {
            advancedText += `In the field of Isolation, your wound feels "hidden" or "weird." Accept this as your power—you are a bridge between the seen and unseen worlds. `;
        }
        advancedText += `Chiron is simply there to be felt and eventually integrated into your authority.\n\n`;
    }

    if (hasAdvanced) {
        sections.push({ title: 'Mechanics of Integration', content: advancedText, icon: '🧪' });
    }

    if (aspects && aspects.length > 0) {
        const aspSection = writeAspectSection(aspects);
        if (aspSection) sections.push(aspSection);
    }

    sections.push(writeTransitSection(chart, currentDate));

    // ADDED: Astrocartography Section
    let acText = `Astrology doesn't just happen in time; it happens in **Location**. This is the art of Astrocartography.\n\n`;
    acText += `**Relocation Insight:** If you've been thinking about moving, remember that someone might tell you to "move to your Venus line" or "move to your Jupiter line" because they sound amazing. While these lines *can* be incredible for love and expansion, you must beware that many generic astrology books are inaccurate. You have to consider the aspects—if Neptune is negatively aspecting your Venus, that line might bring more fog than love.\n\n`;

    // Check POF Orb
    if (chart.planets.sun && chart.planets.moon && asc) {
        // Simplified POF calculation if not already in chart
        const pofLong = (asc.longitude + (chart.planets.moon.longitude - chart.planets.sun.longitude) + 360) % 360;
        const pofDeg = pofLong % 30;
        if (pofDeg >= 15.5 && pofDeg <= 16.5) {
            acText += `**Important Orb Note:** Your Part of Fortune is at 16 degrees. In relocation work, it is important to note that this is **out of the orb of influence** (which cuts off at 15 degrees). Since these are mathematical points, we have to be precise. You'll want to consider if moving east moves your Part of Fortune into a sextile with your Ascendant, which would unlock inherent luck in sales and local communication.\n\n`;
        }
    }

    acText += `**Teacher Voice:** It's really important to know that this is supposed to be fun! The longer you stay in a location, the more these lines activate. But remember: if you haven't dealt with your inner issues, relocation astrology won't fix them—it will just relocate the issues.\n`;
    sections.push({ title: 'Location & Relocation (Astrocartography)', content: acText, icon: '🌍' });

    let text = `Welcome to the family. I am so happy you are here and taking this step to understand your energetic blueprint. Remember that this is not about "fortune telling"—it is about **Alchemy**. It is about taking the cards you were dealt and learning how to play them at the highest level.\n\n`;
    text += `Stay in the work. Join the vibe tribe. And most importantly, keep using this map to navigate your own evolution.\n\n`;
    text += `Talk soon,\n\nThe Alchemistic Astrology Team`;

    // Format birth info for display
    const bTime = birthData.time || '12:00';
    const bDate = new Date(`${birthData.date}T${bTime}`);
    const displayDate = !isNaN(bDate.getTime())
        ? bDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        : birthData.date;
    const displayTime = !isNaN(bDate.getTime())
        ? bDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        : birthData.time;

    return {
        title: `${name}'s Astrological Blueprint`,
        subtitle: `${cap(chart.planets.sun.sign)} Sun . ${cap(chart.planets.moon.sign)} Moon . ${cap(asc.sign)} Rising`,
        name, gender, sections,
        birthInfo: {
            date: displayDate,
            time: displayTime,
            location: birthData.locationName
        },
        generatedDate: currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    };
}

// ============================================
// HTML REPORT WITH GENDER THEMES
// ============================================
export function generateDeepReportHTML(report) {
    const isFemale = report.gender === 'female';

    const theme = isFemale ? {
        bg: 'linear-gradient(135deg, #1a1020 0%, #2d1f3d 30%, #1a1020 100%)',
        accent: '#e8a4c8', accent2: '#c084fc', accent3: '#f9a8d4',
        gold: '#f0c27f', textPrimary: '#f8f0f4', textSecondary: '#c9b3c9',
        sectionBg: 'rgba(232,164,200,0.06)', sectionBorder: 'rgba(232,164,200,0.2)',
        headerGradient: 'linear-gradient(135deg, #e8a4c8, #c084fc, #f9a8d4)',
        openingBg: 'linear-gradient(135deg, rgba(249,168,212,0.1), rgba(192,132,252,0.08))',
        closingBg: 'linear-gradient(135deg, rgba(232,164,200,0.12), rgba(249,168,212,0.08))',
        divider: 'linear-gradient(90deg, transparent, #e8a4c8, transparent)',
        printBg: '#fdf6f9', printText: '#3d2b3a', printAccent: '#9b4d7a',
        printGold: '#8b6914', printSection: '#faf0f5', printBorder: '#e8c4d8'
    } : {
        bg: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3d 30%, #0a0e1a 100%)',
        accent: '#64b5f6', accent2: '#90caf9', accent3: '#42a5f5',
        gold: '#ffd54f', textPrimary: '#e8ecf4', textSecondary: '#a0aec0',
        sectionBg: 'rgba(100,181,246,0.06)', sectionBorder: 'rgba(100,181,246,0.2)',
        headerGradient: 'linear-gradient(135deg, #ffd54f, #64b5f6, #90caf9)',
        openingBg: 'linear-gradient(135deg, rgba(255,213,79,0.1), rgba(100,181,246,0.08))',
        closingBg: 'linear-gradient(135deg, rgba(100,181,246,0.12), rgba(255,213,79,0.08))',
        divider: 'linear-gradient(90deg, transparent, #64b5f6, transparent)',
        printBg: '#f5f7fa', printText: '#1a2332', printAccent: '#1e3a5f',
        printGold: '#8b6914', printSection: '#eef2f7', printBorder: '#c4d4e8'
    };

    const fontImport = isFemale
        ? `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');`
        : `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap');`;

    const displayFont = isFemale ? "'Playfair Display', Georgia, serif" : "'Cinzel', 'Times New Roman', serif";
    const bodyFont = isFemale ? "'Lora', Georgia, serif" : "'Source Serif 4', Georgia, serif";

    let html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${report.title}</title>
<style>
${fontImport}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:${bodyFont};font-size:17px;line-height:1.85;color:${theme.textPrimary};background:${theme.bg};padding:0;margin:0;}
.report-wrap{max-width:820px;margin:0 auto;padding:40px 50px 60px;}

/* HEADER */
.report-cover{text-align:center;padding:60px 20px 50px;margin-bottom:50px;border-bottom:2px solid;border-image:${theme.divider} 1;}
.cover-symbol{font-size:4rem;margin-bottom:20px;display:block;opacity:0.8;}
.cover-title{font-family:${displayFont};font-size:2.6rem;font-weight:700;background:${theme.headerGradient};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:1px;margin-bottom:12px;}
.cover-subtitle{font-family:'Inter',sans-serif;font-size:1rem;color:${theme.textSecondary};letter-spacing:3px;text-transform:uppercase;margin-bottom:20px;}
.cover-info{font-family:'Inter',sans-serif;font-size:0.85rem;color:${theme.textSecondary};padding:15px 25px;background:${theme.sectionBg};border:1px solid ${theme.sectionBorder};border-radius:12px;display:inline-block;}

/* SECTIONS */
.report-section{margin-bottom:45px;page-break-inside:avoid;}
.section-divider{width:60%;height:1px;background:${theme.divider};margin:0 auto 45px;border:none;}
.section-head{display:flex;align-items:center;gap:14px;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid ${theme.sectionBorder};}
.section-ico{font-size:1.6rem;color:${theme.accent};}
.section-ttl{font-family:${displayFont};font-size:1.4rem;font-weight:600;color:${theme.accent};letter-spacing:0.5px;}
.section-body{text-align:left;padding:0 5px;}
.section-body p{margin-bottom:1em;}
.section-body strong{color:${theme.gold};font-weight:600;}
.section-body em{color:${theme.accent2};font-style:italic;}

/* OPENING/CLOSING special */
.opening-section .section-body,.closing-section .section-body{padding:25px 30px;background:${theme.openingBg};border:1px solid ${theme.sectionBorder};border-radius:12px;font-size:1.05rem;line-height:2;white-space:pre-line;}
.closing-section .section-body{background:${theme.closingBg};}

/* FOOTER */
.report-footer{text-align:center;font-family:'Inter',sans-serif;font-size:0.8rem;color:${theme.textSecondary};margin-top:50px;padding-top:25px;border-top:1px solid ${theme.sectionBorder};}
.report-footer em{color:${theme.accent};}

/* PRINT STYLES - proper margins, minimize whitespace, suppress browser chrome */
@page{margin:0.5in 0.6in;size:auto;}
@media print{
  body{background:${theme.printBg}!important;color:${theme.printText}!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:0;margin:0;}
  .report-wrap{padding:0;max-width:100%;}
  .cover-title{background:none!important;-webkit-text-fill-color:${theme.printAccent}!important;color:${theme.printAccent}!important;font-size:2.2rem;}
  .cover-subtitle{color:${theme.printGold}!important;}
  .cover-info{background:${theme.printSection}!important;border-color:${theme.printBorder}!important;color:${theme.printText}!important;}
  .section-ttl{color:${theme.printAccent}!important;}
  .section-body{color:${theme.printText}!important;}
  .section-body strong{color:${theme.printGold}!important;}
  .section-body em{color:${theme.printAccent}!important;}
  .opening-section .section-body,.closing-section .section-body{background:${theme.printSection}!important;border-color:${theme.printBorder}!important;color:${theme.printText}!important;padding:15px 20px!important;}
  .report-section{page-break-inside:auto;margin-bottom:25px;}
  .section-head{page-break-inside:avoid;page-break-after:avoid;border-color:${theme.printBorder}!important;}
  .section-body p{orphans:3;widows:3;}
  .section-divider{background:${theme.printBorder}!important;margin:15px auto!important;}
  .cover-symbol{filter:grayscale(0.3);}
  .report-cover{page-break-after:avoid;padding:30px 20px 25px!important;margin-bottom:25px!important;}
  .report-footer{color:#888!important;border-color:${theme.printBorder}!important;}
}

/* PRINT BUTTON (hidden when printing) */
.print-bar{position:fixed;top:0;left:0;right:0;background:rgba(0,0,0,0.9);padding:12px 20px;display:flex;justify-content:center;gap:15px;z-index:9999;}
.print-bar button{padding:10px 24px;border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:0.9rem;cursor:pointer;font-weight:500;}
.print-btn{background:${theme.accent};color:#000;}
.close-btn{background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)!important;}
@media print{.print-bar{display:none!important;}}
</style></head><body>
<div class="print-bar">
  <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  <button class="close-btn" onclick="window.close()">Close</button>
</div>
<div class="report-wrap">
  <header class="report-cover">
    <span class="cover-symbol">${isFemale ? '✨' : '⚡'}</span>
    <h1 class="cover-title">${report.title}</h1>
    <p class="cover-subtitle">${report.subtitle}</p>
    <div class="cover-info">
      <strong>Born:</strong> ${report.birthInfo.date || 'N/A'} at ${report.birthInfo.time || 'N/A'}<br>
      <strong>Location:</strong> ${report.birthInfo.location || 'N/A'}<br>
      <strong>Report Generated:</strong> ${report.generatedDate}
    </div>
  </header>
  <main>`;

    for (let i = 0; i < report.sections.length; i++) {
        const s = report.sections[i];
        if (i > 0) html += `<hr class="section-divider">`;
        const cls = s.isOpening ? ' opening-section' : s.isClosing ? ' closing-section' : '';

        let content = s.content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        if (!content.startsWith('<p>')) content = '<p>' + content + '</p>';

        html += `
    <section class="report-section${cls}">
      <div class="section-head">
        <span class="section-ico">${s.icon}</span>
        <h2 class="section-ttl">${s.title}</h2>
      </div>
      <div class="section-body">${content}</div>
    </section>`;
    }

    html += `
  </main>
  <footer class="report-footer">
    Report generated on ${report.generatedDate}<br>
    <em>Readings-Astrology . ADS/FREE Theory Chart Engine</em><br>
    <small>Based on Alchemistic Astrology principles. This is an energetic blueprint, not a prediction.</small>
  </footer>
</div></body></html>`;

    return html;
}
