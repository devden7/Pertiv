export const badgeStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'badge_pending';
    case 'canceled':
      return 'badge_canceled';
    case 'accepted':
      return 'badge_accepted';
    case 'borrowed':
      return 'badge_borrowed';
    case 'success':
    case 'returned':
      return 'badge_success';
    default:
      return 'badge_paid';
  }
};
