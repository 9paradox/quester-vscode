import { Card, ScrollArea, Text, Stack, SegmentedControl, Center, Group, Box } from "@mantine/core";
import { IconCircleCheck, IconClick } from "@tabler/icons-react";
import DynamicForm from "./DynamicForm";
import { ActionInputType, Field } from "../Types";
import { useSteps } from "../Store";
import { useState, useEffect } from "react";

function StepOptionSection() {
  const { selectedStep } = useSteps();

  const [optionTab, setOptionTab] = useState<ActionInputType>(ActionInputType.simple);

  useEffect(() => {
    if (
      !selectedStep?.step?.selectedActionInput ||
      selectedStep?.step?.selectedActionInput != optionTab
    ) {
      setOptionTab(selectedStep?.step?.selectedActionInput ?? ActionInputType.simple);
    }
  }, [selectedStep?.step?.selectedActionInput]);

  function handleOptionChange(value: ActionInputType) {
    setOptionTab(value);
  }

  return (
    <Card shadow="none" withBorder radius="md" h="calc(100vh - 40px)" p="md">
      <Card.Section p="lg">
        <Group position="apart">
          <Text fw={500}>Step Options</Text>
        </Group>
      </Card.Section>
      <SegmentedControl
        disabled={!selectedStep}
        fullWidth
        radius="md"
        color="gray"
        data={[
          {
            label:
              selectedStep?.step?.selectedActionInput == ActionInputType.simple ? (
                <TabName name="Simple" />
              ) : (
                "Simple"
              ),
            value: ActionInputType.simple,
            disabled: !selectedStep?.step?.actionInput?.inputDataSimple,
          },
          {
            label:
              selectedStep?.step?.selectedActionInput == ActionInputType.advance ? (
                <TabName name="Advance" />
              ) : (
                "Advance"
              ),
            value: ActionInputType.advance,
            disabled: !selectedStep?.step?.actionInput?.inputDataAdvance,
          },
          {
            label:
              selectedStep?.step?.selectedActionInput == ActionInputType.raw ? (
                <TabName name="Raw" />
              ) : (
                "Raw"
              ),
            value: ActionInputType.raw,
            disabled: !selectedStep?.step?.actionInput?.inputDataRaw,
          },
        ]}
        value={optionTab}
        onChange={handleOptionChange}
      />
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
        <StepOptionForm actionInputType={optionTab} onSubmit={handleOptionChange} />
      </ScrollArea>
    </Card>
  );
}

interface TabNameProps {
  name: string;
}
function TabName({ name }: TabNameProps) {
  return (
    <Center>
      <IconCircleCheck size="1rem" />
      <Box ml={10}>{name}</Box>
    </Center>
  );
}

interface StepOptionFormProps {
  actionInputType: ActionInputType;
  onSubmit: (actionInputType: ActionInputType) => void;
}
function StepOptionForm({ actionInputType, onSubmit }: StepOptionFormProps) {
  const { selectedStep, updateStepActionInput } = useSteps();

  if (!selectedStep) return <NoStepSelected />;

  function handelOnChange(values: Field[]) {
    onSubmit(actionInputType);
    updateStepActionInput(values, actionInputType);
  }

  return (
    <Stack p="md">
      <DynamicForm
        actionInputType={actionInputType}
        id={selectedStep?.step?.id}
        onChange={handelOnChange}
      />
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

export default StepOptionSection;
