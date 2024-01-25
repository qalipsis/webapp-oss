<template>
  <BaseDrawer
    title="Configuration of campaign"
    :open="open"
    @close="emit('update:open', false)"
    @confirm-btn-click="handleConfirmBtnClick"
  >
    <a-form class="pl-2 pr-2 pt-2 pb-2">
      <a-row :gutter="8" class="mt-3 form-row">
        <a-col :span="12">
          <FormRadioGroup
            label="Timeout Campaign"
            form-control-name="timeoutType"
            :options="timeoutOptions"
          />
        </a-col>
        <a-col :span="12">
          <FormInputSelect
            label="Duration"
            form-input-control-name="durationValue"
            form-select-control-name="durationUnit"
            :input-field-validation-schema="fieldValidationSchema.durationValue"
            :select-field-validation-schema="fieldValidationSchema.durationUnit"
            :options="durationUnitOptions"
          />
        </a-col>
      </a-row>
      <a-row class="form-short-row">
        <a-col>
          <FormCheckbox label="Schedule" form-control-name="scheduled" />
        </a-col>
      </a-row>
      <template v-if="values.scheduled">
        <a-row :gutter="8" class="form-row">
          <a-col :span="12">
            <FormDateTimePicker
              label="Date time"
              form-control-name="scheduledTime"
              format="MM/dd/yyyy HH:mm"
              :min-date="new Date()"
              :field-validation-schema="fieldValidationSchema.scheduledTime"
            />
          </a-col>
          <a-col :span="12">
            <FormAutoComplete
              label="Timezone"
              style="min-width: 15.5rem"
              form-control-name="timezone"
              :options="timezoneOptions"
              :field-validation-schema="fieldValidationSchema.timezone"
            >
            </FormAutoComplete>
          </a-col>
        </a-row>
        <a-row class="form-short-row">
          <a-col>
            <FormCheckbox
              label="Repeat"
              form-control-name="repeatEnabled"
              :disabled="!values.repeatTimeRange || !values.timezone"
            />
          </a-col>
        </a-row>
        <template v-if="values.repeatEnabled">
          <a-row class="mb-4">
            <a-col>
              <FormRadioGroup
                label="Repeat every"
                form-control-name="repeatTimeRange"
                :options="repeatTimeRangeOptions"
                @change="handleRepeatTimeRangeOptionChange"
              />
            </a-col>
          </a-row>
          <a-row :class="{ none: values.repeatTimeRange !== 'HOURLY' }">
            <a-col>
              <div class="repeat-value-container">
                <FormMultiCircleCheck
                  form-control-name="repeatValues"
                  :options="hourlyOptions"
                />
              </div>
            </a-col>
          </a-row>
          <a-row :class="{ none: values.repeatTimeRange !== 'DAILY' }">
            <a-col>
              <div class="repeat-value-container">
                <FormMultiCircleCheck
                  form-control-name="repeatValues"
                  :options="dailyOptions"
                />
              </div>
            </a-col>
          </a-row>
          <a-row :class="{ none: values.repeatTimeRange !== 'MONTHLY' }">
            <a-col>
              <div class="repeat-value-container">
                <FormMultiCircleCheck
                  form-control-name="repeatValues"
                  :options="monthlyOptions"
                />
              </div>
              <div class="repeat-value-container">
                <div class="mt-2 mb-2">Relative before the end of month</div>
                <FormMultiCircleCheck
                  form-control-name="relativeRepeatValues"
                  :options="relativeDayOfMonthOptions"
                />
              </div>
            </a-col>
          </a-row>
          <a-row>
            <a-col>
              <label>Repeats:</label>
              <span>{{ repeatText }}</span>
            </a-col>
          </a-row>
        </template>
      </template>
    </a-form>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as zod from "zod";

const props = defineProps<{
  open: boolean;
  campaignConfigurationForm: CampaignConfigurationForm;
}>();
const emit = defineEmits<{
  (e: "submit", v: CampaignConfigurationForm): void;
  (e: "update:open", v: boolean): void;
}>();

const initialFormValue: CampaignConfigurationForm = {
  timeoutType: props.campaignConfigurationForm?.timeoutType ?? "soft",
  durationValue: props.campaignConfigurationForm?.durationValue ?? "",
  durationUnit: props.campaignConfigurationForm?.durationUnit ?? TimeframeUnitConstant.MS,
  scheduled: props.campaignConfigurationForm?.scheduled ?? false,
  repeatEnabled: props.campaignConfigurationForm?.repeatEnabled ?? false,
  repeatTimeRange: props.campaignConfigurationForm?.repeatTimeRange ?? "HOURLY",
  repeatValues: props.campaignConfigurationForm?.repeatValues ?? [],
  relativeRepeatValues: props.campaignConfigurationForm?.relativeRepeatValues ?? [],
  scheduledTime: props.campaignConfigurationForm?.scheduledTime ?? null,
  timezone: props.campaignConfigurationForm?.timezone ?? "",
};

const { handleSubmit, setFieldValue, values, meta, validate } =
  useForm<CampaignConfigurationForm>({
    initialValues: {
      ...initialFormValue,
    },
  });

