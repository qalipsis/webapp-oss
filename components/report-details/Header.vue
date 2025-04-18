<template>
    <BaseHeader>
        <div class="flex justify-between items-center w-full">
            <div class="flex items-center">
                <BaseIcon 
                    icon="qls-icon-arrow-back"
                    class="cursor-pointer pl-1 pr-5 hover:text-primary-500 text-2xl font-extrabold"
                    @click="navigateTo('/reports')"
                />
                <BaseTitle v-model:content="reportName" :editable="true" />
            </div>
            <div class="flex items-center">
                <BaseButton
                    class="ml-2"
                    text="Save"
                    @click="handleSaveReportBtnClick"
                />
                <BaseButton
                    class="ml-2"
                    text="Download"
                    @click="handleDownloadReportBtnClick"
                />
            </div>
        </div>
    </BaseHeader>
</template>


<script setup lang="ts">

const emit = defineEmits<{
    (e: "saved"): void
}>()

const reportDetailsStore = useReportDetailsStore();
const toastStore = useToastStore();
const { updateReport, downloadReport } = useReportApi();
const { reportName } = storeToRefs(reportDetailsStore);

const handleDownloadReportBtnClick = async () => {
    const reportReference = reportDetailsStore.reportDetails!.reference;
    try {
       await downloadReport(reportReference); 
    } catch (error) {
        toastStore.error({ text: ErrorHelper.getErrorMessage(error) });
    }
}

const handleSaveReportBtnClick = async () => {
    // Calls the API to update the campaigns
    const request: ReportCreationAndUpdateRequest = {
        displayName: reportDetailsStore.reportName,
        campaignKeys: reportDetailsStore.campaignKeys,
        campaignNamesPatterns: reportDetailsStore.campaignNamesPatterns,
        description: reportDetailsStore.description,
        sharingMode: SharingModeConstant.WRITE,
        scenarioNamesPatterns: reportDetailsStore.selectedScenarioNames,
        dataComponents: reportDetailsStore.dataComponents
            ? reportDetailsStore.dataComponents.map(dataComponent => ({
                dataSeriesReferences: dataComponent.datas.map(d => d.reference),
                type: dataComponent.type
            }))
            : [],
    };
    try {
        await updateReport(reportDetailsStore.reportDetails!.reference, request);
        toastStore.success({ text: `Report ${reportDetailsStore.reportName} has been successfully updated.`})
        emit("saved")
    } catch (error) {
        toastStore.error({ text: ErrorHelper.getErrorMessage(error) });
    }   
}

</script>
