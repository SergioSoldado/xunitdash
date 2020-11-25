export function shiftDate(date: Date, numDays: number): Date {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + numDays)
  return newDate
}

export function dateFormatDMYHMS(date: string): string {
  const d = new Date(date)
  d.setSeconds(0, 0)
  return `${[d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/')} ${[
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
  ].join(':')}`
  // return d.toISOString();
}

export function dateFormatYMD(date: Date | string) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

export function secondsToHours(seconds: number): string {
  seconds = Math.round(seconds)
  const hours = ('0' + Math.floor(seconds / 3600).toString()).slice(-2)
  const minutes = ('0' + Math.round((seconds % 3600) / 60).toString()).slice(-2)
  return `${hours}h${minutes}`
}

export function getTimeStamp(date?: Date): number {
  if (date !== undefined) {
    return Math.floor(date.getTime() / 1000)
  }
  return Math.floor(Date.now() / 1000)
}
