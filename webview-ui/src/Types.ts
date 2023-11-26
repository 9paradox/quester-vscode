export interface Action {
  index: number;
  name: string;
  description: string;
  type: string;
  color: string;
}

export interface Step {
  action: string;
  inputData: unknown;
}

export interface StepItem extends Step {
  id: string;
  actionItem: Action;
  selected: boolean;
  actionInput: ActionInput | null;
  selectedActionInput: ActionInputType;
}

export enum DragList {
  actionList = "action-list",
  stepList = "step-list",
}

export type ValueType = "string" | "number" | "boolean" | "object";

export interface Field {
  label: string;
  description: string;
  type: ValueType;
  element: "input" | "textarea" | "json" | "select" | "checkbox";
  options?: string[];
  value: string;
  name?: string;
  required?: boolean;
}

export interface ActionInput {
  inputDataSimple: Field[] | null;
  inputDataAdvance: Field[] | null;
  inputDataRaw: Field[] | null;
}

export interface Dictionary<T> {
  [Key: string]: T;
}

export enum ActionInputType {
  simple = "simple",
  advance = "advance",
  raw = "raw",
}
