const careerSignals = [
  /\bleetcode\b/i,
  /\bdsa\b/i,
  /\bdata structures?\b/i,
  /\balgorithms?\b/i,
  /\bsolved?\s+\d*\s*(coding\s*)?(problems?|questions?)\b/i,
  /\bcod(e|ed|ing)\b/i,
  /\bgithub\b/i,
  /\bcommit(ted)?\b/i,
  /\brepo(sitory)?\b/i,
  /\bproject\b/i,
  /\bportfolio\b/i,
  /\bapp\b/i,
  /\bapi\b/i,
  /\bfeature\b/i,
  /\bbug\b/i,
  /\bdebug(g|ged)?\b/i,
  /\bdeploy(ed|ment)?\b/i,
  /\bdocument(ed|ation)?\b/i,
  /\bresume\b/i,
  /\binterview\b/i,
  /\bintern(ship)?\b/i,
  /\bjob\b/i,
  /\bapplication\b/i,
  /\bapplied\b/i,
  /\broadmap\b/i,
  /\bcertification\b/i,
  /\bcourse\b/i,
  /\btutorial\b/i,
  /\bstudied?\b.*\b(java|spring|react|next|node|python|sql|database|backend|frontend|ai|ml|typescript|javascript)\b/i,
  /\b(java|spring boot|react|next\.?js|node\.?js|python|typescript|javascript|sql|postgres|supabase|backend|frontend|full stack|system design|machine learning|ai)\b/i
];

const nonCareerSignals = [
  /\bwwe\b/i,
  /\bcricket\b/i,
  /\bfootball\b/i,
  /\bmovie\b/i,
  /\bnetflix\b/i,
  /\bgaming?\b/i,
  /\bplayed?\b/i,
  /\bwatch(ed|ing)?\b/i,
  /\bslept\b/i,
  /\bnap\b/i,
  /\bscroll(ed|ing)?\b/i,
  /\binstagram\b/i,
  /\byoutube\b/i
];

export function isCareerProgressText(text: string) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (normalized.length < 6) {
    return false;
  }

  const hasCareerSignal = careerSignals.some((pattern) => pattern.test(normalized));
  if (hasCareerSignal) {
    return true;
  }

  const hasNonCareerSignal = nonCareerSignals.some((pattern) => pattern.test(normalized));
  if (hasNonCareerSignal) {
    return false;
  }

  return false;
}

export function careerProgressError() {
  return "This does not look like career or builder progress. Add work like LeetCode, a project, GitHub, study, interview prep, resume, or applications.";
}
