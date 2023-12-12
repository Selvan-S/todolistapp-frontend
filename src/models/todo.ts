export interface Todo {
  _id: string;
  title: string;
  text?: [
    {
      _id: string;
      todo_id: string;
      task: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
  finishedTask?: [string];
  createdAt: string;
  updatedAt: string;
}
