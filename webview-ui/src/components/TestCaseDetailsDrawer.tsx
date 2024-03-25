import { Button, Checkbox, Drawer, Stack, Text, Textarea } from "@mantine/core";
import { useSteps } from "../Store";
import { useForm } from "@mantine/form";
import { TestCaseOptions } from "../Types";
import { useTimeout } from "@mantine/hooks";
import { useEffect, useState } from "react";

export interface TestCaseDetailsDrawerProps {
  opened: boolean;
  onClose: () => void;
}

function TestCaseDetailsDrawer({ opened, onClose }: TestCaseDetailsDrawerProps) {
  const { testCaseOptions, setTestCaseOptions, saveTestCaseWithOptions } = useSteps();
  const [loading, setLoading] = useState(false);
  const { start, clear } = useTimeout(() => saveTestCase(), 200);

  const form = useForm<TestCaseOptions>({
    initialValues: {
      title: testCaseOptions?.title ?? "",
      dataFilePath: testCaseOptions?.dataFilePath ?? "",
      logPath: testCaseOptions?.logPath ?? "",
      logEachStep: testCaseOptions?.logEachStep ?? false,
    },
  });

  useEffect(() => {
    if (testCaseOptions == null) return;
    form.setValues(testCaseOptions);
  }, [testCaseOptions]);

  function startSavingTestCase() {
    if (!form.validate().hasErrors) {
      setLoading(true);
      setTestCaseOptions(form.values);
      start();
    }
  }

  function saveTestCase() {
    saveTestCaseWithOptions(form.values);
    setLoading(false);
    clear();
    onClose();
  }

  return (
    <Drawer opened={opened} onClose={onClose} title={<Text>Save TestCase</Text>} position="right">
      <Stack>
        <Textarea placeholder="testcase title" label="title" {...form.getInputProps("title")} />
        <Textarea
          placeholder="data file path"
          label="dataFilePath"
          {...form.getInputProps("dataFilePath")}
        />
        <Textarea placeholder="log file path" label="logPath" {...form.getInputProps("logPath")} />
        <Checkbox
          label="Log each step"
          {...form.getInputProps("logEachStep", { type: "checkbox" })}
        />
        <Button
          mt="sm"
          color="green"
          onClick={startSavingTestCase}
          loading={loading}
          disabled={loading}>
          Save
        </Button>
      </Stack>
    </Drawer>
  );
}

export default TestCaseDetailsDrawer;
