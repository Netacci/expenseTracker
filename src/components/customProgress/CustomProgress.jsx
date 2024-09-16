/* eslint-disable react/prop-types */

const CustomProgress = ({ value, className }) => {
  return (
    <div
      className={`h-2 w-full bg-gray-200 rounded-full overflow-hidden ${className}`}
    >
      <div
        className={`h-full transition-all duration-500 ease-out ${
          value >= 25 && value < 50
            ? 'bg-orange-600'
            : value >= 50
            ? 'bg-red-600'
            : 'bg-blue-600'
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default CustomProgress;
