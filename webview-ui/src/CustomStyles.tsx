import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  scrollArea: {
    "backgroundColor": theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
    "borderRadius": theme.radius.md,
    "overflowY": "auto",
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1],
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3],
      borderRadius: "8px",
    },
  },
}));

export default useStyles;
