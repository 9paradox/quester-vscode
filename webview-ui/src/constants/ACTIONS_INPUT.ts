import { CloneObject } from "../utilities/Helper";
import { Field, Dictionary, ActionInput, ActionInputType } from "../Types";
import { ACTIONS } from "./ACTIONS";

const ToBeType = [
  "equal",
  "==",
  "notEqual",
  "!=",
  "greaterThan",
  ">",
  "greaterThanOrEqual",
  ">=",
  "lessThan",
  "<",
  "lessThanOrEqual",
  "<=",
  "in",
  "notIn",
  "contains",
];

const ActionNames = ACTIONS.map((action) => action.name);

const StepOptionsType: Field[] = [
  {
    label: "action",
    description: "name of the action",
    type: "string",
    element: "select",
    options: CloneObject(ActionNames),
    value: "",
    required: true,
  },
  {
    label: "inputData",
    description: "input data in json format",
    type: "object",
    element: "json",
    value: "",
  },
];

const RawOptions: Field[] = [
  {
    label: "useFromLastStep",
    description: "check to input data from last step output data",
    type: "boolean",
    element: "checkbox",
    value: "false",
  },
  {
    label: "raw",
    description: "raw data in json format",
    type: "object",
    element: "json",
    value: "",
  },
];

const AxiosRequestConfigType: Field[] = [
  {
    label: "url",
    description: "http url of the request",
    type: "string",
    element: "input",
    value: "",
    required: true,
  },
  {
    label: "data",
    description: "data of the request in json format",
    type: "object",
    element: "json",
    value: "",
    required: true,
  },
  {
    label: "method",
    description: "method of the request",
    type: "string",
    element: "select",
    options: ["GET", "POST", "PUT", "DELETE"],
    value: "GET",
    required: true,
  },
  {
    label: "params",
    description: "params of the request",
    type: "object",
    element: "textarea",
    value: "",
  },
  {
    label: "headers",
    description: "headers of the request in json format",
    type: "object",
    element: "json",
    value: "",
  },
  {
    label: "responseType",
    description: "response type of the request",
    type: "string",
    element: "input",
    value: "",
  },
  {
    label: "timeout",
    description: "timeout of the request",
    type: "number",
    element: "input",
    value: "",
  },
  {
    label: "auth",
    description: "auth of the request in json format",
    type: "object",
    element: "json",
    value: "",
  },
];

