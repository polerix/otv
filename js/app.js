// ==== Constants and State ====
const CASSETTES_COUNT = 8;
const COLOR_MAPPING = {
    'idle': '#999590',
    'cued': 'orange',
    'playing': '#999590',
    'active': 'red',
    'ad': 'blue'
};

const cassettes = [
    { id: 0, label: 'Die Hard', subLabel: '1988 Action Classic', status: 'idle', duration: '02:12:00', scheduledTime: '21:00' },
    { id: 1, label: 'otv Station ID', subLabel: 'Channel bumper', status: 'active', duration: '00:00:15', scheduledTime: 'Live' },
    { id: 2, label: 'Robocop', subLabel: 'Verhoeven Masterpiece', status: 'cued', duration: '01:42:00', scheduledTime: '23:30' },
    { id: 3, label: 'Lethal Weapon 2', subLabel: 'Riggs and Murtaugh', status: 'idle', duration: '01:54:00', scheduledTime: '01:15' },
    { id: 4, label: 'Toy R Us Commercial', subLabel: 'Nostalgia block', status: 'ad', duration: '00:01:00', scheduledTime: '15:45' },
    { id: 5, label: 'Predator', subLabel: 'Jungle Survival', status: 'idle', duration: '01:47:00', scheduledTime: '17:30' },
    { id: 6, label: 'Terminator 2', subLabel: 'Judgment Day', status: 'idle', duration: '02:17:00', scheduledTime: '19:00' },
    { id: 7, label: 'Aliens', subLabel: 'Special Edition', status: 'idle', duration: '02:34:00', scheduledTime: '03:45' },
];

const LIBRARY_DATABASE = [
    { cat: 'Movies', label: 'Alien', subLabel: '1979 Sci-Fi Horror', duration: '01:57:00' },
    { cat: 'Movies', label: 'Blade Runner', subLabel: 'Director\'s Cut', duration: '01:57:00' },
    { cat: 'Movies', label: 'Total Recall', subLabel: 'Get Your Ass to Mars', duration: '01:53:00' },
    { cat: 'Movies', label: 'The Thing', subLabel: 'John Carpenter Masterpiece', duration: '01:49:00' },
    { cat: 'Movies', label: 'Terminator 2', subLabel: 'Judgment Day', duration: '02:17:00' },
    { cat: 'Movies', label: 'Back to the Future', subLabel: 'Delorean Time Trip', duration: '01:56:00' },
    { cat: 'Shows', label: 'The Twilight Zone', subLabel: 'S01E01 - Where is Everybody', duration: '00:25:00' },
    { cat: 'Shows', label: 'Knight Rider', subLabel: 'S01E01 - Knight of the Phoenix', duration: '00:48:00' },
    { cat: 'Ads', label: 'Toy R Us Commercial', subLabel: 'Nostalgia block', duration: '00:01:00' },
    { cat: 'Ads', label: 'Coca Cola 1985', subLabel: 'Summer Refresh', duration: '00:00:30' },
    { cat: 'Station ID', label: 'otv Bumper A', subLabel: 'Midnight Drift', duration: '00:00:15' },
    { cat: 'Station ID', label: 'otv Bumper B', subLabel: 'Cyber Sunset', duration: '00:00:15' },
    { cat: 'Music Videos', label: 'Michael Jackson - Thriller', subLabel: 'Horror Musical', duration: '00:13:42' },
    { cat: 'Music Videos', label: 'A-ha - Take On Me', subLabel: 'Sketch Animation', duration: '00:03:48' },
    { cat: 'News', label: 'Evening Report', subLabel: 'April 10, 1989', duration: '00:30:00' },
    { cat: 'Videos', label: 'NASA STS-31', subLabel: 'Hubble Deployment', duration: '00:10:00' }
];

let selectedIndex = 0;
let inFlightCassetteId = null; // Tracks which cassette is currently on the arm

