import "./App.css";
import { ColorScheme, ColorSchemeProvider, LoadingOverlay, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Editor from "./components/Editor";
import { useEffect, useState } from "react";
import { useSteps } from "./Store";
import Player from "./components/Player";
import { vscode } from "./utilities/vscode";

var testCaseLoaded = false;

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const { isTestRunning, isFullScreenLoading } = useSteps();
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    if (testCaseLoaded) return;

    vscode.postCommand({
      type: "command",
      command: "loadTestCase",
      value: true,
    });

    testCaseLoaded = true;
  }, []); //todo optimize

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <Notifications position="top-right" />
        <LoadingOverlay visible={isFullScreenLoading} zIndex={1000} />
        {!isTestRunning && <Editor />}
        {isTestRunning && <Player />}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
