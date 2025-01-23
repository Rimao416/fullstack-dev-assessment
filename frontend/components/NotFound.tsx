// components/NotFound.tsx
import Header from "./Header";

export default function NotFound() {
  return (
    <div>
      <Header />

      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        
      </div>
    </div>
  );
}