const fieldValidationSchema = {
  durationValue: toTypedSchema(
    zod.coerce
      .number({ invalid_type_error: "You must specify a number" })
      .nullable()
  ),
  durationUnit: toTypedSchema(zod.string().nullable()),
  scheduledTime: toTypedSchema(
    zod
      .date()
      .nullable()
      .refine(
        (value: Date | null) => {
          // The schedule time can be empty when the campaign is not scheduled.
          if (!values.scheduled) return true;
          
          if (value) return true;
           
          return false
        },
        {
          message: "Date time cannot be empty",
        }
      )
  ),
  timezone: toTypedSchema(
    zod
      .string()
      .nullable()
      .refine(
        (value: string | null) => {
          // Timezone can be empty when the campaign is not scheduled.
          if (!values.scheduled) return true;
          
          if (value) return true;
           
          return false
        },
        {
          message: "Timezone cannot be empty",
        }
      )
  ),
};
const timeoutOptions = CampaignDetailsConfig.CAMPAIGN_TIMEOUT_OPTIONS;
const durationUnitOptions = TimeframeHelper.getTimeframeUnitOptions();
const timezoneOptions = TimeframeHelper.getTimezoneOptions();
const repeatTimeRangeOptions = CampaignDetailsConfig.REPEAT_TIME_RANGE_OPTIONS;
const hourlyOptions = CampaignDetailsConfig.HOURLY_REPEAT_OPTIONS;
const dailyOptions = CampaignDetailsConfig.DAILY_REPEAT_OPTIONS;
const monthlyOptions = CampaignDetailsConfig.MONTHLY_REPEAT_OPTIONS;
const relativeDayOfMonthOptions = CampaignDetailsConfig.RELATIVE_DAY_OF_MONTH_OPTIONS;

const DAY_OF_WEEK_MAP: { [key: string]: string } = {
  0: "Monday",
  1: "Tuesday",
  2: "Wednesday",
  3: "Thursday",
  4: "Friday",
  5: "Saturday",
  6: "Sunday",
};

const repeatText = computed(() => {
  const minutes = `${values.scheduledTime!.getMinutes()}`.padStart(2, "0");
  const time = `${values.scheduledTime!.getHours()}:${minutes}`;

  switch (values.repeatTimeRange) {
    case "HOURLY":
      return values.repeatValues.length === 0 ||
        values.repeatValues.length === hourlyOptions.length
        ? "occurs every hour"
        : `occurs every day at ${[...values.repeatValues]
            .sort()
            .map((hour) => `${+hour % 24}:${minutes}`)
            .join(", ")}`;
    case "DAILY":
      return values.repeatValues.length === 0 ||
        values.repeatValues.length === dailyOptions.length
        ? `occurs every day at ${time}`
        : `occurs every ${[...values.repeatValues]
            .sort()
            .map((it) => `${DAY_OF_WEEK_MAP[it.toString()]}`)
            .join(", ")} at ${time}`;
    case "MONTHLY":
      const shouldOnlyDisplayTime =
        values.repeatValues.length === monthlyOptions.length ||
        (values.repeatValues.length === 0 &&
          values.relativeRepeatValues.length === 0);
      const shouldOnlyDisplayRelativeValues =
        values.repeatValues.length === 0 &&
        values.relativeRepeatValues.length > 0;
      const shouldOnlyDisplaySelectedDays =
        values.repeatValues.length > 0 &&
        values.relativeRepeatValues.length === 0;

      if (shouldOnlyDisplayTime) {
        return `occurs every day at ${time}`;
      } else if (shouldOnlyDisplayRelativeValues) {
        return `occurs every month ${[...values.relativeRepeatValues]
          .sort()
          .reverse()
          .map((num) => `${-num} days`)
          .join(
            ", "
          )} before the end of the month and on the last day of the month, at ${time}`;
      } else if (shouldOnlyDisplaySelectedDays) {
        return `occurs every month on ${[...values.repeatValues]
          .sort()
          .map((day) => `${day}${TimeframeHelper.getOrdinalNumberSuffix(+day)}`)
          .join(", ")}, at ${time}`;
      }

      return `occurs every month on ${[...values.repeatValues]
        .sort()
        .map((day) => `${day}${TimeframeHelper.getOrdinalNumberSuffix(+day)}`)
        .join(", ")}, and ${values.relativeRepeatValues
        .map((num) => `${-num} days`)
        .join(
          ", "
        )} before the end of the month and on the last day of the month at ${time}`;
    default:
      return "";
  }
});

const handleRepeatTimeRangeOptionChange = () => {
  setFieldValue("repeatValues", []);
};

const handleConfirmBtnClick = handleSubmit(
  async (values: CampaignConfigurationForm) => {
    validate();
    if (meta.value.valid) {
      emit("submit", values);
      emit("update:open", false);
    }
  }
);
</script>

<style scoped lang="scss">
.form-row {
  height: 6rem;
}

.form-short-row {
  height: 3rem;
}

.repeat-value-container {
  width: 20rem;
}

.none {
  display: none;
}
</style>