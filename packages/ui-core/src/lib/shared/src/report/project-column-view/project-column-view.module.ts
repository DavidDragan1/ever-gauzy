import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nTranslateModule } from '@gauzy/ui-core/i18n';
import { SharedModule } from '../../shared.module';
import { ProjectColumnViewComponent } from './project-column-view.component';

@NgModule({
	imports: [CommonModule, I18nTranslateModule.forChild(), SharedModule],
	declarations: [ProjectColumnViewComponent],
	exports: [ProjectColumnViewComponent]
})
export class ProjectColumnViewModule {}
