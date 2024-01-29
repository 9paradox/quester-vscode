import { Container, Grid, Box } from "@mantine/core";
import StepInputSection from "./StepInputSection";
import PlayerTestCaseSection from "./PlayerTestCaseSection";
import StepOutputSection from "./StepOutputSection";

export function Player() {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "#f4f9fd",
      })}>
      <Container size="100rem" h="calc(100vh - 20px)" pt={20}>
        <Grid grow justify="center">
          <Grid.Col span={1}>
            <StepInputSection />
          </Grid.Col>
          <Grid.Col span={1}>
            <PlayerTestCaseSection />
          </Grid.Col>
          <Grid.Col span={2} maw="40%" miw="30%">
            <StepOutputSection />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}

export default Player;
