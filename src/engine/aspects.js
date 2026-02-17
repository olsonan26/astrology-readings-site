/**
 * Astrology Readings - Aspect Calculation Engine
 * Implements the Aspect Spectrum System with Perception vs Reality
 */

import { PLANETARY_ORBS, MAJOR_ASPECTS, ZODIAC_SIGNS } from '../core/constants.js';
import { normalizeDegrees } from '../core/astronomy.js';
import { COURSE_3_ASPECTS } from '../data/course3-aspect-library.js';

// ============================================
// ASPECT DETECTION
// ============================================

/**
 * Check if an aspect exists between two planets using individual orbs
 */
export function checkAspect(planet1Data, planet2Data, planet1Name, planet2Name) {
    const long1 = planet1Data.longitude;
    const long2 = planet2Data.longitude;

    // Calculate angular separation
    let diff = Math.abs(long1 - long2);
    if (diff > 180) diff = 360 - diff;

    // Get individual orbs (reach values)
    const orb1 = PLANETARY_ORBS[planet1Name] || 5;
    const orb2 = PLANETARY_ORBS[planet2Name] || 5;

    // Combined orb = average of both planets' reach
    const combinedOrb = (orb1 + orb2) / 2;

    // Check each major aspect
    for (const [aspectName, aspectData] of Object.entries(MAJOR_ASPECTS)) {
        const targetAngle = aspectData.degrees;
        const orbDistance = Math.abs(diff - targetAngle);

        // Apply aspect-specific max orb cap (Course 3: minor aspects = 1-2°)
        const effectiveOrb = aspectData.maxOrb !== null && aspectData.maxOrb !== undefined
            ? Math.min(combinedOrb, aspectData.maxOrb)
            : combinedOrb;

        if (orbDistance <= effectiveOrb) {
            // Determine Forced Status
            const reaches1 = orbDistance <= orb1;
            const reaches2 = orbDistance <= orb2;
            let forcedStatus = 'mutual';

            if (reaches1 && !reaches2) forcedStatus = 'forced_by_1';
            if (!reaches1 && reaches2) forcedStatus = 'forced_by_2';

            // Note: If neither reaches but it passed 'effectiveOrb' (average), it's a weak connection
            if (!reaches1 && !reaches2) forcedStatus = 'weak';

            return {
                exists: true,
                type: aspectName,
                exactDegree: targetAngle,
                actualSeparation: diff,
                orbUsed: orbDistance,
                orb1: orb1,
                orb2: orb2,
                effectiveOrbUsed: effectiveOrb,
                forcedStatus: forcedStatus
            };
        }
    }

    return { exists: false };
}

/**
 * Determine if aspect is applying, exact, or separating
 * Based on zodiacal directional order
 */
export function determineAspectPhase(planet1Data, planet2Data, planet1Name, planet2Name) {
    const long1 = planet1Data.longitude;
    const long2 = planet2Data.longitude;

    // Determine which planet is "ahead" in zodiacal order
    let diff = long2 - long1;
    if (diff < 0) diff += 360;

    // Get aspect info
    const aspectInfo = checkAspect(planet1Data, planet2Data, planet1Name, planet2Name);
    if (!aspectInfo.exists) return null;

    const orbDistance = aspectInfo.orbUsed;

    // Exact if within 1 degree
    if (orbDistance < 1) {
        return 'exact';
    }

    // Determine direction based on zodiacal order
    // Faster planet approaching = applying
    // Faster planet departing = separating
    const speed1 = getApproximateSpeed(planet1Name);
    const speed2 = getApproximateSpeed(planet2Name);

    // Calculate actual separation direction
    const actualDiff = long2 - long1;
    const normalizedDiff = actualDiff < 0 ? actualDiff + 360 : actualDiff;

    // If faster planet is behind (smaller longitude in direction of travel)
    // and the aspect is not yet exact, it's applying
    if (speed1 > speed2) {
        // Planet 1 is faster
        return normalizedDiff < aspectInfo.exactDegree ? 'approaching' : 'passing';
    } else {
        // Planet 2 is faster
        return normalizedDiff > aspectInfo.exactDegree ? 'approaching' : 'passing';
    }
}

