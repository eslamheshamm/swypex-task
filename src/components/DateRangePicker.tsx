import {
	endOfMonth,
	endOfWeek,
	format,
	startOfMonth,
	startOfWeek,
	subDays,
	subMonths,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { MouseEvent, useEffect, useState } from "react";

export function DateRangePicker({
	className,
	dateRange,
	setDateRange,
}: {
	className?: string;
	dateRange: DateRange | undefined;
	setDateRange: SelectRangeEventHandler;
}) {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	useEffect(() => {
		if (dateRange && dateRange.from) {
			setCurrentMonth(dateRange.from);
		}
	}, [dateRange]);
	const createButton = (label: string, from: Date, to: Date) => (
		<Button
			onClick={(e: MouseEvent<HTMLButtonElement>) => {
				setDateRange(
					{
						from: from,
						to: to,
					},
					(dateRange && dateRange.from) || new Date(),
					{
						selected: true,
						range_start: true,
					},
					e
				);
			}}
		>
			{label}
		</Button>
	);

	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-full font-bold ",
							!dateRange && "text-muted-foreground"
						)}
					>
						<CalendarIcon className=" h-4 w-4 mr-2" />

						{dateRange?.from ? (
							dateRange.to ? (
								<>
									{format(dateRange.from, "LLL dd, y")} -{" "}
									{format(dateRange.to, "LLL dd, y")}
								</>
							) : (
								format(dateRange.from, "LLL dd, y")
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto flex p-2" align="start">
					<Calendar
						initialFocus
						mode="range"
						selected={dateRange}
						onSelect={setDateRange}
						defaultMonth={new Date()}
						month={currentMonth || new Date()}
						onMonthChange={setCurrentMonth}
						numberOfMonths={2}
						disabled={(day) => day > new Date()}
					/>
					<div className="flex flex-col gap-3 justify-center">
						<p className="text-center font-semibold text-sm">Pick Quickly</p>
						{createButton("Today", new Date(), new Date())}
						{createButton("This Week", startOfWeek(new Date()), new Date())}
						{createButton(
							"Last Week",
							startOfWeek(subDays(new Date(), 7)),
							endOfWeek(subDays(new Date(), 7))
						)}
						{createButton("Last 7 Days", subDays(new Date(), 7), new Date())}
						{createButton(
							"Current Month",
							startOfMonth(new Date()),
							new Date()
						)}
						{createButton(
							"Last Month",
							startOfMonth(subMonths(new Date(), 1)),
							endOfMonth(subMonths(new Date(), 1))
						)}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
