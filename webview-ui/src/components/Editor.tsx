import { Container, Grid, rem, Box } from "@mantine/core";
import ActionSection from "./ActionSection";
import TestCaseSection from "./TestCaseSection";
import StepOptionSection from "./StepOptionSection";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useSteps } from "../Store";
import { DragList } from "../Types";
import { useDisclosure } from "@mantine/hooks";
import ExportDrawer from "./ExportDrawer";

export function Editor() {
  const { addStepFromAction, reorderStep } = useSteps();
  const [exportDrawerOpened, setExportDrawerOpened] = useDisclosure(false);

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
      <ExportDrawer opened={exportDrawerOpened} onClose={setExportDrawerOpened.close} />
      <Container size="100rem" h="calc(100vh - 20px)" pt={20}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid grow justify="center">
            <Grid.Col span={1} style={{ minHeight: rem(10) }}>
              <ActionSection />
            </Grid.Col>
            <Grid.Col span={3} style={{ minHeight: rem(120) }}>
              <TestCaseSection onExportClick={setExportDrawerOpened.open} />
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
