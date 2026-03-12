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
    { id: 1, label: 'OTV Station ID', status: 'active' }, // One must be active
    { id: 2, label: 'Robocop', status: 'cued' },
    { id: 3, label: 'Lethal Weapon 2', status: 'idle' },
    { id: 4, label: 'Toy R Us Commercial', status: 'ad' },
    { id: 5, label: 'Predator', status: 'idle' },
    { id: 6, label: 'Terminator 2', status: 'idle' },
    { id: 7, label: 'Aliens', status: 'idle' },
];

let selectedIndex = 0;


// ==== Initialization ====
document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    renderCassettes();
    setupKeyboardNavigation();
    setupControls();
});


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

    cassettes.forEach((cassette, index) => {
        const slot = document.createElement('div');
        slot.className = `cassette-slot ${index === selectedIndex ? 'selected' : ''}`;
        slot.dataset.index = index;

        const tooltip = document.createElement('div');
        tooltip.className = 'cassette-tooltip';
        tooltip.innerText = cassette.label;

        const overlayText = document.createElement('div');
        overlayText.className = 'cassette-number';
        overlayText.innerText = index + 1;

        const file = index === selectedIndex ? 'TapeCassette_selected.svg' : 'TapeCassette.svg';

        // Inline SVG fetching
        fetch(`ARPS/SVG/${file}`)
            .then(res => res.text())
            .then(svgData => {
                const wrapper = document.createElement('div');
                wrapper.className = `svg-wrapper ${index === selectedIndex ? 'selected-wrapper' : ''}`;
                wrapper.innerHTML = svgData;
                const svg = wrapper.querySelector('svg');
                svg.classList.add('cassette-img');

                const baseFill = wrapper.querySelector('.cls-1');
                if (baseFill) {
                    baseFill.style.fill = COLOR_MAPPING[cassette.status] || COLOR_MAPPING['idle'];
                }

                wrapper.appendChild(overlayText);
                slot.appendChild(wrapper);
                slot.appendChild(tooltip);
            });
        queue.appendChild(slot);
    });
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

    const els = {
        retractedOpen0: document.getElementById('arm-retracted-open-0'),
        retractedOpen180: document.getElementById('arm-retracted-open-180'),
        extendedOpen0: document.getElementById('arm-extended-open-0'),
        extendedClosed0: document.getElementById('arm-extended-closed-0'),
        extendedOpen180: document.getElementById('arm-extended-open-180'),
        extendedClosed180: document.getElementById('arm-extended-closed-180'),
        pick0: document.getElementById('tape-cassette-pick-0'),
        pick180: document.getElementById('tape-cassette-pick-180'),
        rotator: document.getElementById('arm-rotator')
    };

    const btnSwap = document.getElementById('btn-swap');
    const swapUp = btnSwap.querySelector('.btn-up');
    const swapDown = btnSwap.querySelector('.btn-down');

    // CSS-driven pulse animation
    btnSwap.classList.add('anim-active');

    // Make sure we are at baseline before start
    els.rotator.style.transition = 'none';
    els.rotator.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    await delay(50);
    els.rotator.style.transition = 'transform 3s ease-in-out';

    // --- PICK ---
    els.retractedOpen0.classList.remove('hidden');
    els.retractedOpen180.classList.remove('hidden');
    await delay(500);
    els.retractedOpen0.classList.add('hidden');
    els.extendedOpen0.classList.remove('hidden');
    await delay(1000);
    els.pick0.classList.remove('hidden');
    await delay(250);
    els.extendedOpen0.classList.add('hidden');
    els.extendedClosed0.classList.remove('hidden');
    els.pick0.style.transform = 'translate(-50%, calc(-50% - 100px)) rotate(0deg)';
    els.pick0.style.transition = 'transform 0.5s ease-in-out';

    await delay(500);

    // --- ROTATE ---
    els.rotator.style.transform = 'translate(-50%, -50%) rotate(180deg)';
    await delay(3000);

    // Reset visual mapping since physical rotation happened 180
    els.rotator.style.transition = 'none';
    els.rotator.style.transform = 'translate(-50%, -50%) rotate(0deg)';

    els.extendedClosed0.classList.add('hidden');
    els.pick0.classList.add('hidden');
    els.pick0.style.transition = 'none';
    els.pick0.style.transform = 'translate(-50%, -50%) rotate(0deg)';

    // --- PLACE ---
    els.pick180.style.transform = 'translate(-50%, calc(-50% + 100px)) rotate(180deg)';
    els.pick180.classList.remove('hidden');

    els.extendedOpen0.classList.remove('hidden');
    els.extendedClosed180.classList.remove('hidden');

    els.rotator.style.transition = 'transform 3s ease-in-out';
    els.pick180.style.transition = 'transform 0.25s ease-in-out';
    await delay(250);

    els.pick180.style.transform = 'translate(-50%, -50%) rotate(180deg)';

    await delay(1000);

    await delay(250);

    els.pick180.classList.add('hidden');

    await delay(500);

    els.extendedOpen0.classList.add('hidden');
    els.extendedClosed180.classList.add('hidden');

    els.retractedOpen0.classList.remove('hidden');
    // retractedOpen180 is already shown

    btnSwap.classList.remove('anim-active');

    isAnimating = false;
}
