/**
 * Astrology Profile Report Generator
 * Creates a narrative, book-style report using ADS/FREE Theory calculations
 */

import { HOUSE_THEMES, SIGN_SYMBOLS, PLANET_SYMBOLS, SIGN_ELEMENTS, SIGN_RULERS } from '../core/constants.js';
import {
    calculateFullIdentity,
    calculateTraumaTimeline,
    calculateSpecificTraumaIndicators,
    analyzeDelegateFlow
} from '../core/spark-base.js';

// ============================================
// NARRATIVE GENERATORS
// ============================================

/**
 * Generate a full profile report in narrative prose format
 */
export function generateProfileReport(chartReading, birthData, currentDate = new Date()) {
    const { chart, interpretations, aspects, guidance } = chartReading;

    const report = {
        title: 'Your Personal Astrological Profile',
        generatedDate: currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        birthInfo: formatBirthInfo(birthData),
        sections: []
    };

    // Section 1: WHO YOU ARE - Core Identity
    report.sections.push(generateCoreIdentitySection(chart, interpretations));

    // Section 2: TRUE IDENTITY - Spark & Base (Advanced)
    report.sections.push(generateTrueIdentitySection(chart));

    // Section 3: YOUR INNER WORLD - Emotional Landscape
    report.sections.push(generateEmotionalLandscapeSection(chart, interpretations));

    // Section 4: HOW YOU CONNECT - Communication & Relationships
    report.sections.push(generateConnectionSection(chart, interpretations));

    // Section 5: YOUR LIFE PATH - Key Life Themes
    report.sections.push(generateLifePathSection(chart, interpretations, aspects));

    // Section 6: DELEGATE FLOW - Where Energy Patterns Come From
    report.sections.push(generateDelegateFlowSection(chart));

    // Section 7: TRAUMA TIMELINE - Significant Ages
    report.sections.push(generateTraumaTimelineSection(chart));

    // Section 8: CURRENT SEASON - Where You Are Now
    report.sections.push(generateCurrentSeasonSection(chart, interpretations, birthData, currentDate));

    // Section 9: THIS MONTH'S FOCUS
    report.sections.push(generateMonthlyFocusSection(chart, interpretations, currentDate));

    // Section 10: WATCH-OUTS & AWARENESS
    report.sections.push(generateWatchOutsSection(chart, interpretations, aspects));

    // Section 11: REVERSE VANTAGE - The Hidden Perspective
    report.sections.push(generateReverseVantageSection(chart, aspects));

    // Section 12: YOUR GIFTS & STRENGTHS
    report.sections.push(generateGiftsSection(chart, guidance));

    return report;
}

