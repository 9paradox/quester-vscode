import { atom, useAtom } from "jotai";
import { TestCaseError, TestCaseItem } from "./Types";
import { useEffect } from "react";

const TestCasesStore = atom<TestCaseItem[]>([]);
const SelectedTestCaseStore = atom<{ testCase: TestCaseItem; index: number } | undefined>(
  undefined
);
const TestCaseResultsStore = atom<
  { filePath: string; result: any; testCaseError?: TestCaseError }[]
>([]);

const IsFullScreenLoadingStore = atom<boolean>(true);
const IsTestRunningStore = atom<boolean>(false);
const IsTestCompletedStore = atom<boolean>(false);

let messageEventListenerAdded = false;

export const useTestCases = () => {
  const [testCases, setTestCases] = useAtom(TestCasesStore);
  const [selectedTestCase, setSelectedTestCase] = useAtom(SelectedTestCaseStore);
  const [testCaseResults, setTestCaseResults] = useAtom(TestCaseResultsStore);
  const [isFullScreenLoading, setIsFullScreenLoading] = useAtom(IsFullScreenLoadingStore);
  const [isTestRunning, setIsTestRunning] = useAtom(IsTestRunningStore);
  const [isTestCompleted, setIsTestCompleted] = useAtom(IsTestCompletedStore);

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
  }, [testCaseResults]); //todo optimize

  function handleEvent(event: any) {
    if (event?.data?.type != "runner-command") return;

    var data = event.data;
    if (data.command == "callback") {
      addTestCaseResult(data.value);
    } else if (data.command == "result") {
      testCasesCompleted(data.value);
    } else if (data.command == "loadTestCases") {
      loadTestCases(data.value);
    }
  }

  function addTestCaseResult(data: any) {
    const newTestCaseResult = {
      filePath: data.testCaseResult.filePath + "",
      result: data,
    };

    const newTestCasesResults = [...testCaseResults, newTestCaseResult];
    setTestCaseResults([...newTestCasesResults]);

    const newTestCases = testCases.map((t, i) => {
      if (t.filePath === data.testCaseResult.filePath) {
        t.completed = true;
        t.success = data?.testCaseResult?.success ? true : false;
      }
      if (i + 1 < testCases.length) {
        testCases[i + 1].completed = "loading";
      }
      return t;
    });
    setTestCases([...newTestCases]);
  }

  function testCasesCompleted(data: any) {
    setIsTestCompleted(true);
    const newTestCases = testCases.map((t, i) => {
      t.completed = t.completed ? true : false;
      t.success = t.success ? true : false;
      return t;
    });

    setTestCases([...newTestCases]);

    // const testCaseError = data.error;
    // if (testCaseError) {
    //   const newStepResults = stepResults.map((s, i) => {
    //     if (i + 1 === testCaseError.stepIndex) {
    //       s.testCaseError = testCaseError;
    //     }
    //     return s;
    //   });
    //   setStepResults([...newStepResults]);
    // }
  }

  function loadTestCases(data: any) {
    setTestCaseResults([]);
    setIsTestCompleted(false);
    setIsTestRunning(false);
    setSelectedTestCase(undefined);

    var newTestCases = data.map((t: TestCaseItem) => {
      t.completed = undefined;
      t.success = undefined;
      t.selected = false;
      return t;
    });

    setTestCases(newTestCases);

    setIsFullScreenLoading(false);
  }

  function selectTestCase(testCase: TestCaseItem) {
    const unselectedTestCases = testCases.map((t) => {
      t.selected = false;
      return t;
    });

    setTestCases(unselectedTestCases);
    var selectedTestCaseObj = undefined;

    const newTestCases = testCases.map((t, i) => {
      if (t.filePath === testCase.filePath) {
        t.selected = !t.selected;
        selectedTestCaseObj = { testCase: t, index: i };
      }
      return t;
    });
    setTestCases([...newTestCases]);
    setSelectedTestCase(selectedTestCaseObj);
  }

  return {
    testCases,
    selectedTestCase,
    testCaseResults,
    isFullScreenLoading,
    isTestRunning,
    isTestCompleted,
    addTestCaseResult,
    testCasesCompleted,
    loadTestCases,
    selectTestCase,
  };
};
