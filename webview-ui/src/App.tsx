import "./App.css";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Editor from "./components/Editor";
import { useState } from "react";
import { useSteps } from "./Store";
import Player from "./components/Player";

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const { isTestRunning } = useSteps();
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <Notifications position="top-right" />
        {!isTestRunning && <Editor />}
        {isTestRunning && <Player />}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
