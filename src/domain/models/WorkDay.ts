import { WorkDay as enumWorkDay } from "@/domain/enums/WorkDay";

export type WorkDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

const _workDayTranslations: Record<WorkDay, string> = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const translateWorkDay = (day: WorkDay): string => {
  return _workDayTranslations[day];
};

export const itemsWorkDays = [
  { name: "Domingo", value: enumWorkDay.sunday },
  { name: "Segunda", value: enumWorkDay.monday },
  { name: "Terça", value: enumWorkDay.tuesday },
  { name: "Quarta", value: enumWorkDay.wednesday },
  { name: "Quinta", value: enumWorkDay.thursday },
  { name: "Sexta", value: enumWorkDay.friday },
  { name: "Sábado", value: enumWorkDay.saturday },
];
