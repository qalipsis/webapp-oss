<template>
  <BaseDrawer
    :open="open"
    @close="emit('update:open', false)"
    :title="title"
    confirm-btn-text="Apply"
    @confirm-btn-click="handleConfirmBtnClick"
  >
    <a-form class="pl-2 pr-2 pt-2 pb-2">
      <a-row class="pt-2 pb-4">
        <a-col>
          <h4 class="text-grey-1">Execution profile</h4>
        </a-col>
      </a-row>
      <template v-for="(_, index) in executionProfileFields">
        <ScenarioExecutionProfile
          :index="index"
          :configuration="configuration"
          :deleteHidden="index === 0"
          @executionProfileChange="handleExecutionProfileChange($event, index)"
        />
        <span
          v-if="invalidExecutionProfileIndexes.includes(index)"
          class="text-pink"
        >
          The start duration value should be less or equal than the duration
          value!
        </span>
      </template>
      <template v-if="isConfirmBtnClicked">
        <span v-if="!hasValidMinionsSummary" class="text-pink pt-2">
          The summary of the minions count should not exceed
          {{ configuration.validation.maxMinionsCount }}
        </span>
        <span v-if="!hasValidDurationSummary" class="text-pink pt-2">
          The summary of the duration should not exceed
          {{ maxDurationInMilliSeconds }} ms
        </span>
      </template>
      <a-row>
        <a-col :span="23">
          <BaseButton
            icon="/icons/icon-plus-grey.svg"
            btn-style="stroke"
            class="full-width"
            text="Add new"
            @click="handleAddExecutionProfileBtnClick"
          />
        </a-col>
      </a-row>
      <div class="pr-6">
        <hr class="divide-line" />
      </div>
      <a-row class="pt-2 pb-4">
        <a-col>
          <h4 class="text-grey-1">Zone</h4>
        </a-col>
      </a-row>
      <ScenarioZone
        v-for="(_, index) in zoneFields"
        :index="index"
        :zone-options="zoneOptions"
        @zoneSharedInputChange="handleZoneSharedInputChange"
      />
      <template v-if="isConfirmBtnClicked">
        <span
          v-if="!hasValidZoneShareSummary && values.zones.length > 0"
          class="text-pink pt-2"
        >
          The sum of the share zones should be equal 100%
        </span>
      </template>
      <a-row>
        <a-col :span="23">
          <BaseButton
            icon="/icons/icon-plus-grey.svg"
            btn-style="stroke"
            class="full-width"
            text="Add new"
            @click="handleAddZoneBtnClick"
          />
        </a-col>
      </a-row>
      <div class="pr-6">
        <hr class="divide-line" />
      </div>
    </a-form>
    <div class="pr-6" v-if="!isRenderingChart">
      <apexchart
        :options="chartOptions"
        :height="250"
        :series="chartDataSeries"
      />
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { ApexOptions } from "apexcharts";
import { DefaultCampaignConfiguration } from "utils/configuration";
import { FormMenuOption } from "utils/form";
import {
  ExecutionProfileStage,
  ScenarioConfigurationForm,
  ScenarioSummary,
  ZoneForm,
} from "utils/scenario";
import { useFieldArray, useForm } from "vee-validate";

const props = defineProps<{
  open: boolean;
  scenario: ScenarioSummary;
  configuration: DefaultCampaignConfiguration;
  zoneOptions: FormMenuOption[];
  scenarioForm?: ScenarioConfigurationForm;
}>();
const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "submit", v: ScenarioConfigurationForm): void;
}>();

const title = computed(() => `Configuration of ${props.scenario.name}`);
const maxDurationInMilliSeconds = computed(() =>
  TimeframeHelper.toMilliseconds(
    props.configuration.validation.maxExecutionDuration,
    TimeframeUnit.SEC
  )
);

const isRenderingChart = ref(false);
const chartOptions = ref<ApexOptions>({
  ...ScenarioHelper.SCENARIO_CONFIG_CHART_OPTIONS,
});
const chartDataSeries = ref<ApexAxisChartSeries>([]);
const invalidExecutionProfileIndexes = ref<number[]>([]);
const hasValidZoneShareSummary = ref(true);
const hasValidMinionsSummary = ref(true);
const hasValidDurationSummary = ref(true);
const isConfirmBtnClicked = ref(false);

const { handleSubmit, values, meta, validate } =
  useForm<ScenarioConfigurationForm>({
    initialValues: {
      executionProfileStages: props.scenarioForm?.executionProfileStages ?? [
        {
          minionsCount: props.configuration.validation.stage.minMinionsCount,
          duration: TimeframeHelper.toMilliseconds(
            props.configuration.validation.stage.minDuration,
            TimeframeUnit.SEC
          ),
          startDuration: TimeframeHelper.toMilliseconds(
            props.configuration.validation.stage.minStartDuration,
            TimeframeUnit.SEC
          ),
          resolution: TimeframeHelper.toMilliseconds(
            props.configuration.validation.stage.minResolution,
            TimeframeUnit.SEC
          ),
        },
      ],
      zones: props.scenarioForm?.zones ?? [],
    },
  });

const { push: pushExecutionProfile, fields: executionProfileFields } =
  useFieldArray<ExecutionProfileStage>("executionProfileStages");
