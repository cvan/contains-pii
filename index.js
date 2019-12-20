const VALIDATOR_REGEXPS = Object.seal({
  // Adapted from source: https://github.com/solvvy/redact-pii/blob/da5f16f/src/built-ins/simple-regexp-patterns.ts
  EMAIL: /([a-z0-9_\-.+]+)@\w+(\.\w+)*/,
  PHONE: /(\(?\+?[0-9]{1,2}\)?[-. ]?)?(\(?[0-9]{3}\)?|[0-9]{3})[-. ]?([0-9]{3}[-. ]?[0-9]{4}|\b[A-Z0-9]{7}\b)/,
  PROPERTY_UNIT_NUMBER: /(apt|bldg|dept|fl|hngr|lot |pier|rm|ste|slip|trlr|unit |#)\s*\.?#?\s*[0-9]+[a-z0-9-]*\b/i,
  PROPERTY_STREET_ADDRESS: /\d+(\s+[nsew]\.?)?(\s+\w+){1,}\s+(?:st(?:\.|reet)?|dr(?:\.|ive)?|pl(?:\.|ace)?|ave(?:\.|nue)?|rd|road|lane|boulevard|blvd|loop|way|circle|cir|court|ct|plaza|square|run|parkway|point|pike|square|driveway|trace|park|terrace)(\s|[^a-z]|$)/,
  SSN: /\b\d{3}[ -.]\d{2}[ -.]\d{4}\b/,
  // Adapted from source: https://stackoverflow.com/a/3809435
  URL: /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)\/.*/
});

const VALIDATOR_REGEXPS_KEYS = Object.keys(VALIDATOR_REGEXPS);

const VALIDATOR_ERROR_MESSAGES = Object.seal({
  EMAIL: 'Contains an email address',
  PHONE: 'Contains a phone number',
  PROPERTY_UNIT_NUMBER: 'Contains a condo-unit number',
  PROPERTY_STREET_ADDRESS: 'Contains a street address',
  SSN: 'Contains a social-security number',
  URL: 'Contains a link to an external website'
});

const VALIDATOR_ERROR_REASONS = Object.seal({
  EMAIL: 'Email addresses disallowed in field',
  PHONE: 'Phone numbers disallowed in field',
  PROPERTY_UNIT_NUMBER: 'Condo-unit numbers disallowed in field',
  PROPERTY_STREET_ADDRESS: 'Street addresses disallowed in field',
  SSN: 'Social-Security Numbers disallowed in field',
  URL: 'URLs disallowed in field'
});

const containsPII = str => {
  const strToTest = (str || '')
    .replace(/\s+/g, ' ')
    .replace(/\s/g, ' ')
    .toLocaleLowerCase();
  if (!strToTest) {
    return false;
  }
  let key;
  let errors = [];
  for (let i = 0; i < VALIDATOR_REGEXPS_KEYS.length; i++) {
    key = VALIDATOR_REGEXPS_KEYS[i];
    if (VALIDATOR_REGEXPS[key].test(strToTest)) {
      errors.push({
        type: key,
        message: VALIDATOR_ERROR_MESSAGES[key],
        reason: VALIDATOR_ERROR_REASONS[key]
      });
    }
  }
  return errors.length ? errors : false;
};

module.exports = containsPII;
