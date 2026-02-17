/**
 * Astrology Readings - Yearly Forecast Engine
 * Based on ADS/FREE Theory - Transits and Timing
 * 
 * Framework: Uses transits (current planetary positions) to determine
 * what themes, challenges, and opportunities are active throughout the year.
 */

import {
    PLANETARY_ORBS, SIGN_RULERS, HOUSE_THEMES, ZODIAC_SIGNS,
    PLANET_SYMBOLS, SIGN_SYMBOLS, MAJOR_ASPECTS
} from '../core/constants.js';

// ============================================
// TRANSIT PLANET MEANINGS (From the doctrine)
// ============================================

export const TRANSIT_MEANINGS = {
    sun: {
        name: 'Sun',
        symbol: '☉',
        transitDuration: '~1 month per sign',
        brings: 'Energy, creative expression, vitality, focus on children',
        challenge: 'Overconfidence, ego issues, pride',
        advice: 'Shine in this area but stay humble. Express yourself creatively.',
        beginnerExplanation: 'When the Sun transits a house, it brings ENERGY and LIGHT to that life area. You feel more alive and motivated in these matters. It\'s your time to shine here!'
    },
    moon: {
        name: 'Moon',
        symbol: '☽',
        transitDuration: '2-3 days per sign',
        brings: 'Emotional triggers, instinctive reactions, heightened sensitivity',
        challenge: 'Reactionary behavior, moodiness, losing emotional control',
        advice: 'Recognize "this is the Moon" - pause before reacting emotionally.',
        beginnerExplanation: 'Moon transits trigger EMOTIONAL reactions. You may feel more sensitive or moody. The key is to pause and not react impulsively - recognize the Moon is influencing your emotions.'
    },
    mercury: {
        name: 'Mercury',
        symbol: '☿',
        transitDuration: '3-4 weeks per sign',
        brings: 'Communication focus, documents, siblings/cousins, organization, details',
        challenge: 'Miscommunication, overlooking details, scattered thinking',
        advice: 'Pay attention to contracts, conversations, and fine print.',
        beginnerExplanation: 'Mercury transits put focus on COMMUNICATION and THINKING. Sign contracts, have important conversations, organize details. Your mind is active in this area.'
    },
    venus: {
        name: 'Venus',
        symbol: '♀',
        transitDuration: '3-4 weeks per sign',
        brings: 'Partnership opportunities, love, luxury, money, beauty',
        challenge: 'Overspending, superficiality, relationship idealization',
        advice: 'Attract what you value. Good for relationships and finances.',
        beginnerExplanation: 'Venus transits bring LOVE, MONEY, and PLEASURE to focus. Relationships flow more easily, money opportunities arise, and you appreciate beauty. Enjoy, but don\'t overspend!'
    },
    mars: {
        name: 'Mars',
        symbol: '♂',
        transitDuration: '6-7 weeks per sign',
        brings: 'Action, extra energy, drive, motivation, passion',
        challenge: 'Aggression, impatience, conflict, accidents',
        advice: 'Channel this energy productively. Take action but avoid conflict.',
        beginnerExplanation: 'Mars transits give you ENERGY and DRIVE in this life area. You\'ll feel motivated to take action. Use this power wisely - it can make you accomplish a lot or cause conflict if not managed.'
    },
    jupiter: {
        name: 'Jupiter',
        symbol: '♃',
        transitDuration: '~1 year per sign',
        brings: 'Expansion, abundance, luck, learning opportunities, growth',
        challenge: 'Overdoing things, over-expansion, unrealistic optimism',
        advice: 'Great time to learn, travel, or expand in this area. Don\'t overdo it.',
        beginnerExplanation: 'Jupiter is your LUCKY star! When it transits a house, things in that life area tend to EXPAND and GROW. You find opportunities, luck, and abundance. This is a fortunate period for that area of life.'
    },
    saturn: {
        name: 'Saturn',
        symbol: '♄',
        transitDuration: '~2.5 years per sign',
        brings: 'Restrictions, long-term goals, discipline, structure, responsibility',
        challenge: 'Feeling blocked, delays, extra burdens, depression',
        advice: 'Saturn takes away distractions and forces you to focus. Do the work - the foundation you build now lasts.',
        beginnerExplanation: 'Saturn is the TEACHER. It may feel like this area of life gets harder or more restricted - but that\'s because Saturn is forcing you to BUILD A FOUNDATION. The work you do now creates lasting results. You can\'t have your "fun stuff" back until you focus on what Saturn demands.'
    },
    uranus: {
        name: 'Uranus',
        symbol: '♅',
        transitDuration: '~7 years per sign',
        brings: 'Abrupt change, innovation, technology breakthroughs, freedom',
        challenge: 'Instability, unexpected disruptions, rebellion without cause',
        advice: 'Expect the unexpected. Embrace innovation and be flexible.',
        beginnerExplanation: 'Uranus brings SUDDEN CHANGE and REVOLUTION to this area of life. Things you thought were stable may shift unexpectedly. This is about breaking free from old patterns and embracing innovation.'
    },
    neptune: {
        name: 'Neptune',
        symbol: '♆',
        transitDuration: '~14 years per sign',
        brings: 'Spirituality (higher), illusion (lower), dreams, intuition',
        challenge: 'Confusion, deception, rose-colored glasses, escapism',
        advice: 'Good for spiritual growth but stay grounded. Don\'t believe everything you see.',
        beginnerExplanation: 'Neptune can bring SPIRITUAL AWAKENING or CONFUSION - you choose! You may see things through rose-colored glasses in this area. Connect to spirituality and intuition, but stay grounded in reality.'
    },
    pluto: {
        name: 'Pluto',
        symbol: '♇',
        transitDuration: '12-30 years per sign',
        brings: 'Deep transformation, power dynamics, death/rebirth cycles, past resurfaces',
        challenge: 'Upheaval, control issues, obsession, destruction',
        advice: 'Everything from the past comes to surface. Allow complete transformation.',
        beginnerExplanation: 'Pluto brings DEEP TRANSFORMATION. This is a profound period where what\'s no longer serving you must die so something new can be born. It can feel intense, but you\'re becoming more powerful and authentic.'
    }
};

