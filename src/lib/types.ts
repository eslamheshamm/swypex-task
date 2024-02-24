export interface RateData {
	[date: string]: {
		USDEGP: string;
		USDCAD: string;
	};
}
export interface ExchangeRateData {
	start_date: string;
	end_date: string;
	quotes: RateData;
	success: boolean;
	source: string;
}
