export interface StripeCard {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  stripeSourceId?: string;
}

export interface AutoReloadSettings {
  enabled: boolean;
  threshold: number;
  amount: number;
}

export interface WaxDetails {
  remainingCredits: number | string;
  userStripeSource: StripeCard | null;
  creditsPerCent: number;
  autoReloadSettings: AutoReloadSettings;
}

export interface UpdateAutoReloadDto {
  enabled: boolean;
  threshold: number;
  amount: number;
}
