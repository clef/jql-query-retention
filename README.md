# jql-query-retention

A better Mixpanel retention query, written in JQL. This query let's you:

* Define a series of events as your retention entrance condition (a user must complete ALL to be counted)
* Define a set of events as your retention condition (a user must complete ANY to be counted)

## Usage

To use, require the query and pass it the `MP.api.jql` function.

```javascript
import RetentionQuery from '@clef/jql-query-retention'

MP.api.jql(
  RetentionQuery,
  {
    fromDate: moment().subtract(20, 'days').toDate(),
    toDate: moment().toDate(),
    startEvents: [ { name: 'Your Start Event' } ],
    retentionEvents: [ { name: 'Your Retention Event' } ],
    retentionInterval: 8640000 // one day,
    retentionBuckets: [0, 1, 7, 4, 30]
  }
).done((results) => {
  console.log(results)
})
```

You can see detailed explanations of all params below.

## Params

### fromDate: new Date
### toDate: new Date
### startEvents: [ jql.types.Event ]

A series of events which together are the entrance condition. A
user must complete ALL of these events to be counted as a member
of the group we are measureing retention for. In other words,
they must do EventA AND EventB.

### retentionEvents: [ jql.types.Event ]

A set of events of which any can count sa the retention condition.
A user must complete ANY of these events to be counted
as retained on a given interval. In other words, they must do
EventA OR EventB.

### retentionInterval: Number (milliseconds)

The interval within which a user must complete an action to be
counted as retained. For instance, a retention interval of
1 day (8640000) means a user must complete one of the retentionEvents
in a 1 day interval to be counted as retained.

### retentionBuckets: [ Number ]

The number of intervals after the fromDate on which to measure retention.
For instance, if you have an interval of 1 day and retention buckets of
[0, 1, 7, 14, 30], this will return the retention for D0, D1, D7, D14,
and D30.
