import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Button } from "./components/ui/button";
import swypexLogo from "./assets/swypex-logo.svg";
import { DateRangePicker } from "./components/DateRangePicker";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ExchangeRateData } from "./lib/types";
import { fetchExchangeRates } from "./lib/utils";
import Loading from "./components/ui/loading";

function App() {
	const initialRangeDate: DateRange | undefined = {
		from: addDays(new Date(), -2),
		to: new Date(),
	};
	const [selectedDate, setSelectedDate] = useState<DateRange | undefined>(
		initialRangeDate
	);
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<ExchangeRateData | null>(null);
	return (
		<main className="px-4 md:px-20 max-w-3xl">
			<header className=" py-10">
				<h2>
					<img src={swypexLogo} className="block" alt="Swypex" />
				</h2>
			</header>
			<div>
				<div className="flex items-center gap-4">
					<DateRangePicker
						dateRange={selectedDate}
						setDateRange={setSelectedDate}
					/>
					<Button
						disabled={!selectedDate}
						onClick={() => {
							setIsLoading(true);
							fetchExchangeRates(
								format(String(selectedDate?.from), "yyyy-MM-dd"),
								format(String(selectedDate?.to), "yyyy-MM-dd")
							).then((data) => {
								setData(data);
								setIsLoading(false);
							});
						}}
					>
						Show Data
					</Button>
				</div>
				{isLoading ? (
					<Loading className=" mt-12 text-center" />
				) : data && data.quotes ? (
					<Table className="my-4 ">
						<TableCaption>A list of currency exchange rates.</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>EGP</TableHead>
								<TableHead>CAD</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Object.entries(data.quotes).map(([date, rates]) => (
								<TableRow key={date}>
									<TableCell>{date}</TableCell>
									<TableCell>{rates.USDEGP}</TableCell>
									<TableCell>{rates.USDCAD}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<p className="mt-8 font-bold">
						Please select a date and click "Show Data" to view exchange rates.
					</p>
				)}
			</div>
		</main>
	);
}

export default App;
