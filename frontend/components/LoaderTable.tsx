const LoaderTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 border-b">Course Name</th>
              <th className="py-3 px-4 border-b">Date</th>
              <th className="py-3 px-4 border-b">Subject</th>
              <th className="py-3 px-4 border-b">Location</th>
              <th className="py-3 px-4 border-b">Trainer</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="py-3 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-2/4"></div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="h-8 bg-gray-300 rounded w-full"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default LoaderTable;
  