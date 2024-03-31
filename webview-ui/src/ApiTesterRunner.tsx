import "./ApiTesterRunner.css";
import { ColorScheme, ColorSchemeProvider, LoadingOverlay, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import Runner from "./components/Runner";
import { vscode } from "./utilities/vscode";
import { useTestCases } from "./RunnerStore";

var testCaseLoaded = false;

function ApiTesterRunner() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const { isFullScreenLoading } = useTestCases();
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    if (testCaseLoaded) return;

    vscode.postCommand({
      type: "runner-command",
      command: "loadTestCases",
      value: true,
    });

    testCaseLoaded = true;
  }, []); //todo optimize

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <Notifications position="top-right" />
        <LoadingOverlay visible={isFullScreenLoading} zIndex={1000} />
        <Runner />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default ApiTesterRunner;
