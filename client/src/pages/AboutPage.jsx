import { About } from "../components/About";
import Navbar from "../components/Navbar";

export function AboutPage({
  authToken,
  user,
  userRole,
  onLogout,
  onSignInClick,
  onRegisterClick,
  onRecordItemClick,
}) {
  return (
    <>
      <Navbar
        authToken={authToken}
        user={user}
        userRole={userRole}
        onLogout={onLogout}
        onSignInClick={onSignInClick}
        onRegisterClick={onRegisterClick}
        onRecordItemClick={onRecordItemClick}
      />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <About />
      </div>
    </>
  );
}
