import { Job } from "agenda"

export const runRoutine = async (job:Job) => {
    console.log(job.attrs)
}
export const runSubRoutine = async (job:Job) => {}