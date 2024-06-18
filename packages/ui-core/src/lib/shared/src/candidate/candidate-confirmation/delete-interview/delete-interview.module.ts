import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbButtonModule } from '@nebular/theme';
import { I18nTranslateModule } from '@gauzy/ui-core/i18n';
import { DeleteInterviewComponent } from './delete-interview.component';

@NgModule({
	imports: [CommonModule, NbButtonModule, NbCardModule, NbIconModule, I18nTranslateModule.forChild()],
	declarations: [DeleteInterviewComponent],
	exports: [DeleteInterviewComponent]
})
export class DeleteInterviewModule {}
