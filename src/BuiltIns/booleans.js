export const testBooleanString = ( booleanString ) =>
  booleanString === 'true' || booleanString === 'false'

export const booleanFromString = (booleanString) =>
  testBooleanString(booleanString) ? Boolean.valueOf(booleanString) : null