// ============================================
// HOUSE THEMES FOR YEARLY FOCUS
// ============================================

export const YEARLY_HOUSE_THEMES = {
    1: {
        focus: 'YOUR SELF & IDENTITY',
        yearlyTheme: 'This year asks you to focus on YOU - your appearance, how you present yourself, your personal brand, and self-awareness.',
        action: 'Reinvent yourself. Update your image. Start new personal projects.',
        challenge: 'Being too self-focused or missing how you come across to others.',
        navigation: 'This is about becoming the best version of yourself. What identity do you want to embody?'
    },
    2: {
        focus: 'YOUR MONEY & VALUES',
        yearlyTheme: 'Financial matters and what you truly value take center stage this year.',
        action: 'Build income streams. Clarify your values. Invest in yourself.',
        challenge: 'Financial stress or discovering your values conflict with your actions.',
        navigation: 'Get clear on what you truly value. Align your spending and earning with your authentic worth.'
    },
    3: {
        focus: 'COMMUNICATION & LEARNING',
        yearlyTheme: 'This year is about learning, speaking, writing, and connecting with siblings/neighbors.',
        action: 'Take courses. Start blogging or writing. Have important conversations. Short trips.',
        challenge: 'Miscommunication, information overload, or mental scattered-ness.',
        navigation: 'Your mind is active - use it! Share your ideas. Learn something new. Improve how you communicate.'
    },
    4: {
        focus: 'HOME & FAMILY ROOTS',
        yearlyTheme: 'Home, family, and your emotional foundation are the focus this year.',
        action: 'Move, renovate, or transform your living space. Heal family relationships. Work on inner security.',
        challenge: 'Family drama, feeling rootless, or confronting childhood patterns.',
        navigation: 'Build a solid emotional foundation. Where do you truly feel at home? Create that sanctuary.'
    },
    5: {
        focus: 'CREATIVITY, ROMANCE & FUN',
        yearlyTheme: 'This is a year for joy, creativity, romance, hobbies, and children.',
        action: 'Date! Create art. Start hobbies. Have fun. Focus on children if applicable.',
        challenge: 'Taking too many risks, romantic drama, or creative blocks.',
        navigation: 'What brings you pure JOY? This year invites you to play, create, and express yourself freely.'
    },
    6: {
        focus: 'HEALTH & DAILY WORK',
        yearlyTheme: 'Daily routines, health habits, work environment, and service to others come into focus.',
        action: 'Improve your health. Optimize daily routines. Find better work/life balance.',
        challenge: 'Burnout, health issues, or work stress.',
        navigation: 'Master your daily life. Small daily improvements create massive long-term results.'
    },
    7: {
        focus: 'RELATIONSHIPS & PARTNERSHIPS',
        yearlyTheme: 'One-on-one relationships - marriage, business partnerships, serious commitments - are the theme.',
        action: 'Commit or recommit. Improve existing partnerships. Learn to balance give and take.',
        challenge: 'Relationship conflicts, codependency, or fear of commitment.',
        navigation: 'Relationships are your mirror. What are your partners showing you about yourself?'
    },
    8: {
        focus: 'TRANSFORMATION & INTIMACY',
        yearlyTheme: 'Deep change, shared resources, intimacy, psychological work, and letting go.',
        action: 'Do the inner work. Address shared finances. Deepen intimacy. Let go of what\'s dead.',
        challenge: 'Power struggles, financial entanglements, or fear of deep vulnerability.',
        navigation: 'This is a year for deep transformation. What needs to die so you can be reborn?'
    },
    9: {
        focus: 'EXPANSION & HIGHER LEARNING',
        yearlyTheme: 'Travel, higher education, philosophy, beliefs, and seeking the bigger picture.',
        action: 'Travel far. Go back to school. Explore new philosophies. Publish or teach.',
        challenge: 'Overcommitting, belief conflicts, or feeling stuck in limiting worldviews.',
        navigation: 'Expand your horizons. What do you truly believe? What bigger truth are you seeking?'
    },
    10: {
        focus: 'CAREER & PUBLIC REPUTATION',
        yearlyTheme: 'Your career, public image, achievements, and legacy are in the spotlight.',
        action: 'Make career moves. Build your reputation. Take on leadership. Set long-term goals.',
        challenge: 'Work-life imbalance, career setbacks, or public criticism.',
        navigation: 'What do you want to be known for? This year builds your lasting legacy.'
    },
    11: {
        focus: 'FRIENDS & FUTURE VISIONS',
        yearlyTheme: 'Social networks, friendships, groups, hopes, dreams, and humanitarian causes.',
        action: 'Join groups. Network. Clarify your dreams for the future. Serve a cause.',
        challenge: 'Feeling isolated, group conflicts, or losing sight of your dreams.',
        navigation: 'Your tribe matters. Who shares your vision? Together, you can change the future.'
    },
    12: {
        focus: 'SPIRITUALITY & THE HIDDEN',
        yearlyTheme: 'The unseen realm - spirituality, solitude, unconscious patterns, and behind-the-scenes work.',
        action: 'Meditate. Retreat. Do therapy or inner work. Release old karma. Rest.',
        challenge: 'Isolation, escapism, hidden enemies, or feeling lost spiritually.',
        navigation: 'This is a year for inner work. What patterns are running unconsciously? Time to heal them.'
    }
};

