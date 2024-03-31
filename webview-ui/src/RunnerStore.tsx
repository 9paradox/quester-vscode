import { atom, useAtom } from "jotai";
import { TestCaseError, TestCaseItem } from "./Types";
import { useEffect } from "react";
import { vscode } from "./utilities/vscode";

const TestCasesStore = atom<TestCaseItem[]>([]);
const SelectedTestCaseStore = atom<{ testCase: TestCaseItem; index: number } | undefined>(
  undefined
);

const IsFullScreenLoadingStore = atom<boolean>(true);
const IsTestRunningStore = atom<boolean>(false);
const IsTestCompletedStore = atom<boolean>(false);
const FolderPath = atom<string>("");

let messageEventListenerAdded = false;

export const useTestCases = () => {
  const [testCases, setTestCases] = useAtom(TestCasesStore);
  const [selectedTestCase, setSelectedTestCase] = useAtom(SelectedTestCaseStore);
  const [isFullScreenLoading, setIsFullScreenLoading] = useAtom(IsFullScreenLoadingStore);
  const [isTestRunning, setIsTestRunning] = useAtom(IsTestRunningStore);
  const [isTestCompleted, setIsTestCompleted] = useAtom(IsTestCompletedStore);
  const [folderPath, setFolderPath] = useAtom(FolderPath);

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
  }, [testCases]); //todo optimize

  function handleEvent(event: any) {
    if (event?.data?.type != "runner-command") return;

    var data = event.data;
    if (data.command == "testCasesCallback") {
      addTestCaseResult(data.value);
    } else if (data.command == "testCasesResult") {
      testCasesCompleted(data.value);
    } else if (data.command == "loadTestCases") {
      loadTestCases(data.value);
    }
  }

  function addTestCaseResult(data: any) {
    const newTestCaseResult = {
      filePath: data.filePath + "",
      result: data.testCaseResult,
    };

    const newTestCases = testCases.map((t, i) => {
      if (t.filePath === data.filePath) {
        t.completed = true;
        t.success = data?.testCaseResult?.success ? true : false;
        t.error = data?.testCaseResult?.error;
        if (
          i + 1 < testCases.length &&
          testCases[i + 1] &&
          testCases[i + 1].completed == undefined
        ) {
          testCases[i + 1].completed = "loading";
        }
      }
      return t;
    });
    setTestCases([...newTestCases]);

    //console.log("addTestCaseResult", data);
  }

  function testCasesCompleted(data: any) {
    setIsTestCompleted(true);
    setIsTestRunning(false);
    //console.log("testCasesCompleted", data);

    const newTestCases = testCases.map((t, i) => {
      t.completed = t.completed ? true : false;
      t.success = t.success ? true : false;
      return t;
    });

    setTestCases([...newTestCases]);
  }

  function loadTestCases(data: any) {
    setIsTestCompleted(false);
    setIsTestRunning(false);
    setSelectedTestCase(undefined);
    setFolderPath(data.folderPath);

    var newTestCases = data.testCases.map((t: TestCaseItem) => {
      t.completed = undefined;
      t.success = undefined;
      t.selected = false;
      t.error = undefined;
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

  function runTest() {
    if (isTestRunning) return;
    setIsTestCompleted(false);
    setIsTestRunning(true);
    setSelectedTestCase(undefined);

    testCases[0].completed = "loading";
    testCases[0].selected = false;
    const _testCases = [...testCases];
    setTestCases(_testCases);

    vscode.postCommand({
      type: "runner-command",
      command: "runTestCases",
      value: undefined,
    });
  }

  function stopTest() {
    if (!isTestRunning) return;
    resetTest();
  }

  function closeTest() {
    resetTest();
  }

  function resetTest() {
    setIsTestRunning(false);
    setIsTestCompleted(false);

    const newTestCases = testCases.map((t, i) => {
      t.completed = undefined;
      t.success = undefined;
      t.selected = false;
      return t;
    });
    setTestCases([...newTestCases]);
    //console.log("stopTest", isTestRunning, isTestCompleted, testCases);
  }

  return {
    folderPath,
    testCases,
    selectedTestCase,
    isFullScreenLoading,
    isTestRunning,
    isTestCompleted,
    addTestCaseResult,
    testCasesCompleted,
    loadTestCases,
    selectTestCase,
    runTest,
    stopTest,
    closeTest,
  };
};