function formatBirthInfo(birthData) {
    const time = birthData.time || '12:00';
    // Use the string format that browsers interpret as local time (YYYY-MM-DDTHH:mm)
    const date = new Date(`${birthData.date}T${time}`);

    // If date is invalid, fallback to the raw data
    if (isNaN(date.getTime())) {
        return {
            dateFormatted: birthData.date,
            timeFormatted: birthData.time,
            location: birthData.locationName
        };
    }

    return {
        dateFormatted: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        timeFormatted: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        location: birthData.locationName
    };
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================
// SECTION GENERATORS
// ============================================

function generateCoreIdentitySection(chart, interpretations) {
    const sun = chart.planets.sun;
    const rising = chart.angles.ascendant;
    const sunInterp = interpretations.planets.sun;

    // Get the TRUE identity from Earth Arc calculations
    const trueIdentity = sunInterp.house.trueIdentity || capitalize(sun.sign);
    const zodiacSign = capitalize(sun.sign);

    let narrative = `At your core, you are a ${trueIdentity} soul`;

    if (trueIdentity !== zodiacSign) {
        narrative += ` (expressed through the lens of ${zodiacSign} energy)`;
    }

    narrative += `. Your Sun sits in House ${sun.house}, the house of ${HOUSE_THEMES[sun.house]?.name || 'life'}, which means your essential life force and creative energy naturally flow into ${HOUSE_THEMES[sun.house]?.name.toLowerCase() || 'this'} matters.\n\n`;

    narrative += `Your Rising Sign is ${capitalize(rising.sign)}, which acts as the "costume" you wear when meeting the world. This is the first impression you make on others and the lens through which you approach new situations. With ${capitalize(rising.sign)} rising, you come across as ${getSignPersonality(rising.sign)}.\n\n`;

    narrative += `${sunInterp.planet.beginnerExplanation || sunInterp.planet.focus}\n\n`;

    narrative += `**What This Means For You:** ${sunInterp.guidance || 'You are meant to shine brightly in this area of life. Embrace your authentic expression and let your light guide others.'}`;

    return {
        title: 'WHO YOU ARE: Your Core Identity',
        icon: '☉',
        content: narrative
    };
}

function generateEmotionalLandscapeSection(chart, interpretations) {
    const moon = chart.planets.moon;
    const moonInterp = interpretations.planets.moon;

    const trueNeeds = moonInterp.house.trueIdentity || capitalize(moon.sign);
    const zodiacSign = capitalize(moon.sign);

    let narrative = `Your emotional nature is deeply ${trueNeeds}`;

    if (trueNeeds !== zodiacSign) {
        narrative += ` (operating through ${zodiacSign} sensitivity)`;
    }

    narrative += `. The Moon in your chart represents your inner emotional world, your deepest needs, and what makes you feel safe and secure.\n\n`;

    narrative += `With your Moon in House ${moon.house} (${HOUSE_THEMES[moon.house]?.name || 'life'}), you find emotional fulfillment through ${HOUSE_THEMES[moon.house]?.beginnerExplanation?.split('.')[0].toLowerCase() || 'this area of life'}. `;

    narrative += `This is where you seek comfort and where your intuition is strongest.\n\n`;

    // Emotional style based on sign element
    const element = SIGN_ELEMENTS[moon.sign];
    narrative += getEmotionalStyleByElement(element, moon.sign);

    narrative += `\n\n**Your Emotional Needs:** ${moonInterp.planet.simpleQuestion || 'What do you need to feel emotionally secure?'} Understanding this about yourself is key to your happiness and wellbeing.`;

    if (moonInterp.guidance) {
        narrative += `\n\n**Guidance:** ${moonInterp.guidance}`;
    }

    return {
        title: 'YOUR INNER WORLD: Emotional Landscape',
        icon: '☽',
        content: narrative
    };
}

function generateConnectionSection(chart, interpretations) {
    const mercury = chart.planets.mercury;
    const venus = chart.planets.venus;
    const mars = chart.planets.mars;

    let narrative = `**How You Think & Communicate**\n`;
    narrative += `Mercury in ${capitalize(mercury.sign)} (House ${mercury.house}) shapes how your mind works. You think in a ${getSignThinkingStyle(mercury.sign)} manner. `;
    narrative += `Communication and learning flow best when you embrace these qualities. ${interpretations.planets.mercury?.sign.tone || ''}\n\n`;

    narrative += `**How You Love & Attract**\n`;
    narrative += `Venus in ${capitalize(venus.sign)} (House ${venus.house}) defines your love language and what you find beautiful. You attract through ${getSignAttractionStyle(venus.sign)} qualities. `;
    narrative += `In relationships, you value ${interpretations.planets.venus?.planet.keywords?.[0] || 'connection'} and express affection ${getSignLoveExpression(venus.sign)}.\n\n`;

    narrative += `**How You Take Action**\n`;
    narrative += `Mars in ${capitalize(mars.sign)} (House ${mars.house}) drives how you pursue goals and handle conflict. Your action style is ${getSignActionStyle(mars.sign)}. `;
    narrative += `When you want something, you go after it with ${capitalize(mars.sign)} determination.`;

    if (mars.motionState === 'retrograde') {
        narrative += ` Note: With Mars retrograde in your birth chart, you may process action internally first before expressing it outwardly. Your drive is no less powerful, just more considered.`;
    }

    return {
        title: 'HOW YOU CONNECT: Communication, Love & Action',
        icon: '♀',
        content: narrative
    };
}

function generateLifePathSection(chart, interpretations, aspects) {
    const saturn = chart.planets.saturn;
    const jupiter = chart.planets.jupiter;
    const pluto = chart.planets.pluto;

    let narrative = `**Your Life Lessons (Saturn)**\n`;
    narrative += `Saturn in ${capitalize(saturn.sign)} (House ${saturn.house}) points to your major life lessons. The ${HOUSE_THEMES[saturn.house]?.name || ''} area of life requires discipline, patience, and mastery from you. `;
    narrative += `This isn't punishment – it's where you build lasting achievement. What you build here with effort LASTS.\n\n`;

    if (saturn.motionState === 'retrograde') {
        narrative += `With Saturn retrograde, you may have internalized these lessons early in life. You're working through karmic patterns around authority and structure.\n\n`;
    }

    narrative += `**Your Growth & Expansion (Jupiter)**\n`;
    narrative += `Jupiter in ${capitalize(jupiter.sign)} (House ${jupiter.house}) shows where luck and opportunity naturally find you. Your path to expansion and growth runs through ${HOUSE_THEMES[jupiter.house]?.name.toLowerCase() || 'this'} matters. `;
    narrative += `Embrace ${capitalize(jupiter.sign)} energy here – it's your fortunate zone.\n\n`;

    narrative += `**Your Transformation (Pluto)**\n`;
    narrative += `Pluto in ${capitalize(pluto.sign)} (House ${pluto.house}) marks where deep transformation happens in your life. `;
    narrative += `This is intense territory – death and rebirth of old patterns. You have immense power here once you learn to wield it consciously.`;

    // Add chiron if available
    if (chart.planets.chiron) {
        const chiron = chart.planets.chiron;
        narrative += `\n\n**Your Wound That Becomes Your Gift (Chiron)**\n`;
        narrative += `Chiron in ${capitalize(chiron.sign)} (House ${chiron.house}) reveals your deepest wound – and paradoxically, where you have the greatest wisdom to share. `;
        narrative += `Through healing this area, you become a healer for others walking a similar path.`;
    }

    // Add Mean Lilith if available (Radical Acceptance)
    if (chart.planets.meanLilith) {
        const lilith = chart.planets.meanLilith;
        narrative += `\n\n**Your Raw Power & Shadow (Lilith)**\n`;
        narrative += `Mean Lilith in ${capitalize(lilith.sign)} (House ${lilith.house}) represents the raw, primal part of you that society (or early authority figures) may have shamed. `;
        narrative += `**The Protocol:** Radical Self-Acceptance. You must stop repressing this energy ("Let her out of the cage") because it is authentically YOU. `;
        narrative += `However, you must integrate it responsibly ("Keep her on the leash") within your **${HOUSE_THEMES[lilith.house]?.name || 'House ' + lilith.house}** activities. Don't hide this part of yourself—use its raw power to fuel your life.`;
    }

    return {
        title: 'YOUR LIFE PATH: Lessons, Growth & Transformation',
        icon: '♄',
        content: narrative
    };
}

function generateCurrentSeasonSection(chart, interpretations, birthData, currentDate) {
    // Calculate progressed sun position (simplified: 1 day = 1 year)
    const birthDate = new Date(birthData.date);
    const ageInYears = (currentDate - birthDate) / (365.25 * 24 * 60 * 60 * 1000);
    const ageWhole = Math.floor(ageInYears);

    // Progressed sun moves ~1 degree per year
    const sunLongitude = chart.planets.sun.longitude;
    const progressedLongitude = (sunLongitude + ageInYears) % 360;
    const progressedSignIndex = Math.floor(progressedLongitude / 30);
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    const progressedSign = signs[progressedSignIndex];

    let narrative = `**Your Age:** ${ageWhole} years old\n\n`;

    narrative += `**Your Current Life Season**\n`;
    narrative += `Using the progressed Sun (which moves one degree per year of life), you are currently in a ${capitalize(progressedSign)} season of life. `;
    narrative += `This colors everything you do right now with ${capitalize(progressedSign)} energy.\n\n`;

    narrative += getProgressedSeasonMeaning(progressedSign);

    // Calculate years until next season
    const degreesIntoSign = progressedLongitude % 30;
    const yearsUntilNextSeason = Math.round(30 - degreesIntoSign);

    narrative += `\n\n**Timeline:** You have approximately ${yearsUntilNextSeason} years in this life season before transitioning to your ${capitalize(signs[(progressedSignIndex + 1) % 12])} phase.`;

    return {
        title: 'CURRENT SEASON: Where You Are Now',
        icon: '⏳',
        content: narrative
    };
}

function generateMonthlyFocusSection(chart, interpretations, currentDate) {
    // Get current month's zodiac sign (where the Sun is transiting)
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    // Approximate sun signs by date
    const sunSigns = [
        { sign: 'capricorn', until: { month: 0, day: 19 } },
        { sign: 'aquarius', until: { month: 1, day: 18 } },
        { sign: 'pisces', until: { month: 2, day: 20 } },
        { sign: 'aries', until: { month: 3, day: 19 } },
        { sign: 'taurus', until: { month: 4, day: 20 } },
        { sign: 'gemini', until: { month: 5, day: 20 } },
        { sign: 'cancer', until: { month: 6, day: 22 } },
        { sign: 'leo', until: { month: 7, day: 22 } },
        { sign: 'virgo', until: { month: 8, day: 22 } },
        { sign: 'libra', until: { month: 9, day: 22 } },
        { sign: 'scorpio', until: { month: 10, day: 21 } },
        { sign: 'sagittarius', until: { month: 11, day: 21 } }
    ];

    let transitSign = 'capricorn';
    for (const entry of sunSigns) {
        if (month < entry.until.month || (month === entry.until.month && day <= entry.until.day)) {
            transitSign = entry.sign;
            break;
        }
    }
    if (month === 11 && day > 21) transitSign = 'capricorn';

    // Find which house the transiting Sun is activating
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    const ascSign = chart.angles.ascendant.sign;
    const ascIndex = signs.indexOf(ascSign);
    const transitIndex = signs.indexOf(transitSign);
    let transitHouse = ((transitIndex - ascIndex + 12) % 12) + 1;

    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });

    let narrative = `**${monthName} ${currentDate.getFullYear()} Focus**\n\n`;

    narrative += `The Sun is currently transiting through ${capitalize(transitSign)}, which activates your **House ${transitHouse}** – the house of ${HOUSE_THEMES[transitHouse]?.name || 'life'}.\n\n`;

    narrative += `**What This Month Asks of You:**\n`;
    narrative += `${HOUSE_THEMES[transitHouse]?.beginnerExplanation || 'Focus on this life area.'}\n\n`;

    narrative += `**Monthly Action Items:**\n`;
    narrative += getMonthlyActions(transitHouse);

    narrative += `\n\n**This Month's Energy:** ${capitalize(transitSign)} energy is flowing through this area. Approach ${HOUSE_THEMES[transitHouse]?.name.toLowerCase() || 'matters'} with ${getSignApproach(transitSign)} for best results.`;

    return {
        title: `THIS MONTH'S FOCUS: ${monthName} ${currentDate.getFullYear()}`,
        icon: '📅',
        content: narrative
    };
}

