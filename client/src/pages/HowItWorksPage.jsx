import { HowItWorks } from "../components/HowItWorks";

export function HowItWorksPage({
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
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <HowItWorks />
      </div>
    </>
  );
}
