export class SeriesHelper {
    static sharingModeToText = {
        [SharingMode.READONLY]: 'Read Only',
        [SharingMode.NONE]: 'None',
        [SharingMode.WRITE]: 'Write',
    }

    static toDataSeriesTableData(dataSeries: DataSeries[], userName: string): DataSeriesTableData[] {
        return dataSeries.map(el => ({
            ...el,
            key: el.reference,
            sharedText: SeriesHelper.sharingModeToText[el.sharingMode],
            filterNames: el.filters?.map(filter => filter.name),
            formattedTimeframe: TimeframeHelper.toFormattedTimeframe(el.timeframeUnit),
            disabled: el.creator !== userName && el.sharingMode === SharingMode.READONLY
        }))
    }

    static getTableColumnConfigs() {
        return [
            {
                title: 'Name',
                dataIndex: 'displayName',
                key: 'displayName',
                sorter: (next: DataSeriesTableData, prev: DataSeriesTableData) => next.displayName.localeCompare(prev.displayName),
            },
            {
                title: 'Time-series type',
                dataIndex: 'dataType',
                key: 'dataType',
                sorter: (next: DataSeriesTableData, prev: DataSeriesTableData) => next.dataType.localeCompare(prev.dataType),
            },
            {
                title: 'Field name',
                dataIndex: 'fieldName',
                key: 'fieldName',
            },
            {
                title: 'Value',
                dataIndex: 'valueName',
                key: 'valueName',
            },
            {
                title: 'Shared',
                dataIndex: 'sharingMode',
                key: 'sharingMode',
                sorter: (next: DataSeriesTableData, prev: DataSeriesTableData) => next.sharingMode.localeCompare(prev.sharingMode),
            },
            {
                title: '',
                dataIndex: 'actions',
                key: 'actions',
            }
        ];
    }
}