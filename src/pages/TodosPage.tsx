import { Container } from "react-bootstrap";
import TodosPageLoggedView from "../components/TodosPageLoggedView";
import TodosPageLoggedOutView from "../components/TodosPageLoggedOutView";
import styles from "../styles/TodoPage.module.css";
import { User } from "../models/user";

interface TodosPageProps {
  loggedInUser: User | null;
}
const TodosPage = ({ loggedInUser }: TodosPageProps) => {
  return (
    <Container className={styles.todosPage} style={{ marginBlock: "2rem" }}>
      <>{loggedInUser ? <TodosPageLoggedView /> : <TodosPageLoggedOutView />}</>
    </Container>
  );
};

export default TodosPage;
