import { useSignOutMutation } from "@/slice/authSlice";
import { useAppSelector } from "@/store/store";
import Link from "next/link";

const Header = () => {
  const user=useAppSelector((state) => state.auth.user);  
  const [signOut] = useSignOutMutation();

  const handleSignOut = async () => {
    try {
      await signOut().unwrap(); // Déclenche la mutation signOut
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="flex items-center">
        <h1 className="text-xl font-bold">Kodschul Management Hub</h1>
      </Link>
      <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm">Welcome, {user?.name}</span>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600"
          >
            Sign In
          </Link>
        )}
      </div>
      </div>
    </header>
  );
};

export default Header;
