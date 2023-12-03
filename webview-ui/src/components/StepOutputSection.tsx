import { Card, ScrollArea, Text, Stack, Center, Group } from "@mantine/core";
import { IconClick } from "@tabler/icons-react";
import { ActionInputType } from "../Types";
import { useSteps } from "../Store";
import { useState, useEffect } from "react";

function StepOutputSection() {
  const { getSelectedStep } = useSteps();

  const [optionTab, setOptionTab] = useState<ActionInputType>(ActionInputType.simple);

  const selectedStep = getSelectedStep();

  useEffect(() => {
    if (!selectedStep?.selectedActionInput || selectedStep?.selectedActionInput != optionTab) {
      setOptionTab(selectedStep?.selectedActionInput ?? ActionInputType.simple);
    }
  }, [selectedStep?.selectedActionInput]);

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
        offsetScrollbars
        type="hover"
        scrollbarSize={8}
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
          borderRadius: theme.radius.md,
        })}>
        <StepOutputOption />
      </ScrollArea>
    </Card>
  );
}

interface StepOutputOptionsProps {}
function StepOutputOption({}: StepOutputOptionsProps) {
  const { getSelectedStep } = useSteps();

  const selectedStep = getSelectedStep();

  return <StepOutput />;
}

function StepOutput() {
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
          Step output
        </Text>
      </Stack>
    </Center>
  );
}

export default StepOutputSection;
