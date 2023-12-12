import React from "react";
import {
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
} from "react-bootstrap";
import { Todo } from "../models/todo";
import { useForm } from "react-hook-form";
import { TodoInput } from "../network/todo_api";
import * as TodosApi from "../network/todo_api";
import TextInputField from "./form/TextInputField";

interface AddEditTodoDialogProps {
  todoToEdit?: Todo;
  onDismiss: () => void;
  onTodoSaved: (todo: Todo) => void;
}
const AddEditTodoDialog = ({
  todoToEdit,
  onDismiss,
  onTodoSaved,
}: AddEditTodoDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TodoInput>({
    defaultValues: {
      title: todoToEdit?.title || "",
    },
  });

  async function onSubmit(input: TodoInput) {
    try {
      let todoResponse: Todo;
      if (todoToEdit) {
        todoResponse = await TodosApi.updateTodo(todoToEdit._id, input);
      } else {
        todoResponse = await TodosApi.createTodo(input);
      }

      onTodoSaved(todoResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <ModalHeader closeButton>
        <Modal.Title>{todoToEdit ? "Edit Todo" : "Add Todo"}</Modal.Title>
      </ModalHeader>
      <ModalBody>
        <Form id="addEditTodoForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="title"
            label="Title"
            type="text"
            placeholder="Title"
            register={register}
            registerOptions={{ required: "Required" }}
            error={errors.title}
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" form="addEditTodoForm" disabled={isSubmitting}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddEditTodoDialog;
