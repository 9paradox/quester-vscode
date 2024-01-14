import { Avatar, Badge, Box, Button, Card, Flex, Group, Loader, Stack, Text } from "@mantine/core";
import { IconCircleX, IconPlayerStopFilled } from "@tabler/icons-react";
import useStyles from "../CustomStyles";
import { StepItem } from "../Types";
import { useSteps } from "../Store";
import { IconCircleCheck } from "@tabler/icons-react";

interface PlayerTestCaseSectionProps {}

function PlayerTestCaseSection({}: PlayerTestCaseSectionProps) {
  const { classes } = useStyles();
  const { steps, selectStep, stopTest, isTestCompleted } = useSteps();

  return (
    <>
      <Card shadow="none" withBorder radius="md" h="calc(100vh - 40px)" p="md">
        <Card.Section p="lg">
          <Group position="apart">
            <Group>
              <Text fw={500}>TestCase Steps</Text>
            </Group>
            {!isTestCompleted && (
              <Button
                variant="light"
                leftIcon={<IconPlayerStopFilled size={14} />}
                color="red"
                onClick={stopTest}>
                Stop
              </Button>
            )}
            {isTestCompleted && (
              <Button variant="light" onClick={stopTest}>
                Close
              </Button>
            )}
          </Group>
        </Card.Section>
        <Box h="calc(100% - 60px)" className={classes.scrollArea}>
          {steps &&
            steps.map((step) => (
              <StepCard
                key={step.id}
                index={steps.indexOf(step)}
                step={step}
                onCardClick={() => selectStep(step)}
              />
            ))}
        </Box>
      </Card>
    </>
  );
}

interface StepCardProps {
  index: number;
  step: StepItem;
  onCardClick: () => void;
}
function StepCard({ index, step, onCardClick }: StepCardProps) {
  return (
    <Card
      shadow="none"
      withBorder
      radius="md"
      m={16}
      onClick={(e) => {
        if (step.selected) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        onCardClick();
      }}
      sx={(theme) => ({
        boxShadow: step.selected ? `inset 0 0 0px 2px ${theme.colors.blue[3]}` : "",
        overflow: "visible",
      })}>
      <Flex mih={50} gap="md" align="center" direction="row" wrap="nowrap">
        {step.completed == false && <Loader color="blue" size="xs" />}
        {step.completed && step.success && <IconCircleCheck color="green" size="1rem" />}
        {step.completed && step.success == false && <IconCircleX color="red" size="1rem" />}
        <Avatar size={48} radius="lg" color={step.selected ? "blue.6" : "gray.6"} m={16}>
          #{index + 1}
        </Avatar>
        <Stack spacing="sm" style={{ marginRight: "auto" }}>
          <Group>
            <Text fw={500}>{step.actionItem.name}</Text>
            <Badge color={step.actionItem.color} variant="light" size="xs">
              {step.actionItem.type}
            </Badge>
          </Group>

          <Text fz="xs" color="dimmed" w="100%">
            {step.actionItem.description}
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
}

export default PlayerTestCaseSection;
