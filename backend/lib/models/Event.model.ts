import { Event } from '../common/types/events.types';

export interface IEvent {
    _id:            string,
    event_type:     Event,
    created_at?:    Date,
}
