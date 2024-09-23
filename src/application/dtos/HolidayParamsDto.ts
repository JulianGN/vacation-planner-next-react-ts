export class HolidayParamsDTO {
  periodStart: string | null;
  periodEnd: string | null;
  idState?: string;
  idCity?: string;

  constructor(searchParams: URLSearchParams) {
    this.periodStart = searchParams.get("period.start");
    this.periodEnd = searchParams.get("period.end");
    this.idState = searchParams.get("idState") ?? undefined;
    this.idCity = searchParams.get("idCity") ?? undefined;
  }

  get period() {
    return this.periodStart && this.periodEnd
      ? { start: new Date(this.periodStart), end: new Date(this.periodEnd) }
      : null;
  }

  get numberIdState() {
    return !isNaN(Number(this.idState)) ? Number(this.idState) : undefined;
  }
}
