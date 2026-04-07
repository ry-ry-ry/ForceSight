// NATO APP-6A Symbol Library - Generated from milsymbol
// Based on APP-6A/MIL-STD-2525 specification

import ms from 'milsymbol';

export type Affiliation = 'friendly' | 'hostile' | 'neutral' | 'unknown';

export interface NatoSymbolEntry {
    code: string;
    name: string;
    category: string;
    tags: string[];
}

export const AFFILIATION_PREFIX: Record<Affiliation, string> = {
    friendly: '1',
    hostile: '3',
    neutral: '2',
    unknown: '0'
};

// NATO symbol database with correct names from milsymbol
export const NATO_SYMBOLS: NatoSymbolEntry[] = [
  {
    "code": "sfapc",
    "name": "CIVILIAN",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "civilian"
    ]
  },
  {
    "code": "sfapcf",
    "name": "CIVILIAN FIXED WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "civilian",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sfapch",
    "name": "CIVILIAN ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "civilian",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapcl",
    "name": "CIVILIAN BALLOON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "civilian",
      "balloon"
    ]
  },
  {
    "code": "sfapm",
    "name": "MILITARY",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military"
    ]
  },
  {
    "code": "sfapme",
    "name": "ESCORT",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "escort"
    ]
  },
  {
    "code": "sfapmf",
    "name": "MILITARY FIXED WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sfapmfa",
    "name": "ATTACK/STRIKE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "attack",
      "strike"
    ]
  },
  {
    "code": "sfapmfb",
    "name": "BOMBER",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "bomber",
      "b"
    ]
  },
  {
    "code": "sfapmfc",
    "name": "CARGO",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "cargo",
      "c"
    ]
  },
  {
    "code": "sfapmfch",
    "name": "CARGO",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "cargo",
      "c"
    ]
  },
  {
    "code": "sfapmfcl",
    "name": "CARGO",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "cargo",
      "c"
    ]
  },
  {
    "code": "sfapmfcm",
    "name": "CARGO",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "cargo",
      "c"
    ]
  },
  {
    "code": "sfapmfd",
    "name": "AIRBORNE COMMAND POST",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "airborne",
      "command",
      "post"
    ]
  },
  {
    "code": "sfapmff",
    "name": "FIGHTER",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "fighter",
      "f"
    ]
  },
  {
    "code": "sfapmffi",
    "name": "FIGHTER INTERCEPTOR",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "fighter",
      "interceptor",
      "fi",
      "f"
    ]
  },
  {
    "code": "sfapmfh",
    "name": "PERSONNEL RECOVERY",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "personnel",
      "recovery"
    ]
  },
  {
    "code": "sfapmfj",
    "name": "JAMMER / ELECTRONIC COUNTER-MEASURES",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "jammer",
      "electronic",
      "counter-measures"
    ]
  },
  {
    "code": "sfapmfk",
    "name": "TANKER",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "tanker",
      "k",
      "refuel",
      "air refueling"
    ]
  },
  {
    "code": "sfapmfkb",
    "name": "TANKER",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "tanker",
      "k",
      "refuel",
      "air refueling"
    ]
  },
  {
    "code": "sfapmfkd",
    "name": "TANKER",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "tanker",
      "k",
      "refuel",
      "air refueling"
    ]
  },
  {
    "code": "sfapmfl",
    "name": "VSTOL",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "vstol"
    ]
  },
  {
    "code": "sfapmfm",
    "name": "SPECIAL OPERATIONS FORCES",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "special",
      "operations",
      "forces",
      "sof"
    ]
  },
  {
    "code": "sfapmfo",
    "name": "MEDICAL EVACUATION",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "medical",
      "evacuation",
      "medevac"
    ]
  },
  {
    "code": "sfapmfp",
    "name": "PATROL",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "patrol"
    ]
  },
  {
    "code": "sfapmfpm",
    "name": "MINE COUNTERMEASURES",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "mine",
      "countermeasures"
    ]
  },
  {
    "code": "sfapmfpn",
    "name": "ANTISURFACE WARFARE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "antisurface",
      "warfare"
    ]
  },
  {
    "code": "sfapmfq",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqa",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqb",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqc",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqd",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqf",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqh",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqi",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqj",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqk",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfql",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqm",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqn",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqo",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqp",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqr",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqrw",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqrx",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqrz",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqs",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqt",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqu",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfqy",
    "name": "UNMANNED AERIAL VEHICLE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "unmanned",
      "aerial",
      "vehicle",
      "uav",
      "drone"
    ]
  },
  {
    "code": "sfapmfr",
    "name": "RECONNAISSANCE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfapmfrw",
    "name": "AIRBORNE EARLY WARNING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "airborne",
      "early",
      "warning"
    ]
  },
  {
    "code": "sfapmfrz",
    "name": "ELECTRONIC SUPPORT MEASURES",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "electronic",
      "support",
      "measures"
    ]
  },
  {
    "code": "sfapmfs",
    "name": "ANTISUBMARINE WARFARE",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "antisubmarine",
      "warfare"
    ]
  },
  {
    "code": "sfapmft",
    "name": "TRAINER",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "trainer"
    ]
  },
  {
    "code": "sfapmfu",
    "name": "UTILITY",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "utility"
    ]
  },
  {
    "code": "sfapmfuh",
    "name": "UTILITY",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "utility"
    ]
  },
  {
    "code": "sfapmful",
    "name": "UTILITY",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "utility"
    ]
  },
  {
    "code": "sfapmfum",
    "name": "UTILITY",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "utility"
    ]
  },
  {
    "code": "sfapmfy",
    "name": "COMMUNICATIONS",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "communications",
      "comm"
    ]
  },
  {
    "code": "sfapmh",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmha",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhc",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhch",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhcl",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhcm",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhd",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhh",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhi",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhj",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhk",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhm",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmho",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhq",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhr",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhs",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmht",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhu",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhuh",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhul",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapmhum",
    "name": "MILITARY ROTARY WING",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfapml",
    "name": "MILITARY BALLOON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "military",
      "balloon"
    ]
  },
  {
    "code": "sfapmv",
    "name": "VIP",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "vip"
    ]
  },
  {
    "code": "sfapw",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwb",
    "name": "BOMB",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "bomb"
    ]
  },
  {
    "code": "sfapwd",
    "name": "AIR DECOY",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "decoy"
    ]
  },
  {
    "code": "sfapwm",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwma",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwmaa",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwmap",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwmas",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwmb",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwmcm",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwml",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwms",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwmsa",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwmsb",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwmss",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwmsu",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sfapwmu",
    "name": "ICON",
    "category": "Air",
    "tags": [
      "friendly",
      "air",
      "icon"
    ]
  },
  {
    "code": "sffp",
    "name": "SPECIAL OPERATIONS FORCES",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "special",
      "operations",
      "forces"
    ]
  },
  {
    "code": "sffpa",
    "name": "MILITARY ROTARY WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "military",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sffpaf",
    "name": "MILITARY FIXED WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "military",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sffpafa",
    "name": "MILITARY FIXED WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "military",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sffpafk",
    "name": "MILITARY FIXED WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "military",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sffpafu",
    "name": "MILITARY FIXED WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "military",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sffpafuh",
    "name": "MILITARY FIXED WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "military",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sffpaful",
    "name": "MILITARY FIXED WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "military",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sffpafum",
    "name": "MILITARY FIXED WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "military",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sffpaha",
    "name": "AVIATION ROTARY WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sffpahh",
    "name": "AVIATION ROTARY WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sffpahu",
    "name": "AVIATION ROTARY WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sffpahuh",
    "name": "AVIATION ROTARY WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sffpahul",
    "name": "AVIATION ROTARY WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sffpahum",
    "name": "AVIATION ROTARY WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sffpav",
    "name": "MILITARY FIXED WING",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "military",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sffpb",
    "name": "SPECIAL OPERATIONS FORCES",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "special",
      "operations",
      "forces"
    ]
  },
  {
    "code": "sffpg",
    "name": "INFANTRY",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "infantry",
      "inf"
    ]
  },
  {
    "code": "sffpgca",
    "name": "CIVIL AFFAIRS",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "civil",
      "affairs"
    ]
  },
  {
    "code": "sffpgs",
    "name": "SPECIAL FORCES",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "special",
      "forces"
    ]
  },
  {
    "code": "sffpgsp",
    "name": "PSYCHOLOGICAL OPERATIONS EQUIPMENT",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "psychological",
      "operations",
      "equipment"
    ]
  },
  {
    "code": "sffpgspa",
    "name": "PSYCHOLOGICAL OPERATIONS EQUIPMENT",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "psychological",
      "operations",
      "equipment"
    ]
  },
  {
    "code": "sffpgsr",
    "name": "INFANTRY",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "infantry",
      "inf"
    ]
  },
  {
    "code": "sffpn",
    "name": "NAVAL",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "naval"
    ]
  },
  {
    "code": "sffpnb",
    "name": "COMBATANT",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "combatant"
    ]
  },
  {
    "code": "sffpnn",
    "name": "SUBMARINE NUCLEAR PROPULSION",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "submarine",
      "nuclear",
      "propulsion"
    ]
  },
  {
    "code": "sffpns",
    "name": "SEA-AIR-LAND",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "sea-air-land"
    ]
  },
  {
    "code": "sffpnu",
    "name": "UNDERWATER DEMOLITION TEAM",
    "category": "SOF",
    "tags": [
      "friendly",
      "sof",
      "underwater",
      "demolition",
      "team"
    ]
  },
  {
    "code": "sfgpes",
    "name": "SENSOR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "sensor"
    ]
  },
  {
    "code": "sfgpese",
    "name": "SENSOR EMPLACED",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "sensor",
      "emplaced"
    ]
  },
  {
    "code": "sfgpesr",
    "name": "RADAR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "radar"
    ]
  },
  {
    "code": "sfgpevaa",
    "name": "ARMOURED PERSONNEL CARRIER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armoured",
      "personnel",
      "carrier",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpevaar",
    "name": "ARMOURED PERSONNEL CARRIER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armoured",
      "personnel",
      "carrier",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpevac",
    "name": "ARMOURED FIGHTING VEHICLE (AFV) COMMAND AND CONTROL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armoured",
      "fighting",
      "vehicle",
      "(afv)",
      "command",
      "and",
      "control",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpevai",
    "name": "ARMOURED FIGHTING VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armoured",
      "fighting",
      "vehicle",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpeval",
    "name": "ARMOURED FIGHTING VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armoured",
      "fighting",
      "vehicle",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpevas",
    "name": "ARMOURED PERSONNEL CARRIER COMBAT SERVICE SUPPORT VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armoured",
      "personnel",
      "carrier",
      "combat",
      "service",
      "support",
      "vehicle",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpevat",
    "name": "TANK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "tank"
    ]
  },
  {
    "code": "sfgpevath",
    "name": "TANK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "tank"
    ]
  },
  {
    "code": "sfgpevatl",
    "name": "TANK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "tank"
    ]
  },
  {
    "code": "sfgpevatm",
    "name": "TANK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "tank"
    ]
  },
  {
    "code": "sfgpevatw",
    "name": "TANK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "tank"
    ]
  },
  {
    "code": "sfgpevatx",
    "name": "TANK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "tank"
    ]
  },
  {
    "code": "sfgpevaty",
    "name": "TANK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "tank"
    ]
  },
  {
    "code": "sfgpevc",
    "name": "CIVILIAN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "civilian"
    ]
  },
  {
    "code": "sfgpevca",
    "name": "AUTOMOBILE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "automobile"
    ]
  },
  {
    "code": "sfgpevcah",
    "name": "AUTOMOBILE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "automobile"
    ]
  },
  {
    "code": "sfgpevcal",
    "name": "AUTOMOBILE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "automobile"
    ]
  },
  {
    "code": "sfgpevcam",
    "name": "AUTOMOBILE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "automobile"
    ]
  },
  {
    "code": "sfgpevcf",
    "name": "OPEN-BED TRUCK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "open-bed",
      "truck"
    ]
  },
  {
    "code": "sfgpevcfh",
    "name": "OPEN-BED TRUCK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "open-bed",
      "truck"
    ]
  },
  {
    "code": "sfgpevcfl",
    "name": "OPEN-BED TRUCK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "open-bed",
      "truck"
    ]
  },
  {
    "code": "sfgpevcfm",
    "name": "OPEN-BED TRUCK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "open-bed",
      "truck"
    ]
  },
  {
    "code": "sfgpevcj",
    "name": "JEEP TYPE VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "jeep",
      "type",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevcjh",
    "name": "JEEP TYPE VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "jeep",
      "type",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevcjl",
    "name": "JEEP TYPE VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "jeep",
      "type",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevcjm",
    "name": "JEEP TYPE VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "jeep",
      "type",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevcm",
    "name": "MULTIPLE PASSENGER VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "multiple",
      "passenger",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevcmh",
    "name": "MULTIPLE PASSENGER VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "multiple",
      "passenger",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevcml",
    "name": "MULTIPLE PASSENGER VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "multiple",
      "passenger",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevcmm",
    "name": "MULTIPLE PASSENGER VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "multiple",
      "passenger",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevco",
    "name": "OPEN-BED TRUCK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "open-bed",
      "truck"
    ]
  },
  {
    "code": "sfgpevcoh",
    "name": "OPEN-BED TRUCK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "open-bed",
      "truck"
    ]
  },
  {
    "code": "sfgpevcol",
    "name": "OPEN-BED TRUCK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "open-bed",
      "truck"
    ]
  },
  {
    "code": "sfgpevcom",
    "name": "OPEN-BED TRUCK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "open-bed",
      "truck"
    ]
  },
  {
    "code": "sfgpevct",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevcth",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevctl",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevctm",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevcu",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevcuh",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevcul",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevcum",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevd",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevea",
    "name": "MINE CLEARING EQUIPMENT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mine",
      "clearing",
      "equipment"
    ]
  },
  {
    "code": "sfgpeveaa",
    "name": "MINE CLEARING EQUIPMENT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mine",
      "clearing",
      "equipment"
    ]
  },
  {
    "code": "sfgpeveat",
    "name": "MINE CLEARING EQUIPMENT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mine",
      "clearing",
      "equipment"
    ]
  },
  {
    "code": "sfgpeveb",
    "name": "BRIDGE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "bridge"
    ]
  },
  {
    "code": "sfgpevec",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpeved",
    "name": "DOZER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "dozer"
    ]
  },
  {
    "code": "sfgpeveda",
    "name": "DOZER ARMORED",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "dozer",
      "armored",
      "armour",
      "tank"
    ]
  },
  {
    "code": "sfgpevee",
    "name": "EARTHMOVER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "earthmover"
    ]
  },
  {
    "code": "sfgpevef",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpeveh",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevem",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevema",
    "name": "MINE CLEARING EQUIPMENT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mine",
      "clearing",
      "equipment"
    ]
  },
  {
    "code": "sfgpeveml",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevemsm",
    "name": "ARMOURED PERSONNEL CARRIER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armoured",
      "personnel",
      "carrier",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpevemt",
    "name": "MINE CLEARING EQUIPMENT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mine",
      "clearing",
      "equipment"
    ]
  },
  {
    "code": "sfgpevemv",
    "name": "ARMOURED PERSONNEL CARRIER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armoured",
      "personnel",
      "carrier",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpever",
    "name": "ARMOURED PERSONNEL CARRIER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armoured",
      "personnel",
      "carrier",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpeves",
    "name": "ARMOURED PERSONNEL CARRIER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armoured",
      "personnel",
      "carrier",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpevm",
    "name": "PACK ANIMAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "pack",
      "animal"
    ]
  },
  {
    "code": "sfgpevt",
    "name": "TRAIN LOCOMOTIVE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "train",
      "locomotive"
    ]
  },
  {
    "code": "sfgpevu",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevua",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevuaa",
    "name": "ARMOURED PERSONNEL CARRIER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armoured",
      "personnel",
      "carrier",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpevub",
    "name": "BUS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "bus"
    ]
  },
  {
    "code": "sfgpevul",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevur",
    "name": "WATER VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "water",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevus",
    "name": "SEMI-TRAILER TRUCK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "semi-trailer",
      "truck"
    ]
  },
  {
    "code": "sfgpevush",
    "name": "SEMI-TRAILER TRUCK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "semi-trailer",
      "truck"
    ]
  },
  {
    "code": "sfgpevusl",
    "name": "SEMI-TRAILER TRUCK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "semi-trailer",
      "truck"
    ]
  },
  {
    "code": "sfgpevusm",
    "name": "SEMI-TRAILER TRUCK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "semi-trailer",
      "truck"
    ]
  },
  {
    "code": "sfgpevut",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevuth",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevutl",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpevux",
    "name": "UTILITY VEHICLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "vehicle"
    ]
  },
  {
    "code": "sfgpewa",
    "name": "AIR DEFENCE GUN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "gun",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewah",
    "name": "AIR DEFENCE GUN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "gun",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewal",
    "name": "AIR DEFENCE GUN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "gun",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewam",
    "name": "AIR DEFENCE GUN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "gun",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewd",
    "name": "DIRECT FIRE GUN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "direct",
      "fire",
      "gun"
    ]
  },
  {
    "code": "sfgpewdh",
    "name": "DIRECT FIRE GUN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "direct",
      "fire",
      "gun"
    ]
  },
  {
    "code": "sfgpewdl",
    "name": "DIRECT FIRE GUN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "direct",
      "fire",
      "gun"
    ]
  },
  {
    "code": "sfgpewdm",
    "name": "DIRECT FIRE GUN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "direct",
      "fire",
      "gun"
    ]
  },
  {
    "code": "sfgpewg",
    "name": "ANTITANK GUN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "gun"
    ]
  },
  {
    "code": "sfgpewgh",
    "name": "ANTITANK GUN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "gun"
    ]
  },
  {
    "code": "sfgpewgl",
    "name": "ANTITANK GUN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "gun"
    ]
  },
  {
    "code": "sfgpewgm",
    "name": "ANTITANK GUN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "gun"
    ]
  },
  {
    "code": "sfgpewgr",
    "name": "RECOILLESS GUN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "recoilless",
      "gun"
    ]
  },
  {
    "code": "sfgpewh",
    "name": "HOWITZER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "howitzer"
    ]
  },
  {
    "code": "sfgpewhh",
    "name": "HOWITZER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "howitzer"
    ]
  },
  {
    "code": "sfgpewhl",
    "name": "HOWITZER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "howitzer"
    ]
  },
  {
    "code": "sfgpewhm",
    "name": "HOWITZER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "howitzer"
    ]
  },
  {
    "code": "sfgpewm",
    "name": "MISSILE LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "missile",
      "launcher"
    ]
  },
  {
    "code": "sfgpewma",
    "name": "AIR DEFENCE MISSILE LAUNCHER SURFACE-TO-AIR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "missile",
      "launcher",
      "surface-to-air",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewmai",
    "name": "AIR DEFENCE MISSILE LAUNCHER SURFACE-TO-AIR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "missile",
      "launcher",
      "surface-to-air",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewmaie",
    "name": "AIR DEFENCE MISSILE LAUNCHER SURFACE-TO-AIR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "missile",
      "launcher",
      "surface-to-air",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewmair",
    "name": "AIR DEFENCE MISSILE LAUNCHER SURFACE-TO-AIR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "missile",
      "launcher",
      "surface-to-air",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewmal",
    "name": "AIR DEFENCE MISSILE LAUNCHER SURFACE-TO-AIR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "missile",
      "launcher",
      "surface-to-air",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewmale",
    "name": "AIR DEFENCE MISSILE LAUNCHER SURFACE-TO-AIR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "missile",
      "launcher",
      "surface-to-air",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewmalr",
    "name": "AIR DEFENCE MISSILE LAUNCHER SURFACE-TO-AIR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "missile",
      "launcher",
      "surface-to-air",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewmas",
    "name": "AIR DEFENCE MISSILE LAUNCHER SURFACE-TO-AIR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "missile",
      "launcher",
      "surface-to-air",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewmase",
    "name": "AIR DEFENCE MISSILE LAUNCHER SURFACE-TO-AIR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "missile",
      "launcher",
      "surface-to-air",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewmasr",
    "name": "AIR DEFENCE MISSILE LAUNCHER SURFACE-TO-AIR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "missile",
      "launcher",
      "surface-to-air",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpewms",
    "name": "SURFACE-TO-SURFACE MISSILE LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "surface-to-surface",
      "missile",
      "launcher"
    ]
  },
  {
    "code": "sfgpewmsi",
    "name": "SURFACE-TO-SURFACE MISSILE LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "surface-to-surface",
      "missile",
      "launcher"
    ]
  },
  {
    "code": "sfgpewmsl",
    "name": "SURFACE-TO-SURFACE MISSILE LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "surface-to-surface",
      "missile",
      "launcher"
    ]
  },
  {
    "code": "sfgpewmss",
    "name": "SURFACE-TO-SURFACE MISSILE LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "surface-to-surface",
      "missile",
      "launcher"
    ]
  },
  {
    "code": "sfgpewmt",
    "name": "ANTITANK MISSILE LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "missile",
      "launcher"
    ]
  },
  {
    "code": "sfgpewmth",
    "name": "ANTITANK MISSILE LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "missile",
      "launcher"
    ]
  },
  {
    "code": "sfgpewmtl",
    "name": "ANTITANK MISSILE LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "missile",
      "launcher"
    ]
  },
  {
    "code": "sfgpewmtm",
    "name": "ANTITANK MISSILE LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "missile",
      "launcher"
    ]
  },
  {
    "code": "sfgpewo",
    "name": "MORTAR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortar"
    ]
  },
  {
    "code": "sfgpewoh",
    "name": "MORTAR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortar"
    ]
  },
  {
    "code": "sfgpewol",
    "name": "MORTAR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortar"
    ]
  },
  {
    "code": "sfgpewom",
    "name": "MORTAR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortar"
    ]
  },
  {
    "code": "sfgpewr",
    "name": "RIFLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "rifle"
    ]
  },
  {
    "code": "sfgpewrh",
    "name": "RIFLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "rifle"
    ]
  },
  {
    "code": "sfgpewrl",
    "name": "RIFLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "rifle"
    ]
  },
  {
    "code": "sfgpewrr",
    "name": "RIFLE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "rifle"
    ]
  },
  {
    "code": "sfgpews",
    "name": "SINGLE ROCKET LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "single",
      "rocket",
      "launcher"
    ]
  },
  {
    "code": "sfgpewsh",
    "name": "SINGLE ROCKET LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "single",
      "rocket",
      "launcher"
    ]
  },
  {
    "code": "sfgpewsl",
    "name": "SINGLE ROCKET LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "single",
      "rocket",
      "launcher"
    ]
  },
  {
    "code": "sfgpewsm",
    "name": "SINGLE ROCKET LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "single",
      "rocket",
      "launcher"
    ]
  },
  {
    "code": "sfgpewt",
    "name": "ANTITANK ROCKET LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "rocket",
      "launcher"
    ]
  },
  {
    "code": "sfgpewth",
    "name": "ANTITANK ROCKET LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "rocket",
      "launcher"
    ]
  },
  {
    "code": "sfgpewtl",
    "name": "ANTITANK ROCKET LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "rocket",
      "launcher"
    ]
  },
  {
    "code": "sfgpewtm",
    "name": "ANTITANK ROCKET LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "rocket",
      "launcher"
    ]
  },
  {
    "code": "sfgpewx",
    "name": "MULTIPLE ROCKET LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "multiple",
      "rocket",
      "launcher"
    ]
  },
  {
    "code": "sfgpewxh",
    "name": "MULTIPLE ROCKET LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "multiple",
      "rocket",
      "launcher"
    ]
  },
  {
    "code": "sfgpewxl",
    "name": "MULTIPLE ROCKET LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "multiple",
      "rocket",
      "launcher"
    ]
  },
  {
    "code": "sfgpewxm",
    "name": "MULTIPLE ROCKET LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "multiple",
      "rocket",
      "launcher"
    ]
  },
  {
    "code": "sfgpewz",
    "name": "GRENADE LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "grenade",
      "launcher"
    ]
  },
  {
    "code": "sfgpewzh",
    "name": "GRENADE LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "grenade",
      "launcher"
    ]
  },
  {
    "code": "sfgpewzl",
    "name": "GRENADE LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "grenade",
      "launcher"
    ]
  },
  {
    "code": "sfgpewzm",
    "name": "GRENADE LAUNCHER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "grenade",
      "launcher"
    ]
  },
  {
    "code": "sfgpexf",
    "name": "FLAME THROWER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "flame",
      "thrower"
    ]
  },
  {
    "code": "sfgpexi",
    "name": "IMPROVISED EXPLOSIVE DEVICE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "improvised",
      "explosive",
      "device"
    ]
  },
  {
    "code": "sfgpexl",
    "name": "LASER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "laser"
    ]
  },
  {
    "code": "sfgpexm",
    "name": "LAND MINES",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "land",
      "mines"
    ]
  },
  {
    "code": "sfgpexmc",
    "name": "ANTIPERSONNEL LAND MINE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antipersonnel",
      "land",
      "mine"
    ]
  },
  {
    "code": "sfgpexml",
    "name": "ANTIPERSONNEL LAND MINE LESS THAN LETHAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antipersonnel",
      "land",
      "mine",
      "less",
      "than",
      "lethal"
    ]
  },
  {
    "code": "sfgpexn",
    "name": "CBRN EQUIPMENT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn",
      "equipment"
    ]
  },
  {
    "code": "sfgpgl",
    "name": "LIAISON",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "liaison"
    ]
  },
  {
    "code": "sfgpib",
    "name": "BASE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "base"
    ]
  },
  {
    "code": "sfgpiba",
    "name": "TRANSPORTATION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "transportation"
    ]
  },
  {
    "code": "sfgpibn",
    "name": "NAVAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "naval"
    ]
  },
  {
    "code": "sfgpie",
    "name": "EQUIPMENT MANUFACTURE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "equipment",
      "manufacture"
    ]
  },
  {
    "code": "sfgpig",
    "name": "GOVERNMENT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "government"
    ]
  },
  {
    "code": "sfgpima",
    "name": "AIRCRAFT PRODUCTION & ASSEMBLY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aircraft",
      "production",
      "assembly"
    ]
  },
  {
    "code": "sfgpimc",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpime",
    "name": "CLASS V",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "class"
    ]
  },
  {
    "code": "sfgpimf",
    "name": "ATOMIC ENERGY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "atomic",
      "energy"
    ]
  },
  {
    "code": "sfgpimfa",
    "name": "ATOMIC ENERGY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "atomic",
      "energy"
    ]
  },
  {
    "code": "sfgpimfp",
    "name": "ATOMIC ENERGY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "atomic",
      "energy"
    ]
  },
  {
    "code": "sfgpimfpw",
    "name": "ATOMIC ENERGY WEAPONS GRADE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "atomic",
      "energy",
      "weapons",
      "grade"
    ]
  },
  {
    "code": "sfgpimfs",
    "name": "ATOMIC ENERGY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "atomic",
      "energy"
    ]
  },
  {
    "code": "sfgpimg",
    "name": "TANK",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "tank"
    ]
  },
  {
    "code": "sfgpimm",
    "name": "MISSILE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "missile"
    ]
  },
  {
    "code": "sfgpimn",
    "name": "DOZER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "dozer"
    ]
  },
  {
    "code": "sfgpimnb",
    "name": "BRIDGE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "bridge"
    ]
  },
  {
    "code": "sfgpims",
    "name": "NAVAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "naval"
    ]
  },
  {
    "code": "sfgpimv",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpip",
    "name": "PROCESSING FACILITY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "processing",
      "facility"
    ]
  },
  {
    "code": "sfgpipd",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpir",
    "name": "RAW MATERIAL PRODUCTION/STORAGE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "raw",
      "material",
      "production",
      "storage"
    ]
  },
  {
    "code": "sfgpirm",
    "name": "MINE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mine"
    ]
  },
  {
    "code": "sfgpirn",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpirnb",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpirnc",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpirnn",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpirp",
    "name": "CLASS III",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "class",
      "iii"
    ]
  },
  {
    "code": "sfgpirsr",
    "name": "SEA SURFACE INSTALLATION, OIL RIG/PLATFORM",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "sea",
      "surface",
      "installation,",
      "oil",
      "rig",
      "platform"
    ]
  },
  {
    "code": "sfgpit",
    "name": "TRANSPORTATION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "transportation"
    ]
  },
  {
    "code": "sfgpiu",
    "name": "UTILITY FACILITY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "utility",
      "facility"
    ]
  },
  {
    "code": "sfgpiue",
    "name": "ELECTRIC POWER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "electric",
      "power"
    ]
  },
  {
    "code": "sfgpiued",
    "name": "ELECTRIC POWER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "electric",
      "power"
    ]
  },
  {
    "code": "sfgpiuef",
    "name": "ELECTRIC POWER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "electric",
      "power"
    ]
  },
  {
    "code": "sfgpiuen",
    "name": "ELECTRIC POWER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "electric",
      "power"
    ]
  },
  {
    "code": "sfgpiup",
    "name": "WATER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "water"
    ]
  },
  {
    "code": "sfgpiur",
    "name": "RESEARCH",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "research"
    ]
  },
  {
    "code": "sfgpiut",
    "name": "TELECOMMUNICATIONS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "telecommunications",
      "comm"
    ]
  },
  {
    "code": "sfgpix",
    "name": "MEDICAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical"
    ]
  },
  {
    "code": "sfgpixh",
    "name": "MEDICAL TREATMENT FACILITY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical",
      "treatment",
      "facility"
    ]
  },
  {
    "code": "sfgpuc",
    "name": "COMBAT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "combat"
    ]
  },
  {
    "code": "sfgpuca",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaa",
    "name": "ANTITANK/ANTIARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "antiarmour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaaa",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaaas",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaaat",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaaaw",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaac",
    "name": "ANTITANK/ANTIARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "antiarmour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaad",
    "name": "ANTITANK/ANTIARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "antiarmour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaal",
    "name": "ANTITANK/ANTIARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "antiarmour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaam",
    "name": "ANTITANK/ANTIARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "antiarmour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaao",
    "name": "ANTITANK/ANTIARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "antiarmour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaaos",
    "name": "ANTITANK/ANTIARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "antiarmour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaas",
    "name": "ANTITANK/ANTIARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "antiarmour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaau",
    "name": "ANTITANK/ANTIARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "antitank",
      "antiarmour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucat",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucata",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucath",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucatl",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucatm",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucatr",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucatw",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucatwr",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucaw",
    "name": "ARMOR, WHEELED",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armor,",
      "wheeled",
      "armour",
      "tank"
    ]
  },
  {
    "code": "sfgpucawa",
    "name": "ARMOR, WHEELED",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armor,",
      "wheeled",
      "armour",
      "tank"
    ]
  },
  {
    "code": "sfgpucawh",
    "name": "ARMOR, WHEELED",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armor,",
      "wheeled",
      "armour",
      "tank"
    ]
  },
  {
    "code": "sfgpucawl",
    "name": "ARMOR, WHEELED",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armor,",
      "wheeled",
      "armour",
      "tank"
    ]
  },
  {
    "code": "sfgpucawm",
    "name": "ARMOR, WHEELED",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armor,",
      "wheeled",
      "armour",
      "tank"
    ]
  },
  {
    "code": "sfgpucawr",
    "name": "ARMOR, WHEELED",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armor,",
      "wheeled",
      "armour",
      "tank"
    ]
  },
  {
    "code": "sfgpucaws",
    "name": "ARMOR, WHEELED",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armor,",
      "wheeled",
      "armour",
      "tank"
    ]
  },
  {
    "code": "sfgpucaww",
    "name": "ARMOR, WHEELED",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armor,",
      "wheeled",
      "armour",
      "tank"
    ]
  },
  {
    "code": "sfgpucawwr",
    "name": "ARMOR, WHEELED",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armor,",
      "wheeled",
      "armour",
      "tank"
    ]
  },
  {
    "code": "sfgpucd",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdc",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdg",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdh",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdhh",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdhp",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdm",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdmh",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdml",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdmla",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdmm",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdo",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucds",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdsc",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdss",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdsv",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpucdt",
    "name": "AIR DEFENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "air",
      "defence",
      "air defense",
      "ad"
    ]
  },
  {
    "code": "sfgpuce",
    "name": "ENGINEER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "engineer",
      "eng"
    ]
  },
  {
    "code": "sfgpucec",
    "name": "ENGINEER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "engineer",
      "eng"
    ]
  },
  {
    "code": "sfgpuceca",
    "name": "ENGINEER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "engineer",
      "eng"
    ]
  },
  {
    "code": "sfgpucecc",
    "name": "ENGINEER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "engineer",
      "eng"
    ]
  },
  {
    "code": "sfgpucech",
    "name": "ENGINEER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "engineer",
      "eng"
    ]
  },
  {
    "code": "sfgpucecl",
    "name": "ENGINEER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "engineer",
      "eng"
    ]
  },
  {
    "code": "sfgpucecm",
    "name": "ENGINEER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "engineer",
      "eng"
    ]
  },
  {
    "code": "sfgpuceco",
    "name": "ENGINEER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "engineer",
      "eng"
    ]
  },
  {
    "code": "sfgpucecr",
    "name": "ENGINEER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "engineer",
      "eng"
    ]
  },
  {
    "code": "sfgpucecs",
    "name": "ENGINEER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "engineer",
      "eng"
    ]
  },
  {
    "code": "sfgpucect",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucecw",
    "name": "ENGINEER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "engineer",
      "eng"
    ]
  },
  {
    "code": "sfgpucen",
    "name": "ENGINEER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "engineer",
      "eng"
    ]
  },
  {
    "code": "sfgpucenn",
    "name": "ENGINEER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "engineer",
      "eng"
    ]
  },
  {
    "code": "sfgpucf",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfh",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfha",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfhc",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfhe",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucfhh",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfhl",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfhm",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfho",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfhs",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfhx",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfm",
    "name": "MORTAR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortar"
    ]
  },
  {
    "code": "sfgpucfms",
    "name": "MORTAR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortar"
    ]
  },
  {
    "code": "sfgpucfmsw",
    "name": "MORTAR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortar"
    ]
  },
  {
    "code": "sfgpucfmt",
    "name": "MORTAR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortar"
    ]
  },
  {
    "code": "sfgpucfmta",
    "name": "MORTAR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortar"
    ]
  },
  {
    "code": "sfgpucfmtc",
    "name": "MORTAR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortar"
    ]
  },
  {
    "code": "sfgpucfmto",
    "name": "MORTAR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortar"
    ]
  },
  {
    "code": "sfgpucfmts",
    "name": "MORTAR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortar"
    ]
  },
  {
    "code": "sfgpucfo",
    "name": "METEOROLOGICAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "meteorological"
    ]
  },
  {
    "code": "sfgpucfoa",
    "name": "METEOROLOGICAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "meteorological"
    ]
  },
  {
    "code": "sfgpucfol",
    "name": "METEOROLOGICAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "meteorological"
    ]
  },
  {
    "code": "sfgpucfoo",
    "name": "METEOROLOGICAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "meteorological"
    ]
  },
  {
    "code": "sfgpucfos",
    "name": "METEOROLOGICAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "meteorological"
    ]
  },
  {
    "code": "sfgpucfr",
    "name": "FIELD ARTILLERY ROCKET",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "rocket",
      "arty"
    ]
  },
  {
    "code": "sfgpucfrm",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfrmr",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfrms",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucfrmt",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfrs",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfrsr",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfrss",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucfrst",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfs",
    "name": "SURVEY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "survey"
    ]
  },
  {
    "code": "sfgpucfsa",
    "name": "SURVEY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "survey"
    ]
  },
  {
    "code": "sfgpucfsl",
    "name": "SURVEY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "survey"
    ]
  },
  {
    "code": "sfgpucfso",
    "name": "SURVEY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "survey"
    ]
  },
  {
    "code": "sfgpucfss",
    "name": "SURVEY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "survey"
    ]
  },
  {
    "code": "sfgpucft",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucfta",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucftc",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucftcd",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpucftcm",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucftf",
    "name": "FIELD ARTILLERY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "field",
      "artillery",
      "arty"
    ]
  },
  {
    "code": "sfgpuci",
    "name": "INFANTRY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "infantry",
      "inf"
    ]
  },
  {
    "code": "sfgpucia",
    "name": "INFANTRY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "infantry",
      "inf"
    ]
  },
  {
    "code": "sfgpucic",
    "name": "INFANTRY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "infantry",
      "inf"
    ]
  },
  {
    "code": "sfgpucii",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucil",
    "name": "INFANTRY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "infantry",
      "inf"
    ]
  },
  {
    "code": "sfgpucim",
    "name": "INFANTRY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "infantry",
      "inf"
    ]
  },
  {
    "code": "sfgpucin",
    "name": "INFANTRY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "infantry",
      "inf"
    ]
  },
  {
    "code": "sfgpucio",
    "name": "INFANTRY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "infantry",
      "inf"
    ]
  },
  {
    "code": "sfgpucis",
    "name": "INFANTRY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "infantry",
      "inf"
    ]
  },
  {
    "code": "sfgpuciz",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucm",
    "name": "MISSILE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "missile"
    ]
  },
  {
    "code": "sfgpucms",
    "name": "MISSILE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "missile"
    ]
  },
  {
    "code": "sfgpucmt",
    "name": "MISSILE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "missile"
    ]
  },
  {
    "code": "sfgpucr",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucra",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucrc",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucrh",
    "name": "HORSE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "horse"
    ]
  },
  {
    "code": "sfgpucrll",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucro",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucrr",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucrrd",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucrrf",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucrrl",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucrs",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucrv",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucrva",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucrvg",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucrvm",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucrvo",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucrx",
    "name": "RECONNAISSANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "reconnaissance",
      "recon"
    ]
  },
  {
    "code": "sfgpucs",
    "name": "SECURITY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "security"
    ]
  },
  {
    "code": "sfgpucsg",
    "name": "SECURITY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "security"
    ]
  },
  {
    "code": "sfgpucsga",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucsgd",
    "name": "SECURITY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "security"
    ]
  },
  {
    "code": "sfgpucsgm",
    "name": "SECURITY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "security"
    ]
  },
  {
    "code": "sfgpucsm",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpucsr",
    "name": "SECURITY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "security"
    ]
  },
  {
    "code": "sfgpucv",
    "name": "AVIATION ROTARY WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfgpucvc",
    "name": "AVIATION COMPOSITE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "composite"
    ]
  },
  {
    "code": "sfgpucvf",
    "name": "AVIATION FIXED WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sfgpucvfa",
    "name": "AVIATION FIXED WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sfgpucvfr",
    "name": "AVIATION FIXED WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sfgpucvfu",
    "name": "AVIATION FIXED WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sfgpucvra",
    "name": "AVIATION ROTARY WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfgpucvrm",
    "name": "AVIATION ROTARY WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfgpucvrs",
    "name": "AVIATION ROTARY WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfgpucvru",
    "name": "AVIATION ROTARY WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfgpucvruc",
    "name": "AVIATION ROTARY WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfgpucvrue",
    "name": "AVIATION ROTARY WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfgpucvruh",
    "name": "AVIATION ROTARY WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfgpucvrul",
    "name": "AVIATION ROTARY WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfgpucvrum",
    "name": "AVIATION ROTARY WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfgpucvrw",
    "name": "AVIATION ROTARY WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfgpucvs",
    "name": "AVIATION ROTARY WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfgpucvu",
    "name": "UNMANNED SYSTEMS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "unmanned",
      "systems"
    ]
  },
  {
    "code": "sfgpucvuf",
    "name": "AVIATION FIXED WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sfgpucvufc",
    "name": "AVIATION FORWARD AIR CONTROLLER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "forward",
      "air",
      "controller"
    ]
  },
  {
    "code": "sfgpucvur",
    "name": "AVIATION ROTARY WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "rotary",
      "wing"
    ]
  },
  {
    "code": "sfgpucvutp",
    "name": "AVIATION TACTICAL AIR CONTROL PARTY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "tactical",
      "air",
      "control",
      "party"
    ]
  },
  {
    "code": "sfgpucvv",
    "name": "AVIATION FIXED WING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "aviation",
      "fixed",
      "wing"
    ]
  },
  {
    "code": "sfgpus",
    "name": "COMBAT SERVICE SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "combat",
      "service",
      "support"
    ]
  },
  {
    "code": "sfgpusa",
    "name": "ADMINISTRATIVE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "administrative"
    ]
  },
  {
    "code": "sfgpusac",
    "name": "ADMINISTRATIVE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "administrative"
    ]
  },
  {
    "code": "sfgpusaf",
    "name": "FINANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "finance"
    ]
  },
  {
    "code": "sfgpusafc",
    "name": "FINANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "finance"
    ]
  },
  {
    "code": "sfgpusaft",
    "name": "FINANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "finance"
    ]
  },
  {
    "code": "sfgpusaj",
    "name": "JUDGE ADVOCATE GENERAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "judge",
      "advocate",
      "general"
    ]
  },
  {
    "code": "sfgpusajc",
    "name": "JUDGE ADVOCATE GENERAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "judge",
      "advocate",
      "general"
    ]
  },
  {
    "code": "sfgpusajt",
    "name": "JUDGE ADVOCATE GENERAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "judge",
      "advocate",
      "general"
    ]
  },
  {
    "code": "sfgpusal",
    "name": "LABOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "labour"
    ]
  },
  {
    "code": "sfgpusalc",
    "name": "LABOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "labour"
    ]
  },
  {
    "code": "sfgpusalt",
    "name": "LABOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "labour"
    ]
  },
  {
    "code": "sfgpusam",
    "name": "MORTUARY AFFAIRS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortuary",
      "affairs"
    ]
  },
  {
    "code": "sfgpusamc",
    "name": "MORTUARY AFFAIRS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortuary",
      "affairs"
    ]
  },
  {
    "code": "sfgpusamt",
    "name": "MORTUARY AFFAIRS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "mortuary",
      "affairs"
    ]
  },
  {
    "code": "sfgpusao",
    "name": "POSTAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "postal"
    ]
  },
  {
    "code": "sfgpusaoc",
    "name": "POSTAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "postal"
    ]
  },
  {
    "code": "sfgpusaot",
    "name": "POSTAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "postal"
    ]
  },
  {
    "code": "sfgpusap",
    "name": "PUBLIC AFFAIRS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "public",
      "affairs"
    ]
  },
  {
    "code": "sfgpusapb",
    "name": "PUBLIC AFFAIRS BROADCAST",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "public",
      "affairs",
      "broadcast"
    ]
  },
  {
    "code": "sfgpusapbc",
    "name": "PUBLIC AFFAIRS BROADCAST",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "public",
      "affairs",
      "broadcast"
    ]
  },
  {
    "code": "sfgpusapbt",
    "name": "PUBLIC AFFAIRS BROADCAST",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "public",
      "affairs",
      "broadcast"
    ]
  },
  {
    "code": "sfgpusapc",
    "name": "PUBLIC AFFAIRS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "public",
      "affairs"
    ]
  },
  {
    "code": "sfgpusapm",
    "name": "JOINT INFORMATION BUREAU",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "joint",
      "information",
      "bureau"
    ]
  },
  {
    "code": "sfgpusapmc",
    "name": "JOINT INFORMATION BUREAU",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "joint",
      "information",
      "bureau"
    ]
  },
  {
    "code": "sfgpusapmt",
    "name": "JOINT INFORMATION BUREAU",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "joint",
      "information",
      "bureau"
    ]
  },
  {
    "code": "sfgpusapt",
    "name": "PUBLIC AFFAIRS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "public",
      "affairs"
    ]
  },
  {
    "code": "sfgpusaq",
    "name": "QUARTERMASTER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "quartermaster"
    ]
  },
  {
    "code": "sfgpusaqc",
    "name": "QUARTERMASTER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "quartermaster"
    ]
  },
  {
    "code": "sfgpusaqt",
    "name": "QUARTERMASTER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "quartermaster"
    ]
  },
  {
    "code": "sfgpusar",
    "name": "RELIGIOUS SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "religious",
      "support"
    ]
  },
  {
    "code": "sfgpusarc",
    "name": "RELIGIOUS SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "religious",
      "support"
    ]
  },
  {
    "code": "sfgpusart",
    "name": "RELIGIOUS SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "religious",
      "support"
    ]
  },
  {
    "code": "sfgpusas",
    "name": "PERSONNEL SERVICES",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "personnel",
      "services"
    ]
  },
  {
    "code": "sfgpusasc",
    "name": "PERSONNEL SERVICES",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "personnel",
      "services"
    ]
  },
  {
    "code": "sfgpusast",
    "name": "PERSONNEL SERVICES",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "personnel",
      "services"
    ]
  },
  {
    "code": "sfgpusat",
    "name": "ADMINISTRATIVE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "administrative"
    ]
  },
  {
    "code": "sfgpusaw",
    "name": "MORALE, WELFARE, AND RECREATION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "morale,",
      "welfare,",
      "and",
      "recreation"
    ]
  },
  {
    "code": "sfgpusawc",
    "name": "MORALE, WELFARE, AND RECREATION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "morale,",
      "welfare,",
      "and",
      "recreation"
    ]
  },
  {
    "code": "sfgpusawt",
    "name": "MORALE, WELFARE, AND RECREATION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "morale,",
      "welfare,",
      "and",
      "recreation"
    ]
  },
  {
    "code": "sfgpusax",
    "name": "REPLACEMENT HOLDING UNIT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "replacement",
      "holding",
      "unit"
    ]
  },
  {
    "code": "sfgpusaxc",
    "name": "REPLACEMENT HOLDING UNIT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "replacement",
      "holding",
      "unit"
    ]
  },
  {
    "code": "sfgpusaxt",
    "name": "REPLACEMENT HOLDING UNIT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "replacement",
      "holding",
      "unit"
    ]
  },
  {
    "code": "sfgpusm",
    "name": "MEDICAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical"
    ]
  },
  {
    "code": "sfgpusmc",
    "name": "MEDICAL CORPS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical",
      "corps"
    ]
  },
  {
    "code": "sfgpusmd",
    "name": "MEDICAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical"
    ]
  },
  {
    "code": "sfgpusmdc",
    "name": "MEDICAL CORPS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical",
      "corps"
    ]
  },
  {
    "code": "sfgpusmdt",
    "name": "MEDICAL THEATER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical",
      "theater"
    ]
  },
  {
    "code": "sfgpusmm",
    "name": "MEDICAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical"
    ]
  },
  {
    "code": "sfgpusmmc",
    "name": "MEDICAL CORPS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical",
      "corps"
    ]
  },
  {
    "code": "sfgpusmmt",
    "name": "MEDICAL THEATER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical",
      "theater"
    ]
  },
  {
    "code": "sfgpusmp",
    "name": "MEDICAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical"
    ]
  },
  {
    "code": "sfgpusmpc",
    "name": "MEDICAL CORPS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical",
      "corps"
    ]
  },
  {
    "code": "sfgpusmpt",
    "name": "MEDICAL THEATER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical",
      "theater"
    ]
  },
  {
    "code": "sfgpusmt",
    "name": "MEDICAL THEATER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical",
      "theater"
    ]
  },
  {
    "code": "sfgpusmv",
    "name": "MEDICAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical"
    ]
  },
  {
    "code": "sfgpusmvc",
    "name": "MEDICAL CORPS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical",
      "corps"
    ]
  },
  {
    "code": "sfgpusmvt",
    "name": "MEDICAL THEATER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "medical",
      "theater"
    ]
  },
  {
    "code": "sfgpuss",
    "name": "SUPPLY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply"
    ]
  },
  {
    "code": "sfgpussc",
    "name": "SUPPLY CORPS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply",
      "corps"
    ]
  },
  {
    "code": "sfgpussl",
    "name": "SUPPLY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply"
    ]
  },
  {
    "code": "sfgpusslc",
    "name": "SUPPLY CORPS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply",
      "corps"
    ]
  },
  {
    "code": "sfgpusslt",
    "name": "SUPPLY THEATER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply",
      "theater"
    ]
  },
  {
    "code": "sfgpusst",
    "name": "SUPPLY THEATER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply",
      "theater"
    ]
  },
  {
    "code": "sfgpussw",
    "name": "SUPPLY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply"
    ]
  },
  {
    "code": "sfgpusswc",
    "name": "SUPPLY CORPS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply",
      "corps"
    ]
  },
  {
    "code": "sfgpusswp",
    "name": "SUPPLY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply"
    ]
  },
  {
    "code": "sfgpusswpc",
    "name": "SUPPLY CORPS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply",
      "corps"
    ]
  },
  {
    "code": "sfgpusswpt",
    "name": "SUPPLY THEATER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply",
      "theater"
    ]
  },
  {
    "code": "sfgpusswt",
    "name": "SUPPLY THEATER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply",
      "theater"
    ]
  },
  {
    "code": "sfgpussx",
    "name": "SUPPLY",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply"
    ]
  },
  {
    "code": "sfgpussxc",
    "name": "SUPPLY CORPS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply",
      "corps"
    ]
  },
  {
    "code": "sfgpussxt",
    "name": "SUPPLY THEATER",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "supply",
      "theater"
    ]
  },
  {
    "code": "sfgpust",
    "name": "TRANSPORTATION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "transportation"
    ]
  },
  {
    "code": "sfgpusta",
    "name": "TRANSPORTATION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "transportation"
    ]
  },
  {
    "code": "sfgpustac",
    "name": "CORPS SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "corps",
      "support"
    ]
  },
  {
    "code": "sfgpustat",
    "name": "THEATRE SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "theatre",
      "support"
    ]
  },
  {
    "code": "sfgpustc",
    "name": "CORPS SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "corps",
      "support"
    ]
  },
  {
    "code": "sfgpusti",
    "name": "TRANSPORTATION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "transportation"
    ]
  },
  {
    "code": "sfgpustic",
    "name": "CORPS SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "corps",
      "support"
    ]
  },
  {
    "code": "sfgpustit",
    "name": "THEATRE SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "theatre",
      "support"
    ]
  },
  {
    "code": "sfgpustm",
    "name": "TRANSPORTATION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "transportation"
    ]
  },
  {
    "code": "sfgpustmc",
    "name": "CORPS SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "corps",
      "support"
    ]
  },
  {
    "code": "sfgpustmt",
    "name": "THEATRE SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "theatre",
      "support"
    ]
  },
  {
    "code": "sfgpustr",
    "name": "TRANSPORTATION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "transportation"
    ]
  },
  {
    "code": "sfgpustrc",
    "name": "CORPS SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "corps",
      "support"
    ]
  },
  {
    "code": "sfgpustrt",
    "name": "THEATRE SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "theatre",
      "support"
    ]
  },
  {
    "code": "sfgpusts",
    "name": "TRANSPORTATION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "transportation"
    ]
  },
  {
    "code": "sfgpustsc",
    "name": "CORPS SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "corps",
      "support"
    ]
  },
  {
    "code": "sfgpustst",
    "name": "THEATRE SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "theatre",
      "support"
    ]
  },
  {
    "code": "sfgpustt",
    "name": "THEATRE SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "theatre",
      "support"
    ]
  },
  {
    "code": "sfgpusx",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxbdr",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxc",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxe",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxec",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxep",
    "name": "ENVIRONMENTAL PROTECTION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "environmental",
      "protection"
    ]
  },
  {
    "code": "sfgpusxet",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxh",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxhc",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxht",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxo",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxoc",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxom",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxomc",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxomt",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxot",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxp",
    "name": "PIPELINE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "pipeline"
    ]
  },
  {
    "code": "sfgpusxpm",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxr",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxrc",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxrt",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpusxt",
    "name": "MAINTENANCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "maintenance"
    ]
  },
  {
    "code": "sfgpuu",
    "name": "COMBAT SUPPORT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "combat",
      "support"
    ]
  },
  {
    "code": "sfgpuua",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuuab",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuuabr",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuuac",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuuacc",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuuacck",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpuuaccm",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuuacr",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuuacrs",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpuuacrw",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpuuacs",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuuacsa",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpuuacsm",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuuad",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuuade",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuuadet",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuuadt",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuual",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuuan",
    "name": "CBRN",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "cbrn"
    ]
  },
  {
    "code": "sfgpuud",
    "name": "DRILLING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "drilling"
    ]
  },
  {
    "code": "sfgpuue",
    "name": "EXPLOSIVE ORDNANCE DISPOSAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "explosive",
      "ordnance",
      "disposal"
    ]
  },
  {
    "code": "sfgpuui",
    "name": "INFORMATION OPERATIONS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "information",
      "operations"
    ]
  },
  {
    "code": "sfgpuul",
    "name": "MILITARY POLICE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "military",
      "police"
    ]
  },
  {
    "code": "sfgpuulc",
    "name": "LAW ENFORCEMENT",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "law",
      "enforcement"
    ]
  },
  {
    "code": "sfgpuuld",
    "name": "CRIMINAL INVESTIGATION DIVISION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "criminal",
      "investigation",
      "division"
    ]
  },
  {
    "code": "sfgpuulm",
    "name": "MILITARY POLICE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "military",
      "police"
    ]
  },
  {
    "code": "sfgpuuls",
    "name": "SHORE PATROL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "shore",
      "patrol"
    ]
  },
  {
    "code": "sfgpuum",
    "name": "MILITARY INTELLIGENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "military",
      "intelligence"
    ]
  },
  {
    "code": "sfgpuuma",
    "name": "MILITARY INTELLIGENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "military",
      "intelligence"
    ]
  },
  {
    "code": "sfgpuumc",
    "name": "COUNTER-INTELLIGENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "counter-intelligence"
    ]
  },
  {
    "code": "sfgpuumj",
    "name": "JOINT INTELLIGENCE CENTRE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "joint",
      "intelligence",
      "centre"
    ]
  },
  {
    "code": "sfgpuummo",
    "name": "MILITARY INTELLIGENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "military",
      "intelligence"
    ]
  },
  {
    "code": "sfgpuumo",
    "name": "MILITARY INTELLIGENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "military",
      "intelligence"
    ]
  },
  {
    "code": "sfgpuumq",
    "name": "INTERROGATION",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "interrogation"
    ]
  },
  {
    "code": "sfgpuumr",
    "name": "MILITARY INTELLIGENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "military",
      "intelligence"
    ]
  },
  {
    "code": "sfgpuumrg",
    "name": "MILITARY INTELLIGENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "military",
      "intelligence"
    ]
  },
  {
    "code": "sfgpuumrx",
    "name": "MILITARY INTELLIGENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "military",
      "intelligence"
    ]
  },
  {
    "code": "sfgpuumse",
    "name": "ELECTRONIC WARFARE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "electronic",
      "warfare"
    ]
  },
  {
    "code": "sfgpuumsea",
    "name": "ARMOUR",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "armour",
      "armor",
      "tank"
    ]
  },
  {
    "code": "sfgpuumsec",
    "name": "ELECTRONIC WARFARE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "electronic",
      "warfare"
    ]
  },
  {
    "code": "sfgpuumsed",
    "name": "ELECTRONIC WARFARE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "electronic",
      "warfare"
    ]
  },
  {
    "code": "sfgpuumsei",
    "name": "ELECTRONIC WARFARE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "electronic",
      "warfare"
    ]
  },
  {
    "code": "sfgpuumsej",
    "name": "ELECTRONIC WARFARE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "electronic",
      "warfare"
    ]
  },
  {
    "code": "sfgpuumset",
    "name": "ELECTRONIC WARFARE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "electronic",
      "warfare"
    ]
  },
  {
    "code": "sfgpuumt",
    "name": "MILITARY INTELLIGENCE",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "military",
      "intelligence"
    ]
  },
  {
    "code": "sfgpuus",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuusa",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuusc",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuuscl",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuusf",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuusm",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuusml",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuusmn",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuusms",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuuso",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuusr",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuusrs",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuusrt",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuusrw",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuuss",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuusw",
    "name": "SIGNAL",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "signal"
    ]
  },
  {
    "code": "sfgpuusx",
    "name": "ELECTRONIC RANGING",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "electronic",
      "ranging"
    ]
  },
  {
    "code": "sfgpuut",
    "name": "TOPOGRAPHIC",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "topographic"
    ]
  },
  {
    "code": "sfgpuux",
    "name": "AMPHIBIOUS",
    "category": "Ground",
    "tags": [
      "friendly",
      "ground",
      "amphibious"
    ]
  },
  {
    "code": "sfppl",
    "name": "SPACE LAUNCH VEHICLE",
    "category": "Space",
    "tags": [
      "friendly",
      "space",
      "launch",
      "vehicle"
    ]
  },
  {
    "code": "sfpps",
    "name": "SATELLITE",
    "category": "Space",
    "tags": [
      "friendly",
      "space",
      "satellite"
    ]
  },
  {
    "code": "sfppt",
    "name": "SPACE STATION",
    "category": "Space",
    "tags": [
      "friendly",
      "space",
      "station"
    ]
  },
  {
    "code": "sfppv",
    "name": "CREWED SPACE VEHICLE",
    "category": "Space",
    "tags": [
      "friendly",
      "space",
      "crewed",
      "vehicle"
    ]
  },
  {
    "code": "sfspc",
    "name": "COMBATANT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "combatant"
    ]
  },
  {
    "code": "sfspca",
    "name": "AMPHIBIOUS WARFARE SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "amphibious",
      "warfare",
      "ship"
    ]
  },
  {
    "code": "sfspcalc",
    "name": "LANDING CRAFT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "landing",
      "craft"
    ]
  },
  {
    "code": "sfspcals",
    "name": "LANDING SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "landing",
      "ship"
    ]
  },
  {
    "code": "sfspcalsm",
    "name": "LANDING SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "landing",
      "ship"
    ]
  },
  {
    "code": "sfspcalst",
    "name": "LANDING SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "landing",
      "ship"
    ]
  },
  {
    "code": "sfspcd",
    "name": "SEA SURFACE DECOY",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "sea",
      "surface",
      "decoy"
    ]
  },
  {
    "code": "sfspch",
    "name": "HOVERCRAFT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "hovercraft"
    ]
  },
  {
    "code": "sfspcl",
    "name": "SURFACE COMBATANT, LINE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "surface",
      "combatant,",
      "line"
    ]
  },
  {
    "code": "sfspclbb",
    "name": "BATTLESHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "battleship"
    ]
  },
  {
    "code": "sfspclcc",
    "name": "CRUISER",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "cruiser"
    ]
  },
  {
    "code": "sfspclcv",
    "name": "CARRIER",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "carrier"
    ]
  },
  {
    "code": "sfspcldd",
    "name": "DESTROYER",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "destroyer"
    ]
  },
  {
    "code": "sfspclff",
    "name": "FRIGATE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "frigate"
    ]
  },
  {
    "code": "sfspclll",
    "name": "LITTORAL COMBATANT SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "littoral",
      "combatant",
      "ship"
    ]
  },
  {
    "code": "sfspclllas",
    "name": "LITTORAL COMBATANT SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "littoral",
      "combatant",
      "ship"
    ]
  },
  {
    "code": "sfspclllmi",
    "name": "LITTORAL COMBATANT SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "littoral",
      "combatant",
      "ship"
    ]
  },
  {
    "code": "sfspclllsu",
    "name": "LITTORAL COMBATANT SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "littoral",
      "combatant",
      "ship"
    ]
  },
  {
    "code": "sfspcm",
    "name": "MINE WARFARE VESSEL",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "mine",
      "warfare",
      "vessel"
    ]
  },
  {
    "code": "sfspcmma",
    "name": "MINE COUNTER MEASURE SUPPORT SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "mine",
      "counter",
      "measure",
      "support",
      "ship"
    ]
  },
  {
    "code": "sfspcmmd",
    "name": "MINESWEEPER, DRONE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "minesweeper,",
      "drone"
    ]
  },
  {
    "code": "sfspcmmh",
    "name": "MINEHUNTER",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "minehunter"
    ]
  },
  {
    "code": "sfspcmml",
    "name": "MINELAYER",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "minelayer"
    ]
  },
  {
    "code": "sfspcmms",
    "name": "MINESWEEPER",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "minesweeper"
    ]
  },
  {
    "code": "sfspcp",
    "name": "PATROL",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "patrol"
    ]
  },
  {
    "code": "sfspcpsb",
    "name": "PATROL CRAFT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "patrol",
      "craft"
    ]
  },
  {
    "code": "sfspcpsu",
    "name": "PATROL ANTI SUBMARINE WARFARE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "patrol",
      "anti",
      "submarine",
      "warfare"
    ]
  },
  {
    "code": "sfspcpsug",
    "name": "PATROL GUN",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "patrol",
      "gun"
    ]
  },
  {
    "code": "sfspcpsum",
    "name": "PATROL ANTISHIP MISSILE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "patrol",
      "antiship",
      "missile"
    ]
  },
  {
    "code": "sfspcpsut",
    "name": "PATROL TORPEDO",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "patrol",
      "torpedo"
    ]
  },
  {
    "code": "sfspcu",
    "name": "UNMANNED SURFACE WATER VEHICLE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "unmanned",
      "surface",
      "water",
      "vehicle"
    ]
  },
  {
    "code": "sfspcum",
    "name": "UNMANNED SURFACE WATER VEHICLE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "unmanned",
      "surface",
      "water",
      "vehicle"
    ]
  },
  {
    "code": "sfspcun",
    "name": "UNMANNED SURFACE WATER VEHICLE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "unmanned",
      "surface",
      "water",
      "vehicle"
    ]
  },
  {
    "code": "sfspcur",
    "name": "UNMANNED SURFACE WATER VEHICLE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "unmanned",
      "surface",
      "water",
      "vehicle"
    ]
  },
  {
    "code": "sfspcus",
    "name": "UNMANNED SURFACE WATER VEHICLE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "unmanned",
      "surface",
      "water",
      "vehicle"
    ]
  },
  {
    "code": "sfsped",
    "name": "DITCHED AIRCRAFT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "ditched",
      "aircraft"
    ]
  },
  {
    "code": "sfspep",
    "name": "PERSON IN WATER",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "person",
      "water"
    ]
  },
  {
    "code": "sfspev",
    "name": "DISTRESSED VESSEL",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "distressed",
      "vessel"
    ]
  },
  {
    "code": "sfspg",
    "name": "NAVY TASK ORGANIZATION UNIT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "navy",
      "task",
      "organization",
      "unit"
    ]
  },
  {
    "code": "sfspgc",
    "name": "CONVOY",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "convoy"
    ]
  },
  {
    "code": "sfspge",
    "name": "NAVY TASK ELEMENT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "navy",
      "task",
      "element"
    ]
  },
  {
    "code": "sfspgg",
    "name": "NAVY TASK GROUP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "navy",
      "task",
      "group"
    ]
  },
  {
    "code": "sfspgt",
    "name": "NAVY TASK FORCE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "navy",
      "task",
      "force"
    ]
  },
  {
    "code": "sfspgu",
    "name": "NAVY TASK UNIT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "navy",
      "task",
      "unit"
    ]
  },
  {
    "code": "sfspn",
    "name": "NONCOMBATANT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "noncombatant"
    ]
  },
  {
    "code": "sfspnft",
    "name": "TUG, OCEAN GOING",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "tug,",
      "ocean",
      "going"
    ]
  },
  {
    "code": "sfspnh",
    "name": "HOVERCRAFT NONCOMBATANT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "hovercraft",
      "noncombatant"
    ]
  },
  {
    "code": "sfspni",
    "name": "INTELLIGENCE COLLECTOR",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "intelligence",
      "collector"
    ]
  },
  {
    "code": "sfspnm",
    "name": "HOSPITAL SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "hospital",
      "ship"
    ]
  },
  {
    "code": "sfspnr",
    "name": "AUXILIARY SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "auxiliary",
      "ship"
    ]
  },
  {
    "code": "sfspnra",
    "name": "AMMUNITION SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "ammunition",
      "ship"
    ]
  },
  {
    "code": "sfspnro",
    "name": "OILER, REPLENISHMENT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "oiler,",
      "replenishment"
    ]
  },
  {
    "code": "sfspns",
    "name": "SERVICE CRAFT, YARD, GENERAL",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "service",
      "craft,",
      "yard,",
      "general"
    ]
  },
  {
    "code": "sfspnts",
    "name": "SUBMARINE TENDER",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "submarine",
      "tender"
    ]
  },
  {
    "code": "sfspo",
    "name": "OWN SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "own",
      "ship"
    ]
  },
  {
    "code": "sfspxa",
    "name": "LEISURE CRAFT, MOTORIZED",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "leisure",
      "craft,",
      "motorized"
    ]
  },
  {
    "code": "sfspxar",
    "name": "LEISURE CRAFT, MOTORIZED, RIGID-HULL INFLATABLE BOAT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "leisure",
      "craft,",
      "motorized,",
      "rigid-hull",
      "inflatable",
      "boat"
    ]
  },
  {
    "code": "sfspxas",
    "name": "LEISURE CRAFT, MOTORIZED, SPEEDBOAT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "leisure",
      "craft,",
      "motorized,",
      "speedboat"
    ]
  },
  {
    "code": "sfspxf",
    "name": "FISHING VESSEL",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "fishing",
      "vessel"
    ]
  },
  {
    "code": "sfspxfdf",
    "name": "DRIFTER",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "drifter"
    ]
  },
  {
    "code": "sfspxfdr",
    "name": "FISHING VESSEL DREDGE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "fishing",
      "vessel",
      "dredge"
    ]
  },
  {
    "code": "sfspxftr",
    "name": "TRAWLER",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "trawler"
    ]
  },
  {
    "code": "sfspxh",
    "name": "HOVERCRAFT CIVILIAN",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "hovercraft",
      "civilian"
    ]
  },
  {
    "code": "sfspxl",
    "name": "LAW ENFORCEMENT VESSEL",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "law",
      "enforcement",
      "vessel"
    ]
  },
  {
    "code": "sfspxm",
    "name": "MERCHANT SHIP, GENERAL",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "merchant",
      "ship,",
      "general"
    ]
  },
  {
    "code": "sfspxmc",
    "name": "CARGO, GENERAL",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "cargo,",
      "general",
      "c"
    ]
  },
  {
    "code": "sfspxmd",
    "name": "DREDGE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "dredge"
    ]
  },
  {
    "code": "sfspxmf",
    "name": "FERRY",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "ferry"
    ]
  },
  {
    "code": "sfspxmh",
    "name": "TRANSPORT SHIP, HAZARDOUS MATERIAL",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "transport",
      "ship,",
      "hazardous",
      "material"
    ]
  },
  {
    "code": "sfspxmo",
    "name": "OILER/TANKER",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "oiler",
      "tanker",
      "k",
      "refuel",
      "air refueling"
    ]
  },
  {
    "code": "sfspxmp",
    "name": "PASSENGER SHIP",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "passenger",
      "ship"
    ]
  },
  {
    "code": "sfspxmr",
    "name": "ROLL ON-ROLL OFF",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "roll",
      "on-roll",
      "off"
    ]
  },
  {
    "code": "sfspxmto",
    "name": "TOW",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "tow"
    ]
  },
  {
    "code": "sfspxmtu",
    "name": "TUG, OCEAN GOING CIVILIAN",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "tug,",
      "ocean",
      "going",
      "civilian"
    ]
  },
  {
    "code": "sfspxp",
    "name": "LEISURE CRAFT, JETSKI",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "leisure",
      "craft,",
      "jetski"
    ]
  },
  {
    "code": "sfspxr",
    "name": "LEISURE CRAFT, SAILING BOAT",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "leisure",
      "craft,",
      "sailing",
      "boat"
    ]
  },
  {
    "code": "sfspzi",
    "name": "ICEBERG",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "iceberg"
    ]
  },
  {
    "code": "sfspzm",
    "name": "SEA MINELIKE",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "sea",
      "minelike"
    ]
  },
  {
    "code": "sfspzn",
    "name": "NAVIGATIONAL",
    "category": "Sea Surface",
    "tags": [
      "friendly",
      "seasurface",
      "navigational"
    ]
  },
  {
    "code": "sfupe",
    "name": "ENVIRONMENTAL REPORT LOCATION",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "environmental",
      "report",
      "location"
    ]
  },
  {
    "code": "sfupn",
    "name": "NON-SUBMARINE",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "non-submarine"
    ]
  },
  {
    "code": "sfupna",
    "name": "SEA ANOMALY",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "anomaly"
    ]
  },
  {
    "code": "sfupnbr",
    "name": "SEABED ROCK/STONE, OBSTACLE, OTHER",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "seabed",
      "rock",
      "stone,",
      "obstacle,",
      "other"
    ]
  },
  {
    "code": "sfupnbs",
    "name": "SEABED INSTALLATION/MANMADE",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "seabed",
      "installation",
      "manmade"
    ]
  },
  {
    "code": "sfupnbw",
    "name": "WRECK",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "wreck"
    ]
  },
  {
    "code": "sfupnd",
    "name": "DIVER, CIVILIAN",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "diver,",
      "civilian"
    ]
  },
  {
    "code": "sfupnm",
    "name": "MARINE LIFE",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "marine",
      "life"
    ]
  },
  {
    "code": "sfups",
    "name": "SUBMARINE",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine"
    ]
  },
  {
    "code": "sfupsb",
    "name": "SUBMARINE, BOTTOMED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine,",
      "bottomed"
    ]
  },
  {
    "code": "sfupsc",
    "name": "SUBMARINE CONVENTIONAL PROPULSION",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine",
      "conventional",
      "propulsion"
    ]
  },
  {
    "code": "sfupsca",
    "name": "SUBMARINE CONVENTIONAL PROPULSION",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine",
      "conventional",
      "propulsion"
    ]
  },
  {
    "code": "sfupscb",
    "name": "SUBMARINE CONVENTIONAL PROPULSION",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine",
      "conventional",
      "propulsion"
    ]
  },
  {
    "code": "sfupscf",
    "name": "SUBMARINE CONVENTIONAL PROPULSION, SURFACED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine",
      "conventional",
      "propulsion,",
      "surfaced"
    ]
  },
  {
    "code": "sfupscg",
    "name": "SUBMARINE CONVENTIONAL PROPULSION",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine",
      "conventional",
      "propulsion"
    ]
  },
  {
    "code": "sfupscm",
    "name": "SUBMARINE CONVENTIONAL PROPULSION",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine",
      "conventional",
      "propulsion"
    ]
  },
  {
    "code": "sfupsf",
    "name": "SUBMARINE, SURFACED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine,",
      "surfaced"
    ]
  },
  {
    "code": "sfupsk",
    "name": "SUBMARINE, SNORKELING",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine,",
      "snorkeling"
    ]
  },
  {
    "code": "sfupsl",
    "name": "SUBMARINE",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine"
    ]
  },
  {
    "code": "sfupsn",
    "name": "SUBMARINE NUCLEAR PROPULSION",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine",
      "nuclear",
      "propulsion"
    ]
  },
  {
    "code": "sfupsna",
    "name": "SUBMARINE NUCLEAR PROPULSION",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine",
      "nuclear",
      "propulsion"
    ]
  },
  {
    "code": "sfupsnb",
    "name": "SUBMARINE NUCLEAR PROPULSION",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine",
      "nuclear",
      "propulsion"
    ]
  },
  {
    "code": "sfupsnf",
    "name": "SUBMARINE NUCLEAR PROPULSION, SURFACED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine",
      "nuclear",
      "propulsion,",
      "surfaced"
    ]
  },
  {
    "code": "sfupsng",
    "name": "SUBMARINE NUCLEAR PROPULSION",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine",
      "nuclear",
      "propulsion"
    ]
  },
  {
    "code": "sfupsnm",
    "name": "SUBMARINE NUCLEAR PROPULSION",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine",
      "nuclear",
      "propulsion"
    ]
  },
  {
    "code": "sfupso",
    "name": "OTHER SUBMERSIBLE",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "other",
      "submersible"
    ]
  },
  {
    "code": "sfupsof",
    "name": "OTHER SUBMERSIBLE, SURFACED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "other",
      "submersible,",
      "surfaced"
    ]
  },
  {
    "code": "sfupsr",
    "name": "SUBMARINE",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "submarine"
    ]
  },
  {
    "code": "sfupsx",
    "name": "NON-SUBMARINE",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "non-submarine"
    ]
  },
  {
    "code": "sfupv",
    "name": "DIVE REPORT LOCATION",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "dive",
      "report",
      "location"
    ]
  },
  {
    "code": "sfupw",
    "name": "UNDERWATER WEAPON",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "underwater",
      "weapon"
    ]
  },
  {
    "code": "sfupwd",
    "name": "UNDERWATER DECOY",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "underwater",
      "decoy"
    ]
  },
  {
    "code": "sfupwdm",
    "name": "SEA MINE DECOY",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "decoy"
    ]
  },
  {
    "code": "sfupwdmg",
    "name": "SEA MINE DECOY, BOTTOM/GROUND",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "decoy,",
      "bottom",
      "ground"
    ]
  },
  {
    "code": "sfupwdmm",
    "name": "SEA MINE DECOY, MOORED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "decoy,",
      "moored"
    ]
  },
  {
    "code": "sfupwm",
    "name": "SEA MINE",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine"
    ]
  },
  {
    "code": "sfupwma",
    "name": "SEA MINE MINE ANCHOR",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "anchor"
    ]
  },
  {
    "code": "sfupwmb",
    "name": "SEA MINE GENERAL OBSTRUCTOR",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "general",
      "obstructor"
    ]
  },
  {
    "code": "sfupwmbd",
    "name": "SEA MINE GENERAL OBSTRUCTOR NEUTRALIZED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "general",
      "obstructor",
      "neutralized"
    ]
  },
  {
    "code": "sfupwmc",
    "name": "SEA MINE MILCO",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "milco"
    ]
  },
  {
    "code": "sfupwmd",
    "name": "SEA MINE NEUTRALIZED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "neutralized"
    ]
  },
  {
    "code": "sfupwme",
    "name": "SEA MINE MILEC",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "milec"
    ]
  },
  {
    "code": "sfupwmf",
    "name": "SEA MINE - FLOATING",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "floating"
    ]
  },
  {
    "code": "sfupwmfc",
    "name": "SEA MINE MILCO - FLOATING",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "milco",
      "floating"
    ]
  },
  {
    "code": "sfupwmfd",
    "name": "SEA MINE NEUTRALIZED - FLOATING",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "neutralized",
      "floating"
    ]
  },
  {
    "code": "sfupwmfe",
    "name": "SEA MINE MILEC - FLOATING",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "milec",
      "floating"
    ]
  },
  {
    "code": "sfupwmfo",
    "name": "SEA MINE NON-MINE MINE-LIKE CONTACT - FLOATING",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "non-mine",
      "mine-like",
      "contact",
      "floating"
    ]
  },
  {
    "code": "sfupwmfr",
    "name": "SEA MINE NEGATIVE REACQUISITION - FLOATING",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "negative",
      "reacquisition",
      "floating"
    ]
  },
  {
    "code": "sfupwmfx",
    "name": "SEA MINE EXERCISE MINE - FLOATING",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "exercise",
      "floating"
    ]
  },
  {
    "code": "sfupwmg",
    "name": "SEA MINE - BOTTOM",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "bottom"
    ]
  },
  {
    "code": "sfupwmgc",
    "name": "SEA MINE MILCO - BOTTOM",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "milco",
      "bottom"
    ]
  },
  {
    "code": "sfupwmgd",
    "name": "SEA MINE NEUTRALIZED - BOTTOM",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "neutralized",
      "bottom"
    ]
  },
  {
    "code": "sfupwmge",
    "name": "SEA MINE MILEC - BOTTOM",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "milec",
      "bottom"
    ]
  },
  {
    "code": "sfupwmgo",
    "name": "SEA MINE NON-MINE MINE-LIKE CONTACT - BOTTOM",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "non-mine",
      "mine-like",
      "contact",
      "bottom"
    ]
  },
  {
    "code": "sfupwmgr",
    "name": "SEA MINE NEGATIVE REACQUISITION - BOTTOM",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "negative",
      "reacquisition",
      "bottom"
    ]
  },
  {
    "code": "sfupwmgx",
    "name": "SEA MINE EXERCISE MINE - BOTTOM",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "exercise",
      "bottom"
    ]
  },
  {
    "code": "sfupwmm",
    "name": "SEA MINE - MOORED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "moored"
    ]
  },
  {
    "code": "sfupwmmc",
    "name": "SEA MINE MILCO - MOORED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "milco",
      "moored"
    ]
  },
  {
    "code": "sfupwmmd",
    "name": "SEA MINE NEUTRALIZED - MOORED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "neutralized",
      "moored"
    ]
  },
  {
    "code": "sfupwmme",
    "name": "SEA MINE MILEC - MOORED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "milec",
      "moored"
    ]
  },
  {
    "code": "sfupwmmo",
    "name": "SEA MINE NON-MINE MINE-LIKE CONTACT - MOORED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "non-mine",
      "mine-like",
      "contact",
      "moored"
    ]
  },
  {
    "code": "sfupwmmr",
    "name": "SEA MINE NEGATIVE REACQUISITION - MOORED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "negative",
      "reacquisition",
      "moored"
    ]
  },
  {
    "code": "sfupwmmx",
    "name": "SEA MINE EXERCISE MINE - MOORED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "exercise",
      "moored"
    ]
  },
  {
    "code": "sfupwmn",
    "name": "SEA MINE NON-MINE MINE-LIKE CONTACT",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "non-mine",
      "mine-like",
      "contact"
    ]
  },
  {
    "code": "sfupwmo",
    "name": "SEA MINE (IN OTHER POSITION)",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "(in",
      "other",
      "position)"
    ]
  },
  {
    "code": "sfupwmod",
    "name": "SEA MINE (IN OTHER POSITION) NEUTRALIZED",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "(in",
      "other",
      "position)",
      "neutralized"
    ]
  },
  {
    "code": "sfupwmr",
    "name": "SEA MINE NEGATIVE REACQUISITION",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "negative",
      "reacquisition"
    ]
  },
  {
    "code": "sfupwms",
    "name": "SEA MINE - RISING",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "rising"
    ]
  },
  {
    "code": "sfupwmsd",
    "name": "SEA MINE NEUTRALIZED - RISING",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "neutralized",
      "rising"
    ]
  },
  {
    "code": "sfupwmsx",
    "name": "SEA MINE EXERCISE MINE - RISING",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "exercise",
      "rising"
    ]
  },
  {
    "code": "sfupwmx",
    "name": "SEA MINE EXERCISE MINE",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "sea",
      "mine",
      "exercise"
    ]
  },
  {
    "code": "sfupwt",
    "name": "TORPEDO",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "torpedo"
    ]
  },
  {
    "code": "sfupx",
    "name": "UNEXPLODED EXPLOSIVE ORDNANCE",
    "category": "Subsurface",
    "tags": [
      "friendly",
      "subsurface",
      "unexploded",
      "explosive",
      "ordnance"
    ]
  }
];

