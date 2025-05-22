import { checkDeadlineReminder } from './scheduler-utils';

describe('scheduler-utils', () => {
  describe('checkDeadlineReminder', () => {
    it('should return correct reminder status for 14 days before deadline', () => {
      const today = new Date();
      const deadlineDate = new Date(today);
      deadlineDate.setDate(today.getDate() + 14);
      const deadlineString = '2025-03-29T23:00:00.000Z';

      const result = checkDeadlineReminder(deadlineString);

      console.log('result >> ', result);

      expect(result.frequency).toEqual(1);
    });

    // it('should return correct reminder status for 7 days before deadline', () => {
    //   const today = new Date();
    //   const deadlineDate = new Date(today);
    //   deadlineDate.setDate(today.getDate() + 7);
    //   const deadlineString = deadlineDate.toISOString().split('T')[0];

    //   const result = checkDeadlineReminder(deadlineString);

    //   expect(result).toEqual({
    //     shouldRemind: true,
    //     daysUntilDeadline: 7,
    //     frequency: 7
    //   });
    // });

    // it('should return false for non-reminder days', () => {
    //   const today = new Date();
    //   const deadlineDate = new Date(today);
    //   deadlineDate.setDate(today.getDate() + 5);
    //   const deadlineString = deadlineDate.toISOString().split('T')[0];

    //   const result = checkDeadlineReminder(deadlineString);

    //   expect(result).toEqual({
    //     shouldRemind: false,
    //     daysUntilDeadline: 5,
    //     frequency: null
    //   });
    // });

    // it('should handle custom reminder frequencies', () => {
    //   const today = new Date();
    //   const deadlineDate = new Date(today);
    //   deadlineDate.setDate(today.getDate() + 10);
    //   const deadlineString = deadlineDate.toISOString().split('T')[0];

    //   const result = checkDeadlineReminder(deadlineString, [10, 5, 2, 1]);

    //   expect(result).toEqual({
    //     shouldRemind: true,
    //     daysUntilDeadline: 10,
    //     frequency: 10
    //   });
    // });

    // it('should handle datetime string with time component', () => {
    //   const today = new Date();
    //   const deadlineDate = new Date(today);
    //   deadlineDate.setDate(today.getDate() + 3);
    //   const deadlineString = deadlineDate.toISOString().replace('T', ' ').slice(0, 19);

    //   const result = checkDeadlineReminder(deadlineString);

    //   expect(result).toEqual({
    //     shouldRemind: true,
    //     daysUntilDeadline: 3,
    //     frequency: 3
    //   });
    // });

    // it('should throw error for invalid date format', () => {
    //   expect(() => {
    //     checkDeadlineReminder('invalid-date');
    //   }).toThrow('Deadline date string must be in YYYY-MM-DD or YYYY-MM-DD HH:MM:SS.mmm format');
    // });

    // it('should handle empty frequencies array', () => {
    //   const today = new Date();
    //   const deadlineDate = new Date(today);
    //   deadlineDate.setDate(today.getDate() + 14);
    //   const deadlineString = deadlineDate.toISOString().split('T')[0];

    //   const result = checkDeadlineReminder(deadlineString, []);

    //   expect(result).toEqual({
    //     shouldRemind: false,
    //     daysUntilDeadline: 14,
    //     frequency: null
    //   });
    // });
  });
});
