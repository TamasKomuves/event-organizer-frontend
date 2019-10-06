export interface IChatMessage {
  id?: number;
  date: string;
  text: string;
  isCurrentUserSent: boolean;
  partnerEmail: string;
}