const CASSETTE_SVG = `<svg class="cassette-img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109.93 56.13">
  <defs>
    <style>
      .cls-1 { fill: #999590; }
      .cls-2 { fill: #787672; }
      .cls-3 { fill: #a7a39d; }
    </style>
  </defs>
  <g>
    <path class="cls-2" d="M109.93,54.13v-8.92H0v8.92c0,1.1.9,2,2,2h105.93c1.1,0,2-.9,2-2Z"/>
    <path class="cls-1" d="M109.93,48.67V2c0-1.1-.9-2-2-2H2C.9,0,0,.9,0,2v46.67c0,1.1.9,2,2,2h105.93c1.1,0,2-.9,2-2ZM31.26,13.93h47c6.3,0,11.72,4.93,11.82,11.22s-5.05,11.6-11.41,11.6H31.67c-6.3,0-11.72-4.93-11.82-11.22s5.05-11.6,11.41-11.6Z"/>
    <path class="cls-3" d="M107.93,1.5c.28,0,.5.22.5.5v46.67c0,.28-.22.5-.5.5H2c-.28,0-.5-.22-.5-.5V2c0-.28.22-.5.5-.5h105.93ZM78.67,38.25c3.49,0,6.75-1.37,9.2-3.86,2.45-2.49,3.76-5.78,3.71-9.26-.11-7-6.09-12.7-13.32-12.7H31.26c-3.49,0-6.75,1.37-9.2,3.86-2.45,2.49-3.76,5.78-3.71,9.26.11,7,6.09,12.7,13.32,12.7h47Z"/>
    <path class="cls-2" d="M31.26,36.75h47.41c6.3,0,11.41-5.11,11.41-11.41s-5.11-11.41-11.41-11.41H31.26c-6.3,0-11.41,5.11-11.41,11.41s5.11,11.41,11.41,11.41ZM81.19,17.34c4.42,0,8,3.58,8,8s-3.58,8-8,8-8-3.58-8-8,3.58-8,8-8ZM37.63,22.34h34.67v6h-34.67v-6ZM28.74,17.34c4.42,0,8,3.58,8,8s-3.58,8-8,8-8-3.58-8-8,3.59-8,8-8Z"/>
  </g>
</svg>`;

// ==== Initialization ====
document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    renderCassettes();
    setupKeyboardNavigation();
    setupControls();
    setupResize();
    initModal();
    initLibraryModal();
});

function setupResize() {
    function resizeApp() {
        const scale = Math.min(window.innerWidth / 1024, window.innerHeight / 768);
        document.documentElement.style.setProperty('--app-scale', scale);
    }
    window.addEventListener('resize', resizeApp);
    resizeApp();
}


// ==== Login Logic ====
function initLogin() {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const otvLogo = document.getElementById('otv-logo');
    const enteringAnimation = document.getElementById('entering-animation');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value.trim().toLowerCase();
        const pass = document.getElementById('password').value.trim().toLowerCase();

        let role = null;
        if (user === '212-555-4240' && pass === 'god') {
            role = 'advanced';
        } else if (user === 'admin' && pass === 'admin') {
            role = 'operator';
        }

        if (role) {
            loginError.classList.add('hidden');
            document.body.dataset.role = role;

            loginForm.classList.add('hidden');
            otvLogo.classList.add('hidden');
            enteringAnimation.classList.remove('hidden');

            setTimeout(() => {
                document.getElementById('login-screen').classList.remove('active');
                document.getElementById('login-screen').classList.add('hidden');

                document.getElementById('app-screen').classList.remove('hidden');
                document.getElementById('app-screen').classList.add('active');
            }, 5000);

        } else {
            loginError.classList.remove('hidden');
        }
    });
}


