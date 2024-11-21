function Loading({ size = "large" }) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12"
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-b-2 border-white ${sizeClasses[size]}`}></div>
    </div>
  );
}

export default Loading; 