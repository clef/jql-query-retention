export function equals (e1, e2) {
  let e1name = e1.event || e1.name
  let e2name = e2.event || e2.name
  return e1name === e2name
}

export function containsEvent (eventCollection, event) {
  for (let ev of eventCollection) {
    if (equals(ev, event)) {
      return true
    }
  }
  return false
}