/**
 * Get approximate daily speed for phase calculation
 */
function getApproximateSpeed(planetName) {
    const speeds = {
        moon: 13.2,    // Fastest
        sun: 1.0,
        mercury: 1.2,
        venus: 1.0,
        mars: 0.5,
        jupiter: 0.08,
        saturn: 0.03,
        uranus: 0.01,
        neptune: 0.005,
        pluto: 0.004   // Slowest
    };
    return speeds[planetName] || 1;
}

/**
 * Find complex aspect configurations (Grand Trine, Kite)
 */
export function findConfigurations(planets, aspects) {
    const configs = [];

    // Get all trines
    const trines = aspects.filter(a => a.type === 'trine');
    const oppositions = aspects.filter(a => a.type === 'opposition');
    const sextiles = aspects.filter(a => a.type === 'sextile');

    // 1. GRAND TRINES
    // Find sets of 3 planets where all 3 connection pairs are trines
    const usedTrineSets = new Set();

    for (let i = 0; i < trines.length; i++) {
        for (let j = i + 1; j < trines.length; j++) {
            const t1 = trines[i];
            const t2 = trines[j];

            // Find a common planet between t1 and t2
            const common = findCommonPlanet(t1, t2);
            if (!common) continue;

            const p1 = t1.planetOne.name === common ? t1.planetTwo.name : t1.planetOne.name;
            const p2 = t2.planetOne.name === common ? t2.planetTwo.name : t2.planetOne.name;

            // Check if there is a trine between p1 and p2
            const thirdTrine = trines.find(t =>
                (t.planetOne.name === p1 && t.planetTwo.name === p2) ||
                (t.planetOne.name === p2 && t.planetTwo.name === p1)
            );

            if (thirdTrine) {
                const planetsInGT = [common, p1, p2].sort();
                const key = planetsInGT.join('-');
                if (!usedTrineSets.has(key)) {
                    usedTrineSets.add(key);
                    configs.push({
                        type: 'grand_trine',
                        planets: planetsInGT,
                        name: 'Grand Trine',
                        description: `A harmonious triangle formed by ${planetsInGT.join(', ')}. This creates a massive loop of supportive energy.`
                    });
                }
            }
        }
    }

    // 2. KITES
    // Grand Trine + Opposition to one point + Two Sextiles
    const grandTrines = configs.filter(c => c.type === 'grand_trine');
    for (const gt of grandTrines) {
        for (const pivot of gt.planets) {
            // Look for an opposition to this pivot planet
            const opp = oppositions.find(o => o.planetOne.name === pivot || o.planetTwo.name === pivot);
            if (opp) {
                const opponent = opp.planetOne.name === pivot ? opp.planetTwo.name : opp.planetOne.name;

                // Check if the opponent planet sextiles the other two points of the Grand Trine
                const otherTwo = gt.planets.filter(p => p !== pivot);
                const s1 = sextiles.find(s =>
                    (s.planetOne.name === opponent && s.planetTwo.name === otherTwo[0]) ||
                    (s.planetTwo.name === opponent && s.planetOne.name === otherTwo[0])
                );
                const s2 = sextiles.find(s =>
                    (s.planetOne.name === opponent && s.planetTwo.name === otherTwo[1]) ||
                    (s.planetTwo.name === opponent && s.planetOne.name === otherTwo[1])
                );

                if (s1 && s2) {
                    configs.push({
                        type: 'kite',
                        planets: [...gt.planets, opponent],
                        pivot: pivot,
                        opponent: opponent,
                        name: 'Kite Configuration',
                        description: `A Kite formed by a Grand Trine and ${opponent} in opposition to ${pivot}. This configuration PIVOTS your gifts through ${opponent}.`
                    });
                }
            }
        }
    }

    return configs;
}