function generateWatchOutsSection(chart, interpretations, aspects) {
    let narrative = `**Retrograde Planets in Your Chart**\n`;

    const retrogrades = Object.entries(chart.planets).filter(([name, data]) => data.motionState === 'retrograde');

    if (retrogrades.length === 0) {
        narrative += `You have no natal retrograde planets. Energy flows outward naturally for you.\n\n`;
    } else {
        narrative += `You have ${retrogrades.length} planet(s) retrograde at birth:\n\n`;
        for (const [name, data] of retrogrades) {
            narrative += `• **${capitalize(name)} Retrograde** in ${capitalize(data.sign)}: `;
            narrative += getRetrogradeWarning(name);
            narrative += `\n\n`;
        }
    }

    narrative += `**Challenging Aspects to Be Aware Of**\n`;

    // Find squares and oppositions
    const challengingAspects = aspects.filter(a => a.type === 'square' || a.type === 'opposition').slice(0, 3);

    if (challengingAspects.length === 0) {
        narrative += `Your chart flows relatively harmoniously. You may need to generate your own motivation since the universe won't force growth through crisis as much.\n`;
    } else {
        for (const aspect of challengingAspects) {
            narrative += `• **${capitalize(aspect.planetOne.name)} ${aspect.symbol} ${capitalize(aspect.planetTwo.name)}**: `;
            narrative += `${aspect.perception || 'This creates tension that drives growth.'} `;
            narrative += `*Resolution:* ${aspect.resolution || 'Find balance between these energies.'}\n\n`;
        }
    }

    return {
        title: 'AWARENESS: What to Watch For',
        icon: '⚠️',
        content: narrative
    };
}

