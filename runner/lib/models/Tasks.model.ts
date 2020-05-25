export enum Jobs {
    Routine     = "runRoutine",
    Subroutine  = "runSubRoutine",
    Task        = "runTask"
}

// GET http://tasks.corrhizal.net/task/:tid/TaskResolutionStates.Success
export enum TaskResolutionStates {
    Success = 'success',
    Fail = 'fail',
}

export enum TaskState {
    Complete    = 'complete',
    Pending     = 'pending',
    Inactive    = 'inactive',
    Failed      = 'failed',
    TimedOut    = 'timed_out'
}

export interface ITaskRoutine {
    _id:            string,
    state:          TaskState
    name:           string,
    cron:           string, //cron string
    timezone:       string,
    created_at:     number,
    execution_count:number,

    short_desc?:    string,
    last_started?:  number,
    last_finished?: number,
}

export interface ITask {
    _id:            string,
    name:           string,
    command:        string, // mcnlang string
    state:          TaskState,
    created_at:     number,

    error?:         string,
    last_started?:  number,
    last_finished?: number,
}