// ==== Cassette UI ====
function renderCassettes() {
    const queue = document.getElementById('cassette-queue');
    queue.innerHTML = '';

    const slotWidth = 109.93;
    const gap = 20;

    // We want the selected cassette to appear at the 6th position (index 5)
    // so that the entire array of 8 fits perfectly centered on the screen when aligned to the claw.
    
    // Total count is 8.
    const centerOffset = 5; // By putting the selected at position 5 (0-indexed), positions 0-4 are to the left, 6-7 to the right.
    
    let displayIndices = [];
    for (let i = -centerOffset; i < CASSETTES_COUNT - centerOffset; i++) {
        let index = (selectedIndex + i) % CASSETTES_COUNT;
        if (index < 0) index += CASSETTES_COUNT;
        displayIndices.push(index);
    }

    displayIndices.forEach((index, positionInQueue) => {
        const cassette = cassettes[index];
        const slot = document.createElement('div');
        const isSelected = index === selectedIndex;
        const isLifted = index === inFlightCassetteId;
        slot.className = `cassette-slot ${isSelected ? 'selected' : ''} ${isLifted ? 'lifted' : ''}`;
        slot.dataset.index = index;

        const tooltip = document.createElement('div');
        tooltip.className = 'cassette-tooltip';
        tooltip.innerText = cassette.label;

        const overlayText = document.createElement('div');
        overlayText.className = 'cassette-number';
        overlayText.innerText = index + 1;

        const wrapper = document.createElement('div');
        wrapper.className = `svg-wrapper ${isSelected ? 'selected-wrapper' : ''}`;
        wrapper.innerHTML = CASSETTE_SVG;

        const baseFill = wrapper.querySelector('.cls-1');
        const baseColor = COLOR_MAPPING[cassette.status] || COLOR_MAPPING['idle'];
        if (baseFill) {
            baseFill.style.fill = baseColor;
        }

        overlayText.style.color = '#37333f';
        overlayText.style.textShadow = `-2px -2px 0 ${baseColor}, 2px -2px 0 ${baseColor}, -2px 2px 0 ${baseColor}, 2px 2px 0 ${baseColor}`;

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        if (cassette.status === 'playing') {
            // Start a CSS animation
            progressBar.style.backgroundColor = baseColor;
            progressBar.style.animation = 'playProgress 10s linear forwards';
        }
        progressContainer.appendChild(progressBar);

        slot.appendChild(wrapper);
        slot.appendChild(progressContainer);
        slot.appendChild(overlayText);
        slot.appendChild(tooltip);
        
        queue.appendChild(slot);
    });

    syncButtonStates();

    const clawX = 699; // 324px (left panel width) + 375px (shifted center)
    
    // The "selected" cassette is exactly at position centerOffset.
    const selectedPosition = centerOffset;
    const selectedCenter = selectedPosition * (slotWidth + gap) + (slotWidth / 2);
    
    // Calculate if we need to scale the queue to fit all 8 cassettes on screen
    const totalQueueWidth = CASSETTES_COUNT * slotWidth + (CASSETTES_COUNT - 1) * gap;
    // We want the left edge (0) to right edge (totalQueueWidth) to fit within 1024px.
    // However, it's pinned to the clawX (674px). The left side is selectedCenter. 
    // The right side is totalQueueWidth - selectedCenter.
    // Left available: 674px. Right available: 1024 - 674 = 350px.
    // Since selectedCenter is position 5 (offset 5), 5.5 slots are on the left (~700px), 2.5 on right (~320px).
    // So it will overflow the left side (700 > 674). 
    // Let's compute a scale factor to force the large side to fit:
    const leftScale = 674 / selectedCenter;
    const rightScale = 350 / (totalQueueWidth - selectedCenter);
    const queueScale = Math.min(1, leftScale, rightScale) * 0.95; // 0.95 gives a little padding
    
    const translateX = clawX - (selectedCenter * queueScale);
    
    queue.style.transform = `translateX(${translateX}px) scale(${queueScale})`;
    queue.style.transformOrigin = 'left bottom';
}

function syncButtonStates() {
    const selectedCassette = cassettes[selectedIndex];
    const btnPlay = document.getElementById('btn-play');
    const btnPause = document.getElementById('btn-pause');
    const btnSwap = document.getElementById('btn-swap');

    if (!btnPlay || !btnPause || !btnSwap) return;

    // Play pulsing while playing
    if (selectedCassette.status === 'playing') {
        btnPlay.classList.add('task-active');
    } else {
        btnPlay.classList.remove('task-active');
    }

    // Pause pulsing while paused
    if (selectedCassette.status === 'paused') {
        btnPause.classList.add('task-active');
    } else {
        btnPause.classList.remove('task-active');
    }

    // Swap pulsing while arm is moving
    if (isAnimating) {
        btnSwap.classList.add('task-active');
    } else {
        btnSwap.classList.remove('task-active');
    }
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('app-screen').classList.contains('active')) return;

        if (e.key === 'ArrowLeft') {
            selectedIndex = (selectedIndex - 1 + CASSETTES_COUNT) % CASSETTES_COUNT;
            renderCassettes();
        } else if (e.key === 'ArrowRight') {
            selectedIndex = (selectedIndex + 1) % CASSETTES_COUNT;
            renderCassettes();
        } else if (e.key === 'Enter') {
            // Open info modal for currently selected cassette
            const cassette = cassettes[selectedIndex];
            if (cassette) showModal(cassette);
        }
    });
}

