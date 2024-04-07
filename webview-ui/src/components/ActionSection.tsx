import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Badge, Card, Group, Input, Text, Center, Stack, Box, Button } from "@mantine/core";
import { IconMoodEmpty, IconSearch } from "@tabler/icons-react";
import useStyles from "../CustomStyles";
import { ActionsStore } from "../Store";
import { useAtom } from "jotai";
import { DragList } from "../Types";
import { useState } from "react";
import { ResultsList } from "./ResultsList";

function ActionSection() {
  const [activeTab, setActiveTab] = useState<"actionsTab" | "resultsTab">("actionsTab");
  return (
    <Card shadow="none" withBorder radius="md" h="calc(100vh - 40px)" p="md">
      <Card.Section p="lg">
        <Button.Group>
          <Button
            variant={activeTab === "actionsTab" ? "light" : "subtle"}
            onClick={() => {
              setActiveTab("actionsTab");
            }}>
            Actions
          </Button>
          <Button
            variant={activeTab === "resultsTab" ? "light" : "subtle"}
            onClick={() => {
              setActiveTab("resultsTab");
            }}>
            Results
          </Button>
        </Button.Group>
      </Card.Section>
      {activeTab === "actionsTab" ? <ActionsList /> : <ResultsList />}
    </Card>
  );
}

function ActionsList() {
  const { classes } = useStyles();
  const [actions] = useAtom(ActionsStore);
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <Input
        icon={<IconSearch size={16} />}
        radius="md"
        variant="filled"
        placeholder="search for actions"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Droppable droppableId={DragList.actionList} isDropDisabled>
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            h="calc(100% - 120px)"
            mt="lg"
            className={classes.scrollArea}>
            {actions.length < 1 && <NoActions />}

            {actions &&
              actions.map((action) => {
                if (searchTerm.length > 0) {
                  if (
                    action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    action.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    action.type.toLowerCase().includes(searchTerm.toLowerCase())
                  ) {
                    return (
                      <ActionCard
                        index={action.index}
                        key={action.name}
                        name={action.name}
                        description={action.description}
                        type={action.type}
                        color={action.color}
                      />
                    );
                  }
                } else if (searchTerm.length < 1) {
                  return (
                    <ActionCard
                      index={action.index}
                      key={action.name}
                      name={action.name}
                      description={action.description}
                      type={action.type}
                      color={action.color}
                    />
                  );
                }
              })}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </>
  );
}

interface ActionCardProps {
  index: number;
  name: string;
  description: string;
  type: string;
  color: string;
}

function ActionCard({ name, description, type, color, index }: ActionCardProps) {
  return (
    <Draggable draggableId={DragList.actionList + "-" + name} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          shadow="none"
          withBorder
          radius="md"
          m={16}>
          <Group position="apart" mb="xs">
            <Text>{name}</Text>
            <Badge color={color} variant="light" size="sm">
              {type}
            </Badge>
          </Group>

          <Text size="sm" color="dimmed">
            {description}
          </Text>
        </Card>
      )}
    </Draggable>
  );
}

export function NoActions() {
  return (
    <Center
      h="calc(100vh - 600px)"
      sx={() => ({
        margin: "20px",
        padding: "20px",
      })}>
      <Stack align="center">
        <IconMoodEmpty color="gray" size={40} />
        <Text size="sm" color="dimmed" inline mt={7}>
          No actions found
        </Text>
      </Stack>
    </Center>
  );
}

export default ActionSection;
