import { Container, Grid, rem, Box } from "@mantine/core";
import TestCasesRunnerSection from "./TestCasesRunnerSection";

export function Runner() {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "#f4f9fd",
      })}>
      <Container size="100rem" h="calc(100vh - 20px)" pt={20}>
        <Grid grow justify="center">
          <Grid.Col style={{ minHeight: rem(120), maxWidth: rem(800) }}>
            <TestCasesRunnerSection />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}

export default Runner;