// ============================================
// ASPECT TRANSIT INTERPRETATIONS (Based on Doctrine)
// ============================================

export const TRANSIT_ASPECT_MEANINGS = {
    conjunction: {
        nature: 'POWER & FUSION',
        experience: 'This transit MERGES the transit planet\'s energy directly with your natal planet. Powerful activation.',
        perception: 'You may feel overwhelmed by the intensity of this energy - like too much is happening at once.',
        reality: 'The transit is fusing with your natal energy. They must work as ONE. Neither can be ignored.',
        resolution: 'Accept both energies. Use the combined power consciously. Don\'t let one dominate.',
        intensity: 'HIGH - Direct, powerful impact'
    },
    opposition: {
        nature: 'AWARENESS & BALANCE',
        experience: 'You\'ll feel a tug-of-war between the transiting planet\'s influence and your natal energy.',
        perception: 'It may feel like external circumstances or other people are working against your natural tendencies.',
        reality: 'You\'re being shown what needs balance. The transit offers what your natal energy lacks.',
        resolution: 'Find the middle ground. Honor both sides. Don\'t swing to extremes.',
        intensity: 'HIGH - Creates tension that demands attention'
    },
    square: {
        nature: 'CONFLICT & GROWTH',
        experience: 'This transit creates friction and challenge. Something needs to change.',
        perception: 'Frustration, obstacles, and tension. It feels like you\'re being blocked or tested.',
        reality: 'Squares create ACTION. The friction is forcing you to grow. This builds character.',
        resolution: 'Don\'t avoid the challenge - meet it. Appease BOTH energies. Find creative solutions.',
        intensity: 'HIGH - Most growth-producing but most challenging'
    },
    trine: {
        nature: 'HARMONY & FLOW',
        experience: 'The transit energy flows naturally with your natal energy. Easy, supportive.',
        perception: 'Things feel good, natural, easy. Talents and gifts are activated.',
        reality: 'Be careful not to take this for granted. Easy doesn\'t mean it happens automatically.',
        resolution: 'Use this opportunity! Trines give you a green light - take action during this period.',
        intensity: 'MODERATE - Supportive but requires you to actually use it'
    },
    sextile: {
        nature: 'OPPORTUNITY & CHOICE',
        experience: 'An opportunity opens up. But YOU must choose to activate it - it won\'t happen automatically.',
        perception: 'You may not even notice this transit unless you\'re paying attention. Subtle opening.',
        reality: 'This is like a light switch on the wall - the power is available, but YOU must flip it.',
        resolution: 'Recognize the opportunity. Make the choice to act. Hidden talents can emerge here.',
        intensity: 'LOW TO MODERATE - Depends entirely on whether you activate it'
    },
    semiSextile: {
        nature: 'AGITATION & ADJUSTMENT',
        experience: 'Minor friction or irritation between the transit and your natal energy.',
        perception: 'Something feels "off" or annoying. Oil and water that won\'t quite mix.',
        reality: 'The second energy (what\'s being affected) needs attention first.',
        resolution: 'Address what\'s being agitated before pushing forward with your agenda.',
        intensity: 'LOW - Background tension, easily managed'
    },
    quincunx: {
        nature: 'MISUNDERSTANDING & BLIND SPOT',
        experience: 'Two incompatible truths operating at once. You can\'t quite see how they connect.',
        perception: 'Confusion, compartmentalization. One area of life suffering while another is focused on.',
        reality: 'These energies CAN work together - but it requires creative, non-logical solutions.',
        resolution: 'Use compassion and creativity. Trust that a bridge exists even if you can\'t see it.',
        intensity: 'MODERATE - Requires creative problem-solving'
    }
};

