import { DataSeries } from "./series";
import { ComposedAggregationValue } from "./time-series";

export class TimeSeriesHelper {
    /**
     * Enriches the data series value with formatted value and texts.
     * 
     * @param dataSeries data series
     * @param value value of the data
     * @returns the value with formatted value and text
     */
    static toComposedValue(dataSeries: DataSeries, value: number): ComposedAggregationValue {
        const isDurationNanoField = dataSeries?.fieldName === SeriesHelper.DURATION_NANO_FIELD_NAME;
        const isMinionsCountSeries = dataSeries?.reference === SeriesHelper.MINIONS_COUNT_DATA_SERIES_REFERENCE;
        const decimal = isMinionsCountSeries ? 0 : (isDurationNanoField ? 6 : 2);
        const formattedValue = isDurationNanoField ? (value / 1_000_000).toFixed(6) : (value).toFixed(decimal);

        return {
            value: value,
            formattedValue: formattedValue,
            formattedText: isDurationNanoField ? `${formattedValue} ms` : value.toFixed(decimal)
        }
    }
}