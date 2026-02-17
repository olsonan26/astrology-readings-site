/**
 * Astrology Readings - Main Application
 * Handles user input, chart generation, and UI rendering
 */

import {
  calculateAllPlanets,
  findAllAspects,
  checkCluster,
  interpretFullChart,
  PLANET_SYMBOLS, SIGN_SYMBOLS, MAJOR_ASPECTS,
  PLANET_TO_TIER, HOUSE_THEMES,
  // New Imports
  LENSES_PHILOSOPHY, LOVE_LENS, CAREER_LENS, CHILDREN_LENS, COURSE_3_ASPECTS,
  ChatEngine, calculateManifestationProfile,
  // Profile Report
  generateProfileReport, generateReportHTML,
  // Question Discovery & Autonomous Analysis
  DISCOVERY_CATEGORIES, FOLLOW_UP_QUESTIONS,
  buildAnalysisPlan, inferPlanFromQuestion, generateFocusedReading,
  SessionContext,
  // Deep Report
  generateDeepReport, generateDeepReportHTML
} from './dist/astrology-bundle.js?v=build5';

// ============================================
// DOM ELEMENTS
// ============================================
const birthDataForm = document.getElementById('birthDataForm');
const birthDate = document.getElementById('birthDate');
const birthTime = document.getElementById('birthTime');
const birthLocation = document.getElementById('birthLocation');
const birthNameInput = document.getElementById('birthName');
const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');
const locationCoords = document.getElementById('locationCoords');
const latDisplay = document.getElementById('latDisplay');
const lonDisplay = document.getElementById('lonDisplay');
const generateBtn = document.getElementById('generateBtn');
const loading = document.getElementById('loading');
const inputSection = document.getElementById('inputSection');
const resultsSection = document.getElementById('resultsSection');
const newReadingBtn = document.getElementById('newReadingBtn');
const profileReportBtn = document.getElementById('profileReportBtn');
const deepReportBtn = document.getElementById('deepReportBtn');

// Results containers
const chartMeta = document.getElementById('chartMeta');
const anglesGrid = document.getElementById('anglesGrid');
const planetsGrid = document.getElementById('planetsGrid');
const aspectsContainer = document.getElementById('aspectsContainer');
const clustersSection = document.getElementById('clustersSection');
const clustersContainer = document.getElementById('clustersContainer');
const rulershipContainer = document.getElementById('rulershipContainer');
const guidanceContent = document.getElementById('guidanceContent');
const lensButtons = document.querySelectorAll('.lens-btn');
const lensAnalysisContainer = document.getElementById('lensAnalysisContainer');

// Chat DOM Elements
const chatFab = document.getElementById('chatFab');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');

let chatEngine = null;

// Store current birth data globally for profile report generation
let currentBirthData = null;

// ============================================
// GEOCODING (Location to Coordinates)
// ============================================
async function geocodeLocation(locationName) {
  try {
    // Add country bias for better results - prioritize USA for US locations
    const searchQuery = locationName.toLowerCase().includes('usa') ||
      locationName.toLowerCase().includes('united states') ||
      locationName.toLowerCase().includes('california') ||
      locationName.toLowerCase().includes('texas') ||
      locationName.toLowerCase().includes('new york') ||
      locationName.toLowerCase().includes('florida')
      ? `${locationName}, USA` : locationName;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      // Try to find the best match - prefer results in USA for common US state names
      let bestResult = data[0];

      // If searching for a US location, try to find a US result
      const usStates = ['california', 'texas', 'florida', 'new york', 'arizona', 'nevada', 'oregon', 'washington'];
      const hasUSIndicator = usStates.some(state => locationName.toLowerCase().includes(state));

      if (hasUSIndicator) {
        const usResult = data.find(r =>
          r.display_name.toLowerCase().includes('united states') ||
          r.display_name.toLowerCase().includes('usa') ||
          r.address?.country_code === 'us'
        );
        if (usResult) bestResult = usResult;
      }

      return {
        latitude: parseFloat(bestResult.lat),
        longitude: parseFloat(bestResult.lon),
        displayName: bestResult.display_name,
        shortName: bestResult.address ?
          `${bestResult.address.city || bestResult.address.town || bestResult.address.village || ''}, ${bestResult.address.state || ''}, ${bestResult.address.country || ''}`.replace(/^, |, $/g, '') :
          bestResult.display_name.split(',').slice(0, 3).join(',')
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Location input handler with debounce
let geocodeTimeout;
birthLocation.addEventListener('input', () => {
  clearTimeout(geocodeTimeout);
  geocodeTimeout = setTimeout(async () => {
    const location = birthLocation.value.trim();
    if (location.length > 2) {
      const coords = await geocodeLocation(location);
      if (coords) {
        latitudeInput.value = coords.latitude;
        longitudeInput.value = coords.longitude;
        // Show BOTH coordinates and the resolved location name for verification
        latDisplay.textContent = `${coords.latitude.toFixed(4)}°`;
        lonDisplay.textContent = `${coords.longitude.toFixed(4)}°`;
        locationCoords.innerHTML = `
                    <span style="color: #2dd4bf;">${coords.latitude.toFixed(4)}°, ${coords.longitude.toFixed(4)}°</span>
                    <br><span style="color: rgba(255,255,255,0.6); font-size: 0.75rem;">📍 ${coords.shortName}</span>
                `;
        locationCoords.style.display = 'block';
      } else {
        locationCoords.innerHTML = '<span style="color: #ef4444;">Location not found. Try adding country name.</span>';
        locationCoords.style.display = 'block';
      }
    }
  }, 800);
});

// ============================================
// FORM SUBMISSION
// ============================================
birthDataForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate location coordinates
  if (!latitudeInput.value || !longitudeInput.value) {
    const coords = await geocodeLocation(birthLocation.value);
    if (!coords) {
      alert('Could not find location. Please try a different location name.');
      return;
    }
    latitudeInput.value = coords.latitude;
    longitudeInput.value = coords.longitude;
  }

  // Show loading
  generateBtn.style.display = 'none';
  loading.style.display = 'flex';

  // Create date object
  // NOTE: The time entered should be the LOCAL TIME at the birth location
  // JavaScript will interpret this as local time on the user's computer
  // For best accuracy, the user should be in the same timezone as the birth location,
  // OR the time should be entered as if it were in the user's current timezone
  const dateStr = birthDate.value;
  const timeStr = birthTime.value;
  const [year, month, day] = dateStr.split('-').map(Number);
  let [hours, minutes] = timeStr.split(':').map(parseFloat);

  // Handle AM/PM if present (fallback for text inputs)
  if (timeStr.toLowerCase().includes('pm') && hours < 12) hours += 12;
  if (timeStr.toLowerCase().includes('am') && hours === 12) hours = 0;

  // Create the birth date/time as a local Date
  // The astronomy-engine will convert this to UTC internally
  const birthDateTime = new Date(year, month - 1, day, hours, minutes);

  console.log('Birth date/time created:', birthDateTime.toString());
  console.log('Birth date/time UTC:', birthDateTime.toISOString());

  // Capture name and gender
  const personName = birthNameInput ? birthNameInput.value.trim() : '';
  const genderRadio = document.querySelector('input[name="gender"]:checked');
  const gender = genderRadio ? genderRadio.value : 'female';

  const birthData = {
    date: birthDateTime,
    latitude: parseFloat(latitudeInput.value),
    longitude: parseFloat(longitudeInput.value),
    locationName: birthLocation.value,
    name: personName,
    gender: gender
  };

  // Small delay for effect
  setTimeout(() => {
    try {
      const chartReading = generateNatalChart(birthData);
      displayResults(chartReading, birthData);
    } catch (error) {
      console.error('Chart generation error:', error);
      alert('Error generating chart. Please check your inputs and try again.');
      generateBtn.style.display = 'flex';
      loading.style.display = 'none';
    }
  }, 1500);
});

// ============================================
// CHART GENERATION
// ============================================
function generateNatalChart(birthData) {
  const { date, latitude, longitude, locationName } = birthData;

  // Calculate planetary positions
  const chartData = calculateAllPlanets(date, latitude, longitude);

  // Find aspects
  const aspects = findAllAspects(chartData);

  // Check for clusters
  const clusters = checkCluster(chartData);

  // Generate interpretations
  const interpretations = interpretFullChart(chartData);

  // Generate guidance
  const guidance = generateGuidance(chartData, aspects, interpretations);

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      birthData: { date, latitude, longitude, locationName }
    },
    chart: chartData,
    aspects,
    clusters,
    interpretations,
    guidance
  };
}

function generateGuidance(chartData, aspects, interpretations) {
  const guidance = {
    strengths: [],
    challenges: [],
    themes: [],
    actions: []
  };

  for (const aspect of aspects) {
    const majorAspect = MAJOR_ASPECTS[aspect.type];

    if (majorAspect.nature === 'harmony' || majorAspect.nature === 'opportunity') {
      guidance.strengths.push({
        aspect: `${capitalize(aspect.planetOne.name)} ${aspect.symbol} ${capitalize(aspect.planetTwo.name)}`,
        description: `Natural flow between ${aspect.planetOne.name} and ${aspect.planetTwo.name}`,
        advice: aspect.resolution
      });
    } else if (majorAspect.nature === 'challenge' || majorAspect.nature === 'adjustment') {
      guidance.challenges.push({
        aspect: `${capitalize(aspect.planetOne.name)} ${aspect.symbol} ${capitalize(aspect.planetTwo.name)}`,
        perception: aspect.perception,
        reality: aspect.reality,
        resolution: aspect.resolution
      });
    }
  }

  // Add retrograde themes
  for (const [planet, data] of Object.entries(chartData.planets)) {
    if (data.motionState === 'retrograde') {
      const interp = interpretations.planets[planet];
      if (interp?.retrograde) {
        guidance.themes.push({
          theme: `${capitalize(planet)} Retrograde`,
          description: interp.retrograde.description,
          gift: interp.retrograde.gift,
          challenge: interp.retrograde.challenge
        });
      }
    }
  }

  // Action items
  for (const challenge of guidance.challenges.slice(0, 3)) {
    guidance.actions.push({
      focus: challenge.aspect,
      action: challenge.resolution
    });
  }

  return guidance;
}

// ... existing code ...

// ============================================
// LENSES SYSTEM LOGIC
// ============================================

function setupLenses(chartReading) {
  lensButtons.forEach(btn => {
    // Remove old listeners to prevent duplicates if re-rendering
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', () => {
      document.querySelectorAll('.lens-btn').forEach(b => b.classList.remove('active'));
      newBtn.classList.add('active');
      updateLensView(newBtn.dataset.lens, chartReading);
    });
  });

  // Reset to general on new load
  document.querySelectorAll('.lens-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-lens="general"]').classList.add('active');
  updateLensView('general', chartReading);
}

