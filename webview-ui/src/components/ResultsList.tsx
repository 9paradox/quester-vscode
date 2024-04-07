import {
  Accordion,
  Box,
  Center,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import useStyles from "../CustomStyles";
import { IconMoodEmpty } from "@tabler/icons-react";
import ReactJson from "@microlink/react-json-view";
import { useEffect, useState } from "react";
import { useSteps } from "../Store";
import { NoStepSelected, getPropertyPath } from "./StepOutputSection";

export function ResultsList() {
  const { classes } = useStyles();

  const { stepResults, selectedStep } = useSteps();
  const selectedStepResult = selectedStep ? stepResults[selectedStep.index] : undefined;
  const [path, setPath] = useState<string>("");

  useEffect(() => {
    setPath("");
  }, [selectedStep]);

  if (stepResults.length < 1)
    return (
      <Box h="calc(100% - 80px)" mt="lg" className={classes.scrollArea}>
        <NoResults />
      </Box>
    );

  return (
    <ScrollArea
      h="calc(100% - 80px)"
      mt="lg"
      p="sm"
      offsetScrollbars
      type="hover"
      scrollbarSize={8}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
        borderRadius: theme.radius.md,
      })}>
      {!selectedStep && <NoStepSelected />}
      {selectedStep && selectedStepResult && (
        <Accordion
          chevronPosition="right"
          variant="contained"
          multiple
          defaultValue={["timeTaken", "outputData", "outputDataString", "error"]}>
          {selectedStepResult?.result?.step?.outputData instanceof Object && (
            <Accordion.Item value="outputData">
              <Accordion.Control>Output Data</Accordion.Control>
              <Accordion.Panel>
                {path && (
                  <TextInput
                    size="xs"
                    readOnly={true}
                    label="Selected Path"
                    value={path}
                    style={{ marginBottom: "8px", padding: "6px", borderRadius: "4px" }}
                  />
                )}
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
              </Accordion.Panel>
            </Accordion.Item>
          )}

          {typeof selectedStepResult?.result?.step?.outputData == "string" && (
            <Accordion.Item value="outputDataString">
              <Accordion.Control>Output Data</Accordion.Control>
              <Accordion.Panel>
                <Textarea
                  autosize={true}
                  minRows={8}
                  readOnly={true}
                  label="outputData"
                  value={selectedStepResult?.result?.step?.outputData}
                  style={{ marginBottom: "8px", padding: "6px", borderRadius: "4px" }}
                />
              </Accordion.Panel>
            </Accordion.Item>
          )}
        </Accordion>
      )}
    </ScrollArea>
  );
}

export function NoResults() {
  return (
    <Center
      h="calc(100vh - 600px)"
      sx={() => ({
        margin: "20px",
        padding: "20px",
      })}>
      <Stack align="center">
        <IconMoodEmpty color="gray" size={40} />
        <Text size="sm" color="dimmed" inline mt={7}>
          No results for previous run
        </Text>
      </Stack>
    </Center>
  );
}
