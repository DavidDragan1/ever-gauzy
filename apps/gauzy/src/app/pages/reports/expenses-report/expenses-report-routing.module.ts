import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DateRangePickerResolver } from '@gauzy/ui-core/shared';
import { ExpensesReportComponent } from './expenses-report/expenses-report.component';

const routes: Routes = [
	{
		path: '',
		component: ExpensesReportComponent,
		data: {
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
export class ExpensesReportRoutingModule {}