function generateReverseVantageSection(chart, aspects) {
    let narrative = `**Understanding Your Energy Flow (Reverse Vantage)**\n`;
    narrative += `Most astrology reads energy in one direction (Planet A affects Planet B). Reverse Vantage reveals the *hidden truth*: how the receiving planet actually experiences and processes that energy. This is especially critical for "Forced Aspects" where one planet pushes onto another that isn't ready to receive it.\n\n`;

    // Filter and Sort aspects using Forced Priority
    // Priority: Forced > Hard > Soft
    const relevantAspects = aspects.filter(a => {
        // Filter out minor aspects if list is too long, but keep ALL forced aspects
        const isForced = a.forcedStatus && a.forcedStatus !== 'mutual' && a.forcedStatus !== 'weak';
        const isMajor = ['conjunction', 'square', 'opposition', 'trine'].includes(a.type);
        return isForced || isMajor;
    }).sort((a, b) => {
        // Custom sort: Forced first
        const aForced = (a.forcedStatus && a.forcedStatus !== 'mutual' && a.forcedStatus !== 'weak') ? 1 : 0;
        const bForced = (b.forcedStatus && b.forcedStatus !== 'mutual' && b.forcedStatus !== 'weak') ? 1 : 0;
        return bForced - aForced; // Forced first
    }).slice(0, 6); // Top 6 most important

    if (relevantAspects.length === 0) {
        narrative += `Your chart shows a relatively integrated energy flow without major forced conflicts in the primary placements.\n`;
    } else {
        relevantAspects.forEach(aspect => {
            const p1Name = capitalize(aspect.planetOne.name);
            const p2Name = capitalize(aspect.planetTwo.name);

            // Determine Receiver
            let receiverName = p2Name;
            let senderName = p1Name;
            let receiverHouse = aspect.planetTwo.house;
            let isForced = false;
            let forceDir = '';

            if (aspect.forcedStatus === 'forced_by_1') {
                // P1 forces P2 (P2 is Receiver)
                receiverName = p2Name;
                senderName = p1Name;
                receiverHouse = aspect.planetTwo.house;
                isForced = true;
                forceDir = `${p1Name} pushes onto ${p2Name}`;
            } else if (aspect.forcedStatus === 'forced_by_2') {
                // P2 forces P1 (P1 is Receiver)
                receiverName = p1Name;
                senderName = p2Name;
                receiverHouse = aspect.planetOne.house;
                isForced = true;
                forceDir = `${p2Name} pushes onto ${p1Name}`;
            } else {
                // Mutual - usually slower planet wraps faster, or check standard logic
                // Default to P2 being receiver (standard Aspect flow) unless P1 is slower
                receiverName = p2Name; // Default
                senderName = p1Name;
                receiverHouse = aspect.planetTwo.house;
            }

            narrative += `**${senderName} ${aspect.symbol} ${receiverName} (${capitalize(aspect.type)})**`;
            if (isForced) narrative += ` ⚠️ FORCED`;
            narrative += `\n`;

            narrative += `*The Dynamic:* ${senderName} is sending energy to ${receiverName}.\n`;
            narrative += `*Reverse Vantage (${receiverName} in House ${receiverHouse}):* `;

            if (isForced) {
                narrative += `This is a **Forced Aspect**. ${receiverName} does not naturally "see" ${senderName}, so the energy feels like an intrusion or a blind-side hit. ${receiverName} is being force-fed energy it didn't ask for. `;
            } else {
                narrative += `${receiverName} receives this energy naturally. `;
            }

            if (aspect.type === 'trine') {
                narrative += `**Caution:** Because this is a Trine, ${receiverName} has **NO DEFENSE** against this flow. The energy floods in instantly. If ${senderName} is toxic or difficult, ${receiverName} absorbs it all without a filter. You must check the health of ${senderName}!\n`;
            } else if (aspect.type === 'square' || aspect.type === 'opposition') {
                narrative += `${receiverName} feels blocked or challenged. It must create a new strategy in House ${receiverHouse} to accommodate this friction. The "problem" isn't ${senderName} – the solution is upgrading how ${receiverName} handles pressure.\n`;
            } else {
                narrative += `${receiverName} must integrate this flow to function effectively.\n`;
            }
            narrative += `\n`;
        });
    }

    narrative += `**Why This Matters:** By understanding the "Receiver's" point of view, you can see where you might be unconsciously blocking support (squares/oppositions) or ignoring gifts (trines/sextiles).`;

    return {
        title: 'REVERSE VANTAGE: The Hidden Flow',
        icon: '🔄',
        content: narrative
    };
}

