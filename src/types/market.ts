export type Market = {
  market: String;
  korean_name: String;
  english_name: String;
  market_warning: String;
  market_event: {
    warning: Boolean;
    caution: {
      PRICE_FLUCTUATIONS: Boolean;
      TRADING_VOLUME_SOARING: Boolean;
      DEPOSIT_AMOUNT_SOARING: Boolean;
      GLOBAL_PRICE_DIFFERENCES: Boolean;
      CONCENTRATION_OF_SMALL_ACCOUNTS: Boolean;
    };
  };
};