// ============================================
// DIFFICULT PERIODS IDENTIFICATION
// ============================================

export const DIFFICULT_TRANSIT_PATTERNS = {
    saturnSquare: {
        name: 'Saturn Square',
        difficulty: 'HIGH',
        duration: 'Several weeks to months',
        experience: 'Obstacles, delays, extra responsibilities in the house/planet being squared.',
        purpose: 'Saturn is testing the foundation you\'ve built. Weak structures crumble; strong ones solidify.',
        navigation: 'Do NOT avoid the work. Face responsibilities head-on. What you build now lasts.',
        mantra: '"I am building something that will last. This difficulty is making me stronger."'
    },
    saturnOpposition: {
        name: 'Saturn Opposition',
        difficulty: 'HIGH',
        duration: 'Several weeks to months',
        experience: 'Feel pulled between responsibilities and desires. External pressure from authority or circumstances.',
        purpose: 'Finding balance between structure (Saturn) and your natural energy (natal planet).',
        navigation: 'You can\'t abandon either side. Find the middle path that honors both duty and self.',
        mantra: '"I balance responsibility with authenticity. Both are necessary."'
    },
    saturnConjunction: {
        name: 'Saturn Conjunction (Saturn Return if to natal Saturn)',
        difficulty: 'HIGH',
        duration: 'Weeks to months (Saturn Return is ~2.5 years for full cycle)',
        experience: 'Major restructuring of this life area. Endings and beginnings. Growing up.',
        purpose: 'Saturn demands maturity and accountability. Time to become the authority in your own life.',
        navigation: 'Accept responsibility. Make adult decisions. What structures need to be rebuilt?',
        mantra: '"I accept responsibility for my life. I am becoming the authority I was meant to be."'
    },
    plutoSquare: {
        name: 'Pluto Square',
        difficulty: 'VERY HIGH',
        duration: 'Years',
        experience: 'Intense transformation. Power struggles. What\'s buried comes to surface.',
        purpose: 'Complete regeneration of this life area. Death of the old; birth of new.',
        navigation: 'Don\'t resist the transformation. Control is illusion. Let go and allow rebirth.',
        mantra: '"I release what no longer serves me. Through this destruction, I am reborn."'
    },
    plutoOpposition: {
        name: 'Pluto Opposition',
        difficulty: 'VERY HIGH',
        duration: 'Years',
        experience: 'External forces demanding transformation. Others may seem to have power over you.',
        purpose: 'Learning about power dynamics. Reclaiming your authentic power.',
        navigation: 'The power you seek is within you. Others are mirrors showing you your own shadow.',
        mantra: '"I reclaim my power. What I seek outside exists within me."'
    },
    neptuneSquare: {
        name: 'Neptune Square',
        difficulty: 'MODERATE TO HIGH',
        duration: 'Years',
        experience: 'Confusion, illusion, idealization that leads to disappointment. Hard to see clearly.',
        purpose: 'Dissolving rigid structures. Opening to spirituality and intuition.',
        navigation: 'Stay grounded. Double-check facts. Don\'t make major decisions when confused.',
        mantra: '"I stay grounded while remaining open to spiritual guidance."'
    },
    uranusSquare: {
        name: 'Uranus Square',
        difficulty: 'HIGH',
        duration: '1-2 years',
        experience: 'Sudden disruptions in this life area. Breaking free from restrictions. Restlessness.',
        purpose: 'Liberation from what\'s been constraining you. Evolution through revolution.',
        navigation: 'Expect the unexpected. Be flexible. Sometimes what falls apart needed to fall.',
        mantra: '"I embrace change and freedom. What\'s disrupting my life is liberating me."'
    },
    marsSquare: {
        name: 'Mars Square',
        difficulty: 'MODERATE',
        duration: '1-2 weeks',
        experience: 'Tension, conflict, frustration, accidents, anger.',
        purpose: 'Action is demanded. Something in this area needs to MOVE.',
        navigation: 'Channel the energy productively. Exercise. Take action but avoid conflict.',
        mantra: '"I channel my energy wisely. Action, not aggression."'
    }
};

