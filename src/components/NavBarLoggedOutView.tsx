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
      <Button onClick={onSignUpClicked}>Sign Up</Button>
      <Button onClick={onLoginClicked}>Login In</Button>
    </>
  );
};

export default NavBarLoggedOutView;
