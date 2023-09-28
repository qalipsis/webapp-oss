import { defineStore } from "pinia";
import { CampaignOption } from "utils/campaign";
import { DataComponent, Report } from "utils/report";
import { DataSeriesOption } from "utils/series";

interface ReportDetailStoreState {
    reportDetails: Report | null;
    reportName: string;
    dataComponents: DataComponent[];
    campaignOptions: CampaignOption[];
    scenarioNames: string[];
    selectedScenarioNames: string[];
    campaignNamesPatterns: string[];
    campaignKeys: string[];
    allDataSeriesOptions: DataSeriesOption[];
}

export const useReportDetailsStore = defineStore("ReportDetails", {
    state: (): ReportDetailStoreState => {
        return {
            reportDetails: null,
            reportName: '',
            dataComponents: [],
            campaignOptions: [],
            scenarioNames: [],
            selectedScenarioNames: [],
            campaignNamesPatterns: [],
            campaignKeys: [],
            allDataSeriesOptions: []
        }
    },
    getters: {
        activeCampaignOptions: state => state.campaignOptions.filter(c => c.isActive),
        hasUnsavedChanges: state => {
            const simplifiedNewDataComponents = state.dataComponents.map(d => ({
                dataType: d.type,
                references: d.datas.map((data) => {
                    return data.reference
                })
            }));
            const simplifiedOldDataComponents = state.reportDetails!.dataComponents.map(d => ({
                dataType: d.type,
                references: d.datas.map((data) => {
                    return data.reference
                })
            }));

            if (state.reportName !== state.reportDetails?.displayName) return true;
            else if (!arraysEqual(simplifiedNewDataComponents, simplifiedOldDataComponents)) return true;

            return false
        }
    },
    actions: {
        deleteDataComponent(dataIndex: number): void {
            this.dataComponents.splice(dataIndex, 1);
        }
    }
});