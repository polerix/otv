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
    { id: 0, label: 'Die Hard', status: 'idle' },
    { id: 1, label: 'otv Station ID', status: 'active' }, // One must be active
    { id: 2, label: 'Robocop', status: 'cued' },
    { id: 3, label: 'Lethal Weapon 2', status: 'idle' },
    { id: 4, label: 'Toy R Us Commercial', status: 'ad' },
    { id: 5, label: 'Predator', status: 'idle' },
    { id: 6, label: 'Terminator 2', status: 'idle' },
    { id: 7, label: 'Aliens', status: 'idle' },
];

let selectedIndex = 0;

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
        slot.className = `cassette-slot ${index === selectedIndex ? 'selected' : ''}`;
        slot.dataset.index = index;

        const tooltip = document.createElement('div');
        tooltip.className = 'cassette-tooltip';
        tooltip.innerText = cassette.label;

        const overlayText = document.createElement('div');
        overlayText.className = 'cassette-number';
        overlayText.innerText = index + 1;

        const wrapper = document.createElement('div');
        wrapper.className = `svg-wrapper ${index === selectedIndex ? 'selected-wrapper' : ''}`;
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

    const clawX = 674; // 324px (left panel width) + 350px (half of right panel width)
    
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

function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('app-screen').classList.contains('active')) return;

        if (e.key === 'ArrowRight') {
            selectedIndex = (selectedIndex + 1) % CASSETTES_COUNT;
            renderCassettes();
        } else if (e.key === 'ArrowLeft') {
            selectedIndex = (selectedIndex - 1 + CASSETTES_COUNT) % CASSETTES_COUNT;
            renderCassettes();
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
        const cassette = cassettes[selectedIndex];
        if (cassette.status === 'active') {
            triggerFault();
        } else if (cassette.status === 'playing') {
            cassette.status = 'idle';
            renderCassettes();
        }
    });

    setupButton('btn-swap', () => {
        if (isAnimating) return;
        
        const cassette = cassettes[selectedIndex];
        if (document.body.dataset.role === 'operator' && cassette.status === 'playing') {
            // Show error indicator (e.g. flashing fault) and block swap
            triggerFault();
            return;
        }
        
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
    isAnimating = true;

    // Elements mapped by arm rotation angle group
    const els = {
        0: {
            retractedOpen: document.getElementById('arm-retracted-open-0'),
            extendedOpen: document.getElementById('arm-extended-open-0'),
            extendedClosed: document.getElementById('arm-extended-closed-0'),
            pick: document.getElementById('tape-cassette-pick-0')
        },
        180: {
            retractedOpen: document.getElementById('arm-retracted-open-180'),
            extendedOpen: document.getElementById('arm-extended-open-180'),
            extendedClosed: document.getElementById('arm-extended-closed-180'),
            pick: document.getElementById('tape-cassette-pick-180')
        },
        rotator: document.getElementById('arm-rotator')
    };

    const btnSwap = document.getElementById('btn-swap');
    btnSwap.classList.add('anim-active');

    // Make sure we are at baseline before start
    els.rotator.style.transition = 'none';
    els.rotator.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    await delay(50);
    els.rotator.style.transition = 'transform 3s ease-in-out';

    // Helper to asynchronously animate a single arm grabbing a tape
    async function pickTape(arm) {
        arm.retractedOpen.classList.add('hidden');
        arm.extendedOpen.classList.remove('hidden');
        
        await delay(1000); // Time to extend
        
        arm.pick.classList.remove('hidden');
        
        await delay(250); // Pause briefly before closing
        
        arm.extendedOpen.classList.add('hidden');
        arm.extendedClosed.classList.remove('hidden');
        
        // Retract while holding the tape
        arm.pick.style.transform = 'translate(0, -100px)'; // 100px relative translation upwards to hub center
        arm.pick.style.transition = 'transform 0.5s ease-in-out';
        
        await delay(500); // Time to retract
    }

    // Helper to asynchronously animate a single arm placing a tape
    async function placeTape(arm) {
        // Start from retracted closed position (which is conceptually ExtendedClosed hidden state reversed)
        // Wait, physically placing involves pushing it OUT to the 100px extreme
        
        // Push tape out
        arm.pick.style.transform = 'translate(0, 0px)'; // reset to original SVG bounds (extended)
        arm.pick.style.transition = 'transform 0.25s ease-in-out';
        await delay(250);
        
        // Open the claw
        arm.extendedClosed.classList.add('hidden');
        arm.extendedOpen.classList.remove('hidden');
        
        await delay(250); // Short pause to let tape go
        
        arm.pick.classList.add('hidden'); // Tape is dropped in player/library
        
        await delay(1000); // Time to retract empty arm
        
        arm.extendedOpen.classList.add('hidden');
        arm.retractedOpen.classList.remove('hidden');
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
    [els[0].extendedClosed.className, els[180].extendedClosed.className] = [els[180].extendedClosed.className, els[0].extendedClosed.className];
    [els[0].pick.className, els[180].pick.className] = [els[180].pick.className, els[0].pick.className];
    // Also reset any lingering internal translation states so the swap is clean
    [els[0].pick.style.transform, els[180].pick.style.transform] = [els[180].pick.style.transform, els[0].pick.style.transform];
    

    // --- 3. BOTH ARMS PLACE SIMULTANEOUSLY ---
    await Promise.all([
        placeTape(els[0]),
        placeTape(els[180])
    ]);

    btnSwap.classList.remove('anim-active');
    isAnimating = false;
}
