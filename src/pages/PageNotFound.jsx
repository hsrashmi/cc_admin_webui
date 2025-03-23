export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">
        Oops! The page you are looking for does not exist.
      </p>
      <a
        href="/home"
        className="mt-6 px-4 py-2 bg-primary rounded-sm hover:bg-yellow-600"
      >
        Go Home
      </a>
    </div>
  );
}
