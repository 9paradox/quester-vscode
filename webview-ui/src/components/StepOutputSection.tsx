import { Card, ScrollArea, Text, Stack, Center, Group, Textarea } from "@mantine/core";
import { useSteps } from "../Store";

function StepOutputSection() {
  const { stepResults } = useSteps();
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
        {stepResults.map((step, index) => {
          return (
            <Textarea
              key={index}
              m="md"
              autosize={true}
              minRows={4}
              readOnly={true}
              label={step.name}
              value={step.text}
            />
          );
        })}
      </ScrollArea>
    </Card>
  );
}

export default StepOutputSection;
