// ============================================================
//  OTV ARPS — BROADCAST SCHEDULE ENGINE
//  js/schedule.js
// ============================================================

// ---- LIBRARY DATABASE (GrimoireVol2 — synced with app.js) ----
const LIBRARY_DATABASE = [
    // ── Movies ────────────────────────────────────────────────────────────
    { cat: 'Movies', label: '2001: A Space Odyssey', subLabel: '1968 Kubrick Epic',         duration: '02:22:00', path: '/Volumes/GrimoireVol2/LIBRARY/Movies/2001 A Space Odyssey (1968)/2001 A Space Odyssey (1968).mp4' },
    { cat: 'Movies', label: 'Akira',                 subLabel: '1988 Anime Masterpiece',    duration: '02:04:00', path: '/Volumes/GrimoireVol2/LIBRARY/Movies/Akira (1988)/Akira (1988).mkv' },
    { cat: 'Movies', label: 'Blade Runner',          subLabel: '1982 Sci-Fi Noir',          duration: '01:57:00', path: '/Volumes/GrimoireVol2/LIBRARY/Movies/Blade Runner (1982)/Blade Runner (1982).mkv' },
    { cat: 'Movies', label: 'Brazil',                subLabel: '1985 Gilliam Dystopia',     duration: '02:12:00', path: '/Volumes/GrimoireVol2/LIBRARY/Movies/Brazil (1985)/Brazil (1985).mkv' },
    { cat: 'Movies', label: 'Escape From New York',  subLabel: '1981 Carpenter Classic',   duration: '01:39:00', path: '/Volumes/GrimoireVol2/LIBRARY/Movies/Escape From New York (1981)/Escape From New York (1981).mkv' },
    { cat: 'Movies', label: 'Fantastic Planet',      subLabel: '1973 French Sci-Fi',        duration: '01:12:00', path: '/Volumes/GrimoireVol2/LIBRARY/Movies/Fantastic Planet (1973)/Fantastic Planet (1973).mkv' },
    { cat: 'Movies', label: 'Hackers',               subLabel: '1995 Cyberpunk Classic',    duration: '01:45:00', path: '/Volumes/GrimoireVol2/LIBRARY/Movies/Hackers (1995)/Hackers (1995).mkv' },
    { cat: 'Movies', label: 'Heavy Metal',           subLabel: '1981 Adult Animation',      duration: '01:27:00', path: '/Volumes/GrimoireVol2/LIBRARY/Movies/Heavy Metal (1981)/Heavy Metal (1981).mkv' },
    { cat: 'Movies', label: 'The Matrix',            subLabel: '1999 Cyberpunk Action',     duration: '02:16:00', path: '/Volumes/GrimoireVol2/LIBRARY/Movies/The Matrix (1999)/The Matrix (1999).mkv' },
    { cat: 'Movies', label: 'Tetsuo The Iron Man',   subLabel: '1989 Japanese Body Horror', duration: '01:07:00', path: '/Volumes/GrimoireVol2/LIBRARY/Movies/Tetsuo The Iron Man (1989)/Tetsuo The Iron Man (1989).mkv' },
    { cat: 'Movies', label: 'They Live',             subLabel: '1988 Carpenter Satire',     duration: '01:34:00', path: '/Volumes/GrimoireVol2/LIBRARY/Movies/They Live (1988)/They Live (1988).mp4' },
    { cat: 'Movies', label: 'Videodrome',            subLabel: '1983 Cronenberg Horror',    duration: '01:27:00', path: '/Volumes/GrimoireVol2/LIBRARY/Movies/Videodrome (1983)/Videodrome (1983).mp4' },
    // ── Shows ─────────────────────────────────────────────────────────────
    { cat: 'Shows', label: 'Batman S01E01',          subLabel: 'Hi Diddle Riddle (1966)',   duration: '00:25:00', path: '/Volumes/GrimoireVol2/LIBRARY/Shows/Shows/Batman (1966)/Season 01/' },
    { cat: 'Shows', label: 'Bill Nye S01E01',        subLabel: 'Skin — Science Guy (1993)', duration: '00:26:00', path: '/Volumes/GrimoireVol2/LIBRARY/Shows/Shows/Bill Nye the Science Guy (1993)/Season 01/Bill Nye the Science Guy - S01E01.mp4' },
    { cat: 'Shows', label: 'Inspector Gadget S01E01',subLabel: 'Winter Olympics (1983)',    duration: '00:22:00', path: '/Volumes/GrimoireVol2/LIBRARY/Shows/Shows/Inspector Gadget/Season 01/' },
    { cat: 'Shows', label: 'ReBoot S01E01',          subLabel: 'The Tearing (1994)',        duration: '00:22:00', path: '/Volumes/GrimoireVol2/LIBRARY/Shows/Shows/ReBoot/Season 01/' },
    { cat: 'Shows', label: 'Rick and Morty S01E01',  subLabel: 'Pilot (2013)',              duration: '00:22:00', path: '/Volumes/GrimoireVol2/LIBRARY/Shows/Shows/Rick and Morty/Season 01/' },
    { cat: 'Shows', label: 'Thundercats S01E01',     subLabel: 'Exodus (1985)',             duration: '00:22:00', path: '/Volumes/GrimoireVol2/LIBRARY/Shows/Shows/Thundercats (1985)/Season 01/' },
    // ── Station IDs ───────────────────────────────────────────────────────
    { cat: 'Station ID', label: 'BIGTIMETV',         subLabel: 'BPM TV Ident',             duration: '00:00:30', path: '/Volumes/GrimoireVol2/LIBRARY/Station_ID/BIGTIMETV.mp4' },
    { cat: 'Station ID', label: 'BIGTIMETV2',        subLabel: 'BPM TV Ident v2',          duration: '00:00:30', path: '/Volumes/GrimoireVol2/LIBRARY/Station_ID/BIGTIMETV2.mp4' },
    { cat: 'Station ID', label: 'BPM Starfield Loader', subLabel: 'Starfield Loop',        duration: '00:00:15', path: '/Volumes/GrimoireVol2/LIBRARY/Station_ID/BPM Starfield Loader.mp4' },
    { cat: 'Station ID', label: 'BPM Starfield Grid',subLabel: 'Grid Loader Loop',         duration: '00:00:15', path: '/Volumes/GrimoireVol2/LIBRARY/Station_ID/BPM Starfield Grid Loader.mp4' },
    { cat: 'Station ID', label: 'BPMTVBAR',          subLabel: 'TV Bar Ident',             duration: '00:00:15', path: '/Volumes/GrimoireVol2/LIBRARY/Station_ID/BPMTVBAR.mp4' },
    { cat: 'Station ID', label: 'BPMTVBAR2',         subLabel: 'TV Bar Ident v2',          duration: '00:00:15', path: '/Volumes/GrimoireVol2/LIBRARY/Station_ID/BPMTVBAR2.mp4' },
    { cat: 'Station ID', label: 'BPM Bloop',         subLabel: 'Transition Bloop',         duration: '00:00:05', path: '/Volumes/GrimoireVol2/LIBRARY/Station_ID/BPM Bloop.mp4' },
    { cat: 'Station ID', label: 'MM Stomp Loop',     subLabel: 'Maudlin Modellers',        duration: '00:00:15', path: '/Volumes/GrimoireVol2/LIBRARY/Station_ID/MM Stomp Loop.mp4' },
    { cat: 'Station ID', label: 'MM Starfield Stamp',subLabel: 'Maudlin Modellers',        duration: '00:00:15', path: '/Volumes/GrimoireVol2/LIBRARY/Station_ID/Maudlin Modellers Starfield Stamp.mp4' },
    { cat: 'Station ID', label: 'PigDrop',           subLabel: 'BPM Animated Logo Drop',   duration: '00:00:10', path: '/Volumes/GrimoireVol2/LIBRARY/Station_ID/PigDrop.mp4' },
    { cat: 'Station ID', label: 'BG Loop Green',     subLabel: 'Background Loop',          duration: '00:01:00', path: '/Volumes/GrimoireVol2/LIBRARY/Station_ID/background loop green.mp4' },
    // ── Music Videos ──────────────────────────────────────────────────────
    { cat: 'Music Videos', label: '19-2000',          subLabel: 'Gorillaz',                duration: '00:03:30', path: '/Volumes/GrimoireVol2/LIBRARY/Music_Videos/19-2000.mp4' },
    { cat: 'Music Videos', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',      duration: '00:03:28', path: '/Volumes/GrimoireVol2/LIBRARY/Videos/ACDC - Highway To Hell.mp4' },
    { cat: 'Music Videos', label: 'ACDC - Let There Be Rock', subLabel: 'Live Classic',    duration: '00:05:50', path: '/Volumes/GrimoireVol2/LIBRARY/Videos/ACDC - Let There Be Rock.mp4' },
    { cat: 'Music Videos', label: 'AFX Untitled B1', subLabel: 'Rabbit City Records',      duration: '00:05:00', path: '/Volumes/GrimoireVol2/LIBRARY/Videos/AFX Untiled B1 (RABBIT CITY RECORDS).mp4' },
    { cat: 'Music Videos', label: 'Afterlife',        subLabel: 'Electronic',              duration: '00:04:30', path: '/Volumes/GrimoireVol2/LIBRARY/Videos/Afterlife.mp4' },
    { cat: 'Music Videos', label: 'Always',           subLabel: 'Music Video',             duration: '00:04:00', path: '/Volumes/GrimoireVol2/LIBRARY/Videos/Always.mp4' },
    { cat: 'Music Videos', label: 'Alrabaiye 1993',   subLabel: 'Electronic 93',           duration: '00:04:20', path: '/Volumes/GrimoireVol2/LIBRARY/Videos/Alrabaiye 1993.mp4' },
    { cat: 'Music Videos', label: 'Abracadabra',      subLabel: 'Music Video',             duration: '00:03:45', path: '/Volumes/GrimoireVol2/LIBRARY/Videos/Abracadabra.mp4' },
    // ── Videos ────────────────────────────────────────────────────────────
    { cat: 'Videos', label: 'StarfieldLoop',         subLabel: 'Space Background',         duration: '00:01:00', path: '/Volumes/GrimoireVol2/LIBRARY/Videos/StarfieldLoop.mp4' },
    { cat: 'Videos', label: 'Joshua Light Show',     subLabel: '1969 Liquid Loops',        duration: '00:45:00', path: '/Volumes/GrimoireVol2/LIBRARY/Videos/The Joshua Light Show - Liquid Loops (1969)/' },
];

const DAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const TYPE_COLORS = {
    'Movies':       '#00adee',
    'Shows':        '#4caf50',
    'Ads':          '#ff9800',
    'Station ID':   '#ffdb00',
    'Music Videos': '#ce93d8',
    'News':         '#e53935',
    'Videos':       '#66605a',
};

// ---- STATE ----
// Week schedule: array of 7 days, each day = sorted array of slot objects
// slot: { id, time: "HH:MM", label, subLabel, duration, cat, status: "scheduled"|"live"|"done"|"skip" }
let schedule = Array.from({ length: 7 }, () => []);
let currentDay = 0;      // 0 = Mon
let currentFilter = 'all';
let editingSlotId = null;
let deletingSlotId = null;
let selectedLibraryItem = null;
let slotIdCounter = 0;

// ---- SEED DATA — Full 24h Broadcast Day ----
function seedSchedule() {
    const seed = [
        // ── MONDAY: Full 24h Broadcast Day ──────────────────────────────────
        // 06:00–09:00  Morning Music Block
        [0, { time: '06:00', label: 'BIGTIMETV',              subLabel: 'Station Open',          cat: 'Station ID',   duration: '00:00:30', status: 'done' }],
        [0, { time: '06:01', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'done' }],
        [0, { time: '06:05', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',          cat: 'Music Videos', duration: '00:03:28', status: 'done' }],
        [0, { time: '06:09', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'done' }],
        [0, { time: '06:13', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'done' }],
        [0, { time: '06:14', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'done' }],
        [0, { time: '06:18', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'done' }],
        [0, { time: '06:23', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'done' }],
        [0, { time: '06:28', label: 'BIGTIMETV2',             subLabel: 'BPM TV Ident v2',       cat: 'Station ID',   duration: '00:00:30', status: 'done' }],
        [0, { time: '06:29', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'done' }],
        [0, { time: '06:33', label: 'ACDC - Let There Be Rock', subLabel: 'Live Classic',        cat: 'Music Videos', duration: '00:05:50', status: 'done' }],
        [0, { time: '06:39', label: 'BPMTVBAR2',              subLabel: 'TV Bar Ident v2',       cat: 'Station ID',   duration: '00:00:15', status: 'done' }],
        [0, { time: '06:40', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'done' }],
        [0, { time: '06:44', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'done' }],
        [0, { time: '06:48', label: 'MM Stomp Loop',          subLabel: 'Maudlin Modellers',     cat: 'Station ID',   duration: '00:00:15', status: 'done' }],
        [0, { time: '06:49', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'done' }],
        [0, { time: '06:53', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'done' }],
        [0, { time: '06:57', label: 'PigDrop',                subLabel: 'BPM Animated Logo',     cat: 'Station ID',   duration: '00:00:10', status: 'done' }],
        [0, { time: '06:58', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'done' }],
        [0, { time: '07:03', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'done' }],
        [0, { time: '07:04', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'done' }],
        [0, { time: '07:08', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',          cat: 'Music Videos', duration: '00:03:28', status: 'done' }],
        [0, { time: '07:12', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'done' }],
        [0, { time: '07:16', label: 'MM Starfield Stamp',     subLabel: 'Maudlin Modellers',     cat: 'Station ID',   duration: '00:00:15', status: 'done' }],
        [0, { time: '07:17', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'done' }],
        [0, { time: '07:21', label: 'ACDC - Let There Be Rock', subLabel: 'Live Classic',        cat: 'Music Videos', duration: '00:05:50', status: 'done' }],
        [0, { time: '07:27', label: 'BIGTIMETV',              subLabel: 'Station ID',            cat: 'Station ID',   duration: '00:00:30', status: 'done' }],
        [0, { time: '07:28', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'done' }],
        [0, { time: '07:32', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'done' }],
        [0, { time: '07:36', label: 'BPMTVBAR2',              subLabel: 'TV Bar Ident v2',       cat: 'Station ID',   duration: '00:00:15', status: 'done' }],
        [0, { time: '07:37', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'done' }],
        [0, { time: '07:42', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'done' }],
        [0, { time: '07:46', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'done' }],
        [0, { time: '07:50', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'done' }],
        [0, { time: '07:51', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',          cat: 'Music Videos', duration: '00:03:28', status: 'done' }],
        [0, { time: '07:55', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'done' }],
        [0, { time: '07:59', label: 'PigDrop',                subLabel: 'BPM Animated Logo',     cat: 'Station ID',   duration: '00:00:10', status: 'done' }],
        [0, { time: '08:00', label: 'BIGTIMETV2',             subLabel: 'BPM TV Ident v2',       cat: 'Station ID',   duration: '00:00:30', status: 'done' }],
        [0, { time: '08:01', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'done' }],
        [0, { time: '08:05', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'done' }],
        [0, { time: '08:09', label: 'ACDC - Let There Be Rock', subLabel: 'Live Classic',        cat: 'Music Videos', duration: '00:05:50', status: 'done' }],
        [0, { time: '08:15', label: 'MM Stomp Loop',          subLabel: 'Maudlin Modellers',     cat: 'Station ID',   duration: '00:00:15', status: 'done' }],
        [0, { time: '08:16', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'done' }],
        [0, { time: '08:21', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'done' }],
        [0, { time: '08:25', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'done' }],
        [0, { time: '08:26', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'done' }],
        [0, { time: '08:30', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'done' }],
        [0, { time: '08:34', label: 'BIGTIMETV',              subLabel: 'Station ID',            cat: 'Station ID',   duration: '00:00:30', status: 'done' }],
        [0, { time: '08:35', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',          cat: 'Music Videos', duration: '00:03:28', status: 'done' }],
        [0, { time: '08:39', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'done' }],
        [0, { time: '08:43', label: 'MM Starfield Stamp',     subLabel: 'Maudlin Modellers',     cat: 'Station ID',   duration: '00:00:15', status: 'done' }],
        [0, { time: '08:44', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'done' }],
        [0, { time: '08:48', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'done' }],
        [0, { time: '08:52', label: 'BPMTVBAR2',              subLabel: 'TV Bar Ident v2',       cat: 'Station ID',   duration: '00:00:15', status: 'done' }],
        [0, { time: '08:53', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'done' }],
        [0, { time: '08:58', label: 'BPM Starfield Loader',   subLabel: 'Starfield Loop',        cat: 'Station ID',   duration: '00:00:15', status: 'done' }],

        // 09:00–12:00  Long-Form Movie Block
        [0, { time: '09:00', label: '2001: A Space Odyssey',  subLabel: '1968 Kubrick Epic',     cat: 'Movies',       duration: '02:22:00', status: 'live' }],
        [0, { time: '11:22', label: 'BIGTIMETV2',             subLabel: 'BPM TV Ident v2',       cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '11:23', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'scheduled' }],
        [0, { time: '11:28', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'scheduled' }],
        [0, { time: '11:32', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '11:33', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'scheduled' }],
        [0, { time: '11:37', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'scheduled' }],
        [0, { time: '11:41', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',          cat: 'Music Videos', duration: '00:03:28', status: 'scheduled' }],
        [0, { time: '11:44', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'scheduled' }],
        [0, { time: '11:48', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'scheduled' }],
        [0, { time: '11:51', label: 'BIGTIMETV',              subLabel: 'Station ID',            cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '11:52', label: 'ACDC - Let There Be Rock', subLabel: 'Live Classic',        cat: 'Music Videos', duration: '00:05:50', status: 'scheduled' }],
        [0, { time: '11:58', label: 'PigDrop',                subLabel: 'BPM Animated Logo',     cat: 'Station ID',   duration: '00:00:10', status: 'scheduled' }],

        // 12:00–14:00  Music Video Countdown Block
        [0, { time: '12:00', label: 'BIGTIMETV2',             subLabel: 'COUNTDOWN BLOCK OPEN',  cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '12:01', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'scheduled' }],
        [0, { time: '12:05', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',          cat: 'Music Videos', duration: '00:03:28', status: 'scheduled' }],
        [0, { time: '12:08', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'scheduled' }],
        [0, { time: '12:13', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '12:13', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'scheduled' }],
        [0, { time: '12:17', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'scheduled' }],
        [0, { time: '12:22', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'scheduled' }],
        [0, { time: '12:26', label: 'BPMTVBAR2',              subLabel: 'TV Bar Ident v2',       cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '12:27', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'scheduled' }],
        [0, { time: '12:31', label: 'ACDC - Let There Be Rock', subLabel: 'Live Classic',        cat: 'Music Videos', duration: '00:05:50', status: 'scheduled' }],
        [0, { time: '12:37', label: 'MM Stomp Loop',          subLabel: 'Maudlin Modellers',     cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '12:38', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'scheduled' }],
        [0, { time: '12:42', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',          cat: 'Music Videos', duration: '00:03:28', status: 'scheduled' }],
        [0, { time: '12:45', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'scheduled' }],
        [0, { time: '12:50', label: 'BIGTIMETV',              subLabel: 'Station ID',            cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '12:51', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'scheduled' }],
        [0, { time: '12:54', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'scheduled' }],
        [0, { time: '12:58', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '12:59', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'scheduled' }],
        [0, { time: '13:04', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'scheduled' }],
        [0, { time: '13:08', label: 'BPMTVBAR2',              subLabel: 'TV Bar Ident v2',       cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '13:09', label: 'ACDC - Let There Be Rock', subLabel: 'Live Classic',        cat: 'Music Videos', duration: '00:05:50', status: 'scheduled' }],
        [0, { time: '13:15', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'scheduled' }],
        [0, { time: '13:18', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'scheduled' }],
        [0, { time: '13:23', label: 'BIGTIMETV2',             subLabel: 'BPM TV Ident v2',       cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '13:24', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'scheduled' }],
        [0, { time: '13:28', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'scheduled' }],
        [0, { time: '13:31', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'scheduled' }],
        [0, { time: '13:36', label: 'MM Starfield Stamp',     subLabel: 'Maudlin Modellers',     cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '13:37', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',          cat: 'Music Videos', duration: '00:03:28', status: 'scheduled' }],
        [0, { time: '13:40', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'scheduled' }],
        [0, { time: '13:44', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '13:45', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'scheduled' }],
        [0, { time: '13:49', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'scheduled' }],
        [0, { time: '13:53', label: 'ACDC - Let There Be Rock', subLabel: 'Live Classic',        cat: 'Music Videos', duration: '00:05:50', status: 'scheduled' }],
        [0, { time: '13:59', label: 'PigDrop',                subLabel: 'BPM Animated Logo',     cat: 'Station ID',   duration: '00:00:10', status: 'scheduled' }],

        // 14:00–16:00  Show Episodes Block
        [0, { time: '14:00', label: 'Bill Nye S01E01',        subLabel: 'Skin — Science Guy',    cat: 'Shows',        duration: '00:26:00', status: 'scheduled' }],
        [0, { time: '14:26', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '14:27', label: 'Inspector Gadget S01E01',subLabel: 'Winter Olympics',       cat: 'Shows',        duration: '00:22:00', status: 'scheduled' }],
        [0, { time: '14:49', label: 'BPMTVBAR2',              subLabel: 'TV Bar Ident v2',       cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '14:50', label: 'Batman S01E01',          subLabel: 'Hi Diddle Riddle 1966', cat: 'Shows',        duration: '00:25:00', status: 'scheduled' }],
        [0, { time: '15:15', label: 'MM Stomp Loop',          subLabel: 'Maudlin Modellers',     cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '15:16', label: 'Rick and Morty S01E01',  subLabel: 'Pilot (2013)',          cat: 'Shows',        duration: '00:22:00', status: 'scheduled' }],
        [0, { time: '15:38', label: 'BIGTIMETV',              subLabel: 'Station ID',            cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '15:39', label: 'ReBoot S01E01',          subLabel: 'The Tearing (1994)',    cat: 'Shows',        duration: '00:22:00', status: 'scheduled' }],
        [0, { time: '16:01', label: 'Thundercats S01E01',     subLabel: 'Exodus (1985)',         cat: 'Shows',        duration: '00:22:00', status: 'scheduled' }],

        // 16:00–18:00  Afternoon Music Block
        [0, { time: '16:00', label: 'BIGTIMETV2',             subLabel: 'Afternoon Block Open',  cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '16:23', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '16:45', label: 'BPMTVBAR2',              subLabel: 'TV Bar Ident v2',       cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '17:10', label: 'MM Starfield Stamp',     subLabel: 'Maudlin Modellers',     cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '17:35', label: 'PigDrop',                subLabel: 'BPM Animated Logo',     cat: 'Station ID',   duration: '00:00:10', status: 'scheduled' }],
        [0, { time: '17:59', label: 'BIGTIMETV',              subLabel: 'Prime Time Intro',      cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],

        // 18:00–20:00  Prime Time Movie
        [0, { time: '18:00', label: 'Blade Runner',           subLabel: '1982 Sci-Fi Noir',      cat: 'Movies',       duration: '01:57:00', status: 'scheduled' }],
        [0, { time: '19:57', label: 'BIGTIMETV2',             subLabel: 'BPM TV Ident v2',       cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '19:58', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'scheduled' }],

        // 20:00–22:00  Evening Show Block
        [0, { time: '20:00', label: 'Rick and Morty S01E01',  subLabel: 'Pilot (2013)',          cat: 'Shows',        duration: '00:22:00', status: 'scheduled' }],
        [0, { time: '20:22', label: 'Thundercats S01E01',     subLabel: 'Exodus (1985)',         cat: 'Shows',        duration: '00:22:00', status: 'scheduled' }],
        [0, { time: '20:44', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '20:45', label: 'Batman S01E01',          subLabel: 'Hi Diddle Riddle 1966', cat: 'Shows',        duration: '00:25:00', status: 'scheduled' }],
        [0, { time: '21:10', label: 'Inspector Gadget S01E01',subLabel: 'Winter Olympics',       cat: 'Shows',        duration: '00:22:00', status: 'scheduled' }],
        [0, { time: '21:32', label: 'Bill Nye S01E01',        subLabel: 'Skin — Science Guy',    cat: 'Shows',        duration: '00:26:00', status: 'scheduled' }],
        [0, { time: '21:58', label: 'BPMTVBAR2',              subLabel: 'TV Bar Ident v2',       cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '21:59', label: 'PigDrop',                subLabel: 'BPM Animated Logo',     cat: 'Station ID',   duration: '00:00:10', status: 'scheduled' }],

        // 22:00–00:00  Late Night Music Videos
        [0, { time: '22:00', label: 'BIGTIMETV',              subLabel: 'Late Night Open',       cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '22:01', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',          cat: 'Music Videos', duration: '00:03:28', status: 'scheduled' }],
        [0, { time: '22:05', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'scheduled' }],
        [0, { time: '22:09', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'scheduled' }],
        [0, { time: '22:14', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '22:14', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'scheduled' }],
        [0, { time: '22:18', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'scheduled' }],
        [0, { time: '22:23', label: 'ACDC - Let There Be Rock', subLabel: 'Live Classic',        cat: 'Music Videos', duration: '00:05:50', status: 'scheduled' }],
        [0, { time: '22:29', label: 'MM Stomp Loop',          subLabel: 'Maudlin Modellers',     cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '22:30', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'scheduled' }],
        [0, { time: '22:34', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'scheduled' }],
        [0, { time: '22:38', label: 'BIGTIMETV2',             subLabel: 'BPM TV Ident v2',       cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '22:39', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'scheduled' }],
        [0, { time: '22:43', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'scheduled' }],
        [0, { time: '22:48', label: 'BPMTVBAR2',              subLabel: 'TV Bar Ident v2',       cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '22:48', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'scheduled' }],
        [0, { time: '22:52', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',          cat: 'Music Videos', duration: '00:03:28', status: 'scheduled' }],
        [0, { time: '22:55', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'scheduled' }],
        [0, { time: '22:59', label: 'PigDrop',                subLabel: 'BPM Animated Logo',     cat: 'Station ID',   duration: '00:00:10', status: 'scheduled' }],
        [0, { time: '23:00', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'scheduled' }],
        [0, { time: '23:05', label: 'ACDC - Let There Be Rock', subLabel: 'Live Classic',        cat: 'Music Videos', duration: '00:05:50', status: 'scheduled' }],
        [0, { time: '23:11', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '23:12', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'scheduled' }],
        [0, { time: '23:15', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'scheduled' }],
        [0, { time: '23:20', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'scheduled' }],
        [0, { time: '23:24', label: 'MM Starfield Stamp',     subLabel: 'Maudlin Modellers',     cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '23:25', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'scheduled' }],
        [0, { time: '23:29', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'scheduled' }],
        [0, { time: '23:33', label: 'BIGTIMETV',              subLabel: 'Station ID',            cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '23:34', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',          cat: 'Music Videos', duration: '00:03:28', status: 'scheduled' }],
        [0, { time: '23:37', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'scheduled' }],
        [0, { time: '23:42', label: 'BPMTVBAR2',              subLabel: 'TV Bar Ident v2',       cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '23:43', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'scheduled' }],
        [0, { time: '23:46', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'scheduled' }],
        [0, { time: '23:51', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'scheduled' }],
        [0, { time: '23:55', label: 'BPM Starfield Loader',   subLabel: 'Starfield Loop',        cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '23:56', label: 'BG Loop Green',          subLabel: 'Background Loop',       cat: 'Station ID',   duration: '00:01:00', status: 'scheduled' }],
        [0, { time: '23:57', label: 'MM Stomp Loop',          subLabel: 'Maudlin Modellers',     cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '23:58', label: 'BIGTIMETV2',             subLabel: 'Overnight Intro',       cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],

        // 00:00–06:00  Overnight Movie Loop
        [0, { time: '00:00', label: 'Heavy Metal',            subLabel: '1981 Adult Animation',  cat: 'Movies',       duration: '01:27:00', status: 'scheduled' }],
        [0, { time: '01:27', label: 'BIGTIMETV',              subLabel: 'Station ID',            cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '01:28', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'scheduled' }],
        [0, { time: '01:31', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'scheduled' }],
        [0, { time: '01:36', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'scheduled' }],
        [0, { time: '01:40', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '01:41', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'scheduled' }],
        [0, { time: '01:44', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'scheduled' }],
        [0, { time: '01:49', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'scheduled' }],
        [0, { time: '01:53', label: 'BIGTIMETV2',             subLabel: 'BPM TV Ident v2',       cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '01:54', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',          cat: 'Music Videos', duration: '00:03:28', status: 'scheduled' }],
        [0, { time: '01:57', label: 'PigDrop',                subLabel: 'BPM Animated Logo',     cat: 'Station ID',   duration: '00:00:10', status: 'scheduled' }],
        [0, { time: '01:58', label: 'ACDC - Let There Be Rock', subLabel: 'Live Classic',        cat: 'Music Videos', duration: '00:05:50', status: 'scheduled' }],
        [0, { time: '02:00', label: 'They Live',              subLabel: '1988 Carpenter Satire', cat: 'Movies',       duration: '01:34:00', status: 'scheduled' }],
        [0, { time: '03:34', label: 'BPMTVBAR2',              subLabel: 'TV Bar Ident v2',       cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '03:35', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'scheduled' }],
        [0, { time: '03:40', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'scheduled' }],
        [0, { time: '03:44', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'scheduled' }],
        [0, { time: '03:48', label: 'BIGTIMETV',              subLabel: 'Station ID',            cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '03:49', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'scheduled' }],
        [0, { time: '03:52', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'scheduled' }],
        [0, { time: '03:57', label: 'MM Stomp Loop',          subLabel: 'Maudlin Modellers',     cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '03:57', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'scheduled' }],
        [0, { time: '04:00', label: 'Fantastic Planet',       subLabel: '1973 French Sci-Fi',    cat: 'Movies',       duration: '01:12:00', status: 'scheduled' }],
        [0, { time: '05:12', label: 'BPM Starfield Loader',   subLabel: 'Starfield Loop',        cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '05:13', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'scheduled' }],
        [0, { time: '05:16', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'scheduled' }],
        [0, { time: '05:21', label: 'BIGTIMETV2',             subLabel: 'BPM TV Ident v2',       cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],
        [0, { time: '05:22', label: 'Alrabaiye 1993',         subLabel: 'Electronic 93',         cat: 'Music Videos', duration: '00:04:20', status: 'scheduled' }],
        [0, { time: '05:26', label: 'AFX Untitled B1',        subLabel: 'Rabbit City Records',   cat: 'Music Videos', duration: '00:05:00', status: 'scheduled' }],
        [0, { time: '05:31', label: 'BPMTVBAR',              subLabel: 'TV Bar Ident',           cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '05:32', label: 'Abracadabra',            subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:03:45', status: 'scheduled' }],
        [0, { time: '05:36', label: 'Always',                 subLabel: 'Music Video',           cat: 'Music Videos', duration: '00:04:00', status: 'scheduled' }],
        [0, { time: '05:40', label: 'ACDC - Highway To Hell', subLabel: 'Rock Classic',          cat: 'Music Videos', duration: '00:03:28', status: 'scheduled' }],
        [0, { time: '05:43', label: 'BPMTVBAR2',              subLabel: 'TV Bar Ident v2',       cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '05:44', label: 'ACDC - Let There Be Rock', subLabel: 'Live Classic',        cat: 'Music Videos', duration: '00:05:50', status: 'scheduled' }],
        [0, { time: '05:50', label: 'BG Loop Green',          subLabel: 'Background Loop',       cat: 'Station ID',   duration: '00:01:00', status: 'scheduled' }],
        [0, { time: '05:51', label: 'MM Starfield Stamp',     subLabel: 'Maudlin Modellers',     cat: 'Station ID',   duration: '00:00:15', status: 'scheduled' }],
        [0, { time: '05:52', label: '19-2000',                subLabel: 'Gorillaz',              cat: 'Music Videos', duration: '00:03:30', status: 'scheduled' }],
        [0, { time: '05:55', label: 'Afterlife',              subLabel: 'Electronic',            cat: 'Music Videos', duration: '00:04:30', status: 'scheduled' }],
        [0, { time: '05:59', label: 'BIGTIMETV',              subLabel: 'Station ID — Sign On',  cat: 'Station ID',   duration: '00:00:30', status: 'scheduled' }],

        // ── Other days (sparse, populated from library) ──────────────────
        [1, { time: '09:00', label: 'Akira',                  subLabel: '1988 Anime Masterpiece',cat: 'Movies',       duration: '02:04:00', status: 'scheduled' }],
        [1, { time: '14:00', label: 'ReBoot S01E01',          subLabel: 'The Tearing (1994)',    cat: 'Shows',        duration: '00:22:00', status: 'scheduled' }],
        [1, { time: '18:00', label: 'They Live',              subLabel: '1988 Carpenter Satire', cat: 'Movies',       duration: '01:34:00', status: 'scheduled' }],
        [1, { time: '20:00', label: 'Videodrome',             subLabel: '1983 Cronenberg Horror',cat: 'Movies',       duration: '01:27:00', status: 'scheduled' }],
        [2, { time: '09:00', label: 'Brazil',                 subLabel: '1985 Gilliam Dystopia', cat: 'Movies',       duration: '02:12:00', status: 'scheduled' }],
        [2, { time: '18:00', label: 'Hackers',                subLabel: '1995 Cyberpunk Classic',cat: 'Movies',       duration: '01:45:00', status: 'scheduled' }],
        [2, { time: '20:00', label: 'Rick and Morty S01E01',  subLabel: 'Pilot (2013)',          cat: 'Shows',        duration: '00:22:00', status: 'scheduled' }],
        [3, { time: '09:00', label: 'Escape From New York',   subLabel: '1981 Carpenter Classic',cat: 'Movies',       duration: '01:39:00', status: 'scheduled' }],
        [3, { time: '18:00', label: 'The Matrix',             subLabel: '1999 Cyberpunk Action', cat: 'Movies',       duration: '02:16:00', status: 'scheduled' }],
        [3, { time: '20:30', label: 'Batman S01E01',          subLabel: 'Hi Diddle Riddle 1966', cat: 'Shows',        duration: '00:25:00', status: 'scheduled' }],
        [4, { time: '09:00', label: 'Tetsuo The Iron Man',    subLabel: '1989 Japanese Body Horror', cat: 'Movies',   duration: '01:07:00', status: 'scheduled' }],
        [4, { time: '18:00', label: 'Heavy Metal',            subLabel: '1981 Adult Animation',  cat: 'Movies',       duration: '01:27:00', status: 'scheduled' }],
        [4, { time: '20:00', label: 'Inspector Gadget S01E01',subLabel: 'Winter Olympics',       cat: 'Shows',        duration: '00:22:00', status: 'scheduled' }],
        [5, { time: '09:00', label: 'Fantastic Planet',       subLabel: '1973 French Sci-Fi',    cat: 'Movies',       duration: '01:12:00', status: 'scheduled' }],
        [5, { time: '14:00', label: 'Thundercats S01E01',     subLabel: 'Exodus (1985)',         cat: 'Shows',        duration: '00:22:00', status: 'scheduled' }],
        [5, { time: '18:00', label: 'Blade Runner',           subLabel: '1982 Sci-Fi Noir',      cat: 'Movies',       duration: '01:57:00', status: 'scheduled' }],
        [5, { time: '20:30', label: 'Bill Nye S01E01',        subLabel: 'Skin — Science Guy',    cat: 'Shows',        duration: '00:26:00', status: 'scheduled' }],
        [6, { time: '10:00', label: 'Akira',                  subLabel: '1988 Anime Masterpiece',cat: 'Movies',       duration: '02:04:00', status: 'scheduled' }],
        [6, { time: '14:00', label: 'Bill Nye S01E01',        subLabel: 'Skin — Science Guy',    cat: 'Shows',        duration: '00:26:00', status: 'scheduled' }],
        [6, { time: '18:00', label: '2001: A Space Odyssey',  subLabel: '1968 Kubrick Epic',     cat: 'Movies',       duration: '02:22:00', status: 'scheduled' }],
        [6, { time: '21:00', label: 'Videodrome',             subLabel: '1983 Cronenberg Horror',cat: 'Movies',       duration: '01:27:00', status: 'scheduled' }],
    ];

    seed.forEach(([day, slot]) => {
        schedule[day].push({ ...slot, id: slotIdCounter++ });
    });
    schedule.forEach(day => day.sort(sortByTime));
}

function sortByTime(a, b) {
    return a.time.localeCompare(b.time);
}

// ---- CLOCK ----
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock-display').textContent = `${h}:${m}:${s}`;
}

// ---- DAY DETECTION ----
function getTodayDayIndex() {
    // JS day: 0=Sun, 1=Mon...6=Sat → remap to Mon=0
    const d = new Date().getDay();
    return (d === 0) ? 6 : d - 1;
}

// ---- RENDER DAY TABS ----
function renderDayTabs() {
    const today = getTodayDayIndex();
    DAY_NAMES.forEach((name, i) => {
        const tab = document.getElementById(`day-tab-${i}`);
        tab.classList.toggle('active', i === currentDay);
        if (i === today) {
            tab.title = 'Today';
        }
    });
}

// ---- RENDER SCHEDULE LIST ----
function renderScheduleList() {
    const list = document.getElementById('schedule-list');
    const empty = document.getElementById('schedule-empty');
    const slots = getFilteredSlots();

    if (slots.length === 0) {
        list.innerHTML = '';
        empty.classList.remove('hidden');
        updateStats();
        return;
    }
    empty.classList.add('hidden');
    list.innerHTML = '';

    slots.forEach(slot => {
        const row = document.createElement('div');
        row.className = 'sched-row';
        row.dataset.status = slot.status;
        row.dataset.id = slot.id;

        const typeCls = 'type-' + slot.cat.replace(/\s+/g, '-');
        const statusLabels = { live: '● ON AIR', scheduled: '◈ QUEUED', done: '✓ DONE', skip: '⊘ SKIP' };

        row.innerHTML = `
            <div class="row-time">${slot.time}</div>
            <div class="row-title-block">
                <span class="row-title">${slot.label}</span>
                <span class="row-sub">${slot.subLabel}</span>
            </div>
            <div class="row-type ${typeCls}">${slot.cat}</div>
            <div class="row-dur">${formatDuration(slot.duration)}</div>
            <div class="row-status" data-s="${slot.status}">${statusLabels[slot.status] || slot.status}</div>
            <div class="row-actions">
                <button class="row-btn edit" data-id="${slot.id}" title="Edit">✎</button>
                <button class="row-btn delete" data-id="${slot.id}" title="Remove">✕</button>
            </div>
        `;
        list.appendChild(row);
    });

    // Wire up row buttons
    list.querySelectorAll('.row-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)));
    });
    list.querySelectorAll('.row-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => openDeleteModal(parseInt(btn.dataset.id)));
    });

    updateStats();
}

function getFilteredSlots() {
    const day = schedule[currentDay];
    if (currentFilter === 'all') return day;
    return day.filter(s => s.cat === currentFilter);
}

// ---- DURATION HELPERS ----
function durationToSeconds(dur) {
    if (!dur) return 0;
    const [h, m, s] = dur.split(':').map(Number);
    return h * 3600 + m * 60 + s;
}

function secondsToDuration(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}

function formatDuration(dur) {
    const secs = durationToSeconds(dur);
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h${String(m).padStart(2, '0')}m`;
    return `${m}m`;
}

// ---- STATS ----
function updateStats() {
    const day = schedule[currentDay];
    const total = day.length;
    const done  = day.filter(s => s.status === 'done').length;
    const live  = day.filter(s => s.status === 'live').length;

    // Total runtime
    const totalSecs = day.reduce((acc, s) => acc + durationToSeconds(s.duration), 0);
    document.getElementById('stat-runtime').textContent = secondsToDuration(totalSecs);
    document.getElementById('stat-slots').textContent = `${done + live} / ${total}`;

    // Next program (first scheduled)
    const next = day.find(s => s.status === 'scheduled');
    const nextEl = document.getElementById('stat-next');
    if (next) {
        nextEl.textContent = `${next.time}\n${next.label}`;
    } else {
        nextEl.textContent = '—';
    }

    // Breakdown bars
    renderBreakdown(day);

    // Week overview
    renderWeekOverview();
}

function renderBreakdown(day) {
    const container = document.getElementById('breakdown-bars');
    container.innerHTML = '';

    // Count minutes per type
    const map = {};
    day.forEach(s => {
        map[s.cat] = (map[s.cat] || 0) + durationToSeconds(s.duration);
    });

    const totalSecs = Object.values(map).reduce((a, b) => a + b, 0) || 1;

    Object.entries(map).sort((a, b) => b[1] - a[1]).forEach(([cat, secs]) => {
        const pct = Math.round((secs / totalSecs) * 100);
        const color = TYPE_COLORS[cat] || '#66605a';
        const div = document.createElement('div');
        div.className = 'breakdown-item';
        div.innerHTML = `
            <div class="bd-label-row">
                <span style="color:${color}">${cat}</span>
                <span>${pct}%</span>
            </div>
            <div class="bd-bar-track">
                <div class="bd-bar-fill" style="width:${pct}%;background:${color}"></div>
            </div>
        `;
        container.appendChild(div);
    });
}

function renderWeekOverview() {
    const container = document.getElementById('week-overview');
    container.innerHTML = '';
    const today = getTodayDayIndex();

    // Max slots for scale
    const maxSlots = Math.max(...schedule.map(d => d.length), 1);

    schedule.forEach((day, i) => {
        const pct = Math.round((day.length / maxSlots) * 100);
        const row = document.createElement('div');
        row.className = `week-day-row${i === today ? ' current' : ''}`;
        row.innerHTML = `
            <span class="week-day-name">${DAY_NAMES[i]}</span>
            <div class="week-day-bar">
                <div class="week-day-fill" style="width:${pct}%"></div>
            </div>
        `;
        row.addEventListener('click', () => {
            currentDay = i;
            renderDayTabs();
            renderScheduleList();
        });
        container.appendChild(row);
    });
}

// ---- ADD SLOT MODAL ----
let modalCategory = 'Movies';

function openAddModal() {
    selectedLibraryItem = null;
    document.getElementById('btn-confirm-add').disabled = true;
    document.getElementById('slot-time').value = getDefaultTime();
    document.getElementById('slot-cat').value = 'Movies';
    modalCategory = 'Movies';
    document.getElementById('modal-search').value = '';
    renderModalResults('');
    document.getElementById('add-modal').classList.remove('hidden');
}

function getDefaultTime() {
    const now = new Date();
    let h = now.getHours();
    let m = Math.ceil(now.getMinutes() / 30) * 30;
    if (m === 60) { h = (h + 1) % 24; m = 0; }
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function renderModalResults(query) {
    const container = document.getElementById('modal-results');
    container.innerHTML = '';
    const cat = document.getElementById('slot-cat').value;

    const filtered = LIBRARY_DATABASE.filter(item =>
        item.cat === cat &&
        item.label.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = '<div style="padding:12px;color:rgba(255,219,0,0.4);font-size:11px;">No titles found</div>';
        return;
    }

    filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = 'modal-result-item';
        div.innerHTML = `
            <span class="ri-title">${item.label}</span>
            <span class="ri-sub">${item.subLabel} | ${formatDuration(item.duration)}</span>
        `;
        div.addEventListener('click', () => {
            container.querySelectorAll('.modal-result-item').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            selectedLibraryItem = item;
            document.getElementById('btn-confirm-add').disabled = false;
        });
        container.appendChild(div);
    });
}

function confirmAddSlot() {
    if (!selectedLibraryItem) return;
    const time = document.getElementById('slot-time').value;
    if (!time) return;

    const slot = {
        id: slotIdCounter++,
        time,
        label:    selectedLibraryItem.label,
        subLabel: selectedLibraryItem.subLabel,
        duration: selectedLibraryItem.duration,
        cat:      selectedLibraryItem.cat,
        status:   'scheduled',
    };
    schedule[currentDay].push(slot);
    schedule[currentDay].sort(sortByTime);

    closeAddModal();
    renderScheduleList();
}

function closeAddModal() {
    document.getElementById('add-modal').classList.add('hidden');
    selectedLibraryItem = null;
}

// ---- EDIT SLOT MODAL ----
function openEditModal(id) {
    const slot = findSlotById(id);
    if (!slot) return;
    editingSlotId = id;
    document.getElementById('edit-time').value = slot.time;
    document.getElementById('edit-status').value = slot.status;
    document.getElementById('edit-modal').classList.remove('hidden');
}

function confirmEditSlot() {
    const slot = findSlotById(editingSlotId);
    if (!slot) return;
    slot.time   = document.getElementById('edit-time').value;
    slot.status = document.getElementById('edit-status').value;
    schedule[currentDay].sort(sortByTime);
    closeEditModal();
    renderScheduleList();
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    editingSlotId = null;
}

// ---- DELETE SLOT MODAL ----
function openDeleteModal(id) {
    const slot = findSlotById(id);
    if (!slot) return;
    deletingSlotId = id;
    document.getElementById('delete-desc').textContent = `Remove "${slot.label}" from ${DAY_NAMES[currentDay]}?`;
    document.getElementById('delete-modal').classList.remove('hidden');
}

function confirmDeleteSlot() {
    schedule[currentDay] = schedule[currentDay].filter(s => s.id !== deletingSlotId);
    closeDeleteModal();
    renderScheduleList();
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
    deletingSlotId = null;
}

// ---- CLEAR DAY ----
function clearDay() {
    if (!confirm(`Clear all slots for ${DAY_NAMES[currentDay]}?`)) return;
    schedule[currentDay] = [];
    renderScheduleList();
}

// ---- UTILS ----
function findSlotById(id) {
    return schedule[currentDay].find(s => s.id === id) || null;
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
    seedSchedule();

    // Set current day to today
    currentDay = getTodayDayIndex();

    // Clock
    updateClock();
    setInterval(updateClock, 1000);

    // Day tabs
    renderDayTabs();
    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            currentDay = parseInt(tab.dataset.day);
            renderDayTabs();
            renderScheduleList();
        });
    });

    // Type filters
    document.querySelectorAll('.type-filter').forEach(f => {
        f.addEventListener('click', () => {
            document.querySelectorAll('.type-filter').forEach(el => el.classList.remove('active'));
            f.classList.add('active');
            currentFilter = f.dataset.type;
            renderScheduleList();
        });
    });

    // Add slot button
    document.getElementById('btn-add-slot').addEventListener('click', openAddModal);
    document.getElementById('add-modal-close').addEventListener('click', closeAddModal);
    document.getElementById('add-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('add-modal')) closeAddModal();
    });

    document.getElementById('slot-cat').addEventListener('change', () => {
        selectedLibraryItem = null;
        document.getElementById('btn-confirm-add').disabled = true;
        document.getElementById('modal-search').value = '';
        renderModalResults('');
    });

    document.getElementById('modal-search').addEventListener('input', e => {
        selectedLibraryItem = null;
        document.getElementById('btn-confirm-add').disabled = true;
        renderModalResults(e.target.value);
    });

    document.getElementById('btn-confirm-add').addEventListener('click', confirmAddSlot);

    // Edit modal
    document.getElementById('edit-modal-close').addEventListener('click', closeEditModal);
    document.getElementById('edit-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('edit-modal')) closeEditModal();
    });
    document.getElementById('btn-confirm-edit').addEventListener('click', confirmEditSlot);

    // Delete modal
    document.getElementById('btn-cancel-delete').addEventListener('click', closeDeleteModal);
    document.getElementById('delete-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('delete-modal')) closeDeleteModal();
    });
    document.getElementById('btn-confirm-delete').addEventListener('click', confirmDeleteSlot);

    // Clear day
    document.getElementById('btn-clear-day').addEventListener('click', clearDay);

    // Escape key closes modals
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeAddModal();
            closeEditModal();
            closeDeleteModal();
        }
    });

    // Initial render
    renderScheduleList();
});
