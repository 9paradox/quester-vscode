import { Avatar, Box, Button, Card, Flex, Group, Loader, Stack, Text } from "@mantine/core";
import { IconCircleX, IconPlayerPlayFilled, IconPlayerStopFilled } from "@tabler/icons-react";
import useStyles from "../CustomStyles";
import { TestCaseItem } from "../Types";
import { IconCircleCheck } from "@tabler/icons-react";
import { useTestCases } from "../RunnerStore";

interface TestCasesRunnerSectionProps {}

function TestCasesRunnerSection({}: TestCasesRunnerSectionProps) {
  const { classes } = useStyles();
  const { testCases, selectTestCase } = useTestCases();

  return (
    <>
      <Card shadow="none" withBorder radius="md" h="calc(100vh - 40px)" p="md">
        <Card.Section p="lg">
          <Group position="apart">
            <Flex direction={"column"}>
              <Text fw={500}>TestCases</Text>
              <Text color="dimmed">Select test case to run</Text>
            </Flex>
            <Group>
              <Button
                variant="light"
                leftIcon={<IconPlayerPlayFilled size={14} />}
                color="green"
                onClick={() => {}}>
                Run
              </Button>
              <Button
                variant="light"
                leftIcon={<IconPlayerStopFilled size={14} />}
                color="red"
                onClick={() => {}}>
                Stop
              </Button>
            </Group>
          </Group>
        </Card.Section>
        <Box h="calc(100% - 60px)" className={classes.scrollArea}>
          {testCases &&
            testCases.map((testCase: TestCaseItem, index: number) => (
              <TestCaseCard
                key={index}
                testCase={testCase}
                onCardClick={() => selectTestCase(testCase)}
              />
            ))}
        </Box>
      </Card>
    </>
  );
}

interface TestCaseCardProps {
  testCase: TestCaseItem;
  onCardClick: () => void;
}
function TestCaseCard({ testCase, onCardClick }: TestCaseCardProps) {
  return (
    <Card
      shadow="none"
      withBorder
      radius="md"
      m={16}
      onClick={(e) => {
        if (testCase.selected) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        onCardClick();
      }}
      sx={(theme) => ({
        boxShadow: testCase.selected ? `inset 0 0 0px 2px ${theme.colors.blue[3]}` : "",
        overflow: "visible",
      })}>
      <Flex mih={50} gap="md" align="center" direction="row" wrap="nowrap">
        <Avatar size={48} radius="lg" color={testCase.selected ? "blue.6" : "gray.6"}>
          <TestCaseStatus completed={testCase.completed} success={testCase.success} />
        </Avatar>
        <Stack spacing="sm" style={{ marginRight: "auto" }}>
          <Flex direction={"column"} w={"100%"}>
            <Text fw={500}>{testCase.title}</Text>
            <Text color="dimmed" size="sm">
              {testCase.filePath}
            </Text>
          </Flex>
        </Stack>
      </Flex>
    </Card>
  );
}

interface TestCaseStatusProp {
  completed?: "loading" | boolean;
  success?: boolean;
}
function TestCaseStatus({ completed, success }: TestCaseStatusProp) {
  if (completed == "loading") {
    return <Loader color="blue" size="xs" />;
  }
  if (completed && success) {
    return <IconCircleCheck color="green" size="1rem" />;
  }
  if (completed && success == false) {
    return <IconCircleX color="red" size="1rem" />;
  }
}

export default TestCasesRunnerSection;