// ============================================
// YEARLY FORECAST GENERATION
// ============================================

/**
 * Generate a yearly forecast based on the natal chart and current date
 * This uses the ADS/FREE framework: Transit planets aspecting natal positions
 */
export function generateYearlyForecast(chartData, currentYear) {
    const forecast = {
        year: currentYear,
        overallTheme: '',
        primaryFocus: [],
        challengingPeriods: [],
        opportunityPeriods: [],
        monthlyHighlights: [],
        personalGrowthAreas: [],
        navigationGuidance: []
    };

    // Determine major themes based on slow-moving planet positions
    const majorThemes = identifyMajorYearlyThemes(chartData, currentYear);
    forecast.overallTheme = majorThemes.overallTheme;
    forecast.primaryFocus = majorThemes.primaryFocus;

    // Identify challenging periods and how to navigate them
    const challenges = identifyChallengingPeriods(chartData, currentYear);
    forecast.challengingPeriods = challenges;

    // Identify opportunity windows
    const opportunities = identifyOpportunityPeriods(chartData, currentYear);
    forecast.opportunityPeriods = opportunities;

    // Generate monthly highlights
    forecast.monthlyHighlights = generateMonthlyHighlights(chartData, currentYear);

    // Personalized growth areas based on natal chart
    forecast.personalGrowthAreas = identifyGrowthAreas(chartData);

    // Navigation guidance - how to work with the energies
    forecast.navigationGuidance = generateNavigationGuidance(chartData, forecast);

    return forecast;
}

/**
 * Identify major yearly themes based on outer planet positions
 */
function identifyMajorYearlyThemes(chartData, currentYear) {
    const themes = {
        overallTheme: '',
        primaryFocus: []
    };

    // Get the Sun sign and Rising sign for basic theme
    const sunSign = chartData.planets.sun.sign;
    const risingSign = chartData.angles.ascendant.sign;
    const sunHouse = chartData.planets.sun.house;

    // Primary focus based on Sun house (where your life force is directed)
    const sunHouseTheme = YEARLY_HOUSE_THEMES[sunHouse];
    themes.primaryFocus.push({
        area: sunHouseTheme.focus,
        reason: 'Your Sun placement - where your core identity expresses',
        theme: sunHouseTheme.yearlyTheme,
        action: sunHouseTheme.action
    });

    // Check Moon house for emotional needs focus
    const moonHouse = chartData.planets.moon.house;
    const moonHouseTheme = YEARLY_HOUSE_THEMES[moonHouse];
    themes.primaryFocus.push({
        area: moonHouseTheme.focus,
        reason: 'Your Moon placement - your emotional security needs',
        theme: 'Emotionally, you need stability in: ' + moonHouseTheme.focus.toLowerCase(),
        action: 'Honor your emotional needs around ' + HOUSE_THEMES[moonHouse].name.toLowerCase()
    });

    // Check MC for career/life direction theme
    const mcSign = chartData.angles.midheaven.sign;
    themes.primaryFocus.push({
        area: 'Career & Life Direction',
        reason: 'Your Midheaven (MC) - your public purpose',
        theme: `Your public life direction is expressed through ${capitalize(mcSign)} energy`,
        action: 'Embody ' + capitalize(mcSign) + ' qualities in your public/career life'
    });

    // Create overall theme narrative
    themes.overallTheme = generateOverallThemeNarrative(chartData);

    return themes;
}

/**
 * Generate a comprehensive overall theme narrative
 */
function generateOverallThemeNarrative(chartData) {
    const sunSign = chartData.planets.sun.sign;
    const sunHouse = chartData.planets.sun.house;
    const moonSign = chartData.planets.moon.sign;
    const moonHouse = chartData.planets.moon.house;
    const ascSign = chartData.angles.ascendant.sign;
    const mcSign = chartData.angles.midheaven.sign;

    return `
As a ${capitalize(sunSign)} with ${capitalize(ascSign)} Rising, your year centers around ${HOUSE_THEMES[sunHouse].name.toLowerCase()} matters (House ${sunHouse}) while presenting yourself to the world through ${capitalize(ascSign)} energy. 

Your emotional center (Moon in ${capitalize(moonSign)}, House ${moonHouse}) requires ${HOUSE_THEMES[moonHouse].name.toLowerCase()} to feel secure. 

Career-wise, your Midheaven in ${capitalize(mcSign)} calls you to embody those qualities in your public life and professional reputation.

This year, focus on integrating these energies: Express your ${capitalize(sunSign)} nature through ${HOUSE_THEMES[sunHouse].name.toLowerCase()}, while nurturing your emotional needs in ${HOUSE_THEMES[moonHouse].name.toLowerCase()}.
    `.trim();
}

/**
 * Identify challenging periods based on difficult aspects
 */
