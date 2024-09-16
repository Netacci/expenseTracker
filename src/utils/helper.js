export const currencySymbol = (currency) => {
  switch (currency) {
    case 'USD':
      return '$';
    case 'GBP':
      return '£';
    case 'EUR':
      return '€';
    case 'CAD':
      return 'Can$';
    case 'KES':
      return 'KSh';
    case 'ZAR':
      return 'R';
    case 'TZS':
      return 'Tsh';
    case 'AUD':
      return '$';
    case 'GHS':
      return 'GH₵';
    case 'UGX':
      return 'Ush';
    case 'ZWL':
      return '$';
    case 'BWP':
      return 'P';
    case 'NAD':
      return '$';
    case 'LSL':
      return 'L';
    case 'SZL':
      return 'E';
    case 'INR':
      return '₹';
    default:
      return '₦';
  }
};

export const startProgressInterval = (
  id,
  setDeleting,
  intervalDuration = 100
) => {
  const intervalId = setInterval(() => {
    setDeleting((prev) => {
      const progress = prev[id]?.progress || 0;

      // Check if progress reached 100%
      if (progress >= 100) {
        clearInterval(intervalId);
        return {
          ...prev,
          [id]: { ...prev[id], progress: 100 },
        };
      }

      // Increment progress by 10
      return {
        ...prev,
        [id]: { ...prev[id], progress: progress + 10 },
      };
    });
  }, intervalDuration);

  return intervalId; // Return interval ID to allow clearing it later
};
