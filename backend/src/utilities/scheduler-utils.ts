export const getTimezoneDate = (isoString, timezone) => {
  // Create a date formatter for the specific timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Format the date
  const formattedParts = formatter.formatToParts(new Date(isoString));

  // Extract the parts into an object
  const parts: any = formattedParts.reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  // Create a new date string in ISO format
  const dateString = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`;

  // Return the new date
  return new Date(dateString);
};

export const toLocaleDateString = (timestamp, timeZone) => {
  const date = new Date(timestamp);

  // Format the date part
  const options: any = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: timeZone,
  };
  const formattedDate = date.toLocaleDateString('en-US', options);

  return `${formattedDate}`;
};

export const convertToFriendlyFormat = (isoString, timezone) => {
  const timezoneDate = getTimezoneDate(isoString, timezone);
  const reminderDate = timezoneDate.getTime();
  return toLocaleDateString(reminderDate, timezone);
};

export const isTargetDate = (deadlineDatetime: string) => {
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);

  //console.log('now >> ', now);
  //console.log('yesterday >>', yesterday);
  //console.log('deadlineDatetime >>', deadlineDatetime);

  return (
    yesterday.getTime() < new Date(deadlineDatetime).getTime() &&
    now.getTime() >= new Date(deadlineDatetime).getTime()
  );
};

export const checkDeadlineReminder = (
  deadlineDatetime: string,
  frequencies = [14, 7, 3, 1],
) => {
  const nowUTC = new Date();
  const deadlineUTC = new Date(deadlineDatetime);

  const diffTime = deadlineUTC.getTime() - nowUTC.getTime();
  const exactDiffDays = diffTime / (1000 * 60 * 60 * 24);
  const sortedFrequencies = [...frequencies].sort((a, b) => b - a);

  let shouldRemind = false;
  let frequency: number | null = null;
  for (const freq of sortedFrequencies) {
    if (freq - 1 < exactDiffDays && exactDiffDays <= freq) {
      shouldRemind = true;
      frequency = freq;
      break;
    }
  }

  return {
    shouldRemind,
    frequency,
    exactDiffDays,
    currentUTC: nowUTC.toISOString(),
    deadlineUTC: deadlineUTC.toISOString(),
  };
};