const { push: pushZones, fields: zoneFields } =
  useFieldArray<ZoneForm>("zones");

onMounted(() => {
  const initialExecutionProfiles: ExecutionProfileStage[] = props.scenarioForm
    ?.executionProfileStages ?? [
    {
      minionsCount: props.configuration.validation.stage.minMinionsCount,
      duration: TimeframeHelper.toMilliseconds(
        props.configuration.validation.stage.minDuration,
        TimeframeUnit.SEC
      ),
      startDuration: TimeframeHelper.toMilliseconds(
        props.configuration.validation.stage.minStartDuration,
        TimeframeUnit.SEC
      ),
      resolution: TimeframeHelper.toMilliseconds(
        props.configuration.validation.stage.minResolution,
        TimeframeUnit.SEC
      ),
    },
  ];
  _setScenarioConfigChartDataSeries(initialExecutionProfiles);
});

const handleConfirmBtnClick = handleSubmit(
  async (values: ScenarioConfigurationForm) => {
    validate();
    isConfirmBtnClicked.value = true;
    const hasValidFormInput =
      meta.value.valid &&
      invalidExecutionProfileIndexes.value.length === 0 &&
      hasValidDurationSummary.value &&
      hasValidMinionsSummary.value &&
      hasValidZoneShareSummary.value;
    if (hasValidFormInput) {
      emit("submit", values);
      emit("update:open", false);
    }
  }
);

const handleExecutionProfileChange = (
  executionProfileStage: ExecutionProfileStage | null,
  index: number
) => {
  // Validates the start duration and duration
  _validateStartDurationAndDuration(index, executionProfileStage);
  // Validates the summary of minions
  _validateMinionsSummary();
  // Validates the summary of the duration
  _validateDurationSummary();
  _setScenarioConfigChartDataSeries(values.executionProfileStages);
};

const handleAddExecutionProfileBtnClick = () => {
  pushExecutionProfile({
    minionsCount: props.configuration.validation.stage.minMinionsCount,
    duration: TimeframeHelper.toMilliseconds(
      props.configuration.validation.stage.minDuration,
      TimeframeUnit.SEC
    ),
    startDuration: TimeframeHelper.toMilliseconds(
      props.configuration.validation.stage.minStartDuration,
      TimeframeUnit.SEC
    ),
    resolution: TimeframeHelper.toMilliseconds(
      props.configuration.validation.stage.minResolution,
      TimeframeUnit.SEC
    ),
  });
  _setScenarioConfigChartDataSeries(values.executionProfileStages);
  // Validates the summary of minions
  _validateMinionsSummary();
  // Validates the summary of the duration
  _validateDurationSummary();
};

const handleZoneSharedInputChange = () => {
  _validateZoneSharedSummary();
};

const handleAddZoneBtnClick = () => {
  pushZones({
    share: 20,
    name: "",
  });
  // Validates the summary of zone shared
  _validateZoneSharedSummary();
};

const _validateZoneSharedSummary = () => {
  const summaryOfZoneShare = values.zones.reduce((acc, cur) => {
    acc += +cur.share;

    return acc;
  }, 0);
  hasValidZoneShareSummary.value = summaryOfZoneShare === 100;
};

const _validateDurationSummary = () => {
  const summaryOfDuration = values.executionProfileStages
    .map((executionProfileStage) => executionProfileStage.duration)
    .reduce((acc, cur) => {
      acc += +cur;
      return acc;
    }, 0);
  hasValidDurationSummary.value =
    summaryOfDuration <= maxDurationInMilliSeconds.value;
};

const _validateMinionsSummary = () => {
  const summaryOfMinions = values.executionProfileStages
    .map((executionProfileStage) => executionProfileStage.minionsCount)
    .reduce((acc, cur) => {
      acc += +cur;
      return acc;
    }, 0);
  hasValidMinionsSummary.value =
    summaryOfMinions <= props.configuration.validation.maxMinionsCount;
};

const _validateStartDurationAndDuration = (
  index: number,
  executionProfileStage: ExecutionProfileStage | null
) => {
  // When the duration or start duration is not a number, return
  if (
    !executionProfileStage ||
    isNaN(+executionProfileStage.startDuration) ||
    isNaN(+executionProfileStage.duration)
  )
    return;

  const hasValidStartDuration =
    +executionProfileStage.startDuration <= +executionProfileStage.duration;

  if (hasValidStartDuration) {
    invalidExecutionProfileIndexes.value =
      invalidExecutionProfileIndexes.value.filter((i) => i !== index);
  } else {
    if (!invalidExecutionProfileIndexes.value.some((i) => i === index)) {
      invalidExecutionProfileIndexes.value.push(index);
    }
  }
};

const _setScenarioConfigChartDataSeries = (
  executionProfileStages: ExecutionProfileStage[]
) => {
  isRenderingChart.value = true;
  // Notes: Needs to add the timeout to rerender the chart
  setTimeout(() => {
    const chartData =
      ScenarioHelper.toScenarioConfigChartData(executionProfileStages);
    chartDataSeries.value = chartData.chartDataSeries;
    chartOptions.value = chartData.chartOptions;
    isRenderingChart.value = false;
  }, 50);
};
</script>