export const ACTIONS_INPUT: Dictionary<ActionInput> = {
  get: {
    inputDataSimple: [
      {
        label: "url",
        description: "http url of the request",
        type: "string",
        element: "input",
        value: "",
        required: true,
      },
    ],
    inputDataAdvance: CloneObject(AxiosRequestConfigType),
    inputDataRaw: CloneObject(RawOptions),
  },
  post: {
    inputDataSimple: [
      {
        label: "url",
        description: "http url of the request",
        type: "string",
        element: "input",
        value: "",
        required: true,
      },
      {
        label: "data",
        description: "data of the request in json format",
        type: "object",
        element: "json",
        value: "",
        required: true,
      },
    ],
    inputDataAdvance: CloneObject(AxiosRequestConfigType),
    inputDataRaw: CloneObject(RawOptions),
  },
  axios: {
    inputDataSimple: null,
    inputDataAdvance: CloneObject(AxiosRequestConfigType),
    inputDataRaw: CloneObject(RawOptions),
  },
  pickData: {
    inputDataSimple: [
      {
        label: "query",
        description: "jmespath or jsonata query to pick data",
        type: "string",
        element: "textarea",
        value: "",
        required: true,
      },
    ],
    inputDataAdvance: null,
    inputDataRaw: CloneObject(RawOptions),
  },
  formatData: {
    inputDataSimple: [
      {
        label: "template",
        description: "render string template based on input data from last step",
        type: "string",
        element: "textarea",
        value: "",
        required: true,
      },
    ],
    inputDataAdvance: [
      {
        label: "templateData",
        description: "render string template based on input data from last step",
        type: "string",
        element: "textarea",
        value: "",
        required: true,
      },
      {
        label: "outputDataFormat",
        description: "render output format for template data",
        type: "string",
        element: "select",
        value: "string",
        options: ["string", "number", "boolean", "object"],
        required: true,
      },
    ],
    inputDataRaw: CloneObject(RawOptions),
  },
  formatTemplate: {
    inputDataSimple: [
      {
        label: "filePath",
        description: "path of the template file",
        type: "string",
        element: "input",
        value: "",
        required: true,
      },
    ],
    inputDataAdvance: [
      {
        label: "filePath",
        description: "path of the template file",
        type: "string",
        element: "input",
        value: "",
        required: true,
      },
      {
        label: "outputDataFormat",
        description: "render output format for template file",
        type: "string",
        element: "select",
        value: "string",
        options: ["string", "number", "boolean", "object"],
        required: true,
      },
    ],
    inputDataRaw: CloneObject(RawOptions),
  },
  pickAndVerify: {
    inputDataSimple: [
      {
        label: "query",
        description: "jmespath or jsonata query to pick data",
        type: "string",
        element: "textarea",
        value: "",
        required: true,
      },
      {
        label: "expected",
        description: "expected value",
        type: "object",
        element: "textarea",
        value: "",
        required: true,
      },
      {
        label: "toBe",
        description: "compare value with expected value",
        type: "string",
        element: "select",
        options: CloneObject(ToBeType),
        value: "equal",
        required: true,
      },
    ],
    inputDataAdvance: null,
    inputDataRaw: CloneObject(RawOptions),
  },
  verify: {
    inputDataSimple: [
      {
        label: "expected",
        description: "expected value",
        type: "object",
        element: "textarea",
        value: "",
        required: true,
      },
    ],
    inputDataAdvance: [
      {
        label: "expected",
        description: "expected value",
        type: "object",
        element: "textarea",
        value: "",
        required: true,
      },
      {
        label: "toBe",
        description: "compare value with expected value",
        type: "string",
        element: "select",
        options: CloneObject(ToBeType),
        value: "equal",
        required: true,
      },
    ],
    inputDataRaw: CloneObject(RawOptions),
  },
  verifyTimeTaken: {
    inputDataSimple: null,
    inputDataAdvance: [
      {
        label: "expected",
        description: "expected value",
        type: "number",
        element: "input",
        value: "",
        required: true,
      },
      {
        label: "format",
        description: "compare expected time against milliseconds or seconds of actual time",
        type: "string",
        element: "select",
        value: "ms",
        options: ["ms", "s"],
        required: true,
      },
      {
        label: "toBe",
        description: "compare value with expected value",
        type: "string",
        element: "select",
        options: CloneObject(ToBeType),
        value: "equal",
        required: true,
      },
    ],
    inputDataRaw: CloneObject(RawOptions),
  },
  pickStep: {
    inputDataSimple: [
      {
        label: "stepNumber",
        description: "to pick output data from specific step",
        type: "number",
        element: "input",
        value: "",
        required: true,
      },
    ],
    inputDataAdvance: null,
    inputDataRaw: CloneObject(RawOptions),
  },
  addStep: {
    inputDataSimple: null,
    inputDataAdvance: StepOptionsType,
    inputDataRaw: CloneObject(RawOptions),
  },
  log: {
    inputDataSimple: null,
    inputDataAdvance: null,
    inputDataRaw: null,
  },
};

export function GetActionInput(actionName: string): ActionInput | null {
  const action = ACTIONS_INPUT[actionName];
  if (!action) return null;
  return {
    inputDataSimple: CloneObject(action.inputDataSimple),
    inputDataAdvance: CloneObject(action.inputDataAdvance),
    inputDataRaw: CloneObject(action.inputDataRaw),
  };
}

export function GetDefaultActionInputType(actionName: string): ActionInputType {
  const action = ACTIONS_INPUT[actionName];
  if (!action) return ActionInputType.simple;
  return action.inputDataSimple
    ? ActionInputType.simple
    : action.inputDataAdvance
    ? ActionInputType.advance
    : ActionInputType.raw;
}
