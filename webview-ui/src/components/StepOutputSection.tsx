import { Card, ScrollArea, Text, Stack, Center, Group, Textarea } from "@mantine/core";
import { useSteps } from "../Store";
import { IconClick } from "@tabler/icons-react";

function StepOutputSection() {
  const { stepResults, selectedStep } = useSteps();
  const selectedStepResult = selectedStep ? stepResults[selectedStep.index] : undefined;
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
        {!selectedStep && <NoStepSelected />}
        {selectedStep && selectedStepResult && (
          <Textarea
            m="md"
            autosize={true}
            minRows={4}
            readOnly={true}
            label={selectedStepResult?.name}
            value={selectedStepResult?.text}
          />
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
