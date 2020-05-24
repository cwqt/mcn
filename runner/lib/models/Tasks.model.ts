export enum Jobs {
    Routine     = "runRoutine",
    Subroutine  = "runSubRoutine",
    Task        = "runTask"
}

export interface ITaskRoutine {
    _id:            string,
    last_ran:       number,
    last_task:      string, //ITask _id
    name:           string,
    short_desc?:    string,
    cron:           string, //cron string
    exe_count:      string,
    timezone:       string,
}

export enum TaskState {
    Complete    = 'complete',
    Pending     = 'pending',
    Failed      = 'failed',
    TimedOut    = 'timed_out'
}

export interface ITask {
    state:  TaskState,
    error:  string,
    name:   string
}