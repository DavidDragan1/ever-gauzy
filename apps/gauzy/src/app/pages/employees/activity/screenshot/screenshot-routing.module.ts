import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DateRangePickerResolver } from '@gauzy/ui-core/shared';
import { ScreenshotComponent } from './screenshot/screenshot.component';

const routes: Routes = [
	{
		path: '',
		component: ScreenshotComponent,
		data: {
			title: 'ACTIVITY.SCREENSHOTS',
			datePicker: {
				unitOfTime: 'day',
				isLockDatePicker: true,
				isSaveDatePicker: true,
				isSingleDatePicker: true,
				isDisableFutureDate: true
			}
		},
		resolve: { dates: DateRangePickerResolver }
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ScreenshotRoutingModule {}
