import { helpers } from 'jql-tools'

let DateHelper = helpers.DateHelper
let EventHelper = helpers.EventHelper

class RetentionState {
  constructor (options) {
    this.toDate = options.toDate
    this.fromDate = options.fromDate
    this.startEvents = options.startEvents.slice()
    this.retentionEvents = options.retentionEvents
    this.retentionBuckets = options.retentionBuckets
    this.retentionInterval = options.retentionInterval

    this.retention = options.retention || {}
    this.startEpoch = options.startEpoch || null
  }

  getEndDate () {
    var parts = this.toDate.split('-')
    return new Date(parts[0], Number(parts[1] - 1), parts[2]).valueOf() + DateHelper.ONE_DAY - DateHelper.getTimezoneOffset()
  }

  getStartDate () {
    var parts = this.fromDate.split('-')
    return new Date(parts[0], Number(parts[1] - 1), parts[2]).valueOf() - DateHelper.getTimezoneOffset()
  }

  getBeginningOfBucket (epoch) {
    var start = this.getStartDate()
    var bucketNum = Math.floor((epoch - start) / this.retentionInterval)
    return new Date(start + (bucketNum * this.retentionInterval)).valueOf()
  }

  hasCompletedAllStartEventsAfterThisEvent (event) {
    if (EventHelper.equals(this.startEvents[0], event)) this.startEvents.shift()
    return this.startEvents.length === 0
  }

  hasBeenRetainedAfterThisEvent (event) {
    return EventHelper.containsEvent(this.retentionEvents, event)
  }

  hasStarted () {
    return !!this.startEpoch
  }

  setStartedOnDayOfEvent (event) {
    this.startEpoch = this.getBeginningOfBucket(event.time)
  }

  setRetainedOnDayOfEvent (event) {
    let dX = (this.getBeginningOfBucket(event.time) - this.startEpoch) / this.retentionInterval
    if (this.retentionBuckets.indexOf(dX) !== -1) {
      this.retention[dX] = RetentionState.STATUS.PRESENT
    }
  }

  consumeEvent (event) {
    if (!this.hasStarted() && this.hasCompletedAllStartEventsAfterThisEvent(event)) {
      return this.setStartedOnDayOfEvent(event)
    }

    if (this.hasStarted() && this.hasBeenRetainedAfterThisEvent(event)) {
      return this.setRetainedOnDayOfEvent(event)
    }
  }

  consume (events) {
    for (let event of events) {
      this.consumeEvent(event)
    }
  }

  toObject () {
    return {
      toDate: this.toDate,
      fromDate: this.fromDate,
      startEvents: this.startEvents,
      retentionEvents: this.retentionEvents,
      retentionInterval: this.retentionInterval,
      retentionBuckets: this.retentionBuckets,
      startEpoch: this.startEpoch,
      retention: this.retention
    }
  }

  bucketIsInFuture (bucket) {
    return this.startEpoch + (bucket * this.retentionInterval) > this.getEndDate()
  }

  ensureAllBucketsHaveStatus () {
    for (let bucket of this.retentionBuckets) {
      if (this.bucketIsInFuture(bucket)) {
        this.retention[bucket] = RetentionState.STATUS.FUTURE
      }

      if (!this.retention[bucket]) {
        this.retention[bucket] = RetentionState.STATUS.ABSENT
      }
    }
  }
}

RetentionState.fromObject = function (object, params) {
  object = object || params
  return new RetentionState(object)
}

RetentionState.STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  FUTURE: 'future'
}

module.exports = RetentionState
