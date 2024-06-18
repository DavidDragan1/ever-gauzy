import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeTrackerStatusService } from './time-tracker-status.service';
import { TimeTrackerStatusComponent } from './time-tracker-status.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { I18nTranslateModule } from '@gauzy/ui-core/i18n';
import { NbTooltipModule } from '@nebular/theme';

@NgModule({
	declarations: [TimeTrackerStatusComponent],
	imports: [CommonModule, FontAwesomeModule, I18nTranslateModule.forChild(), NbTooltipModule],
	exports: [TimeTrackerStatusComponent],
	providers: [TimeTrackerStatusService]
})
export class TimeTrackerStatusModule {}
