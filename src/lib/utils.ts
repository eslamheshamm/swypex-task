import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ExchangeRateData } from "./types";

const ACCESS_KEY: string = "5cf8ac3be9f820075e679169f401bbac";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function fetchExchangeRates(
	startDate: string,
	endDate: string
): Promise<ExchangeRateData> {
	const baseURL = "http://api.exchangerate.host/timeframe"; // This will always use HTTP
	const queryParams = new URLSearchParams({
		start_date: startDate,
		end_date: endDate,
		access_key: ACCESS_KEY,
		currencies: "EGP,CAD",
	});
	const url = `${baseURL}?${queryParams.toString()}`;

	try {
		const response = await fetch(url, {
			cache: "no-store",
		});
		if (!response.ok) {
			throw new Error(`API request failed with status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		throw new Error(`Error fetching exchange rates:: ${error}`);
	}
}