function identifyChallengingPeriods(chartData, currentYear) {
    const challenges = [];

    // Analyze natal Saturn position for ongoing Saturn themes
    const saturn = chartData.planets.saturn;
    challenges.push({
        planet: 'Saturn (Natal)',
        house: saturn.house,
        sign: saturn.sign,
        title: 'Your Saturn Life Lesson',
        description: `Saturn in House ${saturn.house} (${capitalize(saturn.sign)}) represents your major life lessons around ${HOUSE_THEMES[saturn.house].name.toLowerCase()}.`,
        challenge: YEARLY_HOUSE_THEMES[saturn.house].challenge,
        navigation: `This is an area where you must WORK HARD and BE PATIENT. Saturn demands discipline here, but the mastery you develop lasts a lifetime.`,
        pattern: DIFFICULT_TRANSIT_PATTERNS.saturnConjunction,
        mantra: `"I embrace the discipline required in ${HOUSE_THEMES[saturn.house].name.toLowerCase()}. My efforts here build lasting foundations."`
    });

    // Analyze Pluto position for deep transformation
    const pluto = chartData.planets.pluto;
    challenges.push({
        planet: 'Pluto (Natal)',
        house: pluto.house,
        sign: pluto.sign,
        title: 'Your Transformation Zone',
        description: `Pluto in House ${pluto.house} (${capitalize(pluto.sign)}) marks where you experience deep transformation throughout life.`,
        challenge: YEARLY_HOUSE_THEMES[pluto.house].challenge,
        navigation: `This area of life demands complete honesty and willingness to let old patterns die. Resistance only prolongs the transformation.`,
        pattern: DIFFICULT_TRANSIT_PATTERNS.plutoSquare,
        mantra: `"I release control and trust the transformation in ${HOUSE_THEMES[pluto.house].name.toLowerCase()}."`
    });

    // Check for natal retrograde planets - internalized challenges
    Object.entries(chartData.planets).forEach(([planetName, planetData]) => {
        if (planetData.motionState === 'retrograde') {
            challenges.push({
                planet: `${capitalize(planetName)} Retrograde (Natal)`,
                house: planetData.house,
                sign: planetData.sign,
                title: `Internalized ${capitalize(planetName)} Energy`,
                description: `Your ${capitalize(planetName)} is retrograde - its energy is internalized. You process ${TRANSIT_MEANINGS[planetName]?.brings || 'this energy'} internally.`,
                challenge: getRetrogradeChallenge(planetName),
                navigation: getRetrogradeNavigation(planetName),
                mantra: getRetrogradeMantra(planetName)
            });
        }
    });

    // Check for natal squares (ongoing conflict areas)
    // (This would require aspect data - simplified here)

    return challenges;
}

/**
 * Get retrograde challenge text
 */
function getRetrogradeChallenge(planetName) {
    const challenges = {
        mercury: 'Non-linear thinking may frustrate others. May struggle to show your work or explain your thought process.',
        venus: 'Love and beauty standards differ from mainstream. Partnership needs aren\'t obvious to others.',
        mars: 'Compete with yourself rather than others. Anger may be internalized and leak out unexpectedly.',
        jupiter: 'See opportunities others miss, but may persist too long in failing ventures.',
        saturn: 'Deep self-worth issues. May doubt your worthiness and authority.',
        uranus: 'Natural rebel at your core. Must constantly prove yourself to yourself.',
        neptune: 'May be confused about your own virtue. Very generous but easily taken advantage of.',
        pluto: 'Difficulty accepting transformation. May underestimate your power and effect on others.'
    };
    return challenges[planetName] || 'Internalized energy that requires conscious awareness.';
}

/**
 * Get retrograde navigation text
 */
function getRetrogradeNavigation(planetName) {
    const navigation = {
        mercury: 'Learn through doing, not textbooks. Trust your unique thinking process. Review and edit often.',
        venus: 'Communicate your needs explicitly in relationships. Value depth over surface beauty.',
        mars: 'Create healthy outlets for anger. Set personal goals rather than competing with others.',
        jupiter: 'Trust your unique vision. Know when to persist and when to pivot.',
        saturn: 'Build internal self-worth. You ARE worthy. External validation won\'t fill the internal gap.',
        uranus: 'Embrace your rebellious nature as a gift. Help others transform while being patient with yourself.',
        neptune: 'You ARE a good person. Set boundaries. Your generosity is beautiful but protect yourself.',
        pluto: 'Accept your power. Notice your impact on others. Transformation is constant - embrace it.'
    };
    return navigation[planetName] || 'Work consciously with this internalized energy.';
}

/**
 * Get retrograde mantra
 */