// Size symbols for echelon markers
export const SIZE_SYMBOLS: Record<string, { symbol: string; name: string }> = {
    'Team/Crew': { symbol: '•', name: 'Team/Crew' },
    'Squad': { symbol: '••', name: 'Squad' },
    'Section': { symbol: '•••', name: 'Section' },
    'Platoon': { symbol: 'I', name: 'Platoon' },
    'Company': { symbol: 'II', name: 'Company' },
    'Battalion': { symbol: 'III', name: 'Battalion' },
    'Regiment': { symbol: 'X', name: 'Regiment' },
    'Brigade': { symbol: 'XX', name: 'Brigade' },
    'Division': { symbol: 'XXX', name: 'Division' },
    'Corps': { symbol: 'XXXX', name: 'Corps' },
    'Army': { symbol: 'XXXXX', name: 'Army' },
    'Army Group': { symbol: 'XXXXXX', name: 'Army Group' },
};

export function getNatoSymbolFilename(code: string, affiliation: Affiliation): string {
    const prefix = AFFILIATION_PREFIX[affiliation];
    const paddedCode = code.padEnd(15, '-');
    return `${prefix}.${paddedCode}.png`;
}

/**
 * Generate a crisp SVG symbol using milsymbol library
 */
export function generateNatoSymbolSVG(code: string, affiliation: Affiliation, size: number = 100): string {
    // Map our affiliation to milsymbol format
    // milsymbol uses the affiliation from the SIDC code itself (position 2)
    let sidc = code;

    // Pad to 15 characters if needed
    sidc = sidc.padEnd(15, '-');

    // Replace position 2 with the correct affiliation character for milsymbol
    const affMap: Record<Affiliation, string> = {
        friendly: 'f',
        hostile: 'h',
        neutral: 'n',
        unknown: 'u'
    };

    sidc = sidc[0] + affMap[affiliation] + sidc.substring(2);

    try {
        const symbol = new ms.Symbol(sidc, { size, fill: true });
        return symbol.asSVG();
    } catch (e) {
        // Fallback to a basic unit symbol if code is invalid
        try {
            const fallback = new ms.Symbol('sfgpu----------', { size, fill: true });
            return fallback.asSVG();
        } catch {
            return '';
        }
    }
}

