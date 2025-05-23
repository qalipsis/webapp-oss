<template>
  <BaseHeader>
    <div class="flex justify-between items-center w-full">
      <div class="flex items-center">
        <BaseIcon
          icon="qls-icon-arrow-back"
          class="cursor-pointer pl-1 pr-5 hover:text-primary-500 text-2xl"
          @click="navigateTo('/campaigns')"
        />
        <BaseTitle v-model:content="campaignName" :editable="true" />
      </div>
      <div class="flex items-center">
        <BaseSwitch
          @checkedChange="handleCheckedChange"
          :numberOfSelectedItems="selectedRowKeys.length"
        />
        <div 
          class="cursor-pointer pl-2"
          @click="handleSettingBtnClick"
        >
          <BaseIcon 
            icon="qls-icon-setting"
            class="text-2xl text-gray-600 dark:text-gray-100 hover:text-primary-500"
          />
        </div>
        <BaseSearch
          class="ml-2"
          placeholder="Search scenario..."
          size="large"
          @search="handleSearch"
        />
        <BaseButton
          class="ml-2"
          :text="executionText"
          @click="handleRunBtnClick"
          :disabled="selectedRowKeys.length === 0"
        />
      </div>
    </div>
  </BaseHeader>
  <CampaignConfigDrawer
    v-if="open"
    :campaignConfigurationForm="campaignConfigForm"
    v-model:open="open"
    @submit="handleCampaignConfigFormSubmit($event)"
  />
</template>

<script setup lang="ts">

const scenarioTaleStore = useScenarioTableStore();
const toastStore = useToastStore();

const { selectedRowKeys } = storeToRefs(scenarioTaleStore);

const props = defineProps<{
  campaignConfiguration: DefaultCampaignConfiguration,
  campaignKey?: string,
  campaignName?: string,
  campaignConfigForm?: CampaignConfigurationForm
}>()

const { createCampaign, scheduleCampaign, updateCampaignConfig } = useCampaignApi();

const campaignConfigForm = ref<CampaignConfigurationForm>({
  timeoutType: props.campaignConfigForm?.timeoutType ?? TimeoutTypeConstant.SOFT,
  durationValue: props.campaignConfigForm?.durationValue ?? "",
  durationUnit: props.campaignConfigForm?.durationUnit ?? "MS",
  scheduled: props.campaignConfigForm?.scheduled ?? false,
  repeatEnabled: props.campaignConfigForm?.repeatEnabled ?? false,
  repeatTimeRange: props.campaignConfigForm?.repeatTimeRange ?? "DAILY",
  repeatValues: props.campaignConfigForm?.repeatValues ?? [],
  relativeRepeatValues: props.campaignConfigForm?.relativeRepeatValues ?? [],
  // Uses the default time zone from the user browser as the default value.
  timezone: props.campaignConfigForm?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  scheduledTime: props.campaignConfigForm?.scheduledTime ?? null,
});
const campaignName = ref(props.campaignName ?? "New Campaign");
const open = ref(false);
const executionText = computed(() => {
  return campaignConfigForm.value?.scheduled ? "Schedule" : "Run immediately";
});

const handleSearch = (searchTerm: string) => {
  scenarioTaleStore.$patch({
    query: searchTerm
  });

  // When search event is triggered, always resets the current page index to be 0.
  scenarioTaleStore.$patch({
    currentPageIndex: 0,
  });

  scenarioTaleStore.refreshScenarios();
};

const handleCheckedChange = (checked: boolean) => {
  // When show checked event is changed, always resets the current page index to be 0.
  scenarioTaleStore.$patch({
    currentPageIndex: 0,
    dataSource: checked
      ? scenarioTaleStore.selectedRows
      : scenarioTaleStore.allScenarios,
    totalElements: checked
      ? scenarioTaleStore.selectedRows.length
      : scenarioTaleStore.allScenarios.length,
  });
};

const handleSettingBtnClick = () => {
  open.value = true;
};

const handleCampaignConfigFormSubmit = (form: CampaignConfigurationForm) => {
  campaignConfigForm.value = form;
};

const handleRunBtnClick = async () => {
  const selectedScenarioConfigMap: {
    [key: string]: ScenarioConfigurationForm;
  } = {};
  scenarioTaleStore.selectedRows.forEach((scenario) => {
    if (scenarioTaleStore.scenarioConfig[scenario.name]) {
      selectedScenarioConfigMap[scenario.name] =
        scenarioTaleStore.scenarioConfig[scenario.name];
    } else {
      const defaultStage = props.campaignConfiguration.validation.stage;
      const defaultScenarioForm: ScenarioConfigurationForm = {
        executionProfileStages: [
          {
            minionsCount: defaultStage.minMinionsCount,
            duration: TimeframeHelper.toMilliseconds(
              defaultStage.minDuration,
              TimeframeUnitConstant.SEC
            ),
            startDuration: TimeframeHelper.toMilliseconds(
              defaultStage.minStartDuration,
              TimeframeUnitConstant.SEC
            ),
            resolution: TimeframeHelper.toMilliseconds(
              defaultStage.minResolution,
              TimeframeUnitConstant.SEC
            ),
          },
        ],
        zones: [],
      };
      selectedScenarioConfigMap[scenario.name] = defaultScenarioForm;
    }
  });
  
  const request = CampaignHelper.toCampaignConfiguration(
    campaignName.value,
    campaignConfigForm.value!,
    selectedScenarioConfigMap
  );

  try {
    if (campaignConfigForm.value.scheduled) {
      if (props.campaignKey) {
        // Updates the existing scheduled campaign
        await updateCampaignConfig(props.campaignKey, request);
      } else {
        // Creates a new scheduled campaign
        await scheduleCampaign(request);
      }

      navigateTo("/campaigns");
    } else {
      // Creates a new campaign
      const newCampaign = await createCampaign(request);
      // navigate to the campaign details
      navigateTo(`/campaigns/${newCampaign.key}`);
    }
    

  } catch (error) {
    toastStore.error({ text: ErrorHelper.getErrorMessage(error) });
  }
  
};
</script>
