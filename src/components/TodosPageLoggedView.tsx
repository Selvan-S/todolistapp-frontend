import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Todo as TodoModel } from "../models/todo";
import * as TodosApi from "../network/todo_api";
import styles from "../styles/TodoPage.module.css";
import stylesUtils from "../styles/utils.module.css";
import AddEditTodoDialog from "./AddEditTodoDialog";
import Todo from "./Todo";

const TodosPageLoggedView = () => {
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [tasks, setTasks] = useState([]);
  const [todoLoading, setTodoLoading] = useState(true);
  const [showTodoLoadingError, setShowTodoLoadingError] = useState(false);

  const [showAddTodoDialog, setShowAddTodoDialog] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<TodoModel | null>(null);

  useEffect(() => {
    async function loadTodos() {
      try {
        setShowTodoLoadingError(false);
        setTodoLoading(true);
        const todos = await TodosApi.fetchTodo();
        setTodos(todos);
      } catch (error) {
        console.error(error);
        setShowTodoLoadingError(true);
      } finally {
        setTodoLoading(false);
      }
    }

    loadTodos();
  }, []);

  const todosGrid = (
    <Row xs={1} md={2} xl={3} className={`g-3`}>
      {todos.map((todo) => (
        <Col key={todo._id}>
          <Todo
            todo={todo}
            className={styles.todo}
            onTodoClicked={setTodoToEdit}
            onDeleteTodoClicked={deleteTodo}
            createTask={(newTask) => {
              setTodos(
                todos.map((item) => {
                  if (item._id === newTask.todo_id) {
                    item.text?.unshift(newTask);
                    return item;
                  } else return item;
                })
              );
            }}
            updateTask={(updatedTask) =>
              setTodos(
                todos.map((existingTodo) =>
                  existingTodo._id === updatedTask._id
                    ? updatedTask
                    : existingTodo
                )
              )
            }
            deleteTask={(removeTask) =>
              setTodos(
                todos.map((existingTodo) =>
                  existingTodo._id === removeTask._id
                    ? removeTask
                    : existingTodo
                )
              )
            }
          />
        </Col>
      ))}
    </Row>
  );
  async function deleteTodo(todo: TodoModel) {
    try {
      await TodosApi.deleteTodo(todo._id);
      setTodos(todos.filter((existingTodo) => existingTodo._id !== todo._id));
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <Button
        className={`mb-4 mt-2 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
        onClick={() => setShowAddTodoDialog(true)}
      >
        <FaPlus />
        Add new todo
      </Button>
      {todoLoading && <Spinner animation="border" variant="primary" />}
      {showTodoLoadingError && (
        <p style={{ margin: "1rem", display: "grid", placeItems: "center" }}>
          Something went wrong. Please refresh the page.
        </p>
      )}
      {!todoLoading && !showTodoLoadingError && (
        <>
          {todos.length > 0 ? (
            todosGrid
          ) : (
            <p
              style={{
                margin: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              You don't have any Todos yet
            </p>
          )}
        </>
      )}
      {showAddTodoDialog && (
        <AddEditTodoDialog
          onDismiss={() => setShowAddTodoDialog(false)}
          onTodoSaved={(newTodo) => {
            setTodos([newTodo, ...todos]);
            setShowAddTodoDialog(false);
          }}
        />
      )}
      {todoToEdit && (
        <AddEditTodoDialog
          todoToEdit={todoToEdit}
          onDismiss={() => setTodoToEdit(null)}
          onTodoSaved={(updatedTodo) => {
            setTodos(
              todos.map((existingTodo) =>
                existingTodo._id === updatedTodo._id
                  ? updatedTodo
                  : existingTodo
              )
            );
            setTodoToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default TodosPageLoggedView;
