import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackNavigationModule } from './back-navigation';
import { Components } from './components';
import { AlertModalModule } from './alert-modal';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DirectivesModule } from './directives/directives.module';
import { PipesModule } from './pipes/pipes.module';
import { EmployeeStartWorkModule } from './employee/employee-start-work/employee-start-work.module';
import { TaskBadgeViewComponent } from './tasks/task-badge-view/task-badge-view.component';

const Modules = [NgxPermissionsModule, BackNavigationModule, DirectivesModule, PipesModule, EmployeeStartWorkModule];

@NgModule({
	declarations: [...Components, TaskBadgeViewComponent],
	imports: [CommonModule, RouterModule, ...Modules],
	exports: [AlertModalModule, ...Components, ...Modules, TaskBadgeViewComponent]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders<SharedModule> {
		return {
			ngModule: SharedModule,
			providers: []
		};
	}
}
