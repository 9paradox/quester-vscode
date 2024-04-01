import { Action } from "../Types";

var actions: Action[] = [
  {
    index: 0,
    name: "get",
    type: "ACTION",
    color: "blue",
    description: "Perform GET http request.",
  },
  {
    index: 0,
    name: "post",
    type: "ACTION",
    color: "blue",
    description: "Perform POST http request.",
  },
  {
    index: 0,
    name: "axios",
    type: "ACTION",
    color: "blue",
    description: "Perform http request based on AxiosRequestConfig.",
  },
  {
    index: 0,
    name: "inputData",
    type: "ACTION",
    color: "blue",
    description: "Holds input data for next step.",
  },
  {
    index: 0,
    name: "pickData",
    type: "ACTION",
    color: "blue",
    description: "Perform json query to pick data from last step.",
  },
  {
    index: 0,
    name: "formatData",
    type: "ACTION",
    color: "blue",
    description: "Render string template based on input data from last step using Eta.js.",
  },
  {
    index: 0,
    name: "formatTemplate",
    type: "ACTION",
    color: "blue",
    description: "Render template file based on input data from last step using Eta.js.",
  },
  {
    index: 0,
    name: "pickAndVerify",
    type: "VERIFICATION",
    color: "green",
    description: "Perform json query to pick data from last step and do a test assert.",
  },
  {
    index: 0,
    name: "verify",
    type: "VERIFICATION",
    color: "green",
    description: "To assert data from last step.",
  },
  {
    index: 0,
    name: "verifyTimeTaken",
    type: "VERIFICATION",
    color: "green",
    description: "To assert time taken for last step.",
  },
  {
    index: 0,
    name: "pickStep",
    type: "ACTION",
    color: "blue",
    description: "To pick output data from specific step.",
  },
  {
    index: 0,
    name: "addStep",
    type: "ACTION",
    color: "blue",
    description: "Add a steps from JSON object.",
  },
  {
    index: 0,
    name: "customFnFrom",
    type: "ACTION",
    color: "blue",
    description: "Run custom function from a javascript file as a step.",
  },
  {
    index: 0,
    name: "log",
    type: "OTHER",
    color: "gray",
    description: "Last steps will be logged to a file.",
  },
];

export const ACTIONS = actions.map((action, index) => {
  action.index = index;
  return action;
});
