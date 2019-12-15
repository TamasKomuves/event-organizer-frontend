export interface IEvent {
  id?: number;
  addressId?: number;
  organizerEmail?: string;
  eventType: string;
  name: string;
  description: string;
  maxParticipant: number;
  visibility: string;
  eventDate: Date;
  totalCost: number;
}
