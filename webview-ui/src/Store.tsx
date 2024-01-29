import { atom, useAtom } from "jotai";
import { Action, ActionInputType, Field, Step, StepItem, ValueType } from "./Types";
import { ACTIONS } from "./constants/ACTIONS";
import { GetActionInput, GetDefaultActionInputType } from "./constants/ACTIONS_INPUT";
import { CloneObject } from "./utilities/Helper";
import { useEffect } from "react";
import { vscode } from "./utilities/vscode";
import { notifications } from "@mantine/notifications";

const actions = atom<Action[]>(ACTIONS);

export const ActionsStore = atom((get) => get(actions));

const StepsStore = atom<StepItem[]>([]);

const StepResultStore = atom<{ name: string; result: any }[]>([]);

const IsTestRunningStore = atom<boolean>(false);
const IsTestCompletedStore = atom<boolean>(false);
const SelectedStep = atom<{ step: StepItem; index: number } | undefined>(undefined);
const IsFullScreenLoading = atom<boolean>(true);

let messageEventListenerAdded = false;

export const useSteps = () => {
  const [steps, setSteps] = useAtom(StepsStore);
  const [stepResults, setStepResults] = useAtom(StepResultStore);
  const [actions] = useAtom(ActionsStore);
  const [isTestRunning, setIsTestRunning] = useAtom(IsTestRunningStore);
  const [isTestCompleted, setIsTestCompleted] = useAtom(IsTestCompletedStore);
  const [selectedStep, setSelectedStep] = useAtom(SelectedStep);
  const [isFullScreenLoading, setIsFullScreenLoading] = useAtom(IsFullScreenLoading);

  useEffect(() => {
    if (messageEventListenerAdded) return;
    window.addEventListener("message", handleEvent);
    messageEventListenerAdded = true;
    return () => {
      if (messageEventListenerAdded) {
        window.removeEventListener("message", handleEvent);
        messageEventListenerAdded = false;
      }
    };
  }, [stepResults]); //todo optimize

  function runTest() {
    if (isTestRunning) return;
    setStepResults([]);
    setIsTestCompleted(false);
    setIsTestRunning(true);
    setSelectedStep(undefined);
    const testCase = buildJsonTestCase("todo-test-case");

    steps[0].completed = false;
    const _steps = [...steps];
    setSteps(_steps);

    vscode.postCommand({
      type: "command",
      command: "runTestCase",
      value: testCase,
    });
  }

  function loadTestCase(data: any) {
    console.log(data);
    setStepResults([]);
    setIsTestCompleted(false);
    setIsTestRunning(false);
    setSelectedStep(undefined);

    var newSteps = data.steps.map((s: StepItem) => {
      s.completed = undefined;
      s.success = undefined;
      s.selected = false;
      return s;
    });
    setSteps(newSteps);

    setIsFullScreenLoading(false);
  }

  function stopTest() {
    if (!isTestRunning) return;
    setIsTestRunning(false);
    setStepResults([]);

    const newSteps = steps.map((s, i) => {
      s.completed = undefined;
      s.success = undefined;
      return s;
    });
    setSteps([...newSteps]);
  }

  function addStepResult(data: any) {
    const newStepResult = {
      name: "step-" + data.step.index,
      result: data,
    };

    const newStepResults = [...stepResults, newStepResult];
    setStepResults([...newStepResults]);

    const newSteps = steps.map((s, i) => {
      if (i + 1 === data.step.index) {
        s.completed = true;
        s.success = data?.stepResult?.success ?? false;
      }
      if (i + 1 === data.step.index + 1) {
        s.completed = false;
      }
      return s;
    });
    setSteps([...newSteps]);
  }

  function testCaseCompleted(data: any) {
    setIsTestCompleted(true);
    const newSteps = steps.map((s, i) => {
      s.completed = s.completed ?? false;
      s.success = s.success ?? false;
      return s;
    });
    setSteps([...newSteps]);
    console.log(data);
  }

  function testCaseSaved(data: any) {
    console.log(data);
    notifications.show({
      withCloseButton: true,
      title: data?.success ? "Testcase saved." : "Testcase failed to saved.",
      message: data?.message ?? "Some error.",
      color: data?.success ? "green" : "red",
    });
  }

  function saveTestCase() {
    const testCase = buildJsonTestCase("todo-test-case");
    vscode.postCommand({
      type: "command",
      command: "saveTestCase",
      value: testCase,
    });
  }

  function handleEvent(event: any) {
    if (event?.data?.type != "command") return;

    var data = event.data;
    if (data.command == "callback") {
      addStepResult(data.value);
    } else if (data.command == "result") {
      testCaseCompleted(data.value);
    } else if (data.command == "save") {
      testCaseSaved(data.value);
    } else if (data.command == "loadTestCase") {
      loadTestCase(data.value);
    }
  }

  function addStepFromAction(actionIndex: number, destinationIndex: number) {
    const action = actions[actionIndex];
    const actionInput = GetActionInput(action.name);

    const newStep: StepItem = {
      id: action.name + "-" + steps.length + "-" + new Date().getTime(),
      actionItem: action,
      action: action.name,
      selected: false,
      inputData: null,
      actionInput: actionInput,
      selectedActionInput: GetDefaultActionInputType(action.name),
    };

    const newSteps = [...steps];

    newSteps.splice(destinationIndex, 0, newStep);

    setSteps([...newSteps]);
  }

  function reorderStep(sourceIndex: number, destinationIndex: number) {
    const newSteps = [...steps];
    const [removed] = newSteps.splice(sourceIndex, 1);
    newSteps.splice(destinationIndex, 0, removed);
    setSteps([...newSteps]);
  }

  function selectStep(step: StepItem) {
    const unselectedSteps = steps.map((s) => {
      s.selected = false;
      return s;
    });

    setSteps(unselectedSteps);
    var selectedStepObj = undefined;

    const newSteps = steps.map((s, i) => {
      if (s.id === step.id) {
        s.selected = !s.selected;
        selectedStepObj = { step: s, index: i };
      }
      return s;
    });
    setSteps([...newSteps]);
    setSelectedStep(selectedStepObj);
  }

  function duplicateStep(step: StepItem) {
    const newStep: StepItem = CloneObject(step);

    newStep.id = step.actionItem.name + "-" + steps.length + "-" + new Date().getTime();

    newStep.selected = false;

    const newSteps = [...steps];
    newSteps.splice(steps.indexOf(step) + 1, 0, newStep);

    setSteps([...newSteps]);
  }

  function deleteStep(step: StepItem) {
    const newSteps = steps.filter((s) => s.id !== step.id);
    setSteps([...newSteps]);
  }

  function updateStepActionInput(values: Field[], actionInputType: ActionInputType) {
    if (!selectedStep) return;
    const updatedStep = { ...selectedStep.step } as StepItem;

    updatedStep.selectedActionInput = actionInputType;

    if (!values) return;

    if (!updatedStep.actionInput) return;

    if (actionInputType == ActionInputType.simple) {
      updatedStep.actionInput.inputDataSimple = [...values];
    } else if (actionInputType == ActionInputType.advance) {
      updatedStep.actionInput.inputDataAdvance = [...values];
    } else if (actionInputType == ActionInputType.raw) {
      updatedStep.actionInput.inputDataRaw = [...values];
    }

    const newSteps = steps.map((s) => {
      if (s.id === updatedStep.id) {
        return updatedStep;
      }
      return s;
    });
    var newSelectedStep = { ...selectedStep };
    newSelectedStep.step = updatedStep;
    setSelectedStep(newSelectedStep);
    setSteps(newSteps);
  }

  function getStepActionInput(actionInputType: ActionInputType): Field[] {
    if (!selectedStep) return [];

    let actionInputs: Field[] = [];

    if (actionInputType == ActionInputType.simple) {
      actionInputs = selectedStep?.step.actionInput?.inputDataSimple ?? [];
    } else if (actionInputType == ActionInputType.advance) {
      actionInputs = selectedStep?.step.actionInput?.inputDataAdvance ?? [];
    } else if (actionInputType == ActionInputType.raw) {
      actionInputs = selectedStep?.step.actionInput?.inputDataRaw ?? [];
    }

    return actionInputs;
  }

  function buildStep(step: StepItem) {
    if (!step.actionInput || !step.selectedActionInput) return null;

    const actionInput = step.actionInput;

    if (
      step.selectedActionInput == ActionInputType.simple &&
      actionInput.inputDataSimple != null &&
      actionInput.inputDataSimple.length > 0
    ) {
      if (actionInput.inputDataSimple.length == 1) {
        const actionInputSimple = actionInput.inputDataSimple[0];
        return getValue(actionInputSimple.value, actionInputSimple.type);
      } else {
        const actionInputSimples = actionInput.inputDataSimple;
        const finalInputs: any = {};
        actionInputSimples.forEach((actionInputSimple) => {
          finalInputs[actionInputSimple.label] = getValue(
            actionInputSimple.value,
            actionInputSimple.type
          );
        });
        return finalInputs;
      }
    }

    if (
      step.selectedActionInput == ActionInputType.advance &&
      actionInput.inputDataAdvance != null &&
      actionInput.inputDataAdvance.length > 0
    ) {
      const actionInputAdvances = actionInput.inputDataAdvance;
      const finalInputs: any = {};
      actionInputAdvances.forEach((actionInputAdvance) => {
        finalInputs[actionInputAdvance.label] = getValue(
          actionInputAdvance.value,
          actionInputAdvance.type
        );
      });
      return finalInputs;
    }

    if (
      step.selectedActionInput == ActionInputType.raw &&
      actionInput.inputDataRaw != null &&
      actionInput.inputDataRaw.length > 0
    ) {
      if (actionInput.inputDataRaw[0].value == "true") {
        return null;
      } else {
        const actionInputRaw = actionInput.inputDataRaw[1];
        return getValue(actionInputRaw.value, actionInputRaw.type);
      }
    }

    return null;
  }

  function getValue(value: string, valueType: ValueType) {
    if (valueType == "string") {
      return value;
    } else if (valueType == "number") {
      return Number(value);
    } else if (valueType == "boolean") {
      return value == "true";
    } else if (valueType == "object") {
      return JSON.parse(value);
    }
    return null;
  }

  function buildJsonTestCase(title: string) {
    const finalSteps: StepItem[] = [];

    steps.forEach((step) => {
      //todo: validate and stop if invalid
      const stepItem: StepItem = {
        ...step,
        action: step.action,
        inputData: buildStep(step),
        selected: false,
      };
      finalSteps.push(stepItem);
    });

    const jsonTestcase = {
      title: title,
      steps: finalSteps,
      delay: 2000,
    };
    return jsonTestcase;
  }

  return {
    steps,
    addStepFromAction,
    reorderStep,
    selectStep,
    selectedStep,
    duplicateStep,
    deleteStep,
    updateStepActionInput,
    getStepActionInput,
    buildJsonTestCase,
    isTestRunning,
    isTestCompleted,
    runTest,
    stopTest,
    stepResults,
    saveTestCase,
    isFullScreenLoading,
    setIsFullScreenLoading,
  };
};
