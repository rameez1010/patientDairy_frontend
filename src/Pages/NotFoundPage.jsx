import { FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="flex flex-col items-center h-screen justify-center">
      <FaExclamationTriangle className="text-yellow-400 text-6xl mb-4" />
      <h1 className="text-4xl font-semibold mb-4">404 Not Found</h1>
      <p className="text-xl mb-5">This page does not exist</p>
      <Link to="/" className="text-white bg-[#00b4d8] hover:bg-[#2ad0f1] mt-4 p-2">
        Go Back
      </Link>
    </section>
  );
};

export default NotFoundPage;
