import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbInputModule, NbButtonModule, NbSelectModule } from '@nebular/theme';
import { I18nTranslateModule } from '@gauzy/ui-core/i18n';
import { GoalTemplatesComponent } from './goal-templates.component';
import { GoalCustomUnitModule } from '../goal-custom-unit/goal-custom-unit.module';

@NgModule({
	declarations: [GoalTemplatesComponent],
	imports: [
		CommonModule,
		NbCardModule,
		ReactiveFormsModule,
		NbInputModule,
		NbSelectModule,
		NbButtonModule,
		GoalCustomUnitModule,
		I18nTranslateModule.forChild()
	],
	exports: [GoalTemplatesComponent]
})
export class GoalTemplatesModule {}