// ==== Playback & Fault Logic ====

function triggerFault() {
    const fault = document.getElementById('arm-fault');
    fault.classList.remove('hidden');
    fault.classList.add('flash');

    setTimeout(() => {
        fault.classList.add('hidden');
        fault.classList.remove('flash');
    }, 3000);
}

function setupControls() {
    setupButton('btn-play', () => {
        const cassette = cassettes[selectedIndex];
        if (cassette.status === 'idle') {
            cassette.status = 'playing';
            renderCassettes();
        }
    });

    setupButton('btn-pause', () => { });

    setupButton('btn-stop', () => {
        const btnStop = document.getElementById('btn-stop');
        btnStop.classList.add('task-active');
        setTimeout(() => btnStop.classList.remove('task-active'), 2000);

        const cassette = cassettes[selectedIndex];
        if (cassette.status === 'active') {
            triggerFault();
        } else if (cassette.status === 'playing') {
            cassette.status = 'idle';
            syncButtonStates();
            renderCassettes();
        }
    });

    setupButton('btn-swap', () => {
        runSwapSequence();
    });
}

function setupButton(id, onClick) {
    const btnContainer = document.getElementById(id);
    const upImg = btnContainer.querySelector('.btn-up');
    const downImg = btnContainer.querySelector('.btn-down');

    btnContainer.addEventListener('mousedown', () => {
        upImg.classList.add('hidden');
        downImg.classList.remove('hidden');
    });

    btnContainer.addEventListener('mouseup', () => {
        upImg.classList.remove('hidden');
        downImg.classList.add('hidden');
        onClick();
    });

    btnContainer.addEventListener('mouseleave', () => {
        upImg.classList.remove('hidden');
        downImg.classList.add('hidden');
    });
}

// ==== Arm Animation Logic ====

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let isAnimating = false;

