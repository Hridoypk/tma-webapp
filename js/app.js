/* ══════════════════════════════════════════════════════════════════
   AAMVA Premium — Telegram Mini App Logic v2
   Features:
   - Per-state distinct forms with state-specific field configs
   - Auto-Generate buttons for DOB, Name, Height, Issue/Expiry dates
   - DLN and INC display boxes with auto-generate
   - State-aware DL number format patterns (mirrors TG.py DocEngine)
   ══════════════════════════════════════════════════════════════════ */

// ─── Helpers ────────────────────────────────────────────────────
const randDigits = (n) => Array.from({length:n}, () => Math.floor(Math.random()*10)).join('');
const randLetter = () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random()*26)];
const randLetters = (n=1) => Array.from({length:n}, randLetter).join('');
const padDate = (d) => String(d).padStart(2, '0');

// ─── Faker Data for Auto-Generate ───────────────────────────────
const FAKE_FIRST_NAMES_M = ['JAMES','JOHN','ROBERT','MICHAEL','WILLIAM','DAVID','RICHARD','JOSEPH','THOMAS','CHRISTOPHER','CHARLES','DANIEL','MATTHEW','ANTHONY','MARK','DONALD','STEVEN','PAUL','ANDREW','JOSHUA'];
const FAKE_FIRST_NAMES_F = ['MARY','PATRICIA','JENNIFER','LINDA','BARBARA','ELIZABETH','SUSAN','JESSICA','SARAH','KAREN','LISA','NANCY','BETTY','MARGARET','SANDRA','ASHLEY','DOROTHY','KIMBERLY','EMILY','DONNA'];
const FAKE_LAST_NAMES = ['SMITH','JOHNSON','WILLIAMS','BROWN','JONES','GARCIA','MILLER','DAVIS','RODRIGUEZ','MARTINEZ','HERNANDEZ','LOPEZ','GONZALEZ','WILSON','ANDERSON','THOMAS','TAYLOR','MOORE','JACKSON','MARTIN','LEE','PEREZ','THOMPSON','WHITE','HARRIS','SANCHEZ','CLARK','RAMIREZ','LEWIS','ROBINSON','WALKER','YOUNG','ALLEN','KING','WRIGHT','SCOTT','TORRES','NGUYEN','HILL','FLORES','GREEN','ADAMS','NELSON','BAKER','HALL','RIVERA','CAMPBELL','MITCHELL','CARTER','ROBERTS'];
const FAKE_STREETS = ['MAIN ST','OAK AVE','MAPLE DR','CEDAR LN','ELM ST','PINE RD','WALNUT BLVD','BIRCH WAY','ASH ST','WILLOW CT','SPRING CREEK DR','SUNSET BLVD','PARK AVE','LAKE VIEW DR','HIGHLAND AVE','RIVER RD','FOREST LN','VALLEY DR','HILL ST','MEADOW LN'];
const FAKE_CITIES = {
  AL:['BIRMINGHAM','MONTGOMERY','HUNTSVILLE','MOBILE','TUSCALOOSA'],AK:['ANCHORAGE','JUNEAU','FAIRBANKS'],AZ:['PHOENIX','TUCSON','MESA','SCOTTSDALE','CHANDLER'],
  AR:['LITTLE ROCK','FORT SMITH','FAYETTEVILLE'],CA:['LOS ANGELES','SAN FRANCISCO','SAN DIEGO','SAN JOSE','SACRAMENTO'],CO:['DENVER','COLORADO SPRINGS','AURORA'],
  CT:['BRIDGEPORT','NEW HAVEN','HARTFORD'],DE:['WILMINGTON','DOVER','NEWARK'],DC:['WASHINGTON'],FL:['MIAMI','JACKSONVILLE','TAMPA','ORLANDO','ST PETERSBURG'],
  GA:['ATLANTA','AUGUSTA','COLUMBUS','SAVANNAH'],HI:['HONOLULU','HILO','KAILUA'],ID:['BOISE','MERIDIAN','NAMPA'],IL:['CHICAGO','AURORA','NAPERVILLE','SPRINGFIELD'],
  IN:['INDIANAPOLIS','FORT WAYNE','EVANSVILLE'],IA:['DES MOINES','CEDAR RAPIDS','DAVENPORT'],KS:['WICHITA','OVERLAND PARK','KANSAS CITY'],KY:['LOUISVILLE','LEXINGTON','BOWLING GREEN'],
  LA:['NEW ORLEANS','BATON ROUGE','SHREVEPORT'],ME:['PORTLAND','LEWISTON','BANGOR'],MD:['BALTIMORE','FREDERICK','ROCKVILLE'],MA:['BOSTON','WORCESTER','SPRINGFIELD'],
  MI:['DETROIT','GRAND RAPIDS','ANN ARBOR'],MN:['MINNEAPOLIS','ST PAUL','ROCHESTER'],MS:['JACKSON','GULFPORT','SOUTHAVEN'],MO:['KANSAS CITY','ST LOUIS','SPRINGFIELD'],
  MT:['BILLINGS','MISSOULA','GREAT FALLS'],NE:['OMAHA','LINCOLN','BELLEVUE'],NV:['LAS VEGAS','HENDERSON','RENO'],NH:['MANCHESTER','NASHUA','CONCORD'],
  NJ:['NEWARK','JERSEY CITY','PATERSON'],NM:['ALBUQUERQUE','LAS CRUCES','SANTA FE'],NY:['NEW YORK','BUFFALO','ROCHESTER','ALBANY'],NC:['CHARLOTTE','RALEIGH','GREENSBORO'],
  ND:['FARGO','BISMARCK','GRAND FORKS'],OH:['COLUMBUS','CLEVELAND','CINCINNATI'],OK:['OKLAHOMA CITY','TULSA','NORMAN'],OR:['PORTLAND','EUGENE','SALEM'],
  PA:['PHILADELPHIA','PITTSBURGH','ALLENTOWN'],RI:['PROVIDENCE','WARWICK','CRANSTON'],SC:['COLUMBIA','CHARLESTON','GREENVILLE'],SD:['SIOUX FALLS','RAPID CITY'],
  TN:['NASHVILLE','MEMPHIS','KNOXVILLE'],TX:['HOUSTON','SAN ANTONIO','DALLAS','AUSTIN','FORT WORTH','EL PASO'],UT:['SALT LAKE CITY','WEST VALLEY CITY','PROVO'],
  VT:['BURLINGTON','SOUTH BURLINGTON'],VA:['VIRGINIA BEACH','NORFOLK','CHESAPEAKE','RICHMOND'],WA:['SEATTLE','SPOKANE','TACOMA'],WV:['CHARLESTON','HUNTINGTON'],
  WI:['MILWAUKEE','MADISON','GREEN BAY'],WY:['CHEYENNE','CASPER','LARAMIE']
};

