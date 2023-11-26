import { atom, useAtom } from "jotai";
import { Action, ActionInputType, Field, Step, StepItem, ValueType } from "./Types";
import { ACTIONS } from "./constants/ACTIONS";
import { GetActionInput, GetDefaultActionInputType } from "./constants/ACTIONS_INPUT";
import { CloneObject } from "./utilities/Helper";

const actions = atom<Action[]>(ACTIONS);

export const ActionsStore = atom((get) => get(actions));

const StepsStore = atom<StepItem[]>([]);

export const useSteps = () => {
  const [steps, setSteps] = useAtom(StepsStore);
  const [actions] = useAtom(ActionsStore);

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

    const newSteps = steps.map((s) => {
      if (s.id === step.id) {
        s.selected = !s.selected;
      }
      return s;
    });
    setSteps([...newSteps]);
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

  function getSelectedStep() {
    return steps.find((s) => s.selected);
  }

  function updateStepActionInput(values: Field[], actionInputType: ActionInputType) {
    const selectedStep = getSelectedStep();
    const newSelectedStep = { ...selectedStep } as StepItem;

    newSelectedStep.selectedActionInput = actionInputType;

    if (!values) return;

    if (!newSelectedStep.actionInput) return;

    if (actionInputType == ActionInputType.simple) {
      newSelectedStep.actionInput.inputDataSimple = [...values];
    } else if (actionInputType == ActionInputType.advance) {
      newSelectedStep.actionInput.inputDataAdvance = [...values];
    } else if (actionInputType == ActionInputType.raw) {
      newSelectedStep.actionInput.inputDataRaw = [...values];
    }

    const newSteps = steps.map((s) => {
      if (s.id === newSelectedStep.id) {
        return newSelectedStep;
      }
      return s;
    });
    setSteps(newSteps);
  }

  function getStepActionInput(actionInputType: ActionInputType): Field[] {
    const selectedStep = getSelectedStep();
    if (!selectedStep) return [];

    let actionInputs: Field[] = [];

    if (actionInputType == ActionInputType.simple) {
      actionInputs = selectedStep.actionInput?.inputDataSimple ?? [];
    } else if (actionInputType == ActionInputType.advance) {
      actionInputs = selectedStep.actionInput?.inputDataAdvance ?? [];
    } else if (actionInputType == ActionInputType.raw) {
      actionInputs = selectedStep.actionInput?.inputDataRaw ?? [];
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

  function buildJsonTestcase(title: string) {
    const finalSteps: Step[] = [];

    steps.forEach((step) => {
      const stepItem: Step = {
        action: step.action,
        inputData: buildStep(step),
      };
      finalSteps.push(stepItem);
    });

    const jsonTestcase = {
      title: title,
      steps: finalSteps,
    };
    return jsonTestcase;
  }

  return {
    steps,
    addStepFromAction,
    reorderStep,
    selectStep,
    getSelectedStep,
    duplicateStep,
    deleteStep,
    updateStepActionInput,
    getStepActionInput,
    buildJsonTestcase,
  };
};
