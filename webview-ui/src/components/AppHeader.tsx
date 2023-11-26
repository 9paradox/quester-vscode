import {
  createStyles,
  Header,
  Container,
  Group,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

const useStyles = createStyles(() => ({
  header: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    height: "100%",
  },
}));

export function AppHeader() {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  function handelColorScheme() {
    toggleColorScheme();
  }
  return (
    <Header height={60}>
      <Container className={classes.header}>
        <Group spacing={5} position="right">
          <ActionIcon
            onClick={handelColorScheme}
            size="lg"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
              color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.blue[6],
            })}>
            {colorScheme === "dark" ? <IconSun size="1.2rem" /> : <IconMoonStars size="1.2rem" />}
          </ActionIcon>
        </Group>
      </Container>
    </Header>
  );
}

export default AppHeader;
