const VALIDATOR_REGEXPS = Object.seal({
  // Adapted from source: https://github.com/solvvy/redact-pii/blob/da5f16f/src/built-ins/simple-regexp-patterns.ts
  EMAIL: /([a-z0-9_\-.+]+)@\w+(\.\w+)*/,
  PHONE: /(\(?\+?[0-9]{1,2}\)?[-. ]?)?(\(?[0-9]{3}\)?|[0-9]{3})[-. ]?([0-9]{3}[-. ]?[0-9]{4}|\b[A-Z0-9]{7}\b)/,
  PROPERTY_UNIT_NUMBER: /(apt|bldg|dept|fl|hngr|lot|pier|rm|ste|slip|trlr|unit|#)\s*#?\.?\s*[a-z0-9-]+\b/,
  PROPERTY_STREET_ADDRESS: /\d+(\s+[nsew]\.?)?(\s+\w+){1,}\s+(?:st(?:\.|reet)?|dr(?:\.|ive)?|pl(?:\.|ace)?|ave(?:\.|nue)?|rd|road|lane|boulevard|blvd|loop|way|circle|cir|court|ct|plaza|square|run|parkway|point|pike|square|driveway|trace|park|terrace)/,
  SSN: /\b\d{3}[ -.]\d{2}[ -.]\d{4}\b/,
  // Adapted from source: https://stackoverflow.com/a/3809435
  URL: /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)\/.*/
});

const VALIDATOR_REGEXPS_KEYS = Object.keys(VALIDATOR_REGEXPS);

const VALIDATOR_ERRORS = Object.seal({
  EMAIL: 'contains an email address',
  PHONE: 'contains a phone number',
  PROPERTY_UNIT_NUMBER: 'contains a property unit number',
  PROPERTY_STREET_ADDRESS: 'contains a property street address',
  SSN: 'contains a social-security number',
  URL: 'contains a link to an external website'
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
        detail: VALIDATOR_ERRORS[key]
      });
    }
  }
  return errors.length ? errors : false;
};

module.exports = containsPII;
