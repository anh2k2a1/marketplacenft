interface NotificationProps {
  type: 'success' | 'info' | 'error';
  message: string;
  description?: string;
  txid?: string;
  onHide: () => void;
}