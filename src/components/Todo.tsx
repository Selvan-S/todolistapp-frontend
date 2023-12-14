import React, { useState } from "react";
import { Button, Card, CardFooter, ListGroup } from "react-bootstrap";
import { BiAddToQueue, BiEdit, BiTask } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Task as TaskModel } from "../models/task";
import { Todo as TodoModel } from "../models/todo";
import todoStyles from "../styles/Todo.module.css";
import styles from "../styles/TodoPage.module.css";
import styleUtils from "../styles/utils.module.css";
import { formatDate } from "../utils/formatDate";
// import API_URL from "../config/global";

interface TodoProps {
  todo: TodoModel;
  onTodoClicked: (todo: TodoModel) => void;
  onDeleteTodoClicked: (todo: TodoModel) => void;
  createTask: (task: TaskModel) => void;
  updateTask: (task: TodoModel) => void;
  deleteTask: (task: TodoModel) => void;
  className?: string;
}
const Todo = ({
  todo,
  onTodoClicked,
  className,
  onDeleteTodoClicked,
  createTask,
  updateTask,
  deleteTask,
}: TodoProps) => {
  const { title, text, finishedTask, createdAt, updatedAt } = todo;
  const [editingTaskText, setEditingTaskText] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState("");
  const [taskIndex, setTaskIndex] = useState(-1);

  const [addTaskField, setAddTaskField] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [isdisabled, setIsDisabled] = useState(true);
  const [isActive, setActive] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setIsDisabled(true);
      setTaskText("");
    } else {
      setTaskText(event.target.value);
      setIsDisabled(false);
    }
  };

  const toggleClass = () => {
    setActive(!isActive);
  };

  let createdUpdatedText: string;

  if (updatedAt > createdAt) {
    createdUpdatedText = "Updated: " + formatDate(updatedAt);
  } else {
    createdUpdatedText = "Created: " + formatDate(createdAt);
  }

  async function addTask(input: string, id: string) {
    // const createdTaskRsponse = await fetch(`${API_URL}/api/v1/tasks`, {
    const createdTaskRsponse = await fetch("/api/v1/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: input, todo_id: id }),
    });

    setAddTaskField(false);
    setIsDisabled(true);
    setTaskText("");
    const variable = await createdTaskRsponse.json();
    createTask(variable);
  }

  async function removeTask(
    taskId: string,
    todoId: string,
    input: string,
    index: number
  ) {
    try {
      // await fetch(`${API_URL}/api/v1/tasks`, {
      await fetch("/api/v1/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task_id: taskId, todo_id: todo._id }),
      });
      console.log(`taskId: ${taskId} todo.id: ${todo._id} todoId: ${todoId}`);

      const removeTaskInTodo = todo;
      removeTaskInTodo.text?.splice(index, 1);
      removeTaskInTodo.finishedTask?.unshift(input);

      deleteTask(removeTaskInTodo);
    } catch (error) {
      console.error(error);
    }
  }

  async function editTask(taskId: string, input: string, index: number) {
    // await fetch(`${API_URL}/api/v1/tasks`, {
    await fetch("/api/v1/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_id: taskId, task: input }),
    });
    setAddTaskField(false);
    setEditingTaskText(false);
    setIsDisabled(true);
    setTaskText("");
    setTaskIndex(-1);

    const updateTaskInTodo = todo;
    updateTaskInTodo.text?.splice(index, 1);

    updateTaskInTodo.text?.unshift({
      _id: taskId,
      todo_id: todo._id,
      task: taskText,
      createdAt: "",
      updatedAt: "",
    });
    updateTask(updateTaskInTodo);
  }

  return (
    <Card
      className={`${todoStyles.todoCard} ${className} ${
        isActive ? styles.active : null
      }`}
      onClick={toggleClass}
    >
      <Card.Body
        className={`${todoStyles.todoBody} 
        ${isActive ? todoStyles.mask_image_none : null}`}
      >
        <Card.Title
          className={`${styleUtils.positionRelative}`}
          style={{ cursor: "pointer" }}
          onClick={() => onTodoClicked(todo)}
        >
          {title}
          <MdDelete
            className={`text-danger ${styleUtils.positionAbsolute}`}
            onClick={(e) => {
              onDeleteTodoClicked(todo);
              e.stopPropagation();
            }}
          />
        </Card.Title>

        <ListGroup className="list-group-flush">
          <Card.Header className={`${styleUtils.flexCenter}`}>
            Tasks
            <BiAddToQueue
              size={23}
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => setAddTaskField(true)}
            />
          </Card.Header>
          {!text?.length ? (
            <ListGroup.Item className={todoStyles.todoList}>
              {!addTaskField ? (
                <Button
                  className={`${styleUtils.buttonText} ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
                  onClick={() => setAddTaskField(true)}
                >
                  <FaPlus />
                  Add Task
                </Button>
              ) : (
                <div>
                  <div
                    className="form-group"
                    style={{
                      display: "grid",
                      gridTemplateRows: "1fr 1fr 1fr",
                      gap: "3px",
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      id="task"
                      required
                      value={taskText}
                      onChange={handleInputChange}
                      name="task"
                    />
                    <button
                      onClick={() => {
                        addTask(taskText, todo._id);
                      }}
                      id="button"
                      disabled={isdisabled}
                      className="btn btn-success"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => {
                        setAddTaskField(false);
                        setTaskText("");
                      }}
                      id="button"
                      type="button"
                      className="btn btn-danger"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </ListGroup.Item>
          ) : !addTaskField ? (
            text?.map((item, index) => (
              <ListGroup.Item
                className={`${todoStyles.todoList} ${styleUtils.positionRelative}`}
              >
                {item.task}
                <div
                  className={`${styleUtils.positionAbsolute} ${styleUtils.checkTask}`}
                >
                  <BiEdit
                    size={23}
                    className="text-warning"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setTaskIndex(index);
                      setCurrentTaskId(item._id);
                      setTaskText(item.task);
                      setEditingTaskText(true);
                      setAddTaskField(true);
                    }}
                  />
                  <BiTask
                    size={23}
                    className="text-success"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      removeTask(item._id, todo._id, item.task, index);
                    }}
                  />
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <div>
              <div
                className="form-group"
                style={{
                  display: "grid",
                  gridTemplateRows: "1fr 1fr 1fr",
                  gap: "3px",
                }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="task"
                  required
                  value={taskText}
                  onChange={handleInputChange}
                  name="task"
                />
                <button
                  onClick={() => {
                    if (editingTaskText === true && taskIndex >= 0) {
                      editTask(currentTaskId, taskText, taskIndex);
                    } else {
                      addTask(taskText, todo._id);
                    }
                  }}
                  id="button"
                  disabled={isdisabled}
                  className="btn btn-success"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setAddTaskField(false);
                    setEditingTaskText(false);
                    setTaskText("");
                  }}
                  id="button"
                  type="button"
                  className="btn btn-danger"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </ListGroup>
        <ListGroup className="list-group-flush">
          <Card.Header>Finished Task</Card.Header>
          {!finishedTask?.length ? (
            <ListGroup.Item
              className={`${todoStyles.todoList} ${todoStyles.finishedTask}`}
            >
              No finished tasks
            </ListGroup.Item>
          ) : (
            finishedTask?.map((item, index) => (
              <ListGroup.Item className={`${todoStyles.todoList}`}>
                <del style={{ color: "GrayText" }}>{item}</del>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card.Body>
      <CardFooter className="text-muted">{createdUpdatedText}</CardFooter>
    </Card>
  );
};

export default Todo;
