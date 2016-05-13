export function formatDate (date) {
  if (!date.toISOString) {
    date = new Date(date)
  }
  return date.toISOString().split('T')[0]
}

export function getStartOfWeek (date) {
  var d = new Date(+date)
  d.setHours(0, 0, 0)
  d.setDate(d.getDate() + 1 - (d.getDay() || 7))
  return d
}

export function getTimezoneOffset () {
  return (60 * new Date().getTimezoneOffset() * 1000)
}

export const ONE_DAY = 60 * 60 * 24 * 1000
export const THIRTY_DAYS = 30 * ONE_DAY
export const ONE_WEEK = ONE_DAY * 7
export const SIXTY_DAYS = 60 * 60 * 24 * 60 * 1000
