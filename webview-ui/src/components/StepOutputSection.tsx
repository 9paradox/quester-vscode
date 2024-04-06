import { Card, ScrollArea, Text, Stack, Center, Group, Textarea, TextInput } from "@mantine/core";
import { useSteps } from "../Store";
import { IconClick } from "@tabler/icons-react";
import ReactJson from "@microlink/react-json-view";
import { useEffect, useState } from "react";

function getPropertyPath(namespaces: Array<string | null>, finalNamespace?: string | null): string {
  if (namespaces.length === 0 && finalNamespace === null) {
    return "";
  }

  if (finalNamespace) {
    namespaces.push(finalNamespace);
  }

  var path = "";

  for (let i = 0; i < namespaces.length; i++) {
    if (isNaN(Number(namespaces[i]))) {
      path += namespaces[i];
    } else {
      path += `[${namespaces[i]}]`;
    }

    if (i + 1 < namespaces.length && namespaces[i + 1] !== null) {
      if (isNaN(Number(namespaces[i + 1]))) {
        path += ".";
      }
    }
  }

  return path;
}

function StepOutputSection() {
  const { stepResults, selectedStep } = useSteps();
  const selectedStepResult = selectedStep ? stepResults[selectedStep.index] : undefined;
  const [path, setPath] = useState<string>("");

  useEffect(() => {
    setPath("");
  }, [selectedStep]);

  return (
    <Card shadow="none" withBorder radius="md" h="calc(100vh - 40px)" p="md">
      <Card.Section p="lg">
        <Group position="apart">
          <Text fw={500}>Step Output</Text>
        </Group>
      </Card.Section>
      <ScrollArea
        h="calc(100% - 120px)"
        mt="lg"
        p="sm"
        offsetScrollbars
        type="hover"
        scrollbarSize={8}
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
          borderRadius: theme.radius.md,
        })}>
        {!selectedStep && <NoStepSelected />}
        {selectedStep && selectedStepResult && (
          <>
            <ReactJson
              src={selectedStepResult?.result?.step?.timeTaken}
              theme="railscasts"
              collapsed={1}
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard={false}
              name="timeTaken"
              style={{ marginBottom: "8px", padding: "6px", borderRadius: "4px" }}
            />
            {path && (
              <TextInput
                readOnly={true}
                label="Selected Path"
                value={path}
                style={{ marginBottom: "8px", padding: "6px", borderRadius: "4px" }}
              />
            )}
            {selectedStepResult?.result?.step?.outputData instanceof Object && (
              <ReactJson
                src={selectedStepResult?.result?.step?.outputData}
                theme="railscasts"
                collapsed={1}
                displayDataTypes={false}
                displayObjectSize={false}
                enableClipboard={false}
                name="outputData"
                onSelect={(s) => {
                  console.log(s);
                  if (s.namespace) {
                    const path = getPropertyPath(s.namespace, s.name);
                    if (path) {
                      setPath(path);
                    }
                  }
                }}
                style={{ marginBottom: "8px", padding: "6px", borderRadius: "4px" }}
              />
            )}

            {typeof selectedStepResult?.result?.step?.outputData == "string" && (
              <Textarea
                autosize={true}
                minRows={8}
                readOnly={true}
                label="outputData"
                value={selectedStepResult?.result?.step?.outputData}
                style={{ marginBottom: "8px", padding: "6px", borderRadius: "4px" }}
              />
            )}

            {selectedStepResult?.testCaseError && (
              <ReactJson
                src={selectedStepResult?.testCaseError}
                theme="railscasts"
                collapsed={1}
                displayDataTypes={false}
                displayObjectSize={false}
                enableClipboard={false}
                name="error"
                style={{ marginBottom: "8px", padding: "6px", borderRadius: "4px" }}
              />
            )}
          </>
        )}
      </ScrollArea>
    </Card>
  );
}

function NoStepSelected() {
  return (
    <Center
      h="calc(100vh - 500px)"
      sx={() => ({
        margin: "20px",
        padding: "20px",
      })}>
      <Stack align="center">
        <IconClick color="gray" size={40} />
        <Text size="sm" color="dimmed" inline mt={7}>
          Please select a step to view result
        </Text>
      </Stack>
    </Center>
  );
}

export default StepOutputSection;
