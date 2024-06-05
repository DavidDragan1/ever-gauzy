import { Component, Input, OnInit } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IOrganization } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-sdk/common';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-income-table-selector',
	template: `
		<span>
			{{ rowData.income ? '+ ' + rowData.income + ' ' + organization?.currency : '' }}
		</span>
	`
})
export class IncomeTableComponent implements OnInit {
	public organization: IOrganization;

	@Input() rowData: any;
	@Input() value: string | number;

	constructor(private readonly store: Store) {}

	ngOnInit(): void {
		this.store.selectedOrganization$
			.pipe(
				filter((organization: IOrganization) => !!organization),
				tap((organization: IOrganization) => {
					this.organization = organization;
				}),
				untilDestroyed(this)
			)
			.subscribe();
	}
}
