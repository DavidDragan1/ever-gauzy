import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSpinnerModule } from '@nebular/theme';
import { ConfirmEmailComponent } from './confirm-email.component';
import { I18nTranslateModule } from '@gauzy/ui-core/i18n';

@NgModule({
	imports: [CommonModule, I18nTranslateModule.forChild(), NbSpinnerModule],
	providers: [],
	declarations: [ConfirmEmailComponent]
})
export class ConfirmEmailModule {}