// ─── State Data with DL formats (mirrors TG.py StateProfile) ────
const STATES = [
  { code:"AL", name:"Alabama", dlFormat:"digits:7", rev:"2022", expiryYears:4 },
  { code:"AK", name:"Alaska", dlFormat:"digits:7", rev:"2018", expiryYears:8 },
  { code:"AZ", name:"Arizona", dlFormat:"L+digits:8", rev:"2023", expiryYears:12 },
  { code:"AR", name:"Arkansas", dlFormat:"9+digits:8", rev:"2016", expiryYears:8 },
  { code:"CA", name:"California", dlFormat:"L+digits:7", rev:"2024", tag:"new", expiryYears:5 },
  { code:"CO", name:"Colorado", dlFormat:"digits:9", rev:"2022", expiryYears:5 },
  { code:"CT", name:"Connecticut", dlFormat:"digits:9", rev:"2017", expiryYears:6 },
  { code:"DE", name:"Delaware", dlFormat:"digits:7", rev:"2018", expiryYears:8 },
  { code:"DC", name:"D.C.", dlFormat:"digits:7", rev:"2017", expiryYears:8 },
  { code:"FL", name:"Florida", dlFormat:"L+digits:12", rev:"2017", expiryYears:8 },
  { code:"GA", name:"Georgia", dlFormat:"digits:9", rev:"2019", expiryYears:8 },
  { code:"HI", name:"Hawaii", dlFormat:"L+digits:8", rev:"2013", expiryYears:8 },
  { code:"ID", name:"Idaho", dlFormat:"LL+digits:6", rev:"2023", expiryYears:8 },
  { code:"IL", name:"Illinois", dlFormat:"L+digits:11", rev:"2016", expiryYears:4 },
  { code:"IN", name:"Indiana", dlFormat:"indiana_hyphen", rev:"2017", expiryYears:6 },
  { code:"IA", name:"Iowa", dlFormat:"3d+2L+4d", rev:"2017", expiryYears:8 },
  { code:"KS", name:"Kansas", dlFormat:"ks_hyphen", rev:"2012", expiryYears:6 },
  { code:"KY", name:"Kentucky", dlFormat:"L+digits:8", rev:"2018", expiryYears:4 },
  { code:"LA", name:"Louisiana", dlFormat:"digits:9", rev:"2016", expiryYears:6 },
  { code:"ME", name:"Maine", dlFormat:"digits:7", rev:"2016", expiryYears:6 },
  { code:"MD", name:"Maryland", dlFormat:"md_hyphen", rev:"2021", expiryYears:8 },
  { code:"MA", name:"Massachusetts", dlFormat:"S+digits:8", rev:"2018", expiryYears:5 },
  { code:"MI", name:"Michigan", dlFormat:"mi_spaced", rev:"2024", expiryYears:4 },
  { code:"MN", name:"Minnesota", dlFormat:"L+digits:12", rev:"2017", expiryYears:4 },
  { code:"MS", name:"Mississippi", dlFormat:"digits:9", rev:"2023", expiryYears:8 },
  { code:"MO", name:"Missouri", dlFormat:"L+digits:9", rev:"2020", expiryYears:6 },
  { code:"MT", name:"Montana", dlFormat:"digits:9", rev:"2016", expiryYears:8 },
  { code:"NE", name:"Nebraska", dlFormat:"L+digits:8", rev:"2021", expiryYears:5 },
  { code:"NV", name:"Nevada", dlFormat:"digits:10", rev:"2021", expiryYears:8 },
  { code:"NH", name:"New Hampshire", dlFormat:"NHL+digits:8", rev:"2024", expiryYears:5 },
  { code:"NJ", name:"New Jersey", dlFormat:"L+digits:14", rev:"2020", expiryYears:4 },
  { code:"NM", name:"New Mexico", dlFormat:"digits:9", rev:"2016", expiryYears:8 },
  { code:"NY", name:"New York", dlFormat:"digits:9", rev:"2022", expiryYears:8 },
  { code:"NC", name:"N. Carolina", dlFormat:"digits:12", rev:"2017", expiryYears:8 },
  { code:"ND", name:"N. Dakota", dlFormat:"LLL+digits:6", rev:"2023", expiryYears:6 },
  { code:"OH", name:"Ohio", dlFormat:"LL+digits:6", rev:"2018", expiryYears:4 },
  { code:"OK", name:"Oklahoma", dlFormat:"L+digits:9", rev:"2017", expiryYears:4 },
  { code:"OR", name:"Oregon", dlFormat:"digits:7", rev:"2018", expiryYears:8 },
  { code:"PA", name:"Pennsylvania", dlFormat:"digits:8", rev:"2022", expiryYears:4 },
  { code:"RI", name:"Rhode Island", dlFormat:"digits:7", rev:"2022", expiryYears:5 },
  { code:"SC", name:"S. Carolina", dlFormat:"digits:9", rev:"2018", expiryYears:8 },
  { code:"SD", name:"S. Dakota", dlFormat:"digits:8", rev:"2016", expiryYears:5 },
  { code:"TN", name:"Tennessee", dlFormat:"digits:9", rev:"2018", expiryYears:5 },
  { code:"TX", name:"Texas", dlFormat:"digits:8", rev:"2020", expiryYears:6 },
  { code:"UT", name:"Utah", dlFormat:"digits:9", rev:"2018", expiryYears:8 },
  { code:"VT", name:"Vermont", dlFormat:"digits:8", rev:"2017", expiryYears:8 },
  { code:"VA", name:"Virginia", dlFormat:"L+digits:8", rev:"2018", expiryYears:8 },
  { code:"WA", name:"Washington", dlFormat:"wa_wdl", rev:"2021", tag:"new", expiryYears:6 },
  { code:"WV", name:"W. Virginia", dlFormat:"L+digits:6", rev:"2016", expiryYears:5 },
  { code:"WI", name:"Wisconsin", dlFormat:"L+digits:13", rev:"2017", expiryYears:8 },
  { code:"WY", name:"Wyoming", dlFormat:"wy_hyphen", rev:"2017", expiryYears:4 },
];

