import test from 'ava';

import containsPII from './index.js';

test('detects an email address', t => {
  const result = containsPII('oops, an email cvan+wuz+here@example.com.');
  t.is(Boolean(result), true);
  t.is(result.length, 1);
  t.is(result[0].type, 'EMAIL');
  t.is(result[0].detail, 'contains an email address');
});

test('detects a phone number', t => {
  const result = containsPII('oops, call me at + 1 248.982.6323.');
  t.is(Boolean(result), true);
  t.is(result.length, 1);
  t.is(result[0].type, 'PHONE');
  t.is(result[0].detail, 'contains a phone number');
});

test('detects a unit number', t => {
  const result = containsPII('This is a lovely location in Unit 42.');
  t.is(Boolean(result), true);
  t.is(result.length, 1);
  t.is(result[0].type, 'PROPERTY_UNIT_NUMBER');
  t.is(result[0].detail, 'contains a property unit number');
});

test('detects a unit number with with a # pound', t => {
  const result = containsPII('This is a lovely location in Unit # 142.');
  t.is(Boolean(result), true);
  t.is(result.length, 1);
  t.is(result[0].type, 'PROPERTY_UNIT_NUMBER');
  t.is(result[0].detail, 'contains a property unit number');
});

test('detects an unit number for an apartment', t => {
  const result = containsPII('Apt. 3 is dope.');
  t.is(Boolean(result), true);
  t.is(result.length, 1);
  t.is(result[0].type, 'PROPERTY_UNIT_NUMBER');
  t.is(result[0].detail, 'contains a property unit number');
});

test('detects an unit number for an apartment without punctutation and ends with a street suffix ("place")', t => {
  const result = containsPII(`Unit 2 is the Place.`);
  t.is(Boolean(result), true);
  t.is(result.length, 2);
  t.is(result[0].type, 'PROPERTY_UNIT_NUMBER');
  t.is(result[0].detail, 'contains a property unit number');
  t.is(result[1].type, 'PROPERTY_STREET_ADDRESS');
  t.is(result[1].detail, 'contains a property street address');
});

test('detects a street address', t => {
  const result = containsPII('This 650 Castro place is dope.');
  t.is(Boolean(result), true);
  t.is(result.length, 1);
  t.is(result[0].type, 'PROPERTY_STREET_ADDRESS');
  t.is(result[0].detail, 'contains a property street address');
});

test('detects a social-security number', t => {
  const result = containsPII('The person is \n\n310-52-0582\n.');
  t.is(Boolean(result), true);
  t.is(result.length, 1);
  t.is(result[0].type, 'SSN');
  t.is(result[0].detail, 'contains a social-security number');
});

test('allows a URL domain name (FQDN) without a protcol + path', t => {
  const result = containsPII('You can find more at example.com.');
  t.is(Boolean(result), false);
});

test('allows a URL without a path', t => {
  const result = containsPII('You can find more at https://example.com.');
  t.is(Boolean(result), false);
});

test('detects a URL without a protocol', t => {
  const result = containsPII('You can find more at example.com/wer.');
  t.is(Boolean(result), true);
  t.is(result.length, 1);
  t.is(result[0].type, 'URL');
  t.is(result[0].detail, 'contains a link to an external website');
});

test('detects a URL with a path', t => {
  const result = containsPII(
    'You can find more at https://example.com/?more-info.'
  );
  t.is(Boolean(result), true);
  t.is(result.length, 1);
  t.is(result[0].type, 'URL');
  t.is(result[0].detail, 'contains a link to an external website');
});

test('allows number/string combo that might look like a street address', t => {
  const result = containsPII('This is 1000 Square Ft.');
  t.is(Boolean(result), false);
});

test('allows a string that might look like a URL domain (FQDN)', t => {
  const result = containsPII('This is 1000 sq.ft.');
  t.is(Boolean(result), false);
});

test('allows "lot" in a string (not a street address)', t => {
  const result = containsPII(`This is a 1,500 sq. ft. lot.`);
  t.is(Boolean(result), false);
});

test('allows "unit" in a string (not a street address)', t => {
  const result = containsPII(`This unit is great.`);
  t.is(Boolean(result), false);
});

test('allows "unit" near numbers in a string (not a street address)', t => {
  const result = containsPII(`In this unit. 2 bed.`);
  t.is(Boolean(result), false);
});
