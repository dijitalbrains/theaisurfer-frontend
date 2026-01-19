export interface WaxDetails {
  remainingCredits: number | string;
  userCard: any;
  waxPerCent: number;
  autoReloadSettings: {
    autoReload: boolean;
    reloadThreshold: number;
    reloadAmount: number;
  };
  stripeClientId: string;
}

export interface UpdateAutoReloadDto {
  autoReloadEnabled: boolean;
  reloadThreshold: number;
  reloadAmount: number;
}

export interface UserCard {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  stripeSourceId?: string;
}
