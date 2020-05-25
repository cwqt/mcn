export enum Jobs {
    Routine     = "runRoutine",
    Subroutine  = "runSubRoutine",
    Task        = "runTask"
}

export enum TaskState {
    Inactive    = 'inactive',
    Complete    = 'complete',
    Pending     = 'pending',
    Failed      = 'failed',
    TimedOut    = 'timed_out'
}

export interface ITaskRoutine {
    _id:            string,
    name:           string,
    cron:           string, //cron string
    execution_count:number,
    last_ran:       number,
    timezone:       string,
    short_desc?:    string,
    last_ran_task?: string, //ITask _id
    created_at:     number,
    locked:         boolean
}

export interface ITask {
    _id:        string,
    state:      TaskState,
    error:      string,
    name:       string,
    created_at: number,
    command:    string, // mcnlang string
}