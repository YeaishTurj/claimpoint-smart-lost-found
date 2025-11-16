export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.name} ({user?.role})</p>
    </div>
  );
}