function findCommonPlanet(a1, a2) {
    const p1 = [a1.planetOne.name, a1.planetTwo.name];
    const p2 = [a2.planetOne.name, a2.planetTwo.name];
    return p1.find(p => p2.includes(p));
}

// ============================================
// THE ASPECT SPECTRUM SYSTEM
// ============================================

/**
 * Analyze aspect with full Perception vs Reality framework
 */
export function analyzeAspect(planet1Name, planet2Name, planet1Data, planet2Data) {
    const aspectInfo = checkAspect(planet1Data, planet2Data, planet1Name, planet2Name);

    if (!aspectInfo.exists) {
        return null;
    }

    const phase = determineAspectPhase(planet1Data, planet2Data, planet1Name, planet2Name);

    // Determine leader based on 180° rule
    const diff = planet2Data.longitude - planet1Data.longitude;
    const normalizedDiff = diff < 0 ? diff + 360 : diff;

    // Before 180°: Planet 1 leads. After 180°: Roles switch
    const isFirstHalf = normalizedDiff <= 180;

    let planetOne, planetTwo;
    if (isFirstHalf) {
        planetOne = { name: planet1Name, ...planet1Data };
        planetTwo = { name: planet2Name, ...planet2Data };
    } else {
        planetOne = { name: planet2Name, ...planet2Data };
        planetTwo = { name: planet1Name, ...planet1Data };
    }

    // Get perception and reality interpretations
    const interpretations = getAspectInterpretations(aspectInfo.type, phase, planetOne.name, planetTwo.name);

    // Determine support structure
    const support = getSupportStructure(aspectInfo.type, phase);

    return {
        type: aspectInfo.type,
        symbol: MAJOR_ASPECTS[aspectInfo.type].symbol,
        keyword: MAJOR_ASPECTS[aspectInfo.type].keyword,
        phase: phase,
        orb: aspectInfo.orbUsed.toFixed(2),
        planetOne: planetOne,
        planetTwo: planetTwo,
        perception: interpretations.perception,
        reality: interpretations.reality,
        resolution: interpretations.resolution,
        support: support,
        richData: COURSE_3_ASPECTS[aspectInfo.type] || null,
        forcedStatus: aspectInfo.forcedStatus
    };
}

/**
 * Get Perception vs Reality interpretations for each aspect
 */
