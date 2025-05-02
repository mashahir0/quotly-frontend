import AdminNavbar from "../../components/admin/AdminNavbar";
import UserTable from "../../components/admin/UserTable";

function Dashboard() {
  return (
    <div className="flex flex-col  h-screen bg-gray-900 text-white">
      {/* Sidebar Navbar */}
      <div className="w-full ">
        <AdminNavbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <UserTable />
      </div>
    </div>
  );
}

export default Dashboard;
