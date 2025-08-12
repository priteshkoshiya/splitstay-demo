import Dashboard from "@/components/Dashboard";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-purple-200 pt-32">
      <Header title="SplitStay" />
      <Dashboard />
    </div>
  );
}
