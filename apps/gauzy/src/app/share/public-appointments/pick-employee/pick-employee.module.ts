import { NgModule } from '@angular/core';
import { NbCardModule, NbButtonModule, NbToastrModule, NbSpinnerModule } from '@nebular/theme';
import { I18nTranslateModule } from '@gauzy/ui-core/i18n';
import { EventTypeService } from '@gauzy/ui-core/core';
import { SelectorsModule, SharedModule } from '@gauzy/ui-core/shared';
import { PickEmployeeComponent } from './pick-employee.component';
import { PickEmployeeRoutingModule } from './pick-employee.routing.module';

@NgModule({
	imports: [
		NbToastrModule,
		NbSpinnerModule,
		NbButtonModule,
		NbCardModule,
		I18nTranslateModule.forChild(),
		PickEmployeeRoutingModule,
		SharedModule,
		SelectorsModule
	],
	declarations: [PickEmployeeComponent],
	providers: [EventTypeService]
})
export class PickEmployeeModule {}
