import { useEffect, useState } from "react";
import {
  Textarea,
  Select,
  Checkbox,
  TextInput,
  JsonInput,
  Button,
  Center,
  Stack,
  Text,
  Alert,
} from "@mantine/core";
import { ActionInputType, Field } from "../Types";
import { IconAlertCircle, IconInfoTriangle } from "@tabler/icons-react";
import { useSteps } from "../Store";

interface DynamicFormProps {
  id: string;
  actionInputType: ActionInputType;
  onChange: (fields: Field[]) => void;
}

function DynamicForm({ id, actionInputType, onChange }: DynamicFormProps) {
  const [formValues, setFormValues] = useState<Field[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const { getStepActionInput } = useSteps();

  useEffect(() => {
    const actionInput = getStepActionInput(actionInputType);
    setFormValues(actionInput);
    setHasError(false);
  }, [id, actionInputType]);

  if (!formValues || formValues.length === 0) return <NoOptionsAvailable />;

  const handleChange = (fieldName: string, value?: string | null) => {
    if (value == undefined) return;

    const newFields: Field[] = [];

    formValues.forEach((field) => {
      if (field.label === fieldName) {
        field.value = value;
      }

      newFields.push({ ...field });
    });
    setFormValues(newFields);
  };

  function handelOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formValues || formValues.length === 0) return;

    const hasEmptyFields = formValues.some((field) => field.required && field.value === "");

    if (hasEmptyFields) {
      setHasError(true);
      return;
    }
    setHasError(false);
    onChange(formValues);
  }

  return (
    <form onSubmit={handelOnSubmit}>
      {formValues.map((field, index) => {
        switch (field.element) {
          case "input":
            return (
              <TextInput
                key={index}
                description={field.description}
                label={field.label}
                type="text"
                mb="md"
                value={field.value}
                withAsterisk={field.required}
                onChange={(event) => handleChange(field.label, event.currentTarget.value)}
              />
            );
          case "textarea":
            return (
              <Textarea
                key={index}
                description={field.description}
                mb="md"
                autosize={true}
                minRows={4}
                label={field.label}
                value={field.value}
                withAsterisk={field.required}
                onChange={(event) => handleChange(field.label, event.currentTarget.value)}
              />
            );

          case "json":
            return (
              <JsonInput
                key={index}
                description={field.description}
                disabled={actionInputType === ActionInputType.raw && formValues[0].value === "true"}
                mb="md"
                formatOnBlur
                autosize={true}
                minRows={4}
                label={field.label}
                value={field.value}
                withAsterisk={field.required}
                onChange={(event) => handleChange(field.label, event)}
              />
            );
          case "select":
            return (
              <Select
                key={index}
                description={field.description}
                mb="md"
                label={field.label}
                value={field.value}
                withAsterisk={field.required}
                onChange={(event) => handleChange(field.label, event)}
                data={field.options ?? []}></Select>
            );
          case "checkbox":
            return (
              <Checkbox
                key={index}
                description={field.description}
                mb="md"
                label={field.label}
                checked={field.value == "true"}
                onChange={(event) =>
                  handleChange(field.label, event.currentTarget.checked ? "true" : "false")
                }
              />
            );
          default:
            return null;
        }
      })}

      {hasError && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Not saved!"
          color="red"
          withCloseButton
          mb="md"
          onClose={() => setHasError(false)}>
          Please fill all required fields before submitting.
        </Alert>
      )}

      <Button fullWidth variant="outline" type="submit">
        Update
      </Button>
    </form>
  );
}

function NoOptionsAvailable() {
  return (
    <Center
      h="calc(100vh - 500px)"
      sx={() => ({
        margin: "20px",
        padding: "20px",
      })}>
      <Stack align="center">
        <IconInfoTriangle color="gray" size={40} />
        <Text size="sm" color="dimmed" inline mt={7}>
          No options available for this step here.
        </Text>
      </Stack>
    </Center>
  );
}

export default DynamicForm;