// ─── Per-state form fields ──────────────────────────────────────
const FIELD_DEFS = {
  DCS: { label:"Last Name", type:"text", placeholder:"DOE", required:true, section:"personal", autoGen:true },
  DAC: { label:"First Name", type:"text", placeholder:"JOHN", required:true, section:"personal", autoGen:true },
  DAD: { label:"Middle Name", type:"text", placeholder:"MICHAEL", required:false, section:"personal" },
  DBC: { label:"Sex", type:"select", options:[["1","Male"],["2","Female"],["9","Non-Binary"]], required:true, section:"personal" },
  DBB: { label:"Date of Birth", type:"date", placeholder:"MM/DD/YYYY", required:true, section:"personal", autoGen:true },
  DAU: { label:"Height (in)", type:"text", placeholder:"510", required:true, section:"physical", autoGen:true },
  DAW: { label:"Weight (lbs)", type:"number", placeholder:"180", required:false, section:"physical" },
  DAY: { label:"Eye Color", type:"select", options:[["BLK","Black"],["BLU","Blue"],["BRO","Brown"],["GRY","Gray"],["GRN","Green"],["HAZ","Hazel"]], required:true, section:"physical" },
  DAZ: { label:"Hair Color", type:"select", options:[["BAL","Bald"],["BLK","Black"],["BLN","Blond"],["BRO","Brown"],["GRY","Gray"],["RED","Red"],["WHI","White"]], required:false, section:"physical" },
  DAG: { label:"Street Address", type:"text", placeholder:"123 MAIN ST", required:true, section:"address", autoGen:true },
  DAH: { label:"Address Line 2", type:"text", placeholder:"APT 4B", required:false, section:"address" },
  DAI: { label:"City", type:"text", placeholder:"HOUSTON", required:true, section:"address", autoGen:true },
  DAK: { label:"ZIP Code", type:"text", placeholder:"770010000", required:true, section:"address", autoGen:true },
  DCA: { label:"DL Class", type:"text", placeholder:"C", required:true, section:"document" },
  DCB: { label:"Restrictions", type:"text", placeholder:"NONE", required:false, section:"document" },
  DCD: { label:"Endorsements", type:"text", placeholder:"NONE", required:false, section:"document" },
  DDK: { label:"Organ Donor", type:"select", options:[["0","No"],["1","Yes"]], required:false, section:"physical" },
  DCU: { label:"Name Suffix", type:"text", placeholder:"JR, SR, III", required:false, section:"personal" },
  DCE: { label:"Weight Range", type:"select", options:[["0","≤70"],["1","71-100"],["2","101-130"],["3","131-160"],["4","161-190"],["5","191-220"],["6","221-250"],["7","251-280"],["8","281-320"],["9","321+"]], required:false, section:"physical" },
  DCL: { label:"Race/Ethnicity", type:"select", options:[["W","White"],["B","Black"],["H","Hispanic"],["A","Asian"],["I","Native American"],["U","Unknown"]], required:false, section:"physical" },
};

const DEFAULT_MANDATORY = ["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"];
const DEFAULT_OPTIONAL  = ["DAD","DAW","DAZ","DCB","DCD"];