function getRetrogradeMantra(planetName) {
    const mantras = {
        mercury: '"My unique way of thinking is a gift, not a problem."',
        venus: '"My needs are valid. I attract the love I deserve by being authentic."',
        mars: '"I direct my energy inward for self-improvement, not self-destruction."',
        jupiter: '"I see opportunities others miss. My unconventional path leads to abundance."',
        saturn: '"I am worthy simply because I exist. I build my own authority from within."',
        uranus: '"My rebellious spirit is how I change the world. I embrace my uniqueness."',
        neptune: '"I am a good person. My compassion is my gift. I protect my energy."',
        pluto: '"I embrace my power. I allow transformation. I rise from every ending."'
    };
    return mantras[planetName] || '"I work consciously with my internalized energy."';
}

/**
 * Identify opportunity periods based on beneficial placements
 */
function identifyOpportunityPeriods(chartData, currentYear) {
    const opportunities = [];

    // Jupiter position shows where luck and expansion naturally occur
    const jupiter = chartData.planets.jupiter;
    opportunities.push({
        planet: 'Jupiter',
        house: jupiter.house,
        sign: jupiter.sign,
        title: 'Your Natural Luck Zone',
        description: `Jupiter in House ${jupiter.house} (${capitalize(jupiter.sign)}) is where luck, growth, and abundance naturally flow for you.`,
        opportunity: YEARLY_HOUSE_THEMES[jupiter.house].action,
        howToActivate: `Expand in ${HOUSE_THEMES[jupiter.house].name.toLowerCase()}. Learn, grow, and be optimistic here. Luck favors you!`,
        mantra: `"I am lucky in ${HOUSE_THEMES[jupiter.house].name.toLowerCase()}. I expand with confidence."`
    });

    // Venus position shows where love and money flow
    const venus = chartData.planets.venus;
    opportunities.push({
        planet: 'Venus',
        house: venus.house,
        sign: venus.sign,
        title: 'Your Love & Abundance Zone',
        description: `Venus in House ${venus.house} (${capitalize(venus.sign)}) brings love, beauty, and money opportunities.`,
        opportunity: `Attract through ${capitalize(venus.sign)} qualities. Express beauty and values in ${HOUSE_THEMES[venus.house].name.toLowerCase()}.`,
        howToActivate: `Be receptive to love and abundance in this area. Your values attract what you need.`,
        mantra: `"I attract love and abundance through my authentic ${capitalize(venus.sign)} nature."`
    });

    // Check trines (natural talents)
    // This would analyze trine aspects - simplified here

    return opportunities;
}

/**
 * Generate monthly highlights (simplified - could be expanded with actual ephemeris data)
 */
function generateMonthlyHighlights(chartData, currentYear) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const highlights = months.map((month, index) => {
        // Get which sign the Sun is in each month (approximate)
        const sunSigns = [
            'capricorn', 'aquarius', 'pisces', 'aries', 'taurus', 'gemini',
            'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius'
        ];
        const currentSunSign = sunSigns[index];

        // Find which house this activates in their chart
        const houses = chartData.houses;
        let activatedHouse = 1;
        Object.entries(houses).forEach(([houseNum, houseData]) => {
            if (houseData.sign === currentSunSign) {
                activatedHouse = parseInt(houseNum);
            }
        });

        return {
            month: month,
            sunTransitSign: capitalize(currentSunSign),
            activatedHouse: activatedHouse,
            focusArea: HOUSE_THEMES[activatedHouse].name,
            theme: `The Sun illuminates your House ${activatedHouse} (${HOUSE_THEMES[activatedHouse].name}). Energy and focus on ${HOUSE_THEMES[activatedHouse].keywords.slice(0, 3).join(', ')}.`,
            action: YEARLY_HOUSE_THEMES[activatedHouse].action
        };
    });

    return highlights;
}

/**
 * Identify personal growth areas based on natal chart
 */
function identifyGrowthAreas(chartData) {
    const growthAreas = [];

    // Chiron (the wound) shows the healing journey
    if (chartData.planets.chiron) {
        const chiron = chartData.planets.chiron;
        growthAreas.push({
            area: 'Healing Your Core Wound',
            planet: 'Chiron',
            house: chiron.house,
            sign: chiron.sign,
            description: `Chiron in House ${chiron.house} represents a core wound in ${HOUSE_THEMES[chiron.house].name.toLowerCase()}.`,
            healingPath: `Your healing journey involves transforming this wound into wisdom you can share with others.`,
            advice: `Don't avoid this area - lean into the healing. Your wound becomes your greatest gift.`
        });
    }

    // Saturn shows where maturity is required
    growthAreas.push({
        area: 'Developing Mastery & Discipline',
        planet: 'Saturn',
        house: chartData.planets.saturn.house,
        sign: chartData.planets.saturn.sign,
        description: `Saturn calls you to master ${HOUSE_THEMES[chartData.planets.saturn.house].name.toLowerCase()}.`,
        growthPath: `This area requires patience, discipline, and consistent effort. No shortcuts.`,
        advice: `The work you do here creates LASTING results. Stay committed even when it's hard.`
    });

    // Moon shows emotional growth needs
    growthAreas.push({
        area: 'Emotional Intelligence & Security',
        planet: 'Moon',
        house: chartData.planets.moon.house,
        sign: chartData.planets.moon.sign,
        description: `Your Moon in ${capitalize(chartData.planets.moon.sign)} (House ${chartData.planets.moon.house}) shows what you need emotionally.`,
        growthPath: `Learn to honor and communicate your emotional needs without shame.`,
        advice: `When you feel emotionally triggered, pause. Your Moon is speaking. Listen to what you truly need.`
    });

    return growthAreas;
}

