interface WeatherData {
	list: WeatherForecast[];
}

interface WeatherForecast {
	dt_txt: string;
	main: {
		temp: number;
	};
	weather: Array<{
		icon: string;
		description: string;
	}>;
}

interface DailyForecasts {
	[key: string]: WeatherForecast[];
}

interface DateInfo {
	day: number;
	date: string;
}

export function WeatherForecast({ data }: { data: WeatherData }) {
	const dailyForecasts: DailyForecasts = data.list.reduce(
		(acc: DailyForecasts, curr) => {
			const date = new Date(curr.dt_txt).toDateString();
			if (!acc[date]) acc[date] = [];
			acc[date].push(curr);
			return acc;
		},
		{}
	);

	const forecastEntries = Object.entries(dailyForecasts);

	const formatTemperature = (temp: number): string =>
		`${Math.round(temp - 273.15)}°C`;

	const getAverageTemp = (forecasts: WeatherForecast[]): string =>
		formatTemperature(
			forecasts.reduce((sum, curr) => sum + curr.main.temp, 0) /
				forecasts.length
		);

	const getDayAndDate = (dtTxt: string): DateInfo => {
		const date = new Date(dtTxt);
		return {
			day: date.getDate(),
			date: date.toLocaleDateString('en-US', {
				month: 'short',
				weekday: 'short',
			}),
		};
	};

	return (
		<div className='bg-white border border-gray-200 rounded-xl p-4 sm:p-6 w-full max-w-lg '>
			<div className='flex items-center justify-between mb-4 sm:mb-6'>
				<h2 className='text-lg sm:text-xl font-semibold'>Forecasts</h2>
			</div>
			<div className='space-y-3 sm:space-y-4'>
				{forecastEntries.map(([, forecasts], index) => {
					const { day, date: formattedDate } = getDayAndDate(
						forecasts[0].dt_txt
					);

					return (
						<div
							key={index}
							className='flex flex-col sm:flex-row items-center justify-between bg-gray-100 rounded-lg p-3 sm:p-4 text-center sm:text-left'
						>
							<div className='flex items-center gap-2 sm:gap-4'>
								<div>
									<p className='text-sm sm:text-base font-medium'>
										{getAverageTemp(forecasts)}
									</p>
								</div>
							</div>
							<div className='flex flex-col items-center '>
								<span className='text-xl sm:text-2xl font-bold'>{day}</span>
								<p className='text-xs sm:text-sm text-gray-500'>
									{formattedDate}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
