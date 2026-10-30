export type CriteriaType = "BENEFIT" | "COST";

export interface Criterion {
  code: string;
  name: string;
  weight: number;
  type: CriteriaType;
}

export interface Applicant {
  id: string;
  name: string;
  values: number[];
}

export interface ElectreInput {
  applicants: Applicant[];
  criteria: Criterion[];
}