function getAspectInterpretations(aspectType, phase, planet1Name, planet2Name) {
    const p1 = capitalize(planet1Name);
    const p2 = capitalize(planet2Name);

    const interpretations = {
        conjunction: {
            approaching: {
                perception: `${p1} feels pressured, out-of-sync with ${p2}`,
                reality: `${p2} must blend without discord. ${p1} must give way, not be the only energy`,
                resolution: `Allow ${p2} to integrate smoothly - preparing for reset at exact conjunction`
            },
            exact: {
                perception: `Both ${p1} and ${p2} feel forced to share space (inhibiting)`,
                reality: `Energies mesh EVENLY - resolve as ONE unified force`,
                resolution: `Balance both equally - this is a HANDOFF POINT where leadership can shift`
            },
            passing: {
                perception: `${p1} feels out-of-sync or misdirected`,
                reality: `${p2} is now the leader (even if slightly ahead). ${p1} must direct energy INTO ${p2}'s needs`,
                resolution: `Support ${p2}'s direction - your ${p1} energy serves their journey now`
            }
        },

        semiSextile: {
            approaching: {
                perception: `${p1} feels overbearing pressure from ${p2}. Doesn't feel understood or supported`,
                reality: `${p2} is approaching to close a cycle. Must understand where energy lends`,
                resolution: `${p1} must utilize ${p2}'s influence to fuel own purposes`
            },
            exact: {
                perception: `Hard stop between ${p1} and ${p2} - oil and water that won't mix`,
                reality: `${p2} reached an area ${p1} doesn't understand. This is ${p1}'s blind spot`,
                resolution: `${p2}'s needs represent the NEXT STEP for ${p1}'s growth`
            },
            passing: {
                perception: `${p1} feels STAGNATED - an unseen challenge appears`,
                reality: `"Here vs There" conflict. ${p2} holds what ${p1} needs to understand`,
                resolution: `Embrace the discomfort - ${p2} shows your blind spot becoming visible`
            }
        },

        sextile: {
            approaching: {
                perception: `${p1} can't operate business-as-usual. Forced integration without understanding why`,
                reality: `${p2} offers assumptive foundation. ${p2} needs to know how much ${p1} is required`,
                resolution: `Ultimately serves ${p2}'s needs - let the opportunity flow`
            },
            exact: {
                perception: `${p1} sees ${p2} but doesn't know how much ${p2} matters`,
                reality: `${p2} has NEW INFORMATION/OPPORTUNITY for ${p1}`,
                resolution: `${p2} is absolute factor in directing ${p1} productively - seize the opportunity`
            },
            passing: {
                perception: `${p1} feels like they're missing context, feels left out`,
                reality: `${p2} holds new information that helps ${p1}`,
                resolution: `Stay open to what ${p2} reveals - the opportunity is still active`
            }
        },

        // QUINTILE (72°) - Course 3: Creative Manifestor - EXTERNAL talents
        quintile: {
            approaching: {
                perception: `${p1} feels a compulsive drive to CREATE something with ${p2}`,
                reality: `This is INTENTIONAL CREATION energy - ${p1} has a talent for manifesting ${p2} in the external world`,
                resolution: `Lean into this creative drive - it's where you can MAKE things happen`
            },
            exact: {
                perception: `${p1} and ${p2} form a CREATIVE MANIFESTOR aspect - this is purposeful talent`,
                reality: `You have a natural talent for outward expression connecting ${p1} and ${p2}. Use it in career and with people.`,
                resolution: `🎨 This is INTENTIONAL. Gives you drive, passion, purpose. Use EXTERNALLY in career and relationships!`
            },
            passing: {
                perception: `The creative drive between ${p1} and ${p2} feels like second nature`,
                reality: `This talent motivates you because you can actually USE it. It's EXTERNAL expression.`,
                resolution: `Don't overlook this gift - it's where you manifest things you want into reality`
            }
        },

        // BIQUINTILE (144°) - Course 3: Internal Problem-Solver - INTERNAL talents
        biQuintile: {
            approaching: {
                perception: `${p1} feels an internal urge to research and problem-solve with ${p2}`,
                reality: `This is HIDDEN TALENT - ${p1} has creative solutions for ${p2} matters that work internally`,
                resolution: `Trust your internal processing - this is for YOUR benefit, not to show off`
            },
            exact: {
                perception: `${p1} and ${p2} form an INTERNAL PROBLEM-SOLVER aspect - this talent is subtle`,
                reality: `You have access to creative and artistic talents that work INWARDLY. 'I can DO certain things' (not 'MAKE' them).`,
                resolution: `🔬 This is INTERNAL TALENT. Perfect for research, problem-solving, creative solutions to difficult issues.`
            },
            passing: {
                perception: `The internal processing between ${p1} and ${p2} may go unrecognized`,
                reality: `This is something you use FOR YOURSELF to help you do things. Obsessive research capability.`,
                resolution: `BiQuintile is harder to grab onto - recognize this hidden talent for internal creativity`
            }
        },

        square: {
            approaching: {
                perception: `${p1} CONFLICTS with ${p2}, wants to dominate. Frustration requiring attention`,
                reality: `Cross-point angle creates conflict. Focus on ${p1}'s expression while ALIGNING with ${p2}'s needs`,
                resolution: `${p1} is the focus now - express ${p1} while honoring ${p2}`
            },
            exact: {
                perception: `SAME conflict/domination desire between ${p1} and ${p2}`,
                reality: `EQUAL CONSIDERATION required. BOTH planets support each other's intentions`,
                resolution: `⚠️ TURNOVER POINT - favor shifts from ${p1} to ${p2}. Balance both equally!`
            },
            passing: {
                perception: `SAME conflict/domination desire persists`,
                reality: `Focus on ${p2}'s expression now. ${p1} ALIGNS to SUPPORT ${p2}`,
                resolution: `Shift focus to ${p2}'s journey - ${p1} now serves to advance ${p2}`
            }
        },

        trine: {
            approaching: {
                perception: `${p1} influenced by ${p2} (unwanted). Creates friction/static, distorts ${p1}'s vitality`,
                reality: `${p2} must be STABLE to direct into ${p1}. Must know ${p1}'s purposes (supportive not detracting)`,
                resolution: `${p1} must be OPEN to ${p2}'s reception - the help is real, accept it`
            },
            exact: {
                perception: `${p1} directly contributes to ${p2}. Comes naturally, goes UNNOTICED`,
                reality: `${p2} is RECEIVER for ${p1}. ${p1} CAN distort/disrupt flow if not intentional`,
                resolution: `Be conscious of what ${p1} is sending. Understand how ${p2} receives`
            },
            passing: {
                perception: `Energy flows so naturally it may be taken for granted`,
                reality: `${p2} continues to receive from ${p1}. The harmony is real but requires awareness`,
                resolution: `Don't become lazy with this gift - conscious use amplifies the blessing`
            }
        },

        quincunx: {
            approaching: {
                perception: `${p1} receives input but can't process it. Doesn't gel, tries to reject`,
                reality: `${p2} SENDING energy toward ${p1}. Should be directed to do so`,
                resolution: `${p2} lends to ${p1}'s scenarios. ${p1} must use it to fuel own purposes`
            },
            exact: {
                perception: `IMPASSE - neither ${p1} nor ${p2} knows how to connect. Separation, compartmentalization`,
                reality: `${p2} is natural receiver (like Trine) BUT not meant to MERGE`,
                resolution: `${p1} "AIMS" influence toward ${p2} - extended but DETACHED support`
            },
            passing: {
                perception: `Continued disconnection, hard to integrate the energies`,
                reality: `Support flows in one direction - ${p1} feeds ${p2} at arm's length`,
                resolution: `Accept the detachment as intentional - not all connections require fusion`
            }
        },

        opposition: {
            approaching: {
                perception: `${p2} is the ENEMY - must remove ${p2}'s influence. ${p2} causes all problems`,
                reality: `${p2} finalizing arc journey. ${p1} offers INCLUSION from across the axis`,
                resolution: `Both operate where they are. ${p2} must EMBRACE ${p1}'s contributions`
            },
            exact: {
                perception: `Both ${p1} and ${p2} feel the other is the enemy`,
                reality: `Final moment - togetherness to opposite sides. Balance struck by offering STRENGTHS`,
                resolution: `🔄 2nd HANDOFF POINT - leadership switches. ${p1} illuminates ${p2}'s hidden side`
            },
            passing: {
                perception: `${p1} feels uneasy, unwanted force from ${p2}. Natural instinct to repel`,
                reality: `${p2} lends energies in OPPOSITIONAL SUPPORT. Naturally opposes BUT feeds into ${p1}`,
                resolution: `${p2} brings additional context. Stay where you are but receive the gift`
            }
        }
    };

    const aspectInterp = interpretations[aspectType];
    if (!aspectInterp) {
        return {
            perception: `${p1} aspects ${p2}`,
            reality: `Energy exchange between ${p1} and ${p2}`,
            resolution: `Balance both planetary energies`
        };
    }

    return aspectInterp[phase] || aspectInterp.exact;
}

