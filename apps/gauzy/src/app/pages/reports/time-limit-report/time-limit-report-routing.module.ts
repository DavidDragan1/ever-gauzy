import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DateRangePickerResolver } from '@gauzy/ui-core/shared';
import { TimeLimitReportComponent } from './time-limit-report/time-limit-report.component';

const routes: Routes = [
	{
		path: '',
		component: TimeLimitReportComponent,
		data: {
			duration: 'day',
			title: 'REPORT_PAGE.DAILY_LIMIT_REPORT',
			datePicker: {
				unitOfTime: 'week'
			}
		},
		resolve: { dates: DateRangePickerResolver }
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TimeLimitReportRoutingModule {}