// Per-state field configs — ALL 51 states from TG.py STATE_FIELD_REQS
const STATE_FIELDS = {
  TX: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAW","DAZ","DCL","DDK","DCB","DCD"] },
  FL: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  AR: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DDK","DCB","DCD"] },
  CO: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAW","DAZ","DCL","DCU","DCB","DCD"] },
  IA: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  IN: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAZ","DAG","DAI","DAK","DCA"], optional:["DAD","DDK","DCB","DCD"] },
  PA: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  NV: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAH","DAZ","DCE","DCU","DCB","DCD"] },
  DC: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCU","DCB","DCD"] },
  SC: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAW","DCL","DDK","DCB","DCD"] },
  WA: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAW","DDK","DCB","DCD"] },
  CA: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAZ","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  IL: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAZ","DAG","DAI","DAK","DCA"], optional:["DAD","DCU","DCB","DCD"] },
  OH: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAW","DAZ","DCE","DCU","DDK","DCB","DCD"] },
  NC: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAZ","DCL","DDK","DCB","DCD"] },
  NE: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAZ","DCE","DCL","DCB","DCD"] },
  MO: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAW","DCU","DDK","DCB","DCD"] },
  MA: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAH","DCB","DCD"] },
  NH: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAH","DCB","DCD"] },
  WY: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAZ","DAG","DAI","DAK","DCA"], optional:["DAD","DAH","DCB","DCD"] },
  MI: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAG","DAI","DAK","DCA"], optional:["DAD","DAH","DCB","DCD"] },
  MD: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  AK: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAZ","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  GA: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DDK","DCB","DCD"] },
  MS: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DDK","DCB","DCD"] },
  NJ: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  UT: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAZ","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  VA: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  KS: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DDK","DCB","DCD"] },
  MN: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  WI: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  TN: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCU","DCB","DCD"] },
  OR: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  OK: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  WV: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAH","DAZ","DCB","DCD"] },
  AZ: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAZ","DAG","DAI","DAK","DCA"], optional:["DAD","DDK","DCB","DCD"] },
  RI: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAZ","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  SD: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  VT: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  NY: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DCB","DCD"] },
  AL: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAZ","DCB","DCD"] },
  CT: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAZ","DCB","DCD"] },
  DE: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAZ","DCB","DCD"] },
  HI: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAZ","DCB","DCD"] },
  ID: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAZ","DCB","DCD"] },
  KY: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAZ","DCB","DCD"] },
  LA: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAZ","DCB","DCD"] },
  ME: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAZ","DCB","DCD"] },
  MT: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAZ","DCB","DCD"] },
  NM: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAZ","DCB","DCD"] },
  ND: { mandatory:["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAG","DAI","DAK","DCA"], optional:["DAD","DAZ","DCB","DCD"] },
};

// ─── DL Number Generator (mirrors DocEngine.gen_dl) ─────────────
function generateDLN(state, lastName) {
  const fmt = state.dlFormat;
  const ln = (lastName || 'DOE').toUpperCase();
  const first = ln[0] || 'A';

  if (fmt === 'digits:7') return randDigits(7);
  if (fmt === 'digits:8') return randDigits(8);
  if (fmt === 'digits:9') return randDigits(9);
  if (fmt === 'digits:10') return randDigits(10);
  if (fmt === 'digits:12') return randDigits(12);
  if (fmt === '9+digits:8') return '9' + randDigits(8);
  if (fmt === 'L+digits:6') return first + randDigits(6);
  if (fmt === 'L+digits:7') return first + randDigits(7);
  if (fmt === 'L+digits:8') return first + randDigits(8);
  if (fmt === 'L+digits:9') return first + randDigits(9);
  if (fmt === 'L+digits:11') return first + randDigits(11);
  if (fmt === 'L+digits:12') return first + randDigits(12);
  if (fmt === 'L+digits:13') return first + randDigits(13);
  if (fmt === 'L+digits:14') return first + randDigits(14);
  if (fmt === 'LL+digits:6') return randLetters(2) + randDigits(6);
  if (fmt === 'S+digits:8') return 'S' + randDigits(8);
  if (fmt === 'NHL+digits:8') return 'NHL' + randDigits(8);
  if (fmt === 'LLL+digits:6') return randLetters(3) + randDigits(6);
  if (fmt === '3d+2L+4d') return randDigits(3) + randLetters(2) + randDigits(4);
  if (fmt === 'indiana_hyphen') return `${randDigits(4)}-${randDigits(2)}-${randDigits(4)}`;
  if (fmt === 'ks_hyphen') return `K${randDigits(2)}-${randDigits(2)}-${randDigits(4)}`;
  if (fmt === 'md_hyphen') return `${first}-${randDigits(3)}-${randDigits(3)}-${randDigits(3)}-${randDigits(3)}`;
  if (fmt === 'wy_hyphen') return `${randDigits(6)}-${randDigits(3)}`;
  if (fmt === 'mi_spaced') return `${first} ${randDigits(3)} ${randDigits(3)} ${randDigits(3)} ${randDigits(3)}`;
  if (fmt === 'wa_wdl') return ('WDL' + randLetter() + randDigits(8)).substring(0, 12);
  return randDigits(8);
}

// ─── ICN Generator ──────────────────────────────────────────────
function generateICN(state) {
  // Most states: 10-digit number, some use specific prefixes
  const prefixes = { FL:'FL', CA:'', TX:'', NY:'', IL:'', PA:'' };
  const prefix = prefixes[state.code] || '';
  const digits = prefix ? 10 - prefix.length : 10;
  return prefix + randDigits(digits);
}

