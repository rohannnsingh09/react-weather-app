function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="mt-8 p-4 bg-red-500/30 text-white rounded-lg text-center animate-fade-in">
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;

