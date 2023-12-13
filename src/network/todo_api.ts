import { ConflictError, UnauthorizedError } from "../errors/http.errors";
import { Todo } from "../models/todo";
import { User } from "../models/user";
import API_URL from "../config/global";

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
  // const response = await fetchWithError(`${API_URL}/api/v1/users`, {
  const response = await fetchWithError("/api/v1/users", {
    method: "GET",
  });
  return response.json();
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  // const response = await fetchWithError(`${API_URL}/api/v1/users/signup`, {
  const response = await fetchWithError("/api/v1/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  // const response = await fetchWithError(`${API_URL}/api/v1/users/login`, {
  const response = await fetchWithError("/api/v1/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function logout() {
  // await fetchWithError(`${API_URL}/api/v1/users/logout`, {
  await fetchWithError("/api/v1/users/logout", {
    method: "POST",
  });
}

// Todo

export async function fetchTodo(): Promise<Todo[]> {
  // const response = await fetchWithError(`${API_URL}/api/v1/todos`, {
  const response = await fetchWithError("/api/v1/todos", {
    method: "GET",
  });
  return response.json();
}

export interface TodoInput {
  title: string;
}

export async function createTodo(todo: TodoInput): Promise<Todo> {
  // const response = await fetchWithError(`${API_URL}/api/v1/todos`, {
  const response = await fetchWithError("/api/v1/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  return response.json();
}

export async function updateTodo(
  todoId: string,
  todo: TodoInput
): Promise<Todo> {
  // const response = await fetchWithError(`${API_URL}/api/v1/todos/` + todoId, {
  const response = await fetchWithError("/api/v1/todos/" + todoId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  return response.json();
}

export async function deleteTodo(todoId: string) {
  // await fetchWithError(`${API_URL}/api/v1/todos/` + todoId, {
  await fetchWithError("/api/v1/todos/" + todoId, {
    method: "DELETE",
  });
}