// ─── Auto-Generate Field Values ─────────────────────────────────
function autoGenField(key, stateCode) {
  const s = STATES.find(x => x.code === stateCode);
  if (key === 'DCS') return FAKE_LAST_NAMES[Math.floor(Math.random() * FAKE_LAST_NAMES.length)];
  if (key === 'DAC') {
    const sex = document.getElementById('field-DBC')?.value || '1';
    const list = sex === '2' ? FAKE_FIRST_NAMES_F : FAKE_FIRST_NAMES_M;
    return list[Math.floor(Math.random() * list.length)];
  }
  if (key === 'DBB') {
    const y = 1970 + Math.floor(Math.random() * 35);
    const m = 1 + Math.floor(Math.random() * 12);
    const d = 1 + Math.floor(Math.random() * 28);
    return `${padDate(m)}/${padDate(d)}/${y}`;
  }
  if (key === 'DAU') {
    // Height in format: 3-digit inches-based (e.g., 510 = 5'10")
    const feet = 5 + Math.floor(Math.random() * 2);
    const inches = Math.floor(Math.random() * 12);
    return `${feet}${padDate(inches)}`;
  }
  if (key === 'DAG') {
    const num = 100 + Math.floor(Math.random() * 9900);
    const st = FAKE_STREETS[Math.floor(Math.random() * FAKE_STREETS.length)];
    return `${num} ${st}`;
  }
  if (key === 'DAI') {
    const cities = FAKE_CITIES[stateCode] || ['SPRINGFIELD'];
    return cities[Math.floor(Math.random() * cities.length)];
  }
  if (key === 'DAK') {
    return randDigits(5) + '0000';
  }
  return '';
}

// ─── App State ──────────────────────────────────────────────────
let currentView = 'dashboard';
let selectedState = null;
let formMode = 'semi_auto';
let tg = null;
let generatedDLN = '';
let generatedICN = '';
let generatedDD = '';
let generatedIssue = '';
let generatedExpiry = '';

// ─── Telegram SDK Init ──────────────────────────────────────────
function initTelegram() {
  if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation();
    document.documentElement.style.setProperty('--tg-bg', tg.themeParams.bg_color || '#0a0e14');
    document.documentElement.style.setProperty('--tg-text', tg.themeParams.text_color || '#f0f4f8');
  } else {
    console.log('[TMA] Running outside Telegram — mock mode');
  }
}

// ─── View Navigation ────────────────────────────────────────────
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active');
    currentView = viewId;
  }
  if (tg) {
    if (viewId === 'dashboard') { tg.BackButton.hide(); tg.MainButton.hide(); }
    else if (viewId === 'states-view') { tg.BackButton.show(); tg.MainButton.hide(); }
    else if (viewId === 'form-view') {
      tg.BackButton.show();
      tg.MainButton.setText('Generate Barcode');
      tg.MainButton.show();
      tg.MainButton.color = '#3b82f6';
    }
  }
  if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

// ─── Dashboard ──────────────────────────────────────────────────
function renderDashboard() {
  const user = tg?.initDataUnsafe?.user;
  const el = document.getElementById('welcome-name');
  if (el) el.textContent = user?.first_name || 'User';
  const statEl = document.getElementById('stat-states');
  if (statEl) statEl.textContent = STATES.length;
}

// ─── State Grid ─────────────────────────────────────────────────
function renderStateGrid(filter = '') {
  const grid = document.getElementById('state-grid');
  if (!grid) return;

  const filtered = STATES.filter(s =>
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.code.toLowerCase().includes(filter.toLowerCase())
  );

  grid.innerHTML = filtered.map(s => `
    <div class="state-card ${s.tag ? 'new-tag' : ''}" data-code="${s.code}"
         onclick="selectState('${s.code}')" role="button" tabindex="0"
         aria-label="${s.name}">
      <span class="state-code">${s.code}</span>
      <span class="state-name">${s.name}</span>
      <span class="state-status active"></span>
    </div>
  `).join('');

  const countEl = document.getElementById('state-count');
  if (countEl) countEl.textContent = filtered.length;
}

function selectState(code) {
  selectedState = STATES.find(s => s.code === code);
  if (!selectedState) return;
  if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
  generatedDLN = '';
  generatedICN = '';
  generatedDD = '';
  generatedIssue = '';
  generatedExpiry = '';
  renderForm(code);
  showView('form-view');
}