function generateGiftsSection(chart, guidance) {
    let narrative = `**Your Natural Gifts & Strengths**\n\n`;

    if (guidance?.strengths && guidance.strengths.length > 0) {
        for (const strength of guidance.strengths.slice(0, 4)) {
            narrative += `• **${strength.aspect}**: ${strength.description}\n`;
            if (strength.advice) {
                narrative += `  *How to use it:* ${strength.advice}\n`;
            }
            narrative += `\n`;
        }
    } else {
        // Default strengths based on chart
        narrative += `Your unique combination of placements gives you special gifts:\n\n`;

        const sun = chart.planets.sun;
        const moon = chart.planets.moon;

        narrative += `• Your ${capitalize(sun.sign)} Sun in House ${sun.house} gives you ${getSignGift(sun.sign)} in ${HOUSE_THEMES[sun.house]?.name.toLowerCase() || 'life'} matters.\n\n`;
        narrative += `• Your ${capitalize(moon.sign)} Moon provides ${getSignGift(moon.sign)} emotional intelligence.\n\n`;
    }

    narrative += `**Remember:** These are not just abilities – they are responsibilities. You have these gifts to share with the world. When you use them, you fulfill your purpose.`;

    return {
        title: 'YOUR GIFTS: Natural Strengths',
        icon: '✨',
        content: narrative
    };
}

// ============================================
// ADVANCED ALCHEMYSTIC SECTIONS
// ============================================

function generateTrueIdentitySection(chart) {
    let narrative = `**Your True Operating System (Spark & Base)**\n`;
    narrative += `Standard astrology reads the "paint" (zodiac sign). Alchemystic Astrology reads the "operating system" (Spark) and the "fuel source" (Base). This is who you REALLY are.\n\n`;

    // Calculate Sun identity
    const sunIdentity = calculateFullIdentity('sun', chart.planets.sun, chart.houses);
    narrative += `**☉ Your Sun (Vitality/Identity)**\n`;
    narrative += `${sunIdentity.summary}\n`;
    if (sunIdentity.sparkDetails) {
        narrative += `• *Tone (Paint):* ${sunIdentity.tone} – This is the color people see.\n`;
        narrative += `• *Spark (Operating System):* ${sunIdentity.spark} – This is how you actually function.\n`;
    }
    if (sunIdentity.baseDetails?.base) {
        narrative += `• *Base (Fuel Source):* ${capitalize(sunIdentity.baseDetails.base)} – This is where your vitality pulls its energy from.\n`;
        narrative += `  ${sunIdentity.baseDetails.interpretation}\n`;
    }
    narrative += `\n`;

    // Calculate Moon identity
    const moonIdentity = calculateFullIdentity('moon', chart.planets.moon, chart.houses);
    narrative += `**☽ Your Moon (Safety/Needs)**\n`;
    narrative += `${moonIdentity.summary}\n`;
    if (moonIdentity.sparkDetails) {
        narrative += `• *Tone (Paint):* ${moonIdentity.tone} – The emotional filter.\n`;
        narrative += `• *Spark (Operating System):* ${moonIdentity.spark} – How you actually process emotions.\n`;
    }
    if (moonIdentity.baseDetails?.base) {
        narrative += `• *Base (Fuel Source):* ${capitalize(moonIdentity.baseDetails.base)} – Where your emotional safety is sourced from.\n`;
        narrative += `  ${moonIdentity.baseDetails.interpretation}\n`;
    }
    narrative += `\n`;

    // Rising Sign context
    const rising = chart.angles.ascendant;
    narrative += `**Your Anchor:** ${capitalize(rising.sign)} Rising. This is the lens through which all Sparks and Bases express. The houses are counted from here.\n`;

    return {
        title: 'TRUE IDENTITY: Spark & Base',
        icon: '⚡',
        content: narrative
    };
}

function generateDelegateFlowSection(chart) {
    let narrative = `**Where Your Energy Patterns Come From**\n`;
    narrative += `In Alchemystic Astrology, a planet doesn't just "sit" in a house. It *pulls* energy from another house (its Base) and *delegates* it into its placement. This reveals the hidden "why" behind your patterns.\n\n`;

    // Analyze Sun delegate flow
    const sunFlow = analyzeDelegateFlow('sun', chart.planets.sun, chart.houses);
    if (sunFlow.flow) {
        narrative += `**☉ Sun Delegation (Identity/Father)**\n`;
        narrative += `${sunFlow.interpretation}\n`;
        if (sunFlow.warning) {
            narrative += `${sunFlow.warning}\n`;
        }
        narrative += `\n`;
    }

    // Analyze Moon delegate flow
    const moonFlow = analyzeDelegateFlow('moon', chart.planets.moon, chart.houses);
    if (moonFlow.flow) {
        narrative += `**☽ Moon Delegation (Safety/Mother)**\n`;
        narrative += `${moonFlow.interpretation}\n`;
        if (moonFlow.warning) {
            narrative += `${moonFlow.warning}\n`;
        }
        narrative += `\n`;
    }

    // Analyze Venus delegate flow (Relationships)
    const venusFlow = analyzeDelegateFlow('venus', chart.planets.venus, chart.houses);
    if (venusFlow.flow) {
        narrative += `**♀ Venus Delegation (Value/Love)**\n`;
        narrative += `${venusFlow.interpretation}\n`;
        if (venusFlow.warning) {
            narrative += `${venusFlow.warning}\n`;
        }
        narrative += `\n`;
    }

    narrative += `**The Key Insight:** When you understand delegation, you stop blaming the "destination" house for problems. The issue is always in the "source" house. Fix the source, and the destination clears up.`;

    return {
        title: 'DELEGATE FLOW: The Hidden Why',
        icon: '🔗',
        content: narrative
    };
}

