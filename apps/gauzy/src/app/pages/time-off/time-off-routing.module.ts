import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionsEnum } from '@gauzy/contracts';
import { PermissionsGuard } from '@gauzy/ui-core/core';
import { DateRangePickerResolver } from '@gauzy/ui-core/shared';
import { TimeOffComponent } from './time-off.component';
import { TimeOffSettingsComponent } from './time-off-settings/time-off-settings.component';

const routes: Routes = [
	{
		path: '',
		component: TimeOffComponent,
		canActivate: [PermissionsGuard],
		data: {
			permissions: {
				only: [PermissionsEnum.ORG_TIME_OFF_VIEW],
				redirectTo: '/pages/dashboard'
			},
			selectors: {
				project: false
			},
			datePicker: {
				unitOfTime: 'month'
			}
		},
		resolve: { dates: DateRangePickerResolver }
	},
	{
		path: 'settings',
		component: TimeOffSettingsComponent,
		canActivate: [PermissionsGuard],
		data: {
			permissions: {
				only: [PermissionsEnum.POLICY_VIEW],
				redirectTo: '/pages/dashboard'
			},
			selectors: {
				project: false,
				employee: false,
				date: false
			}
		}
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TimeOffRoutingModule {}
