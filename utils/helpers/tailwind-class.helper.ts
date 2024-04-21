export class TailwindClassHelper {
    static primaryColorFilterClass = '[filter:brightness(0%)_saturate(100%)_invert(61%)_sepia(38%)_saturate(657%)_hue-rotate(132deg)_brightness(89%)_contrast(91%)]';
    static grayColorFilterClass = '[filter:brightness(0%)_saturate(100%)_invert(67%)_sepia(18%)_saturate(105%)_hue-rotate(145deg)_brightness(90%)_contrast(83%)]';
    static primaryColorFilterHoverClass = 'hover:[filter:brightness(0%)_saturate(100%)_invert(61%)_sepia(38%)_saturate(657%)_hue-rotate(132deg)_brightness(89%)_contrast(91%)]';
    static disableColorFilterClass = '[filter:brightness(0%)_saturate(100%)_invert(94%)_sepia(0%)_saturate(4147%)_hue-rotate(237deg)_brightness(102%)_contrast(83%)]';
    static searchInputBaseClass = 'flex items-center border border-solid h-10 rounded-md w-fit outline-none';
    static circleCheckBoxBaseClass = 'w-7 h-7 rounded-full border border-solid border-primary-400 text-center flex items-center justify-center cursor-pointer';
    static checkBoxClass = 'relative appearance-none w-4 h-4 border border-gray-300 rounded-sm bg-white disabled:bg-gray-50 disabled:cursor-not-allowed enabled:hover:border-primary-500 cursor-pointer shrink-0 enabled:checked:bg-primary-500 enabled:checked:border-0';
    static checkBoxMarkerClass = "enabled:after:content-[''] enabled:after:hidden enabled:after:w-[6px] enabled:after:h-3 enabled:after:border-r-2 enabled:after:border-b-2 enabled:after:border-solid enabled:after:border-white enabled:after:rotate-45 enabled:after:ml-[5px] enabled:checked:after:block";
    static checkBoxIndeterminateClass = "enabled:before:content-[''] enabled:before:inline-block enabled:before:rounded-sm enabled:before:ml-[2px] enabled:before:mb-[3px] enabled:before:w-[10px] enabled:before:h-[10px] enabled:before:bg-primary-500";
    static baseButtonClass = 'h-10 px-3 py-2 text-base rounded-md min-w-32 flex items-center justify-center disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed';
    static filledButtonBaseClass = 'group enabled:bg-primary-500 enabled:hover:bg-primary-600';
    static filledButtonIconClass = 'group-enabled:[filter:brightness(0%)_saturate(100%)_invert(99%)_sepia(99%)_saturate(2%)_hue-rotate(190deg)_brightness(112%)_contrast(100%)]';
    static filledButtonTextClass = 'group-enabled:text-white';
    static outlineButtonBaseClass = 'border border-solid border-gray-300 enabled:text-gray-800 enabled:hover:border-primary-500 enabled:hover:bg-primary-50 group';
    static outlineButtonIconClass = 'group-enabled:group-hover:[filter:brightness(0%)_saturate(100%)_invert(61%)_sepia(38%)_saturate(657%)_hue-rotate(132deg)_brightness(89%)_contrast(91%)]';
    static outlineButtonTextClass = 'group-enabled:group-hover:text-primary-500';
    static seriesOptionItemClass = 'border border-solid align-baseline border-gray-200 rounded-md h-14 py-1 px-2 w-full cursor-pointer hover:bg-gray-50';
    static scenarioDropdownItemClass = 'h-8 min-w-56 relative py-2 px-3 rounded-md mb-1';
    static scenarioDropdownItemActiveClass = "bg-gray-100 after:content-[''] after:absolute after:w-2 after:h-2 after:rounded-full after:right-2 after:top-auto after:bg-primary-500";
}