function updateLensView(lens, chartReading) {
  if (lens === 'general') {
    lensAnalysisContainer.style.display = 'none';
    // Show all sections
    document.querySelector('.planets-section').style.display = 'block';
    document.querySelector('.aspects-section').style.display = 'block';
    return;
  }

  lensAnalysisContainer.style.display = 'block';
  const analysis = generateLensAnalysis(lens, chartReading);

  lensAnalysisContainer.innerHTML = `
        <div class="lens-card">
            <div class="lens-header">
                <h3>${analysis.title}</h3>
                <p class="lens-intro">${analysis.intro}</p>
            </div>
            <div class="lens-content">
                ${analysis.sections.map(section => `
                    <div class="lens-step">
                        <div class="lens-step-title">${section.title}</div>
                        <div class="lens-step-content">${section.content}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateLensAnalysis(lens, chartReading) {
  const { chart, aspects } = chartReading;
  let title = '';
  let intro = '';
  let sections = [];
  let lensData = null;
  let focusHouse = 1;
  let html = ''; // Added for switch statement

  // Define lens data
  switch (lens) {
    case 'love':
      title = '❤️ Love & Relationships Lens';
      intro = LOVE_LENS.truthAboutLove;
      lensData = LOVE_LENS;
      focusHouse = 7;
      break;
    case 'career':
      title = '💼 Career & Legacy Lens';
      intro = "Focus on your public reputation, career path, and professional abundance.";
      lensData = CAREER_LENS;
      focusHouse = 10;
      break;
    case 'children':
      title = '👶 Children & Creativity Lens';
      intro = CHILDREN_LENS.interpretation;
      lensData = CHILDREN_LENS;
      focusHouse = 5;
      break;
    case 'manifestation':
      const manifestProfile = calculateManifestationProfile(chart, aspects);
      const progressionInfo = manifestProfile.divineTiming;

      return {
        title: '✨ Manifestation & Power Lens',
        intro: 'Based on Rebel Academy Class #5: Align your Sun (Goal), Pluto (Power), and Chiron (Block) to manifest your reality.',
        sections: [
          {
            title: `⏳ Divine Timing: Your Current Season`,
            content: `<p><strong>Current Life Season:</strong> ${progressionInfo.currentSeason.sign} Season (Age ${progressionInfo.age})</p><p><strong>Theme:</strong> ${progressionInfo.currentSeason.theme}</p><p>${progressionInfo.currentSeason.guidance}</p>
                            <div class="progress-bar-container" style="margin-top: 15px; background: #333; height: 8px; border-radius: 4px;">
                                <div class="progress-bar" style="width: ${progressionInfo.progress}%; background: #ffd700; height: 100%; border-radius: 4px;"></div>
                            </div>
                            <p style="font-size: 0.8em; color: #888; text-align: right; margin-top: 5px;">${Math.round(progressionInfo.progress)}% through this season</p>`
          },
          {
            title: `1. The Goal (Sun in ${capitalize(manifestProfile.sun.sign)})`,
            content: `<p><strong>Your "Why":</strong> ${manifestProfile.sun.description}</p><div class="lens-advice"><strong>Action:</strong> ${manifestProfile.sun.action}</div>`
          },
          {
            title: `2. The Power Source (Pluto in ${capitalize(manifestProfile.pluto.sign)})`,
            content: `<p><strong>Your Engine:</strong> ${manifestProfile.pluto.description}</p><div class="lens-advice"><strong>Unlock it:</strong> ${manifestProfile.pluto.action}</div>`
          },
          {
            title: `3. The Block (Chiron in ${capitalize(manifestProfile.chiron.sign)})`,
            content: `<p><strong>Your Wound:</strong> ${manifestProfile.chiron.description}</p><div class="lens-advice"><strong>Heal it:</strong> ${manifestProfile.chiron.action}</div>`
          },
          {
            title: `4. The Fear (Moon & Neptune)`,
            content: `<div class="fear-box" style="background: rgba(255, 0, 0, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                                <p><strong>Emotional Fear (Moon in ${capitalize(manifestProfile.moon.sign)}):</strong> ${manifestProfile.moon.fear}</p>
                                <p><em>Fix:</em> ${manifestProfile.moon.fix}</p>
                            </div>
                            <div class="fear-box" style="background: rgba(80, 0, 80, 0.1); padding: 15px; border-radius: 8px;">
                                <p><strong>Abstract Fear (Neptune in ${capitalize(manifestProfile.neptune.sign)}):</strong> ${manifestProfile.neptune.fear}</p>
                                <p><em>Fix:</em> ${manifestProfile.neptune.fix}</p>
                            </div>`
          },
          {
            title: `5. Kinetic Energy (Transmutation)`,
            content: manifestProfile.transmutation.length > 0
              ? `<p>Use these "Hard Aspects" as fuel engines:</p><ul class="lens-aspect-list">${manifestProfile.transmutation.map(t => `<li><strong>${t.aspect}:</strong> ${t.guidance}</li>`).join('')}</ul>`
              : `<p>You have a harmonious flow. You must generate your own discipline to manifest, as the universe won't force you with crisis!</p>`
          }
        ]
      };
    case 'money':
      const moneyProfile = calculateMoneyProfile(chart, aspects);
      return {
        title: '💰 Money & Finance Lens',
        intro: 'Your strategic financial blueprint (Class #6).',
        sections: [
          {
            title: '🏦 The Container (2nd House)',
            content: `<p><strong>Sign:</strong> ${moneyProfile.secondHouse.sign} (Ruled by ${moneyProfile.secondHouse.ruler})</p>
                            <p>${moneyProfile.secondHouse.description}</p>
                            <div class="lens-advice">
                                <strong>Challenge:</strong> ${moneyProfile.secondHouse.challenge}
                            </div>`
          },
          {
            title: '🧲 The Magnet (Venus)',
            content: `<p><strong>Venus in ${moneyProfile.venus.sign}</strong></p>
                            <p><strong>Attraction Strategy:</strong> ${moneyProfile.venus.strategy}</p>`
          },
          {
            title: `👔 The Manager (Ruler: ${moneyProfile.ruler.name})`,
            content: `<p><strong>Located in:</strong> House ${moneyProfile.ruler.house} (${moneyProfile.ruler.sign})</p>
                        <p><strong>Role:</strong> ${moneyProfile.ruler.role}</p>
                        <p><strong>Style:</strong> ${moneyProfile.ruler.style}</p>
                        <div class="lens-advice" style="margin-top: 10px; background: rgba(0, 255, 255, 0.05); border-left: 3px solid cyan;">
                            <strong>Strategy:</strong> ${moneyProfile.ruler.houseDescription}
                        </div>`
          },
          {
            title: `⚖️ The Hidden Partner (Libra Factor)`,
            content: `<p><strong>Located in:</strong> House ${moneyProfile.libra.house}</p>
                        <div class="lens-advice" style="margin-top: 5px; background: rgba(255, 182, 193, 0.05); border-left: 3px solid pink;">
                            ${moneyProfile.libra.strategy}
                        </div>
                        <p style="font-size: 0.8em; margin-top: 5px; opacity: 0.7;">*Venus rules both Money (Taurus) and Balance (Libra), so this house is your financial stabilizer.</p>`
          },
          {
            title: '💸 Money Generators',
            content: `<p>Specific income streams aligned with your Rising Sign:</p>
                            <ul class="aspect-list">
                                ${moneyProfile.generators.map(gen => `
                                    <li style="margin-bottom: 10px; padding: 10px; background: rgba(255, 215, 0, 0.1); border-radius: 6px;">
                                        💰 ${gen}
                                    </li>
                                `).join('')}
                            </ul>`
          }
        ]
      };
  }

  // 1. Analyze Primary House
  const houseData = chart.houses[focusHouse];
  const rulerName = SIGN_RULERS[houseData.sign];
  const ruler = chart.planets[rulerName];

  sections.push({
    title: `1. The Foundation (House ${focusHouse})`,
    content: `
            <p><strong>Starts with ${capitalize(houseData.sign)}:</strong> The atmosphere of this area is ${houseData.sign} — ${SIGN_ELEMENTS[houseData.sign]} energy.</p>
            <p><strong>Ruler:</strong> Ruled by ${capitalize(rulerName)}, located in House ${ruler.house}.</p>
            <p>This links your <strong>${HOUSE_THEMES[focusHouse].name}</strong> directly to your <strong>${HOUSE_THEMES[ruler.house].name}</strong>.</p>
        `
  });

  // 2. Analyze Ruler Aspects
  const rulerAspects = aspects.filter(a => a.planetOne.name === rulerName || a.planetTwo.name === rulerName);
  if (rulerAspects.length > 0) {
    sections.push({
      title: `2. Ruler Connections (${capitalize(rulerName)})`,
      content: `
                <p>${capitalize(rulerName)} is the key player here. Its conversations define your experience:</p>
                <ul class="lens-aspect-list">
                    ${rulerAspects.map(a => `<li><strong>${a.symbol} ${a.planetOne.name === rulerName ? capitalize(a.planetTwo.name) : capitalize(a.planetOne.name)}:</strong> ${a.richData?.manifestation || a.resolution}</li>`).join('')}
                </ul>
            `
    });
  }

  // 3. Planets in the House
  const planetsInHouse = Object.values(chart.planets).filter(p => p.house === focusHouse);
  if (planetsInHouse.length > 0) {
    sections.push({
      title: `3. Occupants (Planets in House ${focusHouse})`,
      content: `
                <p>These planets are active "actors" in this area of your life:</p>
                <ul>
                    ${planetsInHouse.map(p => `<li><strong>${capitalize(p.name)}:</strong> Brings ${p.name === 'sun' ? 'vitality' : p.name === 'moon' ? 'emotional needs' : 'energy'} to this area.</li>`).join('')}
                </ul>
            `
    });
  } else {
    sections.push({
      title: `3. Occupants`,
      content: `<p>House ${focusHouse} is empty. This means the Ruler (${capitalize(rulerName)}) is the sole delegate. Look entirely to ${capitalize(rulerName)} in House ${ruler.house} for the story.</p>`
    });
  }

  return { title, intro, sections };
}
// ============================================
// CHAT UI LOGIC
// ============================================

function setupChat(chartReading) {
  if (!chatEngine) {
    chatEngine = new ChatEngine(chartReading);
  } else {
    chatEngine.chartReading = chartReading;
  }

  // Toggle Chat Window
  chatFab.onclick = () => {
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    if (chatWindow.style.display === 'flex') chatInput.focus();
  };

  chatClose.onclick = () => chatWindow.style.display = 'none';

  // Send Message
  const handleSend = () => {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add User Message
    addChatMessage(text, 'user');
    chatInput.value = '';

    // Show Typing Indicator (Fake delay)
    const loadingId = addChatMessage('Typing...', 'bot', true);

    setTimeout(() => {
      // Remove typing indicator
      const loadingMsg = document.getElementById(loadingId);
      if (loadingMsg) loadingMsg.remove();

      // Get Bot Response
      const response = chatEngine.processQuery(text);
      addChatMessage(response.message, 'bot');

      // If response triggers a specific lens, scroll to it
      // (could implement auto-scroll here)
    }, 1000 + Math.random() * 500);
  };

  chatSendBtn.onclick = handleSend;

  chatInput.onkeypress = (e) => {
    if (e.key === 'Enter') handleSend();
  };
}

function addChatMessage(text, sender, isLoading = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  if (isLoading) msgDiv.id = `msg-${Date.now()}`;

  // Format markdown-style bold
  const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  msgDiv.innerHTML = `
        <div class="message-content">
            ${isUrl(text) ? `<a href="${text}" target="_blank">${text}</a>` : formattedText.replace(/\n/g, '<br>')}
        </div>
    `;

  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return msgDiv.id;
}

function isUrl(str) {
  return /^(http|https):\/\/[^ "]+$/.test(str);
}

function displayResults(chartReading, birthData) {
  loading.style.display = 'none';
  inputSection.style.display = 'none';
  resultsSection.style.display = 'block';

  // Store chart reading globally for discovery & profile report
  currentChartReading = chartReading;
  currentBirthData = {
    date: birthDate.value,
    time: birthTime.value,
    locationName: birthData.locationName || birthLocation.value,
    name: birthData.name || '',
    gender: birthData.gender || 'female'
  };

  // Show discovery trigger for next time
  const trigger = document.getElementById('discoveryTrigger');
  if (trigger) trigger.style.display = 'block';

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Render each section
  renderChartMeta(chartReading, birthData);
  renderDualWheel(chartReading);
  renderAngles(chartReading);
  renderPlanets(chartReading);
  renderAspects(chartReading);
  renderClusters(chartReading);
  renderRulership(chartReading);
  renderGuidance(chartReading);
  renderYearlyForecast(chartReading);
  setupLenses(chartReading);
  setupChat(chartReading);
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderChartMeta(chartReading, birthData) {
  const { chart, interpretations } = chartReading;

  // Use Earth Arc Identity (True Placement) if available
  const sunInterp = interpretations.planets.sun;
  const moonInterp = interpretations.planets.moon;

  console.log('DEBUG: Sun Identity', {
    trueIdentity: sunInterp.house.trueIdentity,
    house: sunInterp.house.number,
    naturalSign: sunInterp.house.naturalSign
  });

  const sunDisplay = sunInterp.house.trueIdentity || capitalize(chart.planets.sun.sign);
  const moonDisplay = moonInterp.house.trueIdentity || capitalize(chart.planets.moon.sign);
  const rising = chart.angles.ascendant.sign;

  chartMeta.innerHTML = `
    <div class="meta-item">
      <div class="meta-symbol">☉</div>
      <div class="meta-label">Sun (True Identity)</div>
      <div class="meta-value">
        ${sunDisplay}
        ${sunInterp.house.trueIdentity ? `<div style="font-size: 0.7em; opacity: 0.7;">(Zodiac: ${capitalize(chart.planets.sun.sign)})</div>` : ''}
      </div>
    </div>
    <div class="meta-item">
      <div class="meta-symbol">☽</div>
      <div class="meta-label">Moon (True Needs)</div>
      <div class="meta-value">
        ${moonDisplay}
        ${moonInterp.house.trueIdentity ? `<div style="font-size: 0.7em; opacity: 0.7;">(Zodiac: ${capitalize(chart.planets.moon.sign)})</div>` : ''}
      </div>
    </div>
    <div class="meta-item">
      <div class="meta-symbol">${SIGN_SYMBOLS[rising]}</div>
      <div class="meta-label">Rising Sign</div>
      <div class="meta-value">${capitalize(rising)}</div>
    </div>
    <div class="meta-item">
      <div class="meta-symbol">📍</div>
      <div class="meta-label">Birth Location</div>
      <div class="meta-value" style="font-size: 0.9rem;">${birthData.locationName}</div>
    </div>
    <div class="meta-item">
      <div class="meta-symbol">📅</div>
      <div class="meta-label">Birth Date/Time</div>
      <div class="meta-value" style="font-size: 0.9rem;">${formatDate(birthData.date)}</div>
    </div>
  `;
}

function renderDualWheel(chartReading) {
  const canvas = document.getElementById('chartWheel');
  const ctx = canvas.getContext('2d');

  const { chart } = chartReading;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Colors
  const outerColor = 'rgba(192, 132, 252, 0.3)';
  const innerColor = 'rgba(96, 165, 250, 0.3)';
  const lineColor = 'rgba(255, 255, 255, 0.2)';
  const textColor = '#f8fafc';
  const goldColor = '#fbbf24';

  // Radii
  const outerRadius = 280;
  const signRingInner = 220;
  const innerRadius = 180;
  const houseRingInner = 120;
  const centerRadius = 40;

  // Ascendant offset (rotate chart so 0° of ASCENDANT SIGN is on the left)
  // Whole Sign System: The cusp of the 1st house is 0° of the Rising Sign
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

  const ascSignIndex = signs.indexOf(chart.angles.ascendant.sign);
  const ascSignStartDegree = ascSignIndex * 30;

  // Rotate so ascSignStartDegree is at PI (180° / Left / 9 o'clock)
  // angle = degrees - offset
  // PI = ascSignStartDegree * (PI/180) - offset
  // offset = ascSignStartDegree * (PI/180) - PI
  const offsetAngle = (ascSignStartDegree * Math.PI / 180) - Math.PI;

  // Draw outer ring (Signs - the Universal Membrane)
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.fillStyle = outerColor;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, signRingInner, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(10, 10, 26, 0.8)';
  ctx.fill();

  // Draw sign divisions
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;

  for (let i = 0; i < 12; i++) {
    const angle = (i * 30) * Math.PI / 180 - offsetAngle;
    ctx.beginPath();
    ctx.moveTo(
      centerX + Math.cos(angle) * signRingInner,
      centerY - Math.sin(angle) * signRingInner
    );
    ctx.lineTo(
      centerX + Math.cos(angle) * outerRadius,
      centerY - Math.sin(angle) * outerRadius
    );
    ctx.stroke();
  }

  // Draw sign symbols
  // signs array is already defined above

  ctx.font = '24px Arial';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < 12; i++) {
    const angle = ((i * 30) + 15) * Math.PI / 180 - offsetAngle;
    const r = (outerRadius + signRingInner) / 2;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY - Math.sin(angle) * r;
    ctx.fillText(SIGN_SYMBOLS[signs[i]], x, y);
  }

  // Draw inner ring (Houses - Earth's Rotation)
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
  ctx.fillStyle = innerColor;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, houseRingInner, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(10, 10, 26, 0.9)';
  ctx.fill();

  // Draw house divisions (Whole Sign)
  // House cusps start at PI (9 o'clock / ASC position) and go counterclockwise (downward)
  // In canvas: adding angle goes counterclockwise visually (downward from left)
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.5)';
  ctx.lineWidth = 2;

  for (let i = 0; i < 12; i++) {
    // Start from PI (left/9 o'clock) and add angles to go counterclockwise (downward)
    const angle = Math.PI + (i * 30) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(
      centerX + Math.cos(angle) * houseRingInner,
      centerY - Math.sin(angle) * houseRingInner
    );
    ctx.lineTo(
      centerX + Math.cos(angle) * innerRadius,
      centerY - Math.sin(angle) * innerRadius
    );
    ctx.stroke();
  }

  // Draw house numbers
  // In Whole Sign Houses, House 1 is the entire sign containing the ASC
  // Houses go counterclockwise: 1 at 9 o'clock, 2 below it (at ~8 o'clock), etc.
  // Position house numbers CLOSE to center (near the Earth circle) for pie-slice look
  ctx.font = 'bold 16px Inter';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';

  for (let houseNum = 1; houseNum <= 12; houseNum++) {
    // Each house is 30 degrees, starting from PI (left side / 9 o'clock)
    // Add 15 degrees to center the number in its 30-degree segment
    // Add angle to go counterclockwise (downward from 9 o'clock)
    const angle = Math.PI + ((houseNum - 1) * 30 + 15) * Math.PI / 180;
    // Place house numbers close to the center radius (just outside the Earth circle)
    const r = centerRadius + 25;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY - Math.sin(angle) * r;
    ctx.fillText(houseNum.toString(), x, y);
  }

  // Draw center (Earth)
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerRadius);
  gradient.addColorStop(0, 'rgba(45, 212, 191, 0.8)');
  gradient.addColorStop(1, 'rgba(45, 212, 191, 0.2)');

  ctx.beginPath();
  ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.font = '24px Arial';
  ctx.fillStyle = textColor;
  ctx.fillText('⊕', centerX, centerY);

  // Draw planets (including Chiron and Lilith)
  const planetRadius = (signRingInner + innerRadius) / 2 - 10;

  // Define all planets to draw (including Chiron, meanLilith, trueLilith)
  const allPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'meanLilith', 'trueLilith'];

  for (const name of allPlanets) {
    const data = chart.planets[name];
    if (!data) continue; // Skip if planet data doesn't exist

    const angle = data.longitude * Math.PI / 180 - offsetAngle;
    const x = centerX + Math.cos(angle) * planetRadius;
    const y = centerY - Math.sin(angle) * planetRadius;

    // Planet glow
    const planetGradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
    planetGradient.addColorStop(0, 'rgba(251, 191, 36, 0.3)');
    planetGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = planetGradient;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Planet symbol
    ctx.font = '18px Arial';
    ctx.fillStyle = goldColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const symbol = PLANET_SYMBOLS[name] || '?';
    ctx.fillText(symbol, x, y - 6);

    // Degree and arc minute label (below symbol)
    ctx.font = '9px Inter';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const degLabel = `${data.degrees}°${data.minutes.toString().padStart(2, '0')}'`;
    ctx.fillText(degLabel, x, y + 10);

    // Retrograde marker
    if (data.motionState === 'retrograde') {
      ctx.font = '9px Arial';
      ctx.fillStyle = '#ef4444';
      ctx.fillText('℞', x + 14, y - 10);
    }
  }

  // Draw ASC/MC markers
  ctx.font = 'bold 12px Inter';
  ctx.fillStyle = goldColor;

  // ASC marker
  const ascAngle = chart.angles.ascendant.longitude * Math.PI / 180 - offsetAngle;
  ctx.fillText('ASC', centerX + Math.cos(ascAngle) * (outerRadius + 15), centerY - Math.sin(ascAngle) * (outerRadius + 15));

  // MC marker
  const mcAngle = chart.angles.midheaven.longitude * Math.PI / 180 - offsetAngle;
  ctx.fillText('MC', centerX + Math.cos(mcAngle) * (outerRadius + 15), centerY - Math.sin(mcAngle) * (outerRadius + 15));

  // Draw aspect lines (major aspects only, simplified)
  const aspectColors = {
    conjunction: 'rgba(251, 191, 36, 0.4)',
    opposition: 'rgba(239, 68, 68, 0.4)',
    square: 'rgba(249, 115, 22, 0.4)',
    trine: 'rgba(34, 197, 94, 0.4)',
    sextile: 'rgba(96, 165, 250, 0.3)'
  };

  ctx.lineWidth = 1;
  for (const aspect of chartReading.aspects.slice(0, 15)) {
    if (aspectColors[aspect.type]) {
      const p1 = chart.planets[aspect.planetOne.name];
      const p2 = chart.planets[aspect.planetTwo.name];

      const angle1 = p1.longitude * Math.PI / 180 - offsetAngle;
      const angle2 = p2.longitude * Math.PI / 180 - offsetAngle;

      const x1 = centerX + Math.cos(angle1) * (houseRingInner - 10);
      const y1 = centerY - Math.sin(angle1) * (houseRingInner - 10);
      const x2 = centerX + Math.cos(angle2) * (houseRingInner - 10);
      const y2 = centerY - Math.sin(angle2) * (houseRingInner - 10);

      ctx.strokeStyle = aspectColors[aspect.type];
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
}

function renderAngles(chartReading) {
  const { interpretations } = chartReading;
  const angles = interpretations.angles;

  const angleData = [
    { key: 'ascendant', icon: '↑', name: 'Ascendant' },
    { key: 'midheaven', icon: '☆', name: 'Midheaven' },
    { key: 'descendant', icon: '↓', name: 'Descendant' },
    { key: 'ic', icon: '⌂', name: 'IC' }
  ];

  anglesGrid.innerHTML = angleData.map(a => {
    const angle = angles[a.key];
    return `
      <div class="angle-card">
        <div class="angle-header">
          <span class="angle-symbol">${a.icon}</span>
          <div>
            <div class="angle-name">${angle.name}</div>
            <div class="angle-sign">${SIGN_SYMBOLS[angle.sign.toLowerCase()]} ${angle.sign}</div>
          </div>
        </div>
        <div class="angle-degree">${angle.degree}</div>
        <div class="angle-meaning">${angle.interpretation}</div>
        
        ${angle.guidance ? `
        <div class="cosmic-advice-box">
          <div class="advice-header">✨ Cosmic Guidance</div>
          <div class="advice-content">${angle.guidance.replace(/\n/g, '<br>')}</div>
        </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function renderPlanets(chartReading) {
  const { chart, interpretations } = chartReading;

  const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'meanLilith', 'trueLilith'];

  planetsGrid.innerHTML = planetOrder.map(name => {
    const data = chart.planets[name];
    const interp = interpretations.planets[name];
    const tier = PLANET_TO_TIER[name];
    const houseInfo = HOUSE_THEMES[data.house];

    // Create beginner-friendly narrative
    const beginnerNarrative = generateBeginnerNarrative(name, data, interp, houseInfo);

    return `
      <div class="planet-card ${tier}">
        <div class="planet-header">
          <span class="planet-symbol">${PLANET_SYMBOLS[name]}</span>
          <div class="planet-info">
            <div class="planet-name">
                <span class="true-sign">${interp.house.naturalSign ? capitalize(interp.house.naturalSign) : ''} ${capitalize(name)}</span>
                ${interp.house.naturalSign ? `<span class="original-sign-sub">(Zodiac: ${capitalize(data.sign)})</span>` : ''}
            </div>
            <div class="planet-position">
              <span class="earth-arc-badge">Earth Arc</span> House ${data.house} • ${capitalize(data.sign)} ${data.degrees}°${data.minutes}'
            </div>
          </div>
          <span class="motion-badge ${data.motionState}">${data.motionState}</span>
        </div>
        
        <!-- Beginner-friendly explanation -->
        <div class="planet-beginner-box">
          <div class="beginner-question">❓ ${interp.planet.simpleQuestion || interp.planet.question}</div>
          <div class="beginner-answer">${beginnerNarrative}</div>
        </div>
        
        <div class="planet-details">
          <p class="planet-focus"><strong>🎯 Focus:</strong> ${interp.planet.focus}</p>
          <p class="planet-field"><strong>📍 Life Area:</strong> House ${data.house} - ${houseInfo.name}</p>
          <p class="planet-tone"><strong>🎨 Style:</strong> ${interp.sign.tone}</p>
          
          ${interp.guidance ? `
          <div class="cosmic-advice-box">
             <div class="advice-content">${interp.guidance.replace(/\n/g, '<br>')}</div>
          </div>
          ` : ''}

          ${interp.retrograde ? `
            <div class="retrograde-box">
              <p><strong>⏪ Retrograde Theme:</strong> ${interp.retrograde.theme}</p>
              <p class="retrograde-desc">${interp.retrograde.description}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Generate a beginner-friendly narrative for each planet placement
 */
function generateBeginnerNarrative(planetName, planetData, interp, houseInfo) {
  const signDescriptions = {
    aries: 'bold, direct, and action-oriented',
    taurus: 'steady, sensual, and value-driven',
    gemini: 'curious, adaptable, and communicative',
    cancer: 'nurturing, protective, and emotionally intuitive',
    leo: 'confident, creative, and warmly expressive',
    virgo: 'analytical, helpful, and detail-oriented',
    libra: 'balanced, diplomatic, and harmony-seeking',
    scorpio: 'intense, transformative, and deeply perceptive',
    sagittarius: 'adventurous, philosophical, and freedom-loving',
    capricorn: 'ambitious, disciplined, and goal-oriented',
    aquarius: 'innovative, independent, and humanitarian',
    pisces: 'intuitive, compassionate, and imaginatively flowing'
  };

  const signStyle = signDescriptions[planetData.sign] || 'unique';
  const houseMeaning = houseInfo.beginnerExplanation || `the area of ${houseInfo.name.toLowerCase()}`;

  const planetNarratives = {
    sun: `Your core self expresses in a ${signStyle} way. You shine brightest when embracing ${capitalize(planetData.sign)} energy in ${houseInfo.beginnerExplanation.split(' - ')[0].replace('This is ', '').replace('your ', '')} matters. This is WHO YOU ARE at your foundation.`,

    moon: `Your emotional needs are ${signStyle}. You feel most secure when ${houseInfo.name.toLowerCase()} matters are stable. Your inner emotional world processes feelings through a ${capitalize(planetData.sign)} lens.`,

    mercury: `Your mind works in a ${signStyle} manner. You think, learn, and communicate best when applying these qualities to ${houseInfo.name.toLowerCase()} topics. People experience your communication style as ${capitalize(planetData.sign)}-like.`,

    venus: `In love and beauty, you're ${signStyle}. You attract through ${capitalize(planetData.sign)} qualities and express affection most naturally in ${houseInfo.name.toLowerCase()} contexts. Your values and aesthetic sense reflect this combination.`,

    mars: `You take action in a ${signStyle} manner. Your drive, ambition, and how you fight for what you want shows up most in ${houseInfo.name.toLowerCase()} matters. This is how you pursue goals and handle conflict.`,

    jupiter: `Your luck and growth opportunities come through being ${signStyle}. You find meaning and expansion in ${houseInfo.name.toLowerCase()} areas. Fortune tends to smile when you embrace ${capitalize(planetData.sign)} energy here.`,

    saturn: `Your major life lessons involve being ${signStyle} in ${houseInfo.name.toLowerCase()} matters. This area requires discipline and patience, but offers lasting achievement when you put in the work.`,

    uranus: `You're unconventional and unique in a ${signStyle} way, especially in ${houseInfo.name.toLowerCase()}. You may experience sudden insights or shake things up in this life area.`,

    neptune: `Your spiritual and imaginative side expresses through ${signStyle} qualities in ${houseInfo.name.toLowerCase()}. Dreams, intuition, and creativity flow through this combination.`,

    pluto: `Deep transformation happens for you in a ${signStyle} manner, especially regarding ${houseInfo.name.toLowerCase()}. This is where you experience power, letting go, and rebirth.`
  };

  return planetNarratives[planetName] || `Your ${planetName} expresses ${signStyle} in ${houseInfo.name.toLowerCase()} matters.`;
}

function renderAspects(chartReading) {
  const { aspects } = chartReading;

  if (aspects.length === 0) {
    aspectsContainer.innerHTML = '<p>No major aspects found</p>';
    return;
  }

  aspectsContainer.innerHTML = aspects.map(aspect => `
    <div class="aspect-card ${aspect.type}">
      <div class="aspect-header">
        <span class="aspect-planets">
          ${PLANET_SYMBOLS[aspect.planetOne.name]} ${capitalize(aspect.planetOne.name)} 
          ${aspect.symbol} 
          ${PLANET_SYMBOLS[aspect.planetTwo.name]} ${capitalize(aspect.planetTwo.name)}
        </span>
        <span class="aspect-type ${aspect.type}">${aspect.keyword}</span>
        <span class="aspect-phase">${capitalize(aspect.phase)}</span>
        <span class="aspect-orb">Orb: ${aspect.orb}°</span>
      </div>
      <div class="aspect-body">
        <div class="aspect-row">
          <div class="aspect-label perception">👁 Perception (What you feel)</div>
          <div class="aspect-text">${aspect.perception}</div>
        </div>
        <div class="aspect-row">
          <div class="aspect-label reality">✦ Reality (What's actually happening)</div>
          <div class="aspect-text">${aspect.reality}</div>
        </div>
        <div class="aspect-row">
          <div class="aspect-label resolution">⚗ Resolution (How to alchemize)</div>
          <div class="aspect-text">${aspect.resolution}</div>
        </div>
        <div class="aspect-support">
          <strong>Support Structure:</strong> ${aspect.support}
        </div>
        ${aspect.richData ? `
          <div class="rich-aspect-data">
            <div class="rich-title">✨ ${aspect.richData.title}</div>
            <div class="rich-desc">${aspect.richData.description}</div>
            <div class="rich-manifestation"><strong>🚀 Manifestation:</strong> ${aspect.richData.manifestation}</div>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function renderClusters(chartReading) {
  const { clusters } = chartReading;

  if (!clusters || clusters.length === 0) {
    clustersSection.style.display = 'none';
    return;
  }

  clustersSection.style.display = 'block';

  clustersContainer.innerHTML = clusters.map(cluster => `
    <div class="cluster-card ${cluster.type}">
      <div class="cluster-type">
        ${cluster.type === 'stellium' ? '✨' : '🌟'} ${capitalize(cluster.type)} in ${capitalize(cluster.sign)}
      </div>
      <div class="cluster-description">${cluster.description}</div>
    </div>
  `).join('');
}

function renderRulership(chartReading) {
  const { interpretations } = chartReading;
  const chains = interpretations.rulershipChains;

  rulershipContainer.innerHTML = Object.entries(chains).map(([house, chain]) => {
    if (!chain) return '';

    let layersHtml = '';
    if (chain.nextLayer) {
      layersHtml = `
        <div class="rulership-layers">
          <div class="layer-item">
            <strong>Layer 2:</strong> ${chain.nextLayer.interpretation}
          </div>
          ${chain.nextLayer.nextLayer ? `
            <div class="layer-item">
              <strong>Layer 3:</strong> ${chain.nextLayer.nextLayer.interpretation}
            </div>
          ` : ''}
        </div>
      `;
    }

    return `
      <div class="rulership-chain">
        <div class="rulership-house">House ${house}: ${HOUSE_THEMES[house]?.name || ''}</div>
        <div class="rulership-flow">${chain.interpretation}</div>
        <div class="rulership-meaning">${chain.meaning}</div>
        ${layersHtml}
      </div>
    `;
  }).join('');
}

function renderGuidance(chartReading) {
  const { guidance } = chartReading;

  // Set up tab switching
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      showGuidanceTab(tab.dataset.tab, guidance);
    });
  });

  // Show first tab
  showGuidanceTab('strengths', guidance);
}

function showGuidanceTab(tabName, guidance) {
  let html = '';

  switch (tabName) {
    case 'strengths':
      if (guidance.strengths.length === 0) {
        html = '<p class="guidance-text">No major harmonious aspects found.</p>';
      } else {
        html = guidance.strengths.map(item => `
          <div class="guidance-item">
            <div class="guidance-title">${item.aspect}</div>
            <div class="guidance-text">${item.description}</div>
            <div class="guidance-advice">
              <div class="guidance-advice-label">How to use this gift</div>
              <div class="guidance-text">${item.advice}</div>
            </div>
          </div>
        `).join('');
      }
      break;

    case 'challenges':
      if (guidance.challenges.length === 0) {
        html = '<p class="guidance-text">No major challenging aspects found.</p>';
      } else {
        html = guidance.challenges.map(item => `
          <div class="guidance-item">
            <div class="guidance-title">${item.aspect}</div>
            <div class="guidance-text"><strong>Perception:</strong> ${item.perception}</div>
            <div class="guidance-text"><strong>Reality:</strong> ${item.reality}</div>
            <div class="guidance-advice">
              <div class="guidance-advice-label">Resolution Path</div>
              <div class="guidance-text">${item.resolution}</div>
            </div>
          </div>
        `).join('');
      }
      break;

    case 'themes':
      if (guidance.themes.length === 0) {
        html = '<p class="guidance-text">No special life themes identified.</p>';
      } else {
        html = guidance.themes.map(item => `
          <div class="guidance-item">
            <div class="guidance-title">${item.theme}</div>
            <div class="guidance-text">${item.description}</div>
            <div class="guidance-text"><strong>Gift:</strong> ${item.gift}</div>
            <div class="guidance-text"><strong>Challenge:</strong> ${item.challenge}</div>
          </div>
        `).join('');
      }
      break;

    case 'actions':
      if (guidance.actions.length === 0) {
        html = '<p class="guidance-text">No specific action items at this time.</p>';
      } else {
        html = guidance.actions.map(item => `
          <div class="guidance-item">
            <div class="guidance-title">Focus: ${item.focus}</div>
            <div class="guidance-advice">
              <div class="guidance-advice-label">Recommended Action</div>
              <div class="guidance-text">${item.action}</div>
            </div>
          </div>
        `).join('');
      }
      break;
  }

  guidanceContent.innerHTML = html;
}

// ============================================
// NEW READING HANDLER
// ============================================
newReadingBtn.addEventListener('click', () => {
  resultsSection.style.display = 'none';
  inputSection.style.display = 'block';
  generateBtn.style.display = 'flex';
  birthDataForm.reset();
  locationCoords.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// YEARLY FORECAST RENDERING
// ============================================

// DOM elements for yearly forecast
const yearlyOverview = document.getElementById('yearlyOverview');
const yearlyContent = document.getElementById('yearlyContent');
const transitDateInput = document.getElementById('transitDate');
const viewTransitsBtn = document.getElementById('viewTransitsBtn');
const viewTodayBtn = document.getElementById('viewTodayBtn');
const currentViewDateDisplay = document.getElementById('currentViewDate');

// Store yearly forecast data globally for tab switching
let currentYearlyForecast = null;
let currentChartReading = null;
let currentViewingDate = new Date();

// Initialize transit date to today
if (transitDateInput) {
  transitDateInput.value = new Date().toISOString().split('T')[0];
}

// View transits button handler
if (viewTransitsBtn) {
  viewTransitsBtn.addEventListener('click', () => {
    if (!currentChartReading) return;

    const selectedDate = new Date(transitDateInput.value + 'T12:00:00');
    currentViewingDate = selectedDate;

    // Update display
    const dateStr = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    currentViewDateDisplay.textContent = dateStr;

    // Re-render with new date
    renderYearlyForecast(currentChartReading, selectedDate);
  });
}

// Back to today button handler
if (viewTodayBtn) {
  viewTodayBtn.addEventListener('click', () => {
    if (!currentChartReading) return;

    currentViewingDate = new Date();
    transitDateInput.value = currentViewingDate.toISOString().split('T')[0];
    currentViewDateDisplay.textContent = 'Today';

    // Re-render with today's date
    renderYearlyForecast(currentChartReading, new Date());
  });
}

// Initialize yearly tab handlers
document.querySelectorAll('.yearly-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.yearly-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (currentYearlyForecast) {
      renderYearlyTabContent(btn.dataset.yearlyTab, currentYearlyForecast);
    }
  });
});

function renderYearlyForecast(chartReading, viewDate = new Date()) {
  const { chart } = chartReading;
  currentChartReading = chartReading;
  currentViewingDate = viewDate;

  // Generate the yearly forecast data for the selected date
  const forecast = generateYearlyForecastData(chart, viewDate);
  currentYearlyForecast = forecast;

  // Render overview
  renderYearlyOverview(forecast, chart, viewDate);

  // Render initial tab content (themes)
  renderYearlyTabContent('themes', forecast);
}

function generateYearlyForecastData(chart, viewDate) {
  // Generate comprehensive forecast based on natal chart and selected date
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const day = viewDate.getDate();

  const forecast = {
    viewDate: viewDate,
    year: year,
    dateLabel: viewDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    overallTheme: '',
    primaryFocus: [],
    challengingPeriods: [],
    opportunityPeriods: [],
    monthlyHighlights: [],
    personalGrowthAreas: [],
    navigationGuidance: []
  };

  // Generate overall theme
  forecast.overallTheme = generateOverallTheme(chart, viewDate);

  // Generate primary focus areas
  forecast.primaryFocus = generatePrimaryFocus(chart);

  // Generate challenging periods
  forecast.challengingPeriods = generateChallengingPeriods(chart);

  // Generate opportunity periods
  forecast.opportunityPeriods = generateOpportunityPeriods(chart);

  // Generate monthly highlights
  forecast.monthlyHighlights = generateMonthlyHighlights(chart);

  // Generate growth areas
  forecast.personalGrowthAreas = generateGrowthAreas(chart);

  // Generate navigation guidance
  forecast.navigationGuidance = generateNavGuidance(chart, forecast);

  return forecast;
}

function generateOverallTheme(chart, viewDate = new Date()) {
  const sunSign = chart.planets.sun.sign;
  const sunHouse = chart.planets.sun.house;
  const moonSign = chart.planets.moon.sign;
  const moonHouse = chart.planets.moon.house;
  const ascSign = chart.angles.ascendant.sign;
  const mcSign = chart.angles.midheaven.sign;

  const today = new Date();
  const isPast = viewDate < today && (today - viewDate) > 86400000; // More than 1 day ago
  const isFuture = viewDate > today && (viewDate - today) > 86400000; // More than 1 day ahead
  const isToday = !isPast && !isFuture;

  let timeContext = '';
  if (isPast) {
    const daysAgo = Math.floor((today - viewDate) / 86400000);
    if (daysAgo > 365) {
      const yearsAgo = Math.floor(daysAgo / 365);
      timeContext = `Looking back ${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago, `;
    } else if (daysAgo > 30) {
      const monthsAgo = Math.floor(daysAgo / 30);
      timeContext = `Looking back ${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago, `;
    } else {
      timeContext = `Looking back ${daysAgo} day${daysAgo > 1 ? 's' : ''} ago, `;
    }
  } else if (isFuture) {
    const daysAhead = Math.floor((viewDate - today) / 86400000);
    if (daysAhead > 365) {
      const yearsAhead = Math.floor(daysAhead / 365);
      timeContext = `Looking ahead ${yearsAhead} year${yearsAhead > 1 ? 's' : ''}, `;
    } else if (daysAhead > 30) {
      const monthsAhead = Math.floor(daysAhead / 30);
      timeContext = `Looking ahead ${monthsAhead} month${monthsAhead > 1 ? 's' : ''}, `;
    } else {
      timeContext = `Looking ahead ${daysAhead} day${daysAhead > 1 ? 's' : ''}, `;
    }
  }

  return `${timeContext}As a ${capitalize(sunSign)} with ${capitalize(ascSign)} Rising, your focus ${isPast ? 'was' : 'is'} on ${HOUSE_THEMES[sunHouse]?.name?.toLowerCase() || 'house ' + sunHouse} matters. Your Sun in House ${sunHouse} illuminates this life area with your core ${capitalize(sunSign)} energy.

Your emotional center (Moon in ${capitalize(moonSign)}, House ${moonHouse}) needs ${HOUSE_THEMES[moonHouse]?.name?.toLowerCase() || 'stability'} to feel secure.

Career-wise, your Midheaven in ${capitalize(mcSign)} calls you to embody those qualities in your public life and professional reputation.

${isToday ? 'Today' : (isPast ? 'During this time' : 'Going forward')}, focus on integrating these energies: Express your authentic ${capitalize(sunSign)} self through ${HOUSE_THEMES[sunHouse]?.name || 'your focus area'}, while nurturing your emotional needs.`;
}

function generatePrimaryFocus(chart) {
  const focus = [];
  const sunHouse = chart.planets.sun.house;
  const moonHouse = chart.planets.moon.house;
  const mcSign = chart.angles.midheaven.sign;

  // Sun focus
  focus.push({
    area: HOUSE_THEMES[sunHouse]?.name || `House ${sunHouse}`,
    icon: '☉',
    reason: 'Your Sun placement - where your core identity expresses',
    theme: `This is your main stage this year. Your ${capitalize(chart.planets.sun.sign)} energy shines brightest through ${HOUSE_THEMES[sunHouse]?.name?.toLowerCase() || 'this area'}.`,
    action: HOUSE_THEMES[sunHouse]?.keywords?.slice(0, 3).join(', ') || 'Focus your energy here'
  });

  // Moon focus
  focus.push({
    area: HOUSE_THEMES[moonHouse]?.name || `House ${moonHouse}`,
    icon: '☽',
    reason: 'Your Moon placement - your emotional security needs',
    theme: `Emotionally, you need stability in ${HOUSE_THEMES[moonHouse]?.name?.toLowerCase() || 'this area'}. Your ${capitalize(chart.planets.moon.sign)} Moon craves security here.`,
    action: `Honor your emotional needs around ${HOUSE_THEMES[moonHouse]?.name?.toLowerCase() || 'this area'}`
  });

  // MC focus
  focus.push({
    area: 'Career & Life Direction',
    icon: 'MC',
    reason: 'Your Midheaven - your public purpose',
    theme: `Your public life direction is expressed through ${capitalize(mcSign)} energy. This is what you're becoming known for.`,
    action: `Embody ${capitalize(mcSign)} qualities in your career`
  });

  return focus;
}

function generateChallengingPeriods(chart) {
  const challenges = [];

  // Saturn challenges
  const saturn = chart.planets.saturn;
  challenges.push({
    planet: 'Saturn',
    icon: '♄',
    house: saturn.house,
    sign: saturn.sign,
    title: 'Your Saturn Life Lesson',
    description: `Saturn in House ${saturn.house} (${capitalize(saturn.sign)}) represents your major life lessons around ${HOUSE_THEMES[saturn.house]?.name?.toLowerCase() || 'this area'}. This is where you must work HARD and be PATIENT.`,
    challenge: HOUSE_THEMES[saturn.house]?.keywords?.slice(0, 2).join(', ') || 'discipline and patience',
    navigation: `Saturn demands discipline here. The foundation you build now lasts a lifetime. Don't avoid the work - face responsibilities head-on.`,
    mantra: `"I embrace the discipline required in ${HOUSE_THEMES[saturn.house]?.name?.toLowerCase() || 'this area'}. My efforts build lasting foundations."`
  });

  // Pluto challenges
  const pluto = chart.planets.pluto;
  challenges.push({
    planet: 'Pluto',
    icon: '♇',
    house: pluto.house,
    sign: pluto.sign,
    title: 'Your Transformation Zone',
    description: `Pluto in House ${pluto.house} (${capitalize(pluto.sign)}) marks where you experience deep transformation throughout life. This is where the old must die for the new to be born.`,
    challenge: 'power dynamics, letting go, transformation',
    navigation: `This area demands complete honesty and willingness to let old patterns die. Resistance only prolongs the transformation. Surrender and allow rebirth.`,
    mantra: `"I release what no longer serves me. Through transformation in ${HOUSE_THEMES[pluto.house]?.name?.toLowerCase() || 'this area'}, I become more powerful."`
  });

  // Retrograde planet challenges
  Object.entries(chart.planets).forEach(([name, data]) => {
    if (data.motionState === 'retrograde' && !['moon', 'sun'].includes(name)) {
      challenges.push({
        planet: `${capitalize(name)} Retrograde`,
        icon: PLANET_SYMBOLS[name] || '℞',
        house: data.house,
        sign: data.sign,
        title: `Internalized ${capitalize(name)} Energy`,
        description: `Your ${capitalize(name)} is retrograde - its energy is internalized. You process this planet's themes internally rather than expressing them outwardly.`,
        challenge: getRetrogradeChallenge(name),
        navigation: getRetrogradeNavigation(name),
        mantra: getRetrogradeMantra(name)
      });
    }
  });

  return challenges;
}

function generateOpportunityPeriods(chart) {
  const opportunities = [];

  // Jupiter opportunities
  const jupiter = chart.planets.jupiter;
  opportunities.push({
    planet: 'Jupiter',
    icon: '♃',
    house: jupiter.house,
    sign: jupiter.sign,
    title: 'Your Natural Luck Zone',
    description: `Jupiter in House ${jupiter.house} (${capitalize(jupiter.sign)}) is where luck, growth, and abundance naturally flow for you.`,
    opportunity: HOUSE_THEMES[jupiter.house]?.keywords?.slice(0, 3).join(', ') || 'expansion and growth',
    howToActivate: `Expand in ${HOUSE_THEMES[jupiter.house]?.name?.toLowerCase() || 'this area'}. Learn, grow, and be optimistic. Luck favors you here!`,
    mantra: `"I am naturally lucky in ${HOUSE_THEMES[jupiter.house]?.name?.toLowerCase() || 'this area'}. I expand with confidence."`
  });

  // Venus opportunities
  const venus = chart.planets.venus;
  opportunities.push({
    planet: 'Venus',
    icon: '♀',
    house: venus.house,
    sign: venus.sign,
    title: 'Your Love & Abundance Zone',
    description: `Venus in House ${venus.house} (${capitalize(venus.sign)}) brings love, beauty, and money opportunities.`,
    opportunity: `Attract through ${capitalize(venus.sign)} qualities. Express beauty and values in ${HOUSE_THEMES[venus.house]?.name?.toLowerCase() || 'this area'}.`,
    howToActivate: `Be receptive to love and abundance here. Your values attract what you need.`,
    mantra: `"I attract love and abundance through my authentic ${capitalize(venus.sign)} nature."`
  });

  return opportunities;
}

function generateMonthlyHighlights(chart) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const sunSigns = [
    'capricorn', 'aquarius', 'pisces', 'aries', 'taurus', 'gemini',
    'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius'
  ];

  return months.map((month, index) => {
    const transitSign = sunSigns[index];

    // Find which house this sign rules in their chart
    let activatedHouse = 1;
    if (chart.houses) {
      Object.entries(chart.houses).forEach(([houseNum, houseData]) => {
        if (houseData.sign === transitSign) {
          activatedHouse = parseInt(houseNum);
        }
      });
    }

    return {
      month,
      sunTransitSign: capitalize(transitSign),
      activatedHouse,
      focusArea: HOUSE_THEMES[activatedHouse]?.name || `House ${activatedHouse}`,
      theme: `The Sun illuminates your House ${activatedHouse} (${HOUSE_THEMES[activatedHouse]?.name || 'this area'}). Energy and focus on ${HOUSE_THEMES[activatedHouse]?.keywords?.slice(0, 3).join(', ') || 'related matters'}.`,
      action: `Focus on ${HOUSE_THEMES[activatedHouse]?.name?.toLowerCase() || 'this area'} matters`
    };
  });
}

function generateGrowthAreas(chart) {
  const growth = [];

  // Moon growth (emotional intelligence)
  const moon = chart.planets.moon;
  growth.push({
    area: 'Emotional Intelligence & Security',
    planet: 'Moon',
    icon: '☽',
    house: moon.house,
    sign: moon.sign,
    description: `Your Moon in ${capitalize(moon.sign)} (House ${moon.house}) shows what you need emotionally.`,
    growthPath: `Learn to honor and communicate your emotional needs without shame. Your ${capitalize(moon.sign)} Moon needs specific things to feel safe.`,
    advice: `When emotionally triggered, pause. Your Moon is speaking. Listen to what you truly need in ${HOUSE_THEMES[moon.house]?.name?.toLowerCase() || 'this area'}.`
  });

  // Saturn growth (discipline)
  const saturn = chart.planets.saturn;
  growth.push({
    area: 'Developing Mastery & Discipline',
    planet: 'Saturn',
    icon: '♄',
    house: saturn.house,
    sign: saturn.sign,
    description: `Saturn calls you to master ${HOUSE_THEMES[saturn.house]?.name?.toLowerCase() || 'this area of life'}.`,
    growthPath: `This area requires patience, discipline, and consistent effort. There are no shortcuts. But what you build here LASTS.`,
    advice: `The work you do in ${HOUSE_THEMES[saturn.house]?.name?.toLowerCase() || 'this area'} creates LASTING results. Stay committed even when it's hard.`
  });

  // Chiron growth (healing wound) - if available
  if (chart.planets.chiron) {
    const chiron = chart.planets.chiron;
    growth.push({
      area: 'Healing Your Core Wound',
      planet: 'Chiron',
      icon: '⚷',
      house: chiron.house,
      sign: chiron.sign,
      description: `Chiron in House ${chiron.house} represents a core wound in ${HOUSE_THEMES[chiron.house]?.name?.toLowerCase() || 'this area'}.`,
      growthPath: `Your healing journey involves transforming this wound into wisdom you can share with others. The wound becomes your greatest gift.`,
      advice: `Don't avoid ${HOUSE_THEMES[chiron.house]?.name?.toLowerCase() || 'this area'} - lean into the healing. What hurts you most can become your greatest strength.`
    });
  }

  return growth;
}

function generateNavGuidance(chart, forecast) {
  const guidance = [];

  // Core approach based on Sun sign
  const sunSign = chart.planets.sun.sign;
  guidance.push({
    category: 'Your Core Approach',
    title: `How to Navigate Life as a ${capitalize(sunSign)}`,
    text: getSignNavigation(sunSign)
  });

  // Challenge navigation
  if (forecast.challengingPeriods.length > 0) {
    const challengeAreas = forecast.challengingPeriods.map(c => c.title).join(', ');
    guidance.push({
      category: 'When Things Get Difficult',
      title: 'Navigating Your Challenging Areas',
      text: `Your chart shows challenges in: ${challengeAreas}.

**The Key to Navigating Challenges:**
1. **Don't resist** - Resistance creates suffering. Accept what IS.
2. **Ask "What is this teaching me?"** - Every challenge carries a lesson.
3. **Use higher vibrations** - Each planet has higher expressions. Choose them.
4. **Take action** - Especially with squares, ACTION is required. Do something.
5. **Be patient** - Growth takes time. You're doing better than you think.`
    });
  }

  // Opportunity activation
  if (forecast.opportunityPeriods.length > 0) {
    const opportunityAreas = forecast.opportunityPeriods.map(o => o.title).join(', ');
    guidance.push({
      category: 'Maximizing Opportunities',
      title: 'How to Activate Your Luck Zones',
      text: `Your chart shows natural opportunities: ${opportunityAreas}.

**How to Maximize These Gifts:**
1. **Show up** - Trines and sextiles only work if you TAKE ACTION.
2. **Don't take it for granted** - Natural talent requires development.
3. **Combine with effort** - Luck + Work = Success.
4. **Share your gifts** - What comes easy to you helps others.`
    });
  }

  return guidance;
}

// ============================================
// YEARLY TAB CONTENT RENDERERS
// ============================================

function renderYearlyOverview(forecast, chart, viewDate = new Date()) {
  const today = new Date();
  const isPast = viewDate < today && (today - viewDate) > 86400000;
  const isFuture = viewDate > today && (viewDate - today) > 86400000;

  let dateIcon = '📍';
  if (isPast) dateIcon = '⏮️';
  else if (isFuture) dateIcon = '⏭️';

  yearlyOverview.innerHTML = `
    <div class="yearly-overview-title">
      ${dateIcon} ${forecast.dateLabel || 'Your Life Energy'}
    </div>
    <div class="yearly-overview-text">${forecast.overallTheme}</div>
  `;
}

function renderYearlyTabContent(tab, forecast) {
  let html = '';

  switch (tab) {
    case 'themes':
      html = renderThemesTab(forecast);
      break;
    case 'challenges':
      html = renderChallengesTab(forecast);
      break;
    case 'opportunities':
      html = renderOpportunitiesTab(forecast);
      break;
    case 'growth':
      html = renderGrowthTab(forecast);
      break;
    case 'monthly':
      html = renderMonthlyTab(forecast);
      break;
    case 'navigation':
      html = renderNavigationTab(forecast);
      break;
  }

  yearlyContent.innerHTML = html;
}

function renderThemesTab(forecast) {
  if (forecast.primaryFocus.length === 0) {
    return '<p>No primary themes identified.</p>';
  }

  return forecast.primaryFocus.map(theme => `
    <div class="yearly-theme-card">
      <div class="yearly-theme-header">
        <div class="yearly-theme-icon">${theme.icon}</div>
        <div>
          <div class="yearly-theme-title">${theme.area}</div>
          <div class="yearly-theme-reason">${theme.reason}</div>
        </div>
      </div>
      <div class="yearly-theme-content">${theme.theme}</div>
      <div class="yearly-theme-action">
        <div class="yearly-theme-action-label">✨ Your Action</div>
        <div>${theme.action}</div>
      </div>
    </div>
  `).join('');
}

function renderChallengesTab(forecast) {
  if (forecast.challengingPeriods.length === 0) {
    return '<p>No major challenging periods identified.</p>';
  }

  return `
    <p style="margin-bottom: var(--space-lg); color: rgba(255,255,255,0.7);">
      <strong>Important:</strong> These aren't meant to scare you - they're areas where you're being asked to GROW. 
      The challenges below show where you'll develop the most strength and wisdom. Lean into them!
    </p>
    ${forecast.challengingPeriods.map(challenge => `
      <div class="yearly-challenge-card">
        <div class="yearly-challenge-header">
          <div class="yearly-challenge-icon">${challenge.icon}</div>
          <div class="yearly-challenge-title">${challenge.title}</div>
          <div class="yearly-challenge-badge">House ${challenge.house}</div>
        </div>
        <div class="yearly-challenge-description">${challenge.description}</div>
        <div class="yearly-challenge-navigation">
          <div class="yearly-challenge-navigation-label">🧭 How to Navigate This</div>
          <div>${challenge.navigation}</div>
        </div>
        <div class="yearly-challenge-mantra">
          <strong>Your Mantra:</strong><br>
          ${challenge.mantra}
        </div>
      </div>
    `).join('')}
  `;
}

function renderOpportunitiesTab(forecast) {
  if (forecast.opportunityPeriods.length === 0) {
    return '<p>No major opportunity periods identified.</p>';
  }

  return `
    <p style="margin-bottom: var(--space-lg); color: rgba(255,255,255,0.7);">
      <strong>These are your luck zones!</strong> The areas below show where fortune naturally favors you. 
      Remember: opportunities only work if you TAKE ACTION on them!
    </p>
    ${forecast.opportunityPeriods.map(opportunity => `
      <div class="yearly-opportunity-card">
        <div class="yearly-opportunity-header">
          <div class="yearly-opportunity-icon">${opportunity.icon}</div>
          <div class="yearly-opportunity-title">${opportunity.title}</div>
        </div>
        <div class="yearly-opportunity-description">${opportunity.description}</div>
        <div class="yearly-opportunity-activate">
          <div class="yearly-opportunity-activate-label">🔓 How to Activate</div>
          <div>${opportunity.howToActivate}</div>
        </div>
        <div class="yearly-opportunity-mantra">
          <strong>Your Affirmation:</strong><br>
          ${opportunity.mantra}
        </div>
      </div>
    `).join('')}
  `;
}

function renderGrowthTab(forecast) {
  if (forecast.personalGrowthAreas.length === 0) {
    return '<p>No growth areas identified.</p>';
  }

  return forecast.personalGrowthAreas.map(growth => `
    <div class="yearly-growth-card">
      <div class="yearly-growth-header">
        <div class="yearly-growth-icon">${growth.icon}</div>
        <div>
          <div class="yearly-growth-title">${growth.area}</div>
          <div class="yearly-growth-planet">${growth.planet} in ${capitalize(growth.sign)}, House ${growth.house}</div>
        </div>
      </div>
      <div class="yearly-growth-description">${growth.description}</div>
      <div class="yearly-growth-path">
        <div class="yearly-growth-path-label">🌱 Your Growth Path</div>
        <div>${growth.growthPath}</div>
      </div>
      <div class="yearly-growth-advice">${growth.advice}</div>
    </div>
  `).join('');
}

function renderMonthlyTab(forecast) {
  if (forecast.monthlyHighlights.length === 0) {
    return '<p>No monthly highlights available.</p>';
  }

  return `
    <p style="margin-bottom: var(--space-lg); color: rgba(255,255,255,0.7);">
      <strong>Month-by-Month Focus:</strong> As the Sun moves through the zodiac, it activates different houses in your chart.
      Here's where your energy naturally flows each month.
    </p>
    <div class="monthly-highlights-grid">
      ${forecast.monthlyHighlights.map(month => `
        <div class="monthly-card">
          <div class="monthly-card-header">
            <div class="monthly-card-month">${month.month}</div>
            <div class="monthly-card-sign">☉ ${month.sunTransitSign}</div>
          </div>
          <div class="monthly-card-focus">House ${month.activatedHouse}: ${month.focusArea}</div>
          <div class="monthly-card-theme">${month.theme}</div>
          <div class="monthly-card-action">→ ${month.action}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderNavigationTab(forecast) {
  if (forecast.navigationGuidance.length === 0) {
    return '<p>No navigation guidance available.</p>';
  }

  return forecast.navigationGuidance.map(guidance => `
    <div class="yearly-navigation-card">
      <div class="yearly-navigation-category">${guidance.category}</div>
      <div class="yearly-navigation-header">${guidance.title}</div>
      <div class="yearly-navigation-text">${guidance.text}</div>
    </div>
  `).join('');
}

// ============================================
// HELPER FUNCTIONS FOR YEARLY FORECAST
// ============================================

function getRetrogradeChallenge(planet) {
  const challenges = {
    mercury: 'You may feel a chronic sense of being unheard or misunderstood, leading to intense internal processing.',
    venus: 'Tendency to over-value others as a way to earn love, often at the expense of your own boundaries.',
    mars: 'Force is turned inward. You may compete aggressively with yourself while feeling stuck in inaction.',
    jupiter: 'A hidden optimism that can lead to ignoring external red flags or realistic boundaries.',
    saturn: 'A profound internal "Authority over Authority" that can feel like endless unworthiness.',
    uranus: `A drive to disrupt your own progress to ensure you aren't being controlled by others.`,
    neptune: `Emotional dissolution. You may use spirituality to bypass the pain of a disconnected reality.`,
    pluto: `Intense internal shifts that feel like a loss of control until you rise from the ashes.`
  };
  return challenges[planet] || 'Internalized survival protocols requiring compassionate inquiry.';
}

function getRetrogradeNavigation(planet) {
  const navigation = {
    mercury: 'Trust your non-linear mind. Your unique way of seeing is an adaptation, not a defect. Slow down and listen to your internal pulse.',
    venus: 'Practice radical self-love. You don\'t need to "earn" your right to exist or be loved. Set boundaries to protect your authentic value.',
    mars: 'Find healthy physical outlets for your internal drive. Move from self-competition back to intentional, centered action.',
    jupiter: 'Look at the external patterns objectively. Your internal vision is valid, but it must be grounded in the material world.',
    saturn: 'You ARE your own final authority. Stop seeking permission from ghosts of the past. Your standard is the only one that matters.',
    uranus: 'Embrace your internal rebel. You are here to change the world by being authentically YOU, even when it feels unsafe.',
    neptune: 'Ground yourself in the physical. Your compassion is a gift, but it must be applied to your own life first.',
    pluto: 'Accept the teardowns as a necessary part of your evolution. You are a phoenix; trust the rising that follows the fire.'
  };
  return navigation[planet] || 'Work consciously with your internal blueprints.';
}

function getRetrogradeMantra(planet) {
  const mantras = {
    mercury: '"My non-linear mind is my power, and I am worthy of being heard."',
    venus: '"I am valuable simply because I exist. My love does not have to be earned."',
    mars: '"I direct my force toward my own growth with compassion and precision."',
    jupiter: '"I trust my internal vision while remaining grounded in my material reality."',
    saturn: '"I am the only authority over my life. I build my own container from within."',
    uranus: '"I am authentically free. My uniqueness is my gift to the collective."',
    neptune: '"I am connected to the sacred while remaining present in the physical world."',
    pluto: '"I rise from my own intensity. Transformation is my path to wholeness."'
  };
  return mantras[planet] || '"I honor my internal survival protocols."';
}

function getSignNavigation(sign) {
  const navigation = {
    aries: 'Lead with authenticity, not just urgency. Your courage is a survival gift—use it to pioneer new paths while allowing yourself to be seen.',
    taurus: 'Trust your grounding. Your need for stability is an adaptation for safety; honor it by building a truly secure foundation from within.',
    gemini: 'Communicate your truth. Your quick mind navigated the unpredictable before; now use it to share your authentic message with the world.',
    cancer: 'Nurture your own sensitive core first. Your empathy is a strength, but it must be rooted in your own emotional security.',
    leo: 'Express your light for yourself, not just for the audience. Your creativity is the bridge back to your authentic self.',
    virgo: 'Move from perfection back to presence. Your attention to detail is your effort to keep a messy world safe—you are enough as you are.',
    libra: 'Prioritize your authenticity over your attachment. Harmony is only real when you are present within it, not when you erase yourself.',
    scorpio: 'Trust the transformation. Your intensity protects your most vulnerable self—allow the teardowns to lead back to your authentic power.',
    sagittarius: 'Expand toward internal truth. Your search for meaning is a flight from the local—ensure your journey leads back home to yourself.',
    capricorn: 'Own your own authority. You were the "little adult" who took on the world; now build your empire the way YOU want to build it.',
    aquarius: 'Embrace your uniqueness as survival. You found safety in detachment; now use that detachment to envision a free future for everyone.',
    pisces: 'Bridge the spiritual and the physical. Your imaginative refuge is valid—bring that compassion back into the material current of your life.'
  };
  return navigation[sign] || 'Navigate through the inquiry into your authentic self.';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Set default date to today
const today = new Date();
birthDate.value = today.toISOString().split('T')[0];
birthTime.value = '12:00';

// ============================================
// PROFILE REPORT GENERATION
// ============================================
if (profileReportBtn) {
  profileReportBtn.onclick = () => {
    if (!currentChartReading || !currentBirthData) {
      alert('Please generate a reading first before creating a profile report.');
      return;
    }

    try {
      // Generate the profile report
      const report = generateProfileReport(currentChartReading, currentBirthData, new Date());
      const html = generateReportHTML(report);

      // Open in new window for printing/saving
      const reportWindow = window.open('', '_blank');
      reportWindow.document.write(html);
      reportWindow.document.close();

      // Optionally trigger print dialog after a short delay
      setTimeout(() => {
        reportWindow.focus();
      }, 500);
    } catch (error) {
      console.error('Error generating profile report:', error);
      alert('Error generating profile report. Please try again.');
    }
  };
}

// ============================================
// QUESTION BEFORE REPORT UI
// ============================================
const questionToggle = document.getElementById('questionToggle');
const questionInputArea = document.getElementById('questionInputArea');
const questionArrow = document.getElementById('questionArrow');
const addQuestionBtn = document.getElementById('addQuestionBtn');
let questionCount = 1;

if (questionToggle) {
  questionToggle.onclick = () => {
    const isOpen = questionInputArea.style.display !== 'none';
    questionInputArea.style.display = isOpen ? 'none' : 'block';
    questionArrow.classList.toggle('open', !isOpen);
  };
}

if (addQuestionBtn) {
  addQuestionBtn.onclick = () => {
    if (questionCount < 3) {
      questionCount++;
      document.getElementById('extraQuestion' + questionCount).style.display = 'block';
      if (questionCount >= 3) addQuestionBtn.style.display = 'none';
    }
  };
}

function collectUserQuestions() {
  const questions = [];
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById('userQuestion' + i);
    if (el && el.value.trim()) questions.push(el.value.trim());
  }
  return questions;
}

// ============================================
// DEEP PERSONAL REPORT GENERATION
// ============================================
if (deepReportBtn) {
  deepReportBtn.onclick = () => {
    if (!currentChartReading || !currentBirthData) {
      alert('Please generate a reading first before creating a deep report.');
      return;
    }

    try {
      const userQuestions = collectUserQuestions();
      const report = generateDeepReport(currentChartReading, currentBirthData, new Date(), userQuestions);
      const html = generateDeepReportHTML(report);

      const reportWindow = window.open('', '_blank');
      reportWindow.document.write(html);
      reportWindow.document.close();

      setTimeout(() => {
        reportWindow.focus();
      }, 500);
    } catch (error) {
      console.error('Error generating deep report:', error);
      alert('Error generating deep report: ' + error.message);
    }
  };
}

// ============================================
// INTELLIGENT QUESTION DISCOVERY SYSTEM
// ============================================
(function initDiscovery() {
  // State
  let selectedCategories = [];
  let followUpResponses = {};

  // DOM references
  const overlay = document.getElementById('discoveryOverlay');
  const closeBtn = document.getElementById('discoveryClose');
  const step1 = document.getElementById('discoveryStep1');
  const step2 = document.getElementById('discoveryStep2');
  const step2b = document.getElementById('discoveryStep2b');
  const step3 = document.getElementById('discoveryStep3');
  const categoryGrid = document.getElementById('discoveryCategoryGrid');
  const nextBtn = document.getElementById('discoveryNextBtn');
  const backBtn1 = document.getElementById('discoveryBackBtn1');
  const backBtn2 = document.getElementById('discoveryBackBtn2');
  const analyzeBtn = document.getElementById('discoveryAnalyzeBtn');
  const askBtn = document.getElementById('discoveryAskBtn');
  const questionsContainer = document.getElementById('discoveryQuestions');
  const progressBar = document.getElementById('analysisProgressBar');
  const factorsList = document.getElementById('analysisFactorsList');
  const openBtn = document.getElementById('openDiscoveryBtn');
  const openFromResults = document.getElementById('openDiscoveryFromResults');
  const discoveryTrigger = document.getElementById('discoveryTrigger');

  if (!overlay || !categoryGrid) return; // Guard

  // Build category cards
  function renderCategories() {
    categoryGrid.innerHTML = '';
    for (const cat of DISCOVERY_CATEGORIES) {
      const card = document.createElement('div');
      card.className = 'discovery-category-card';
      card.dataset.id = cat.id;
      card.innerHTML = `
        <span class="category-icon">${cat.icon}</span>
        <div class="category-label">${cat.label.replace(/^[^ ]+ /, '')}</div>
        <div class="category-desc">${cat.description}</div>
      `;
      card.addEventListener('click', () => toggleCategory(cat.id, card));
      categoryGrid.appendChild(card);
    }
  }

  function toggleCategory(id, card) {
    if (id === 'general' || id === 'specific') {
      // Exclusive: deselect all others
      selectedCategories = [id];
      categoryGrid.querySelectorAll('.discovery-category-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    } else {
      // Remove general/specific if selected
      selectedCategories = selectedCategories.filter(c => c !== 'general' && c !== 'specific');
      categoryGrid.querySelectorAll('[data-id="general"],[data-id="specific"]').forEach(c => c.classList.remove('selected'));

      const idx = selectedCategories.indexOf(id);
      if (idx > -1) {
        selectedCategories.splice(idx, 1);
        card.classList.remove('selected');
      } else {
        selectedCategories.push(id);
        card.classList.add('selected');
      }
    }
    nextBtn.disabled = selectedCategories.length === 0;
  }

  // Open overlay
  function openDiscovery() {
    if (!currentChartReading) {
      alert('Please generate a reading first.');
      return;
    }
    selectedCategories = [];
    followUpResponses = {};
    renderCategories();
    showStep(1);
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeDiscovery() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  function showStep(num) {
    step1.style.display = num === 1 ? 'block' : 'none';
    step2.style.display = num === 2 ? 'block' : 'none';
    step2b.style.display = num === '2b' ? 'block' : 'none';
    step3.style.display = num === 3 ? 'block' : 'none';
  }

  // Render follow-up questions
  function renderFollowUps() {
    questionsContainer.innerHTML = '';
    for (const category of selectedCategories) {
      const questions = FOLLOW_UP_QUESTIONS[category];
      if (!questions) continue;

      for (const q of questions) {
        const block = document.createElement('div');
        block.className = 'question-block';

        let optionsHTML = '';
        if (q.type === 'choice') {
          optionsHTML = `<div class="question-options">${q.options.map((opt, i) => `
            <div class="question-option">
              <input type="radio" name="${q.id}" id="${q.id}_${i}" value="${opt}">
              <label for="${q.id}_${i}">${opt}</label>
            </div>
          `).join('')}</div>`;
        } else if (q.type === 'multi') {
          optionsHTML = `<div class="question-options">${q.options.map((opt, i) => `
            <div class="question-option">
              <input type="checkbox" name="${q.id}" id="${q.id}_${i}" value="${opt}">
              <label for="${q.id}_${i}">${opt}</label>
            </div>
          `).join('')}</div>`;
        } else if (q.type === 'text') {
          optionsHTML = `<textarea rows="3" id="${q.id}" placeholder="Share what's on your mind..."
            style="width:100%;padding:12px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#f8fafc;font-family:inherit;font-size:0.9rem;resize:vertical;"></textarea>`;
        }

        block.innerHTML = `
          <div class="question-label">${q.question}</div>
          ${optionsHTML}
        `;
        questionsContainer.appendChild(block);

        // Click handlers for selection highlight
        block.querySelectorAll('.question-option').forEach(opt => {
          opt.addEventListener('click', (e) => {
            const input = opt.querySelector('input');
            const clickedOnInput = (e.target === input);
            if (input.type === 'radio') {
              block.querySelectorAll('.question-option').forEach(o => o.classList.remove('selected'));
              opt.classList.add('selected');
              if (!clickedOnInput) input.checked = true;
            } else {
              if (!clickedOnInput) input.checked = !input.checked;
              opt.classList.toggle('selected', input.checked);
            }
          });
        });
      }
    }
  }

  // Collect follow-up answers
  function collectFollowUpAnswers() {
    const responses = {};
    questionsContainer.querySelectorAll('.question-block').forEach(block => {
      const radios = block.querySelectorAll('input[type=radio]:checked');
      const checkboxes = block.querySelectorAll('input[type=checkbox]:checked');
      const textarea = block.querySelector('textarea');

      radios.forEach(r => { responses[r.name] = r.value; });
      checkboxes.forEach(c => {
        if (!responses[c.name]) responses[c.name] = [];
        responses[c.name].push(c.value);
      });
      if (textarea && textarea.value.trim()) {
        responses[textarea.id] = textarea.value.trim();
      }
    });
    return responses;
  }

  // Run analysis with animated progress
  async function runAnalysis(plan) {
    showStep(3);

    const title = document.getElementById('analysisProgressTitle');
    const subtitle = document.getElementById('analysisProgressSubtitle');
    title.textContent = 'Analyzing Your Chart...';
    subtitle.textContent = `Examining ${plan.chartFactors.length} chart factors`;

    // Render factor items
    factorsList.innerHTML = plan.chartFactors.map(f => `
      <div class="analysis-factor-item" data-key="${f.key}">
        <span class="factor-status">○</span>
        <span class="factor-icon">${f.icon}</span>
        <span class="factor-name">${f.name}</span>
        <span class="factor-desc">${f.description}</span>
      </div>
    `).join('');

    progressBar.style.width = '0%';

    // Animate through factors
    const items = factorsList.querySelectorAll('.analysis-factor-item');
    for (let i = 0; i < items.length; i++) {
      items[i].classList.add('active');
      items[i].querySelector('.factor-status').textContent = '◉';

      const progress = ((i + 1) / items.length) * 90;
      progressBar.style.width = progress + '%';

      await delay(300 + Math.random() * 400);

      items[i].classList.remove('active');
      items[i].classList.add('done');
      items[i].querySelector('.factor-status').textContent = '✓';
    }

    // Final synthesis phase
    title.textContent = 'Synthesizing Insights...';
    subtitle.textContent = 'Weaving chart factors into a coherent reading';
    progressBar.style.width = '95%';
    await delay(800);
    progressBar.style.width = '100%';
    await delay(400);

    // Generate the focused reading
    const reading = generateFocusedReading(currentChartReading, plan);
    closeDiscovery();
    showFocusedReading(reading);
  }

  // Show focused reading overlay
  function showFocusedReading(reading) {
    const readingOverlay = document.getElementById('focusedReadingOverlay');
    const titleEl = document.getElementById('focusedReadingTitle');
    const subtitleEl = document.getElementById('focusedReadingSubtitle');
    const metaEl = document.getElementById('focusedReadingMeta');
    const bodyEl = document.getElementById('focusedReadingBody');
    const synthesisEl = document.getElementById('focusedReadingSynthesis');

    titleEl.textContent = reading.title;
    subtitleEl.textContent = reading.subtitle;

    // Meta tags
    metaEl.innerHTML = reading.methodologies.map(m =>
      `<span class="reading-meta-tag">${m}</span>`
    ).join('');

    // Factor sections
    bodyEl.innerHTML = reading.sections.filter(Boolean).map(section => {
      let bodyHTML = '';

      if (section.type === 'planet' && section.data) {
        const d = section.data;
        bodyHTML += `<div class="factor-placement">${capFirst(d.sign)} • House ${d.house} • ${d.degree?.toFixed(1) || '?'}°${d.retrograde ? ' ℞' : ''}</div>`;

        if (d.interpretation?.sign) {
          bodyHTML += `<p>${d.interpretation.sign.description || ''}</p>`;
        }
        if (d.interpretation?.house) {
          bodyHTML += `<p>${d.interpretation.house.description || ''}</p>`;
        }
        if (d.interpretation?.retrograde && d.retrograde) {
          bodyHTML += `<p><em>℞ ${d.interpretation.retrograde.description || ''}</em></p>`;
        }

        if (d.aspects && d.aspects.length > 0) {
          bodyHTML += `<div class="factor-aspects">`;
          for (const asp of d.aspects) {
            bodyHTML += `<div class="factor-aspect-item"><strong>${asp.symbol} ${capFirst(asp.otherPlanet)}</strong>: ${asp.resolution || asp.perception || ''}</div>`;
          }
          bodyHTML += `</div>`;
        }
      } else if (section.type === 'angle' && section.data) {
        bodyHTML += `<div class="factor-placement">${capFirst(section.data.sign)} • ${section.data.degree?.toFixed(1) || '?'}°</div>`;
        bodyHTML += `<p>The ${section.title.replace(/[^ ]+ /, '')} determines ${section.subtitle}.</p>`;
      } else if (section.type === 'house' && section.data) {
        bodyHTML += `<div class="factor-placement">${capFirst(section.data.sign)}</div>`;
        if (section.data.planets.length > 0) {
          bodyHTML += `<p>Occupied by: ${section.data.planets.map(p => capFirst(p.name)).join(', ')}</p>`;
        } else {
          bodyHTML += `<p>Empty house — the ruler carries its story.</p>`;
        }
      } else if (section.type === 'transit') {
        bodyHTML += `<p>${section.data?.note || 'Transit analysis available in yearly forecast.'}</p>`;
      }

      return `
        <div class="factor-section">
          <div class="factor-section-header">
            <div class="factor-section-icon">✦</div>
            <div>
              <div class="factor-section-title">${section.title}</div>
              <div class="factor-section-subtitle">${section.subtitle}</div>
            </div>
          </div>
          <div class="factor-section-body">${bodyHTML}</div>
        </div>
      `;
    }).join('');

    // Synthesis
    if (reading.synthesis) {
      const formatted = reading.synthesis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      synthesisEl.innerHTML = `
        <h3>✨ Synthesis & Key Insights</h3>
        <div class="synthesis-content">${formatted}</div>
      `;
      synthesisEl.style.display = 'block';
    } else {
      synthesisEl.style.display = 'none';
    }

    readingOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    readingOverlay.scrollTop = 0;

    // Wire close/action buttons
    document.getElementById('focusedReadingClose').onclick = () => {
      readingOverlay.style.display = 'none';
      document.body.style.overflow = '';
    };
    document.getElementById('focusedAskMore').onclick = () => {
      readingOverlay.style.display = 'none';
      document.body.style.overflow = '';
      // Open chat
      if (chatWindow) chatWindow.style.display = 'flex';
      if (chatInput) chatInput.focus();
    };
    document.getElementById('focusedNewDiscovery').onclick = () => {
      readingOverlay.style.display = 'none';
      document.body.style.overflow = '';
      openDiscovery();
    };
    document.getElementById('focusedViewFull').onclick = () => {
      readingOverlay.style.display = 'none';
      document.body.style.overflow = '';
      // Scroll to results
      if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth' });
    };
  }

  function capFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Wire event listeners
  closeBtn.addEventListener('click', closeDiscovery);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDiscovery();
  });

  if (openBtn) openBtn.addEventListener('click', openDiscovery);
  if (openFromResults) openFromResults.addEventListener('click', openDiscovery);

  // Step 1 → Step 2
  nextBtn.addEventListener('click', () => {
    if (selectedCategories.length === 0) return;

    if (selectedCategories.includes('specific')) {
      showStep('2b');
    } else if (selectedCategories.includes('general')) {
      // Skip follow-ups, go straight to analysis
      const plan = buildAnalysisPlan(['general']);
      runAnalysis(plan);
    } else {
      renderFollowUps();
      showStep(2);
    }
  });

  // Step 2 Back
  if (backBtn1) backBtn1.addEventListener('click', () => showStep(1));
  if (backBtn2) backBtn2.addEventListener('click', () => showStep(1));

  // Step 2 → Analyze
  if (analyzeBtn) analyzeBtn.addEventListener('click', () => {
    followUpResponses = collectFollowUpAnswers();
    const plan = buildAnalysisPlan(selectedCategories, followUpResponses);
    runAnalysis(plan);
  });

  // Step 2b → Analyze specific question (generates DEEP Cassie-style report)
  if (askBtn) askBtn.addEventListener('click', () => {
    const input = document.getElementById('specificQuestionInput');
    const question = input?.value?.trim();
    if (!question) {
      alert('Please enter a question.');
      return;
    }

    if (!currentChartReading || !currentBirthData) {
      alert('Please generate a reading first.');
      return;
    }

    try {
      closeDiscovery();
      const report = generateDeepReport(currentChartReading, currentBirthData, new Date(), [question]);
      const html = generateDeepReportHTML(report);
      const reportWindow = window.open('', '_blank');
      reportWindow.document.write(html);
      reportWindow.document.close();
      setTimeout(() => { reportWindow.focus(); }, 500);
    } catch (error) {
      console.error('Error generating question report:', error);
      alert('Error generating report: ' + error.message);
    }
  });

  // Show trigger immediately if chart already exists
  if (discoveryTrigger && currentChartReading) {
    discoveryTrigger.style.display = 'block';
  }
})();