async function runSwapSequence() {
    if (isAnimating) return;
    
    const cassette = cassettes[selectedIndex];
    if (document.body.dataset.role === 'operator' && cassette.status === 'playing') {
        // Show error indicator (e.g. flashing fault) and block swap
        triggerFault();
        return;
    }

    isAnimating = true;
    syncButtonStates();

    // Elements mapped by arm rotation angle group
    const els = {
        0: {
            retractedOpen: document.getElementById('arm-retracted-open-0'),
            retractedClosed: document.getElementById('arm-retracted-closed-0'),
            extendedOpen: document.getElementById('arm-extended-open-0'),
            extendedClosed: document.getElementById('arm-extended-closed-0'),
            pick: document.getElementById('tape-cassette-pick-0')
        },
        180: {
            retractedOpen: document.getElementById('arm-retracted-open-180'),
            retractedClosed: document.getElementById('arm-retracted-closed-180'),
            extendedOpen: document.getElementById('arm-extended-open-180'),
            extendedClosed: document.getElementById('arm-extended-closed-180'),
            pick: document.getElementById('tape-cassette-pick-180')
        },
        rotator: document.getElementById('arm-rotator')
    };

    // Make sure we are at baseline before start
    els.rotator.style.transition = 'none';
    els.rotator.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    await delay(50);
    els.rotator.style.transition = 'transform 3s ease-in-out';

    // Helper to asynchronously animate a single arm grabbing a tape
    async function pickTape(arm) {
        // Step 1: Start Extension
        arm.pick.style.setProperty('--pick-y', '40px'); // Ensure it starts from retracted position
        
        // Step 2: Extend Arm and Slide Tape simultaneously
        arm.retractedOpen.classList.add('hidden');
        arm.extendedOpen.classList.remove('hidden');
        
        // Hand-off from Queue (if it's the bottom arm)
        if (arm.pick.id.includes('180')) {
            inFlightCassetteId = selectedIndex;
            const selectedSlot = document.querySelector('.cassette-slot.selected');
            if (selectedSlot) selectedSlot.classList.add('lifted');
        }

        arm.pick.classList.add('arm-extended-pick-state');
        arm.pick.style.setProperty('--pick-y', '0px');
        await delay(500); // Match CSS transition
        
        // Step 3: Grab
        arm.pick.classList.remove('hidden');
        await delay(250); 
        arm.extendedOpen.classList.add('hidden');
        arm.extendedClosed.classList.remove('hidden');
        await delay(250);

        // Step 4: Retract
        arm.extendedClosed.classList.add('hidden');
        arm.retractedClosed.classList.remove('hidden');
        arm.pick.classList.remove('arm-extended-pick-state');
        arm.pick.classList.add('arm-retracted-closed-state');
        arm.pick.style.setProperty('--pick-y', '40px');
        await delay(500); 
    }

    // Helper to asynchronously animate a single arm placing a tape
    async function placeTape(arm) {
        // Step 6: Deploy members
        // Swap to extended asset and start slide in one motion
        arm.retractedClosed.classList.add('hidden');
        arm.extendedClosed.classList.remove('hidden');
        arm.pick.classList.remove('arm-retracted-pick-state');
        arm.pick.classList.add('arm-extended-pick-state');
        arm.pick.style.setProperty('--pick-y', '0px');
        await delay(500); // Motion duration

        // Step 7: Release
        await delay(200); 
        arm.extendedClosed.classList.add('hidden');
        arm.extendedOpen.classList.remove('hidden');
        await delay(400); 
        
        // Hand-off to Queue (if it's the bottom arm)
        if (arm.pick.id.includes('180')) {
            // Render the queue with the slot already in the 'lifted' (up) state
            renderCassettes(); 
            
            // Allow a tiny frame for the element to exist in the DOM
            await delay(50);
            
            // Clear the logical state
            inFlightCassetteId = null;
            
            // Find the physical element and remove '.lifted' to trigger the slide down
            const targetSlot = document.querySelector('.cassette-slot.selected');
            if (targetSlot) targetSlot.classList.remove('lifted');
        }
        
        arm.pick.classList.add('hidden'); 
        arm.pick.classList.remove('arm-extended-pick-state');
        await delay(200); 

        // Step 8: Return
        arm.extendedOpen.classList.add('hidden');
        arm.retractedOpen.classList.remove('hidden');
        await delay(500);
    }

    // --- 1. BOTH ARMS EXTEND AND PICK SIMULTANEOUSLY ---
    // Make sure both are visible in open retracted state first
    els[0].retractedOpen.classList.remove('hidden');
    els[180].retractedOpen.classList.remove('hidden');
    await delay(500);

    await Promise.all([
        pickTape(els[0]),
        pickTape(els[180])
    ]);

    // --- 2. ROTATE HUB WITH BOTH TAPES ---
    els.rotator.style.transform = 'translate(-50%, -50%) rotate(180deg)';
    await delay(3000);

    // After physical rotation, reset visual mapping since 180 is now at 0's spot
    els.rotator.style.transition = 'none';
    els.rotator.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    
    // Swap the class visibilities instantly because the hub flipped back to 0 mathematically
    // but the tapes and arms need to physically trade places in the DOM
    [els[0].retractedClosed.className, els[180].retractedClosed.className] = [els[180].retractedClosed.className, els[0].retractedClosed.className];
    [els[0].pick.className, els[180].pick.className] = [els[180].pick.className, els[0].pick.className];
    [els[0].pick.style.transform, els[180].pick.style.transform] = [els[180].pick.style.transform, els[0].pick.style.transform];
    

    // --- 3. BOTH ARMS PLACE SIMULTANEOUSLY ---
    await Promise.all([
        placeTape(els[0]),
        placeTape(els[180])
    ]);

    isAnimating = false;
    syncButtonStates();
}

/**
 * Initializes the Media Library Search Interface
 */
