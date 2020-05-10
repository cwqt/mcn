import { EventType } from '../common/types/events.types';

export interface IEvent {
    images:         string[],
    event_type:     Event,
    created_at?:    number,
    content:        string,
}
