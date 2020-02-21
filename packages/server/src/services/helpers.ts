/* eslint-disable @typescript-eslint/camelcase */
import {PointInTimeState} from '../models/base';

interface ActiveAttributes {
  state: PointInTimeState.active;
  duration_start: Date;
  duration_end: undefined;
}

interface InactiveAttributes {
  state: PointInTimeState.inactive;
  duration_start: Date;
  duration_end: Date;
}

export function addActiveStatusFields(startDate: Date): ActiveAttributes {
  return {
    state: PointInTimeState.active,
    duration_start: startDate,
    duration_end: undefined,
  };
}

export function addInactiveStatusFields(
  startDate: Date,
  endDate: Date
): InactiveAttributes {
  return {
    state: PointInTimeState.inactive,
    duration_start: startDate,
    duration_end: endDate,
  };
}
