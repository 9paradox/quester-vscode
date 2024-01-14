import { Card, ScrollArea, Text, Stack, SegmentedControl, Center, Group, Box } from "@mantine/core";
import { IconCircleCheck, IconClick } from "@tabler/icons-react";
import DynamicForm from "./DynamicForm";
import { ActionInputType, Field } from "../Types";
import { useSteps } from "../Store";
import { useState, useEffect } from "react";

function StepInputSection() {
  const { selectedStep } = useSteps();

  const [optionTab, setOptionTab] = useState<ActionInputType>(ActionInputType.simple);

  useEffect(() => {
    if (!selectedStep?.step?.selectedActionInput || selectedStep?.step?.selectedActionInput != optionTab) {
      setOptionTab(selectedStep?.step?.selectedActionInput ?? ActionInputType.simple);
    }
  }, [selectedStep?.step?.selectedActionInput]);

  return (
    <Card shadow="none" withBorder radius="md" h="calc(100vh - 40px)" p="md">
      <Card.Section p="lg">
        <Group position="apart">
          <Text fw={500}>Step Input</Text>
          <Text size="xs">0.6s</Text>
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
        <StepOptionForm actionInputType={optionTab} />
      </ScrollArea>
    </Card>
  );
}

interface StepOptionFormProps {
  actionInputType: ActionInputType;
}
function StepOptionForm({ actionInputType }: StepOptionFormProps) {
  const { selectedStep } = useSteps();

  if (!selectedStep) return <NoStepSelected />;

  return (
    <Stack p="md">
      <DynamicForm actionInputType={actionInputType} id={selectedStep?.step?.id} readonly={true} />
    </Stack>
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
          Please select a step to continue
        </Text>
      </Stack>
    </Center>
  );
}

export default StepInputSection;