function generateTraumaTimelineSection(chart) {
    let narrative = `**Significant Ages & Trauma Indicators**\n`;
    narrative += `Planetary cycles create predictable activation points. These are ages when deep psychological material is likely to surface or when significant events occurred.\n\n`;

    // Get general timeline
    const timeline = calculateTraumaTimeline(chart);

    narrative += `**Universal Activation Points:**\n`;
    for (const event of timeline.slice(0, 8)) {
        narrative += `• **Age ${event.ageRange}** (${event.event}): ${event.description}\n`;
    }
    narrative += `\n`;

    // Get specific indicators based on their chart
    const specificIndicators = calculateSpecificTraumaIndicators(chart);

    if (specificIndicators.length > 0) {
        narrative += `**Your Specific Indicators:**\n`;
        for (const indicator of specificIndicators) {
            const severityIcon = indicator.severity === 'high' ? '⚠️' : '📍';
            narrative += `${severityIcon} **${indicator.planet}** (House ${indicator.house}): ${indicator.description}\n`;
            narrative += `   *Key Ages:* ${indicator.ageRange}\n\n`;
        }
    } else {
        narrative += `No major trauma indicators detected in the primary placements. This does not mean no challenges exist, but the chart does not show the typical "hot spots."\n`;
    }

    narrative += `**Note:** This section identifies *patterns*, not predictions. Use this information for self-understanding, not diagnosis.`;

    return {
        title: 'SIGNIFICANT AGES: Trauma Timeline',
        icon: '📅',
        content: narrative
    };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getSignPersonality(sign) {
    const personalities = {
        aries: 'bold, direct, and action-oriented',
        taurus: 'grounded, sensual, and steady',
        gemini: 'curious, adaptable, and communicative',
        cancer: 'nurturing, protective, and intuitive',
        leo: 'confident, warm, and charismatic',
        virgo: 'analytical, helpful, and detail-oriented',
        libra: 'charming, diplomatic, and balanced',
        scorpio: 'intense, magnetic, and perceptive',
        sagittarius: 'adventurous, philosophical, and optimistic',
        capricorn: 'ambitious, disciplined, and professional',
        aquarius: 'unique, innovative, and humanitarian',
        pisces: 'compassionate, intuitive, and imaginative'
    };
    return personalities[sign] || 'unique in your own way';
}

function getEmotionalStyleByElement(element, sign) {
    const styles = {
        fire: `As a ${capitalize(sign)} Moon (Fire element), your emotions are passionate and quick to ignite. You need excitement, adventure, and creative expression to feel alive. Boredom is your enemy – you thrive when inspired.`,
        earth: `As a ${capitalize(sign)} Moon (Earth element), you need tangible security and stability to feel emotionally safe. Physical comfort, financial stability, and routine ground you. You process emotions practically.`,
        air: `As a ${capitalize(sign)} Moon (Air element), you process emotions through thinking and communicating. Talking things out helps you understand how you feel. You need intellectual stimulation and social connection.`,
        water: `As a ${capitalize(sign)} Moon (Water element), you feel deeply and intuitively. You pick up on the emotions of others and need time alone to process. Your emotional world is rich and complex.`
    };
    return styles[element] || 'Your emotional style is unique to you.';
}

function getSignThinkingStyle(sign) {
    const styles = {
        aries: 'quick, decisive, and action-oriented',
        taurus: 'methodical, practical, and thorough',
        gemini: 'versatile, curious, and quick-witted',
        cancer: 'intuitive, memory-based, and emotionally intelligent',
        leo: 'creative, confident, and dramatic',
        virgo: 'analytical, precise, and detail-focused',
        libra: 'balanced, diplomatic, and weighing all sides',
        scorpio: 'deep, investigative, and penetrating',
        sagittarius: 'expansive, philosophical, and big-picture',
        capricorn: 'strategic, structured, and goal-oriented',
        aquarius: 'innovative, unconventional, and futuristic',
        pisces: 'imaginative, intuitive, and flowing'
    };
    return styles[sign] || 'unique';
}

function getSignAttractionStyle(sign) {
    const styles = {
        aries: 'bold confidence and directness',
        taurus: 'sensuality and reliability',
        gemini: 'wit and intellectual charm',
        cancer: 'nurturing warmth and emotional depth',
        leo: 'radiant confidence and generosity',
        virgo: 'helpfulness and attention to care',
        libra: 'grace, beauty, and diplomacy',
        scorpio: 'magnetic intensity and mystery',
        sagittarius: 'adventurous spirit and optimism',
        capricorn: 'ambition and quiet strength',
        aquarius: 'uniqueness and intellectual appeal',
        pisces: 'dreamy romance and empathy'
    };
    return styles[sign] || 'your unique qualities';
}

function getSignLoveExpression(sign) {
    const expressions = {
        aries: 'passionately and directly',
        taurus: 'through physical touch and gifts',
        gemini: 'through words and conversation',
        cancer: 'through nurturing and care',
        leo: 'grandly and dramatically',
        virgo: 'through acts of service',
        libra: 'through partnership and harmony',
        scorpio: 'intensely and deeply',
        sagittarius: 'through adventure and freedom',
        capricorn: 'through commitment and providing',
        aquarius: 'through friendship and acceptance',
        pisces: 'through devotion and compassion'
    };
    return expressions[sign] || 'in your own unique way';
}

function getSignActionStyle(sign) {
    const styles = {
        aries: 'immediate, bold, and pioneering',
        taurus: 'steady, persistent, and unstoppable once started',
        gemini: 'adaptable, multi-tasking, and quick',
        cancer: 'emotionally driven and protective',
        leo: 'confident, dramatic, and heart-centered',
        virgo: 'precise, methodical, and improvement-focused',
        libra: 'balanced, fair, and partnership-oriented',
        scorpio: 'strategic, intense, and all-or-nothing',
        sagittarius: 'enthusiastic, expansive, and freedom-seeking',
        capricorn: 'disciplined, strategic, and results-focused',
        aquarius: 'unconventional, innovative, and cause-driven',
        pisces: 'intuitive, fluid, and compassion-motivated'
    };
    return styles[sign] || 'unique';
}

function getProgressedSeasonMeaning(sign) {
    const meanings = {
        aries: 'This is a time of new beginnings and bold initiatives. You are learning to assert yourself and take the lead. Start new projects, be courageous, and trust your pioneering instincts.',
        taurus: 'This is a stabilizing period focused on building and grounding. Slow down, appreciate beauty, cultivate resources, and focus on what has lasting value. Patience is your ally.',
        gemini: 'This is a curious, social, and learning-focused period. Gather information, make connections, explore ideas, and stay adaptable. Your mind is hungry for stimulation.',
        cancer: 'This is a period of emotional deepening and home focus. Family, roots, and creating a sanctuary matter now. Nurture yourself and others. Honor your feelings.',
        leo: 'This is a creative, expressive, and heart-centered period. Shine brightly, take center stage, create from the heart, and lead with warmth. This is your time to be seen.',
        virgo: 'This is a period of refinement, health, and service. Improve yourself, organize your life, focus on wellness, and be of service. The details matter now.',
        libra: 'This is a relationship-focused, balance-seeking period. Partnerships of all kinds take center stage. Seek harmony, beauty, and fairness in all things.',
        scorpio: 'This is a deep, transformative, and intense period. You are going through profound changes. Let go of what no longer serves you to make room for rebirth.',
        sagittarius: 'This is an expansive, adventurous, and philosophical period. Seek truth, expand your horizons, travel (mentally or physically), and embrace freedom.',
        capricorn: 'This is an ambitious, disciplined, and achievement-focused period. Build toward long-term goals, take on responsibility, and establish your legacy.',
        aquarius: 'This is an innovative, humanitarian, and future-focused period. Break free from limitations, embrace your uniqueness, and contribute to the collective.',
        pisces: 'This is a spiritual, intuitive, and dissolving period. Rest, dream, connect to the divine, and prepare for the next cycle. Let go of rigid structures.'
    };
    return meanings[sign] || 'Embrace this season of life and its unique lessons.';
}

function getMonthlyActions(house) {
    const actions = {
        1: '• Update your personal presentation\n• Start a self-improvement project\n• Assert your needs clearly',
        2: '• Review your finances\n• Clarify your values\n• Build something of lasting worth',
        3: '• Reach out to siblings or neighbors\n• Learn something new\n• Communicate important messages',
        4: '• Focus on home and family\n• Connect with your roots\n• Create emotional security',
        5: '• Express yourself creatively\n• Enjoy romance and fun\n• Spend quality time with children',
        6: '• Optimize your daily routines\n• Focus on health and wellness\n• Be of service to others',
        7: '• Nurture key relationships\n• Seek partnership opportunities\n• Find balance with others',
        8: '• Handle shared resources\n• Go deep emotionally\n• Let go of what no longer serves',
        9: '• Expand your horizons\n• Study or travel\n• Explore your beliefs',
        10: '• Make career moves\n• Build your public reputation\n• Set long-term goals',
        11: '• Connect with friends and groups\n• Work toward hopes and dreams\n• Contribute to community',
        12: '• Rest and reflect\n• Engage in spiritual practice\n• Process what is completing'
    };
    return actions[house] || '• Focus on growth in this life area';
}

function getSignApproach(sign) {
    const approaches = {
        aries: 'boldness and initiative',
        taurus: 'patience and persistence',
        gemini: 'flexibility and curiosity',
        cancer: 'nurturing and intuition',
        leo: 'confidence and heart',
        virgo: 'precision and helpfulness',
        libra: 'diplomacy and grace',
        scorpio: 'depth and intensity',
        sagittarius: 'optimism and adventure',
        capricorn: 'discipline and strategy',
        aquarius: 'innovation and openness',
        pisces: 'compassion and intuition'
    };
    return approaches[sign] || 'authenticity';
}

function getRetrogradeWarning(planet) {
    const warnings = {
        mercury: 'Communication and thinking may be more internalized. Revisit ideas before speaking. Double-check details.',
        venus: 'Relationships and values may need internal review. Old loves or values may resurface for resolution.',
        mars: 'Action may be more considered and strategic. You process anger internally. Use physical outlets.',
        jupiter: 'Growth and expansion happen more through internal wisdom than external opportunity.',
        saturn: 'You internalized discipline early. You may be harder on yourself than necessary.',
        uranus: 'Your rebellious and innovative nature expresses in subtle, inner ways.',
        neptune: 'Your spirituality and imagination are very personal and private.',
        pluto: 'Deep transformation happens within. You may resist external change until internally ready.'
    };
    return warnings[planet] || 'This energy is internalized in your chart.';
}

function getSignGift(sign) {
    const gifts = {
        aries: 'pioneering leadership and courage',
        taurus: 'grounded stability and persistence',
        gemini: 'quick wit and communication skills',
        cancer: 'emotional intelligence and nurturing',
        leo: 'natural charisma and creative expression',
        virgo: 'analytical precision and helpfulness',
        libra: 'diplomatic grace and relationship skills',
        scorpio: 'transformative depth and intuition',
        sagittarius: 'inspiring optimism and wisdom-seeking',
        capricorn: 'strategic ambition and mastery',
        aquarius: 'innovative thinking and humanitarian vision',
        pisces: 'compassionate understanding and artistic vision'
    };
    return gifts[sign] || 'unique talents';
}

// ============================================
// HTML REPORT GENERATOR
// ============================================

export function generateReportHTML(report) {
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 18px;
            line-height: 1.8;
            color: #2d2d2d;
            background: #fdfcfa;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .report-header {
            text-align: center;
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 2px solid #8b7355;
        }
        
        .report-title {
            font-size: 2.5rem;
            font-weight: 600;
            color: #4a3728;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }
        
        .report-subtitle {
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            color: #7a6a5a;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        
        .birth-info {
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            color: #5a4a3a;
            margin-top: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #f5f0e8 0%, #ebe4d8 100%);
            border-radius: 8px;
        }
        
        .section {
            margin-bottom: 50px;
            page-break-inside: avoid;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #d4c4a8;
        }
        
        .section-icon {
            font-size: 1.8rem;
            color: #8b7355;
        }
        
        .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #4a3728;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .section-content {
            text-align: justify;
            hyphens: auto;
        }
        
        .section-content p {
            margin-bottom: 1em;
            text-indent: 1.5em;
        }
        
        .section-content p:first-of-type {
            text-indent: 0;
        }
        
        .section-content strong {
            color: #4a3728;
            font-weight: 600;
        }
        
        .section-content em {
            font-style: italic;
            color: #6a5a4a;
        }
        
        .generated-date {
            text-align: center;
            font-family: 'Inter', sans-serif;
            font-size: 0.8rem;
            color: #999;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        
        @page {
            margin: 0.6in 0.5in;
            size: auto;
        }
        
        @media print {
            body {
                padding: 0;
                margin: 0;
                font-size: 11pt;
            }
            
            .report-header {
                margin-bottom: 30px;
                page-break-after: avoid;
            }
            
            .section {
                margin-bottom: 30px;
                page-break-inside: auto;
            }
            
            .section h2 {
                page-break-after: avoid;
            }
            
            .section p {
                orphans: 3;
                widows: 3;
            }
        }
        
        /* Action items styling */
        .section-content ul {
            list-style: none;
            margin: 1em 0;
            padding-left: 0;
        }
        
        .section-content li {
            margin-bottom: 0.5em;
            padding-left: 1.5em;
            position: relative;
        }
        
        .section-content li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #8b7355;
            font-weight: bold;
        }
        .print-bar{position:fixed;top:0;left:0;right:0;background:rgba(0,0,0,0.9);padding:12px 20px;display:flex;justify-content:center;gap:15px;z-index:9999;}
        .print-bar button{padding:10px 24px;border:none;border-radius:8px;font-family:'Inter',sans-serif;font-size:0.9rem;cursor:pointer;font-weight:500;}
        .print-btn{background:#c9a96e;color:#000;}
        .close-btn{background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)!important;}
        @media print{.print-bar{display:none!important;}}
    </style>
</head>
<body>
    <div class="print-bar">
      <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
      <button class="close-btn" onclick="window.close()">Close</button>
    </div>
    <header class="report-header">
        <h1 class="report-title">${report.title}</h1>
        <p class="report-subtitle">Based on ADS/FREE Theory Calculations</p>
        <div class="birth-info">
            <strong>Born:</strong> ${report.birthInfo.dateFormatted} at ${report.birthInfo.timeFormatted}<br>
            <strong>Location:</strong> ${report.birthInfo.location}
        </div>
    </header>
    
    <main>
`;

    for (const section of report.sections) {
        // Convert markdown-style formatting to HTML
        let content = section.content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n•/g, '</p><ul><li>')
            .replace(/•\s/g, '</li><li>')
            .replace(/(<li>.*?)(?=<\/p>|$)/g, '$1</li></ul>');

        // Wrap in paragraphs if not already
        if (!content.startsWith('<p>')) {
            content = '<p>' + content + '</p>';
        }

        html += `
        <section class="section">
            <div class="section-header">
                <span class="section-icon">${section.icon}</span>
                <h2 class="section-title">${section.title}</h2>
            </div>
            <div class="section-content">
                ${content}
            </div>
        </section>
`;
    }

    html += `
    </main>
    
    <footer class="generated-date">
        Report generated on ${report.generatedDate}<br>
        <em>Readings-Astrology • ADS/FREE Theory Chart Engine</em>
    </footer>
</body>
</html>
`;

    return html;
}