// ─── Form Rendering (PER-STATE DISTINCT FORMS) ──────────────────
function renderForm(stateCode) {
  const state = STATES.find(s => s.code === stateCode);
  if (!state) return;

  // Header
  const badge = document.getElementById('form-badge');
  const title = document.getElementById('form-title');
  const subtitle = document.getElementById('form-subtitle');
  if (badge) badge.textContent = stateCode;
  if (title) title.textContent = state.name;
  if (subtitle) subtitle.textContent = `AAMVA Rev. ${state.rev} · DL: ${describeDLFormat(state.dlFormat)}`;

  // Get state-specific field config
  const config = STATE_FIELDS[stateCode] || { mandatory: DEFAULT_MANDATORY, optional: DEFAULT_OPTIONAL };

  // Build sections
  const sections = { personal:[], physical:[], address:[], document:[] };
  const sectionIcons = {
    personal: '<svg width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><use href="#icon-user"/></svg>',
    physical: '<svg width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><use href="#icon-ruler"/></svg>',
    address:  '<svg width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><use href="#icon-map"/></svg>',
    document: '<svg width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><use href="#icon-file"/></svg>',
  };
  const sectionLabels = {
    personal: 'Personal Information',
    physical: 'Physical Description',
    address:  'Address',
    document: 'Document Details'
  };

  config.mandatory.forEach(key => {
    const def = FIELD_DEFS[key];
    if (def) sections[def.section].push({ key, ...def, required: true });
  });
  config.optional.forEach(key => {
    const def = FIELD_DEFS[key];
    if (def) sections[def.section].push({ key, ...def, required: false });
  });

  const container = document.getElementById('form-fields');
  if (!container) return;

  let html = '';

  // ── ID Display Boxes (DLN, INC, DD, Issue, Expiry) ──
  const today = new Date();
  const todayStr = `${padDate(today.getMonth()+1)}/${padDate(today.getDate())}/${today.getFullYear()}`;
  const expiryYrs = state.expiryYears || 8;
  const expiryDt = new Date(today.getFullYear() + expiryYrs, today.getMonth(), today.getDate());
  const expiryStr = `${padDate(expiryDt.getMonth()+1)}/${padDate(expiryDt.getDate())}/${expiryDt.getFullYear()}`;

  html += `
    <div class="id-boxes-grid">
      <div class="id-box">
        <div class="id-box-header">
          <span class="id-box-label">DL Number</span>
          <button class="auto-gen-btn" onclick="autoGenDLN()" aria-label="Auto-generate DL number">
            <svg width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><use href="#icon-zap"/></svg>
            Generate
          </button>
        </div>
        <input type="text" class="id-box-value" id="dln-display"
               placeholder="Click Generate or type manually"
               oninput="onIdBoxEdit('dln',this.value)" />
        <div class="id-box-format">Format: ${describeDLFormat(state.dlFormat)}</div>
      </div>
      <div class="id-box">
        <div class="id-box-header">
          <span class="id-box-label">Inventory Control</span>
          <button class="auto-gen-btn" onclick="autoGenINC()" aria-label="Auto-generate ICN">
            <svg width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><use href="#icon-zap"/></svg>
            Generate
          </button>
        </div>
        <input type="text" class="id-box-value" id="icn-display"
               placeholder="Click Generate or type manually"
               oninput="onIdBoxEdit('icn',this.value)" />
        <div class="id-box-format">10-digit control number</div>
      </div>
      <div class="id-box">
        <div class="id-box-header">
          <span class="id-box-label">Doc Discriminator</span>
          <button class="auto-gen-btn" onclick="autoGenDD()" aria-label="Auto-generate doc discriminator">
            <svg width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><use href="#icon-zap"/></svg>
            Generate
          </button>
        </div>
        <input type="text" class="id-box-value" id="dd-display"
               placeholder="Click Generate or type manually"
               oninput="onIdBoxEdit('dd',this.value)" />
        <div class="id-box-format">Unique document identifier</div>
      </div>
      <div class="id-box">
        <div class="id-box-header">
          <span class="id-box-label">Issue Date</span>
          <button class="auto-gen-btn" onclick="autoGenIssue()" aria-label="Auto-generate issue date">
            <svg width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><use href="#icon-zap"/></svg>
            Generate
          </button>
        </div>
        <input type="text" class="id-box-value" id="issue-display"
               placeholder="MM/DD/YYYY or Generate"
               oninput="onIdBoxEdit('issue',this.value)" />
        <div class="id-box-format">Default: today (${todayStr})</div>
      </div>
      <div class="id-box id-box-full">
        <div class="id-box-header">
          <span class="id-box-label">Expiry Date</span>
          <button class="auto-gen-btn" onclick="autoGenExpiry()" aria-label="Auto-generate expiry date">
            <svg width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><use href="#icon-zap"/></svg>
            Generate
          </button>
        </div>
        <input type="text" class="id-box-value" id="expiry-display"
               placeholder="MM/DD/YYYY or Generate"
               oninput="onIdBoxEdit('expiry',this.value)" />
        <div class="id-box-format">Default: +${expiryYrs} years (${expiryStr})</div>
      </div>
    </div>`;

  // ── Form Sections ──
  for (const [sectionKey, fields] of Object.entries(sections)) {
    if (fields.length === 0) continue;
    html += `<div class="form-section">
      <div class="form-section-title">${sectionIcons[sectionKey]} ${sectionLabels[sectionKey]}</div>
      <div class="form-row">`;

    fields.forEach((f, i) => {
      if (i > 0 && i % 2 === 0) html += `</div><div class="form-row">`;

      const hasAutoGen = f.autoGen && (f.type === 'text' || f.type === 'date' || f.type === 'number');
      html += `<div class="form-group">
        <div class="form-label-row">
          <label class="form-label" for="field-${f.key}">${f.label} ${f.required ? '<span class="required">*</span>' : ''}</label>
          ${hasAutoGen ? `<button class="auto-gen-mini" onclick="autoFillField('${f.key}')" aria-label="Auto-generate ${f.label}" title="Auto-generate">
            <svg width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none"><use href="#icon-zap"/></svg>
          </button>` : ''}
        </div>`;

      if (f.type === 'select' && f.options) {
        html += `<select class="form-select" id="field-${f.key}" data-field="${f.key}" ${f.required ? 'required' : ''}>
          <option value="">Select...</option>
          ${f.options.map(([val, text]) => `<option value="${val}">${text}</option>`).join('')}
        </select>`;
      } else if (f.type === 'date') {
        html += `<input class="form-input" type="text" id="field-${f.key}" data-field="${f.key}"
          placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''} inputmode="numeric">`;
      } else if (f.type === 'number') {
        html += `<input class="form-input" type="number" id="field-${f.key}" data-field="${f.key}"
          placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''} inputmode="numeric">`;
      } else {
        html += `<input class="form-input" type="text" id="field-${f.key}" data-field="${f.key}"
          placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''} autocapitalize="characters">`;
      }
      html += `</div>`;
    });
    html += `</div></div>`;
  }

  // ── Auto-Generated IDs (summary) ──
  html += `
    <div class="auto-ids-card">
      <div class="auto-ids-header"><svg><use href="#icon-zap"/></svg> Auto-Generated Summary</div>
      <div class="auto-id-row">
        <span class="auto-id-label">DL Number</span>
        <span class="auto-id-value" id="preview-daq">${generatedDLN || 'Pending'}</span>
      </div>
      <div class="auto-id-row">
        <span class="auto-id-label">Doc Discriminator</span>
        <span class="auto-id-value" id="preview-dcf">${generatedDD || 'Pending'}</span>
      </div>
      <div class="auto-id-row">
        <span class="auto-id-label">Inventory Control</span>
        <span class="auto-id-value" id="preview-dck">${generatedICN || 'Pending'}</span>
      </div>
      <div class="auto-id-row">
        <span class="auto-id-label">Issue Date</span>
        <span class="auto-id-value" id="preview-dbd">${generatedIssue || 'Pending'}</span>
      </div>
      <div class="auto-id-row">
        <span class="auto-id-label">Expiry Date</span>
        <span class="auto-id-value" id="preview-dba">${generatedExpiry || 'Pending'}</span>
      </div>
    </div>`;

  container.innerHTML = html;
  updateFormProgress();
}

