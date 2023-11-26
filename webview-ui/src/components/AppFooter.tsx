import { Box, Container, createStyles, Text, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  afterFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },
}));

function AppFooter() {
  const { classes } = useStyles();
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : "#f4f9fd",

        borderTop: `${rem(1)} solid ${
          theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
      })}>
      <Container className={classes.afterFooter}>
        <Text color="dimmed" size="sm">
          Build with react and mantine
        </Text>
        <Text color="dimmed" size="sm">
          © {new Date().getFullYear()} 9paradox.com. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}

export default AppFooter;
