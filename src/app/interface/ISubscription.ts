export interface ISubscription {
  topicName: string;
  onMessage: (socketMessage: any) => void;
  subscriptionHolder?: any;
}