// ─── DL Format Descriptor ───────────────────────────────────────
function describeDLFormat(fmt) {
  const map = {
    'digits:7': '7 digits', 'digits:8': '8 digits', 'digits:9': '9 digits',
    'digits:10': '10 digits', 'digits:12': '12 digits',
    'L+digits:6': 'Letter + 6 digits', 'L+digits:7': 'Letter + 7 digits',
    'L+digits:8': 'Letter + 8 digits', 'L+digits:9': 'Letter + 9 digits',
    'L+digits:11': 'Letter + 11 digits', 'L+digits:12': 'Letter + 12 digits',
    'L+digits:13': 'Letter + 13 digits', 'L+digits:14': 'Letter + 14 digits',
    'LL+digits:6': '2 Letters + 6 digits', 'LLL+digits:6': '3 Letters + 6 digits',
    'S+digits:8': 'S + 8 digits',
    'NHL+digits:8': 'NHL + 8 digits', '3d+2L+4d': '3dig + 2let + 4dig',
    'indiana_hyphen': 'XXXX-XX-XXXX', 'ks_hyphen': 'KXX-XX-XXXX',
    'md_hyphen': 'X-XXX-XXX-XXX-XXX', 'wy_hyphen': 'XXXXXX-XXX',
    'mi_spaced': 'X XXX XXX XXX XXX', 'wa_wdl': 'WDLXXXXXXXXX',
    '9+digits:8': '9 + 8 digits',
  };
  return map[fmt] || fmt;
}

// ─── Auto-Generate DLN ─────────────────────────────────────────
function autoGenDLN() {
  if (!selectedState) return;
  const lastNameEl = document.getElementById('field-DCS');
  const lastName = lastNameEl?.value || 'DOE';
  generatedDLN = generateDLN(selectedState, lastName);

  const display = document.getElementById('dln-display');
  if (display) {
    display.value = generatedDLN;
    display.classList.add('flash');
    setTimeout(() => display.classList.remove('flash'), 300);
  }

  const preview = document.getElementById('preview-daq');
  if (preview) preview.textContent = generatedDLN;

  if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  showToast('DL Number generated', 'success');
}

// ─── Auto-Generate INC ─────────────────────────────────────────
function autoGenINC() {
  if (!selectedState) return;
  generatedICN = generateICN(selectedState);

  const display = document.getElementById('icn-display');
  if (display) {
    display.value = generatedICN;
    display.classList.add('flash');
    setTimeout(() => display.classList.remove('flash'), 300);
  }

  const preview = document.getElementById('preview-dck');
  if (preview) preview.textContent = generatedICN;

  if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  showToast('ICN generated', 'success');
}

// ─── Auto-Generate Doc Discriminator ────────────────────────────
function generateDD(state) {
  // DD format: typically 10-25 alphanumeric chars, state-specific
  const dl = generatedDLN || randDigits(8);
  const iss = new Date();
  const issStr = `${iss.getFullYear()}${padDate(iss.getMonth()+1)}${padDate(iss.getDate())}`;
  // Common pattern: issDate + DL fragment + random
  return (issStr + dl.replace(/[^A-Z0-9]/gi, '').substring(0, 4) + randDigits(6)).substring(0, 20);
}

function autoGenDD() {
  if (!selectedState) return;
  generatedDD = generateDD(selectedState);

  const display = document.getElementById('dd-display');
  if (display) {
    display.value = generatedDD;
    display.classList.add('flash');
    setTimeout(() => display.classList.remove('flash'), 300);
  }

  const preview = document.getElementById('preview-dcf');
  if (preview) preview.textContent = generatedDD;

  if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  showToast('Doc Discriminator generated', 'success');
}

