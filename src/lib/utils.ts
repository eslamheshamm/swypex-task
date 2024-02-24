import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import {
	endOfMonth,
	endOfWeek,
	startOfMonth,
	startOfWeek,
	subDays,
	subMonths,
} from "date-fns";
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

export const handleButtonClick = (
	range: string,
	e: React.MouseEvent,
	setDateRange: SelectRangeEventHandler,
	dateRange: DateRange | undefined
) => {
	let from, to;
	switch (range) {
		case "This Week":
			from = startOfWeek(new Date());
			to = new Date();
			break;
		case "Last Week":
			from = startOfWeek(subDays(new Date(), 7));
			to = endOfWeek(subDays(new Date(), 7));
			break;
		case "Last 7 Days":
			from = subDays(new Date(), 7);
			to = new Date();
			break;
		case "Current Month":
			from = startOfMonth(new Date());
			to = new Date();
			break;
		case "Last Month":
			from = startOfMonth(subMonths(new Date(), 1));
			to = endOfMonth(subMonths(new Date(), 1));
			break;
		case "Last 2 Months":
			from = startOfMonth(subMonths(new Date(), 2));
			to = endOfMonth(subMonths(new Date(), 1));
			break;
		default:
			return;
	}
	setDateRange(
		{ from, to },
		(dateRange && dateRange.from) || new Date(),
		{
			selected: true,
			range_start: true,
		},
		e
	);
};
