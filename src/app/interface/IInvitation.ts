export interface IInvitation {
  id: number;
  eventId: number;
  userEmail: string;
  sentDate: string;
  decisionDate: string;
  isAccepted: number;
  isUserRequested: number;
}