/**
 * Generate a data URL for a NATO symbol (for use in img src)
 */
export function getNatoSymbolDataUrl(code: string, affiliation: Affiliation, size: number = 100): string {
    const svg = generateNatoSymbolSVG(code, affiliation, size);
    if (!svg) return '';
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Military terminology mapping for search expansion
const MILITARY_TERM_SYNONYMS: Record<string, string[]> = {
    // Air terms
    'fighter': ['f', 'jet', 'interceptor'],
    'bomber': ['b', 'strike'],
    'tanker': ['k', 'refuel', 'refueling', 'kc'],
    'cargo': ['c', 'transport', 'logistics', 'airlift'],
    'reconnaissance': ['recon', 'recce', 'surveillance', 'intelligence', 'isr'],
    'trainer': ['t', 'training'],
    'utility': ['u', 'general purpose'],
    'jammer': ['j', 'jamming', 'ecm', 'electronic warfare', 'ew'],
    'awacs': ['airborne early warning', 'aew', 'radar aircraft'],
    'uav': ['unmanned aerial vehicle', 'drone', 'rpv'],
    'vstol': ['vtol', 'vertical takeoff', 'harrier'],
    'medevac': ['medical evacuation', 'ambulance', 'casualty evacuation'],
    'csar': ['combat search and rescue', 'personnel recovery', 'rescue'],

    // Ground terms
    'infantry': ['inf', 'foot', 'rifles', 'troops'],
    'armor': ['armour', 'tank', 'armored', 'armoured', 'heavy', 'mbt'],
    'armoured': ['armored', 'armour', 'tank', 'heavy'],
    'mechanized': ['mech', 'armored', 'tracked'],
    'artillery': ['arty', 'gun', 'cannon', 'howitzer', 'fa'],
    'mortar': ['indirect fire'],
    'engineer': ['eng', 'sapper', 'combat engineer'],
    'cavalry': ['cav', 'scout', 'recon'],
    'air defense': ['air defence', 'ad', 'sam', 'antiaircraft', 'aa', 'flak'],
    'air defence': ['air defense', 'ad', 'sam', 'antiaircraft', 'aa', 'flak'],
    'missile': ['mlrs', 'rocket'],
    'intelligence': ['mi', 'intel', 'g2', 's2'],
    'signal': ['signals', 'comm', 'communication', 'comms', 'radio'],
    'medical': ['med', 'hospital', 'ambulance'],
    'supply': ['logistics', 'transport', 'quartermaster'],
    'maintenance': ['maint', 'repair', 'ordnance'],
    'cbrn': ['chemical', 'nbc', 'hazmat'],
    'civil affairs': ['ca', 'cimic'],

    // SOF terms
    'sof': ['special operations', 'special ops', 'spec ops'],
    'special forces': ['sf', 'green beret', 'oda'],
    'ranger': ['rgr', 'rangers', '75th', 'special operations light infantry'],
    'seal': ['navy seal', 'nsw', 'seal team', 'sea-air-land', 'sea air land'],
    'delta': ['cag', 'delta force', '1st sfod'],
    'psyops': ['psychological operations', 'miso', 'information operations'],
    'marsoc': ['marine special operations', 'marine raiders', 'msob'],
    'pj': ['pararescue', 'para rescue', 'combat rescue'],
    'eod': ['explosive ordnance disposal', 'bomb disposal'],

    // Sea terms
    'submarine': ['sub', 'ssn', 'ssbn', 'undersea'],
    'destroyer': ['dd', 'ddg'],
    'cruiser': ['cg'],
    'frigate': ['ff', 'ffg'],
    'carrier': ['cv', 'cvn', 'aircraft carrier', 'flat top'],
    'amphibious': ['lpd', 'lhd', 'lha', 'landing ship'],
    'oiler': ['tanker', 'ao', 'replenishment'],

    // Equipment
    'helicopter': ['helo', 'chopper', 'rotary wing'],
    'rotary wing': ['helicopter', 'helo', 'rw'],
    'fixed wing': ['aircraft', 'plane', 'fw'],
    'apc': ['armored personnel carrier', 'carrier'],
    'ifv': ['infantry fighting vehicle', 'icv'],
};

// Expand search query to include related terms
function expandQuery(query: string): string[] {
    const lowerQuery = query.toLowerCase().trim();
    const terms = [lowerQuery];

    // Add synonyms
    for (const [term, synonyms] of Object.entries(MILITARY_TERM_SYNONYMS)) {
        if (term === lowerQuery || synonyms.includes(lowerQuery)) {
            terms.push(term, ...synonyms);
        }
    }

    return [...new Set(terms)]; // Remove duplicates
}

export function searchNatoSymbols(query: string): NatoSymbolEntry[] {
    const expandedTerms = expandQuery(query);

    // Only return friendly variants since milsymbol handles affiliation dynamically
    const dedupedSymbols = NATO_SYMBOLS;

    if (!expandedTerms[0]) return dedupedSymbols.slice(0, 100);

    return dedupedSymbols.filter(entry => {
        const lowerName = entry.name.toLowerCase();
        // Check if any expanded term matches
        return expandedTerms.some(term =>
            lowerName.includes(term) ||
            entry.tags.some(tag => tag.includes(term)) ||
            entry.code.includes(term)
        );
    }).slice(0, 200);
}

export function getNatoSymbolByCode(code: string): NatoSymbolEntry | undefined {
    const exact = NATO_SYMBOLS.find(e => e.code === code);
    if (exact) return exact;
    return NATO_SYMBOLS.find(e => code.startsWith(e.code));
}

export function inferNatoSymbolFromType(unitType: string): string {
    const typeMap: Record<string, string> = {
        'Ground': 'sfgpuc---------',
        'Air': 'sfapmf---------',
        'SOF': 'sffp-----------',
        'Support': 'sfgpus---------',
    };
    return typeMap[unitType] || 'sfgp-----------';
}

export function getSizeSymbolFromEchelon(echelon: string): { symbol: string; name: string } | undefined {
    return SIZE_SYMBOLS[echelon];
}