/**
 * Get support structure based on aspect type and phase
 */
function getSupportStructure(aspectType, phase) {
    const supportMap = {
        conjunction: {
            approaching: 'Planet One SUPPORTED (by approaching planet)',
            exact: 'BOTH EQUALLY SUPPORTED',
            passing: 'Planet Two leads, Planet One SUPPORTED'
        },
        semiSextile: {
            approaching: 'Planet One SUPPORTED',
            exact: 'Planet One SUPPORTED',
            passing: 'Planet One SUPPORTED'
        },
        sextile: {
            approaching: 'Planet One SUPPORTED (for Planet Two\'s purposes)',
            exact: 'Planet One SUPPORTED',
            passing: 'Planet One SUPPORTED'
        },
        square: {
            approaching: 'Planet One SUPPORTED (not yet turnover)',
            exact: 'BOTH EQUALLY SUPPORTED (⚠️ TURNOVER POINT)',
            passing: 'Planet Two SUPPORTED (favor has shifted)'
        },
        trine: {
            approaching: 'Planet Two SUPPORTED',
            exact: 'Planet Two SUPPORTED',
            passing: 'Planet Two SUPPORTED'
        },
        quincunx: {
            approaching: 'Planet Two SUPPORTED',
            exact: 'Planet Two SUPPORTED',
            passing: 'Planet Two SUPPORTED'
        },
        opposition: {
            approaching: 'Planet Two SUPPORTED',
            exact: 'BOTH EQUALLY SUPPORTED (🔄 HANDOFF POINT)',
            passing: 'Planet Two SUPPORTED (now as Planet One)'
        }
    };

    // Add support structures for Creative Aspects (Quintile/BiQuintile)
    const CREATIVE_SUPPORT = {
        quintile: 'Creative Manifestation (External Talent)',
        biQuintile: 'Internal Processing (Hidden Talent)'
    };

    if (CREATIVE_SUPPORT[aspectType]) {
        return CREATIVE_SUPPORT[aspectType];
    }

    return supportMap[aspectType]?.[phase] || 'Support structure varies';
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================
// FIND ALL ASPECTS IN CHART
// ============================================

/**
 * Find all aspects between planets in a chart
 */
export function findAllAspects(chartData) {
    const planets = Object.keys(chartData.planets);
    const aspects = [];

    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
            const planet1Name = planets[i];
            const planet2Name = planets[j];

            const analysis = analyzeAspect(
                planet1Name,
                planet2Name,
                chartData.planets[planet1Name],
                chartData.planets[planet2Name]
            );

            if (analysis) {
                aspects.push(analysis);
            }
        }
    }

    // Sort by importance: Conjunctions first, then oppositions, squares, etc.
    const aspectOrder = ['conjunction', 'opposition', 'square', 'trine', 'sextile', 'quincunx', 'semiSextile'];
    aspects.sort((a, b) => aspectOrder.indexOf(a.type) - aspectOrder.indexOf(b.type));

    return aspects;
}