function initLibraryModal() {
    const modal = document.getElementById('library-modal');
    const closeX = document.getElementById('library-close-x');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    const selectBtn = document.getElementById('btn-select-media');
    const tabs = document.querySelectorAll('.category-tab');

    let currentCategory = 'Movies';
    let selectedLibraryIndex = -1;

    // Button Triggers
    setupButton('btn-change', () => {
        modal.classList.remove('hidden');
        updateCategory('Movies');
        searchInput.value = '';
    });

    function updateCategory(cat) {
        currentCategory = cat;
        tabs.forEach(t => {
            t.classList.toggle('active', t.dataset.cat === cat);
        });
        renderLibraryResults(searchInput.value);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            updateCategory(tab.dataset.cat);
            selectedLibraryIndex = -1;
            selectBtn.disabled = true;
        });
    });

    // Close Logic
    closeX.addEventListener('click', () => modal.classList.add('hidden'));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        renderLibraryResults(e.target.value);
        selectedLibraryIndex = -1;
        selectBtn.disabled = true;
    });

    function renderLibraryResults(query) {
        resultsContainer.innerHTML = '';
        
        // Filter by category AND query
        const filtered = LIBRARY_DATABASE.filter(item => 
            item.cat === currentCategory && 
            item.label.toLowerCase().includes(query.toLowerCase())
        );

        filtered.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'search-item';
            div.innerHTML = `
                <span class="item-title">${item.label}</span>
                <span class="item-sub">${item.subLabel} | ${item.duration}</span>
            `;
            div.addEventListener('click', () => {
                document.querySelectorAll('.search-item').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                selectedLibraryIndex = LIBRARY_DATABASE.indexOf(item);
                selectBtn.disabled = false;
            });
            resultsContainer.appendChild(div);
        });

        if (filtered.length === 0) {
            resultsContainer.innerHTML = '<div style="padding: 20px; opacity: 0.5;">No items in this category...</div>';
        }
    }

    // Selection Logic
    selectBtn.addEventListener('click', () => {
        if (selectedLibraryIndex === -1) return;
        
        const newMedia = LIBRARY_DATABASE[selectedLibraryIndex];
        
        cassettes[selectedIndex] = {
            ...cassettes[selectedIndex],
            label: newMedia.label,
            subLabel: newMedia.subLabel,
            duration: newMedia.duration,
            status: 'idle'
        };

        renderCassettes();
        modal.classList.add('hidden');
        
        const btnSwap = document.getElementById('btn-swap');
        btnSwap.classList.add('task-active');
        setTimeout(() => btnSwap.classList.remove('task-active'), 5000);
    });
}

/**
 * Initializes the Administrative Info Modal
 */
function initModal() {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close-x');
    const queue = document.getElementById('cassette-queue');

    // Click delegation for cassette slots
    queue.addEventListener('click', (e) => {
        const slot = e.target.closest('.cassette-slot');
        if (!slot) return;

        const index = parseInt(slot.dataset.index);
        const cassette = cassettes[index];
        if (!cassette) return;

        showModal(cassette);
    });

    // Close on X
    closeBtn.addEventListener('click', hideModal);

    // Close on Backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hideModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
            hideModal();
        }
    });
}

function showModal(cassette) {
    const overlay = document.getElementById('modal-overlay');
    document.getElementById('modal-title').innerText = cassette.label;
    document.getElementById('modal-sublabel').innerText = cassette.subLabel || '-';
    document.getElementById('modal-duration').innerText = cassette.duration || '-';
    document.getElementById('modal-scheduled').innerText = cassette.scheduledTime || '-';
    
    const timeUntilElem = document.getElementById('modal-timeleft');
    if (cassette.scheduledTime === 'Live') {
        timeUntilElem.innerText = 'Now Playing';
    } else {
        timeUntilElem.innerText = getTimeUntil(cassette.scheduledTime);
    }

    overlay.classList.remove('hidden');
}

function hideModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

/**
 * Calculates time remaining until a scheduled HH:MM event
 */
function getTimeUntil(scheduledTime) {
    if (!scheduledTime || scheduledTime === '-') return 'TBD';
    
    const now = new Date();
    const [hrs, mins] = scheduledTime.split(':').map(Number);
    
    let target = new Date();
    target.setHours(hrs, mins, 0, 0);
    
    // If target is earlier than now, it's for tomorrow
    if (target < now) {
        target.setDate(target.getDate() + 1);
    }
    
    const diffMs = target - now;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m remaining`;
}
