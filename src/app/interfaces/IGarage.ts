export interface IGarage {
  id: number,
  plate: string,
  entryHour: string,
  exitHour: string,
  cost: number,
  idUserEntry: string,
  idUserExit: string,
  parkingId: number,
  deleted: boolean | null
}