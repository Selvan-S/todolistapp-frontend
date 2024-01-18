import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProbs {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
}
const NavBarLoggedOutView = ({
  onSignUpClicked,
  onLoginClicked,
}: NavBarLoggedOutViewProbs) => {
  return (
    <>
      <Button onClick={onSignUpClicked}>Sign up</Button>
      <Button onClick={onLoginClicked}>Log in</Button>
    </>
  );
};

export default NavBarLoggedOutView;
