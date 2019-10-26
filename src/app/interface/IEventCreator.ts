import { IAddress } from "./IAddress";

export interface IEventCreator {
  id?: number;
  organizerEmail?: string;
  eventType: string;
  name: string;
  description: string;
  maxParticipant: number;
  visibility: string;
  eventDate: Date;
  totalCost: number;
  address?: IAddress;
  addressId?: number;
}
