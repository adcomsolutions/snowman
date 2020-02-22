import { arrayify, identityFn } from './utils.js'
import { partial } from './higherorder.js'

export const queryMods = {
  empty: (property) => [property, 'ISEMPTY', ''],
  notEq: (property, value) => [property, '!=', value],
  or: ([property, ...rest]) => [`OR${property}`, ...rest],
  choice: {
    anyOf: ([property, valueList]) => [property, 'IN', valueList.join()],
    noneOf: ([property, valueList]) => [property, 'NOT IN', valueList.join()]
  }
}

// HACK: Spread parameter transform uses Apply, won't work on native Objects)
const qualifyQuery = (glideQuery, qualifierList) =>
      arrayify(qualifierList)
      .forEach(([p1, p2, p3]) => glideQuery.addQuery(p1, p2, p3))

const eachQuery = (glideQuery, fn) =>
      glideQuery.next() ? [
        fn(glideQuery) || {...glideQuery},
        ...eachQuery(glideQuery, fn)
      ] : []

const exhaustQuery = (glideQuery) =>
      eachQuery(glideQuery, partial(identityFn, glideQuery))

// TODO: ESlint comments
export const queryRecords = (record, queryList, orderByField) => {
  const query = new GlideRecord(record)
  qualifyQuery(query, queryList) // eslint-disable-line functional/no-expression-statement
  query.orderBy(orderByField) // eslint-disable-line functional/no-expression-statement
  query.query() // eslint-disable-line functional/no-expression-statement
  return exhaustQuery(query)
}

export const mapRecords = (record, queryList, fn) => {
  const query = new GlideRecord(record)
  qualifyQuery(query, queryList) // eslint-disable-line functional/no-expression-statement
  query.query() // eslint-disable-line functional/no-expression-statement
  return eachQuery(query, fn)
}