// ─── Auto-Generate Issue Date ───────────────────────────────────
function autoGenIssue() {
  if (!selectedState) return;
  // Default: today, or random recent date within last 2 years
  const now = new Date();
  const daysBack = Math.floor(Math.random() * 60); // within last 60 days
  const d = new Date(now.getTime() - daysBack * 86400000);
  generatedIssue = `${padDate(d.getMonth()+1)}/${padDate(d.getDate())}/${d.getFullYear()}`;

  const display = document.getElementById('issue-display');
  if (display) {
    display.value = generatedIssue;
    display.classList.add('flash');
    setTimeout(() => display.classList.remove('flash'), 300);
  }

  const preview = document.getElementById('preview-dbd');
  if (preview) preview.textContent = generatedIssue;

  if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  showToast('Issue Date generated', 'success');
}

// ─── Auto-Generate Expiry Date ──────────────────────────────────
function autoGenExpiry() {
  if (!selectedState) return;
  // Default: issue date + state-specific expiry years
  const base = generatedIssue ? parseSimpleDate(generatedIssue) : new Date();
  const expiryYrs = selectedState?.expiryYears || 8;
  const expiry = new Date(base.getFullYear() + expiryYrs, base.getMonth(), base.getDate());
  generatedExpiry = `${padDate(expiry.getMonth()+1)}/${padDate(expiry.getDate())}/${expiry.getFullYear()}`;

  const display = document.getElementById('expiry-display');
  if (display) {
    display.value = generatedExpiry;
    display.classList.add('flash');
    setTimeout(() => display.classList.remove('flash'), 300);
  }

  const preview = document.getElementById('preview-dba');
  if (preview) preview.textContent = generatedExpiry;

  if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  showToast('Expiry Date generated', 'success');
}

// ─── Parse simple MM/DD/YYYY date ───────────────────────────────
function parseSimpleDate(str) {
  const parts = str.split('/');
  if (parts.length === 3) return new Date(parseInt(parts[2]), parseInt(parts[0])-1, parseInt(parts[1]));
  return new Date();
}

// ─── Auto-Fill Single Field ─────────────────────────────────────
function autoFillField(key) {
  if (!selectedState) return;
  const el = document.getElementById(`field-${key}`);
  if (!el) return;

  const val = autoGenField(key, selectedState.code);
  if (val) {
    el.value = val;
    el.classList.add('auto-filled');
    setTimeout(() => el.classList.remove('auto-filled'), 600);
    updateFormProgress();
    if (tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
  }
}

// ─── Form Progress ──────────────────────────────────────────────
function updateFormProgress() {
  const fields = document.querySelectorAll('#form-fields [data-field]');
  const required = [...fields].filter(f => f.hasAttribute('required'));
  const filled = required.filter(f => f.value.trim() !== '');
  const pct = required.length ? Math.round(filled.length / required.length * 100) : 0;

  const bar = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = `${filled.length}/${required.length} fields`;
}

// ─── Form Submission ────────────────────────────────────────────
function submitForm() {
  if (!selectedState) return;

  const fields = document.querySelectorAll('#form-fields [data-field]');
  const data = { state: selectedState.code };
  let hasError = false;

  fields.forEach(el => {
    const key = el.dataset.field;
    const val = el.value.trim();
    if (el.hasAttribute('required') && !val) {
      el.classList.add('error');
      hasError = true;
    } else {
      el.classList.remove('error');
    }
    if (val) data[key] = val;
  });

  // Include generated DLN/ICN
  if (generatedDLN) data._dln = generatedDLN;
  if (generatedICN) data._icn = generatedICN;
  if (generatedDD) data._dd = generatedDD;
  if (generatedIssue) data._issue = generatedIssue;
  if (generatedExpiry) data._expiry = generatedExpiry;

  if (hasError) {
    showToast('Please fill all required fields', 'error');
    if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
    // Focus first error field
    const firstErr = document.querySelector('.form-input.error, .form-select.error');
    if (firstErr) firstErr.focus();
    return;
  }

  if (tg) {
    tg.HapticFeedback.notificationOccurred('success');
    tg.MainButton.showProgress();
    try {
      tg.sendData(JSON.stringify(data));
    } catch (e) {
      showToast('Failed to send data', 'error');
      tg.MainButton.hideProgress();
    }
  } else {
    console.log('[TMA Mock] Form data:', JSON.stringify(data, null, 2));
    showToast('Data logged to console (mock mode)', 'success');
  }
}

// ─── Toast ──────────────────────────────────────────────────────
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── Event Listeners ────────────────────────────────────────────
function setupListeners() {
  const searchInput = document.getElementById('search-states');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => renderStateGrid(e.target.value));
  }

  document.addEventListener('input', (e) => {
    if (e.target.closest('#form-fields')) updateFormProgress();
  });

  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      formMode = btn.dataset.mode;
      if (tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
    });
  });

  if (tg) {
    tg.BackButton.onClick(() => {
      if (currentView === 'form-view') showView('states-view');
      else if (currentView === 'states-view') showView('dashboard');
    });
    tg.MainButton.onClick(() => submitForm());
  }
}

// ─── Initialize ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTelegram();
  renderDashboard();
  renderStateGrid();
  setupListeners();
  showView('dashboard');
});