/**
 * Generate personalized navigation guidance
 */
function generateNavigationGuidance(chartData, forecast) {
    const guidance = [];

    // Based on Sun sign - core approach to life
    const sunSign = chartData.planets.sun.sign;
    guidance.push({
        category: 'Your Core Approach',
        title: 'How to Navigate Life as a ' + capitalize(sunSign),
        guidance: getSignNavigationGuidance(sunSign)
    });

    // Based on challenges identified
    if (forecast.challengingPeriods.length > 0) {
        guidance.push({
            category: 'When Things Get Difficult',
            title: 'Navigating Your Challenging Areas',
            guidance: `
Your chart shows challenges in these areas: ${forecast.challengingPeriods.map(c => c.title).join(', ')}.

**The Key to Navigating Challenges:**
1. **Don't resist** - Resistance creates suffering. Accept what IS.
2. **Ask "What is this teaching me?"** - Every challenge carries a lesson.
3. **Use higher vibrations** - Each planet has higher expressions. Choose them.
4. **Take action** - Especially with squares, ACTION is required. Do something.
5. **Be patient with yourself** - Growth takes time. You're doing better than you think.
            `.trim()
        });
    }

    // Based on opportunities identified
    if (forecast.opportunityPeriods.length > 0) {
        guidance.push({
            category: 'Maximizing Opportunities',
            title: 'How to Activate Your Luck Zones',
            guidance: `
Your chart shows natural opportunities in: ${forecast.opportunityPeriods.map(o => HOUSE_THEMES[o.house].name).join(', ')}.

**How to Maximize These Gifts:**
1. **Show up** - Trines and sextiles only work if you TAKE ACTION.
2. **Don't take it for granted** - Natural talent requires development.
3. **Combine with effort** - Luck + Work = Success.
4. **Share your gifts** - What comes easy to you helps others.
            `.trim()
        });
    }

    return guidance;
}

/**
 * Get navigation guidance based on Sun sign
 */
function getSignNavigationGuidance(sign) {
    const guidance = {
        aries: 'Lead with courage. Take initiative. Your natural impulse to START is your gift. Channel your fire productively, and be patient with slower-paced people.',
        taurus: 'Build steadily. Your stability is your power. Don\'t rush - you achieve through consistency. Trust your values and enjoy the sensual pleasures of life.',
        gemini: 'Communicate freely. Your curiosity is your superpower. Share ideas, learn constantly, and don\'t feel guilty about having multiple interests.',
        cancer: 'Nurture and protect. Your emotional intelligence is profound. Create a safe home base, and know your sensitivity is a strength, not a weakness.',
        leo: 'Shine unapologetically. Your creativity and warmth light up others\' lives. Express yourself boldly, and remember: confidence attracts, arrogance repels.',
        virgo: 'Perfect through service. Your attention to detail improves everything you touch. Help others, but also extend that care to yourself.',
        libra: 'Create harmony and beauty. Your sense of balance brings peace to chaotic situations. Don\'t sacrifice your needs for approval - YOU matter too.',
        scorpio: 'Transform deeply. Your intensity is your power. Embrace the cycles of death and rebirth. Your willingness to go deep makes you magnetic.',
        sagittarius: 'Explore and expand. Your optimism and quest for truth inspire others. Keep seeking, teaching, and believing in the bigger picture.',
        capricorn: 'Build your empire. Your discipline and patience create lasting success. Climb your mountain step by step. You\'ll get there - that\'s certain.',
        aquarius: 'Innovate and liberate. Your unique perspective changes the world. Be authentically weird. The future needs your vision.',
        pisces: 'Dream and heal. Your intuition and compassion connect you to the divine. Stay grounded while you swim in the mystical waters. Your sensitivity is a gift.'
    };
    return guidance[sign] || 'Navigate with authenticity and self-awareness.';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Export everything for use in the app
 */
export default {
    generateYearlyForecast,
    TRANSIT_MEANINGS,
    YEARLY_HOUSE_THEMES,
    TRANSIT_ASPECT_MEANINGS,
    DIFFICULT_TRANSIT_PATTERNS
};
