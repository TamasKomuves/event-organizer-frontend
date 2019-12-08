export interface IChatMessage {
  id?: number;
  date?: string;
  text: string;
  senderEmail?: string;
  receiverEmail: string;
  isAlreadySeen?: string;
}
