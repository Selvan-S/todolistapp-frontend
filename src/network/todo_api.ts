import { ConflictError, UnauthorizedError } from "../errors/http.errors";
import { Todo } from "../models/todo";
import { User } from "../models/user";

async function fetchWithError(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;

    if (response.status === 401) {
      throw new UnauthorizedError(errorMessage);
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage);
    } else {
      throw Error(
        "Resquest failed with status: " +
          response.status +
          " message: " +
          errorMessage
      );
    }
  }
}

// User Sign in, Log in and Logout

export async function getLoggedInUser(): Promise<User> {
  const response = await fetchWithError(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/users`,
    {
      method: "GET",
      credentials: "include",
      mode: "cors",
    }
  );
  const getLoggedInUserResponse = await response.json();
  return getLoggedInUserResponse;
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchWithError(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/signup`,
    {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );
  const SignUpCredentialsResponse = await response.json();
  return SignUpCredentialsResponse;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetchWithError(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/login`,
    {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );
  const LoginResponse = await response.json();
  return LoginResponse;
}

export async function logout() {
  await fetchWithError(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/logout`,
    {
      method: "POST",
    }
  );
}

export async function fetchTodo(): Promise<Todo[]> {
  const response = await fetchWithError(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/todos`,
    {
      credentials: "include",
      mode: "cors",
      method: "GET",
    }
  );
  const TodosResponse = await response.json();
  return TodosResponse;
}

export interface TodoInput {
  title: string;
}

export async function createTodo(todo: TodoInput): Promise<Todo> {
  const response = await fetchWithError(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/todos`,
    {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }
  );
  return response.json();
}

export async function updateTodo(
  todoId: string,
  todo: TodoInput
): Promise<Todo> {
  const response = await fetchWithError(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/todos/` + todoId,
    {
      method: "PUT",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }
  );
  return response.json();
}

export async function deleteTodo(todoId: string) {
  await fetchWithError(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/todos/` + todoId,
    {
      mode: "cors",
      credentials: "include",
      method: "DELETE",
    }
  );
}
