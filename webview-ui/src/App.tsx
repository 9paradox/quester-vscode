import "./App.css";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Editor from "./components/Editor";
import AppHeader from "./components/AppHeader";
import { useState } from "react";
import AppFooter from "./components/AppFooter";

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }}>
        <Notifications position="top-right" />
        {/* <AppHeader /> */}
        <Editor />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
