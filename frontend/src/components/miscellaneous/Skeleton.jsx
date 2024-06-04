const Skeleton = () => {
  return (
    <div role="status" className="w-full mx-auto flex flex-col items-center gap-4 animate-pulse">
      <div className="w-full h-[108px] rounded-lg bg-gray-200 dark:bg-gray-700 shadow-md dark:shadow-gray-900"></div>
      <div className="w-full h-[108px] rounded-lg bg-gray-200 dark:bg-gray-700 shadow-md dark:shadow-gray-900"></div>
      <div className="w-full h-[108px] rounded-lg bg-gray-200 dark:bg-gray-700 shadow-md dark:shadow-gray-900"></div>
      <span className="sr-only dark:text-white">Loading...</span>
    </div>
  );
}

export default Skeleton;