/**
 * Check for stellium vs satellitium
 */
export function checkCluster(chartData) {
    const planets = chartData.planets;
    const byGroup = {};

    // Group planets by sign AND house
    for (const [name, data] of Object.entries(planets)) {
        const key = `${data.sign}-${data.house}`;
        if (!byGroup[key]) byGroup[key] = [];
        byGroup[key].push({ name, ...data });
    }

    const clusters = [];

    for (const [key, planetList] of Object.entries(byGroup)) {
        if (planetList.length >= 3) {
            const [sign, house] = key.split('-');
            // Sort by longitude
            planetList.sort((a, b) => a.longitude - b.longitude);

            // Check if all are within mutual orbs (chained conjunctions)
            let allConnected = true;
            for (let i = 0; i < planetList.length - 1; i++) {
                const aspect = checkAspect(planetList[i], planetList[i + 1], planetList[i].name, planetList[i + 1].name);
                if (!aspect.exists || aspect.type !== 'conjunction') {
                    allConnected = false;
                    break;
                }
            }

            clusters.push({
                sign: sign,
                house: parseInt(house),
                type: allConnected ? 'stellium' : 'satellitium',
                planets: planetList.map(p => p.name),
                description: allConnected
                    ? `STELLIUM in ${capitalize(sign)} (House ${house}): ${planetList.map(p => capitalize(p.name)).join(', ')}. These energies STRENGTHEN and AMPLIFY each other; they act as one unified team.`
                    : `SATELLITIUM in ${capitalize(sign)} (House ${house}): ${planetList.map(p => capitalize(p.name)).join(', ')}. While in the same sign and house, these planets do NOT influence each other directly. They act independently within the same field of life.`
            });
        }
    }

    return clusters;
}
