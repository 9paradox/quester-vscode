import { Container, Grid, rem, Box } from "@mantine/core";
import ActionSection from "./ActionSection";
import TestCaseSection from "./TestCaseSection";
import StepOptionSection from "./StepOptionSection";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useSteps } from "../Store";
import { DragList } from "../Types";
import { useDisclosure } from "@mantine/hooks";
import TestCaseDetailsDrawer from "./TestCaseDetailsDrawer";

export function Editor() {
  const { addStepFromAction, reorderStep, isTestRunning } = useSteps();
  const [testCaseDetailsDrawerOpened, setTestCaseDetailsOpened] = useDisclosure(false);

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return;

    if (destination.droppableId == DragList.actionList) return;

    if (source.droppableId == DragList.actionList && destination.droppableId == DragList.stepList) {
      addStepFromAction(source.index, destination.index);
      return;
    }

    if (source.droppableId == DragList.stepList && destination.droppableId == DragList.stepList) {
      reorderStep(source.index, destination.index);
    }
  };

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "#f4f9fd",
      })}>
      <TestCaseDetailsDrawer
        opened={testCaseDetailsDrawerOpened}
        onClose={setTestCaseDetailsOpened.close}
      />
      <Container size="100rem" h="calc(100vh - 20px)" pt={20}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid grow justify="center">
            {!isTestRunning && (
              <Grid.Col span={2} style={{ minHeight: rem(80) }}>
                <ActionSection />
              </Grid.Col>
            )}
            <Grid.Col span={3} style={{ minHeight: rem(120) }}>
              <TestCaseSection onTestCaseDetailsClick={setTestCaseDetailsOpened.open} />
            </Grid.Col>
            <Grid.Col span={2}>
              <StepOptionSection />
            </Grid.Col>
          </Grid>
        </DragDropContext>
      </Container>
    </Box>
  );
}

export default Editor;
